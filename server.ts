import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_COLLEGES, INITIAL_ERROR_REPORTS } from './src/data/colleges.js';
import { runDecisionEngine } from './src/services/decisionEngine.js';
import { StudentProfile, College, DataErrorReport } from './src/types/index.js';

dotenv.config();

const app = express();
app.use(express.json());

// In-memory active stores (can be seeded or updated by admin)
let collegeDatabase: College[] = [...INITIAL_COLLEGES];
let reportedErrors: DataErrorReport[] = [...INITIAL_ERROR_REPORTS];

// Shared server-side Gemini client
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. GET ALL COLLEGES
app.get('/api/colleges', (req: Request, res: Response) => {
  res.json({
    success: true,
    total: collegeDatabase.length,
    colleges: collegeDatabase,
  });
});

// 2. GET SINGLE COLLEGE BY ID
app.get('/api/colleges/:id', (req: Request, res: Response) => {
  const college = collegeDatabase.find(
    (c) => c.id === req.params.id || c.slug === req.params.id
  );
  if (!college) {
    res.status(404).json({ success: false, error: 'College not found in verified database' });
    return;
  }
  res.json({ success: true, college });
});

// 3. AI COUNSELOR CHAT WITH STRUCTURED PROFILE EXTRACTION
app.post('/api/counselor/chat', async (req: Request, res: Response) => {
  try {
    const { messages, currentProfile } = req.body;
    const latestUserMessage = messages[messages.length - 1]?.text || '';

    // If Gemini is available, run prompt for intelligent natural counseling & profile extraction
    if (aiClient) {
      const systemInstruction = `
You are CollegeDekoded AI Counselor, an expert, empathetic, and decision-driven Indian college admissions architect.
Your goal is to converse naturally with a student and incrementally build their structured decision profile.
DO NOT sound like a generic chatbot or ask 10 questions at once. Ask ONLY 1 or 2 high-impact decision-relevant questions at each step.
Key parameters you need to understand:
1. Class 12th percentage and stream (PCM, PCB, Commerce, Arts)
2. Target degree & course (e.g., B.Tech CSE, BBA, BCA, MBA)
3. Career aspirations (e.g. software engineering, high ROI, consulting, startups, research)
4. Entrance exams taken or planned (JEE Main, CUET, BITSAT, COMEDK, or direct merit)
5. Preferred locations (Delhi NCR, Bengaluru, Pune, Mumbai, etc.) & willingness to relocate
6. Total 4-year/3-year budget limit for fees + hostel (e.g., under ₹8 Lakhs, ₹15 Lakhs, ₹25 Lakhs)
7. Hostel vs day scholar preference
8. Placement vs Campus Life vs Academic discipline priority

CRITICAL: Return your response strictly in valid JSON format with this exact structure:
{
  "replyText": "your concise, engaging conversational response asking the next logical question",
  "extractedUpdates": {
    "fullName": "if detected or null",
    "class12Percentage": 85 (number or null),
    "class12Stream": "PCM" (one of PCM, PCB, Commerce with Maths, Commerce, Arts/Humanities or null),
    "targetDegree": "B.Tech" (one of B.Tech, BBA, BCA, MBA, Any or null),
    "targetSpecialization": "Computer Science" (string or null),
    "careerGoal": "string or null",
    "entranceExams": [
      {"examName": "JEE Main", "status": "Taken", "scoreOrPercentile": "92 percentile"}
    ],
    "preferredCities": ["Delhi NCR"],
    "relocationPreference": "Anywhere in India" (or Within 500km, Home State / City Only),
    "totalBudgetLimit": 1500000 (number in INR or null),
    "hostelPreference": "Hostel mandatory" (or Day Scholar preferred, Flexible),
    "placementPriority": "Crucial (High ROI & >10 LPA)" (or Important, Balanced / Research focus),
    "campusLifePriority": "Vibrant clubs & events" (or Moderate, Strict academics preferred),
    "collegeTypePreference": "All" (or Govt only, Private Tier-1, Autonomous only)
  },
  "suggestedQuickReplies": ["3 to 4 short pills to make answering easy"]
}
`;

      const prompt = `
Current Profile State:
${JSON.stringify(currentProfile, null, 2)}

Conversation History:
${messages.map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}

Analyze the user's latest statement and extract any new student parameters. Respond with the next counseling step in the required JSON schema.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text?.trim() || '{}';
      try {
        const parsed = JSON.parse(text);
        res.json({ success: true, ...parsed });
        return;
      } catch (e) {
        console.error('Failed to parse Gemini counselor response as JSON:', text);
      }
    }

    // Heuristic Fallback if Gemini not available or JSON parse failed
    const fallbackResponse = generateHeuristicCounselorReply(latestUserMessage, currentProfile);
    res.json({ success: true, ...fallbackResponse });
  } catch (error: any) {
    console.error('Counselor API error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal counselor error',
    });
  }
});

// 4. ASK AI ABOUT A SPECIFIC COLLEGE (STRICT GROUNDED ANTI-HALLUCINATION)
app.post('/api/colleges/:id/ask', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    const college = collegeDatabase.find(
      (c) => c.id === req.params.id || c.slug === req.params.id
    );

    if (!college) {
      res.status(404).json({ success: false, error: 'College not found' });
      return;
    }

    if (aiClient) {
      const systemInstruction = `
You are the CollegeDekoded Official Fact Verification Officer.
You are STRICTLY GROUNDED in the provided college data record.
RULES:
1. NEVER invent or hallucinate cutoffs, fees, placement figures, rankings, or dates.
2. If a specific figure or detail is NOT present in the provided record, you MUST state explicitly:
   "Data not verified / available in official records. Please verify directly with the college admissions cell."
3. Always cite the verified source and date provided in the record.
4. Clearly distinguish between Official Institutional Facts and Student Experiences.
`;

      const prompt = `
Verified College Record:
${JSON.stringify(college, null, 2)}

User Question:
"${question}"

Provide a precise, verified answer strictly adhering to the ground truth data.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      res.json({
        success: true,
        answer: response.text,
        verifiedSources: college.officialSources,
        lastVerifiedDate: college.lastVerifiedDate,
      });
      return;
    }

    // Fallback if no Gemini API key
    res.json({
      success: true,
      answer: `Based on verified records for ${college.name} (last audited on ${college.lastVerifiedDate} via ${college.officialSources[0]?.title || 'official prospectus'}):\n- Fees: ₹${(college.courses[0]?.fees.totalCourseFee / 100000).toFixed(1)} Lakhs total tuition.\n- Placement Median: ₹${college.courses[0]?.placements.medianCtcLpa} LPA.\n- Hostel: ${college.hostel.available ? `Available at approx ₹${(college.hostel.feePerYear / 1000).toFixed(0)}k/year` : 'Not available'}.\nFor unlisted queries, please verify directly at ${college.websiteUrl}.`,
      verifiedSources: college.officialSources,
      lastVerifiedDate: college.lastVerifiedDate,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. RECOMMENDATION ENGINE API
app.post('/api/recommend', (req: Request, res: Response) => {
  try {
    const profile: StudentProfile = req.body.profile;
    const recommendations = runDecisionEngine(collegeDatabase, profile);
    res.json({
      success: true,
      totalMatched: recommendations.length,
      recommendations,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. REPORT INCORRECT DATA
app.post('/api/reports', (req: Request, res: Response) => {
  const { collegeId, collegeName, fieldFlagged, reportedValue, expectedValue, sourceProofUrl, userNotes } = req.body;
  const newReport: DataErrorReport = {
    id: `rep-${Date.now()}`,
    collegeId,
    collegeName,
    fieldFlagged,
    reportedValue: reportedValue || '',
    expectedValue,
    sourceProofUrl,
    userNotes,
    reportedAt: new Date().toISOString(),
    status: 'Pending Review',
  };

  reportedErrors.unshift(newReport);
  res.json({ success: true, report: newReport });
});

// 7. ADMIN ENDPOINTS
app.get('/api/admin/reports', (req: Request, res: Response) => {
  res.json({ success: true, reports: reportedErrors });
});

app.post('/api/admin/reports/:id/status', (req: Request, res: Response) => {
  const { status, adminNotes } = req.body;
  const report = reportedErrors.find((r) => r.id === req.params.id);
  if (!report) {
    res.status(404).json({ success: false, error: 'Report not found' });
    return;
  }
  report.status = status;
  if (adminNotes) report.adminNotes = adminNotes;
  res.json({ success: true, report });
});

app.post('/api/admin/colleges', (req: Request, res: Response) => {
  const updatedCollege: College = req.body.college;
  const existingIndex = collegeDatabase.findIndex((c) => c.id === updatedCollege.id);
  if (existingIndex >= 0) {
    collegeDatabase[existingIndex] = updatedCollege;
  } else {
    collegeDatabase.unshift(updatedCollege);
  }
  res.json({ success: true, college: updatedCollege });
});

// Helper: Heuristic Counselor logic
function generateHeuristicCounselorReply(
  userMsg: string,
  profile: Partial<StudentProfile>
): {
  replyText: string;
  extractedUpdates: Partial<StudentProfile>;
  suggestedQuickReplies: string[];
} {
  const lower = userMsg.toLowerCase();
  const updates: Partial<StudentProfile> = {};

  // Detect 12th marks
  const pctMatch = userMsg.match(/(\d{2,3}(?:\.\d+)?)\s*%/);
  if (pctMatch) {
    updates.class12Percentage = parseFloat(pctMatch[1]);
  }

  // Detect stream
  if (lower.includes('pcm') || lower.includes('physics') || lower.includes('maths')) {
    updates.class12Stream = 'PCM';
  } else if (lower.includes('commerce with maths') || lower.includes('commerce + maths')) {
    updates.class12Stream = 'Commerce with Maths';
  } else if (lower.includes('commerce')) {
    updates.class12Stream = 'Commerce';
  } else if (lower.includes('pcb') || lower.includes('biology')) {
    updates.class12Stream = 'PCB';
  } else if (lower.includes('arts') || lower.includes('humanities')) {
    updates.class12Stream = 'Arts/Humanities';
  }

  // Detect degree
  if (lower.includes('b.tech') || lower.includes('btech') || lower.includes('engineering') || lower.includes('cse')) {
    updates.targetDegree = 'B.Tech';
    updates.targetSpecialization = 'Computer Science & Engineering';
  } else if (lower.includes('bba') || lower.includes('bms') || lower.includes('management')) {
    updates.targetDegree = 'BBA';
  } else if (lower.includes('bca') || lower.includes('applications')) {
    updates.targetDegree = 'BCA';
  }

  // Detect entrance exams
  if (lower.includes('jee')) {
    updates.entranceExams = [
      { examName: 'JEE Main', status: 'Taken', scoreOrPercentile: 'JEE Aspirant' },
    ];
  } else if (lower.includes('cuet')) {
    updates.entranceExams = [
      { examName: 'CUET-UG', status: 'Taken', scoreOrPercentile: 'CUET Aspirant' },
    ];
  } else if (lower.includes('direct') || lower.includes('no exam') || lower.includes('board marks')) {
    updates.entranceExams = [
      { examName: '12th Board Marks (Direct Merit)', status: 'Taken' },
    ];
  }

  // Detect budget
  if (lower.includes('5 lakh') || lower.includes('5l')) {
    updates.totalBudgetLimit = 600000;
  } else if (lower.includes('10 lakh') || lower.includes('12 lakh') || lower.includes('10-12')) {
    updates.totalBudgetLimit = 1200000;
  } else if (lower.includes('15 lakh') || lower.includes('15l')) {
    updates.totalBudgetLimit = 1600000;
  } else if (lower.includes('25 lakh') || lower.includes('20 lakh') || lower.includes('above 20')) {
    updates.totalBudgetLimit = 2500000;
  }

  // Detect location
  if (lower.includes('delhi') || lower.includes('noida') || lower.includes('gurgaon') || lower.includes('ncr')) {
    updates.preferredCities = ['Delhi NCR'];
  } else if (lower.includes('bangalore') || lower.includes('bengaluru')) {
    updates.preferredCities = ['Bengaluru'];
  } else if (lower.includes('pune') || lower.includes('mumbai')) {
    updates.preferredCities = ['Pune', 'Mumbai'];
  }

  // Formulate next question based on what is missing
  const merged = { ...profile, ...updates };

  if (!merged.class12Percentage) {
    return {
      replyText:
        'Great to meet you! Let us find your ideal college match grounded in real verified data. To start with hard eligibility checks: What is your Class 12th board percentage (or expected score) and stream?',
      extractedUpdates: updates,
      suggestedQuickReplies: [
        '92% in PCM',
        '84% in Commerce with Maths',
        '78% in PCM',
        '88% in Commerce',
      ],
    };
  }

  if (!merged.targetDegree) {
    return {
      replyText: `Got it—${merged.class12Percentage}% in ${merged.class12Stream || 'your stream'}. Which degree or career path are you aiming for?`,
      extractedUpdates: updates,
      suggestedQuickReplies: [
        'B.Tech Computer Science',
        'BBA / Management Studies',
        'BCA (Software focus)',
        'Consulting / Tech Startups',
      ],
    };
  }

  if (!merged.entranceExams || merged.entranceExams.length === 0) {
    return {
      replyText: `Understood! For ${merged.targetDegree}, which entrance exams have you taken or plan to take (e.g. JEE Main, CUET, BITSAT, COMEDK, or direct 12th merit)?`,
      extractedUpdates: updates,
      suggestedQuickReplies: [
        'JEE Main taken',
        'CUET-UG taken',
        'COMEDK / BITSAT planned',
        'Direct 12th Board merit only',
      ],
    };
  }

  if (!merged.totalBudgetLimit) {
    return {
      replyText:
        'What is your comfortable total 4-year/3-year budget for tuition plus hostel? (This helps prevent recommending colleges with unsustainable hidden costs).',
      extractedUpdates: updates,
      suggestedQuickReplies: [
        'Under ₹6 Lakhs (Govt/Affordable)',
        '₹10 - 14 Lakhs',
        '₹15 - 22 Lakhs',
        'Budget is flexible / Loan option',
      ],
    };
  }

  if (!merged.preferredCities || merged.preferredCities.length === 0) {
    return {
      replyText:
        'Which cities or regions do you prefer, or are you comfortable relocating anywhere in India?',
      extractedUpdates: updates,
      suggestedQuickReplies: [
        'Delhi NCR',
        'Bengaluru',
        'Pune / Mumbai',
        'Anywhere in India',
      ],
    };
  }

  return {
    replyText:
      'Super! I have captured your academic scores, target degree, entrance profile, budget, and location preferences. Ready to inspect your personalized shortlist with transparent match breakdowns?',
    extractedUpdates: updates,
    suggestedQuickReplies: [
      'Show my college matches now',
      'Tell me about hostel & campus life first',
      'Refine my budget',
    ],
  };
}

// Full-Stack Server Integration with Vite
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CollegeDekoded AI Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
