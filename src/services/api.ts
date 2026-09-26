import { College, CollegeRecommendation, DataErrorReport, StudentProfile } from '../types';
import { INITIAL_COLLEGES, INITIAL_ERROR_REPORTS } from '../data/colleges';
import { runDecisionEngine } from './decisionEngine';

// Local storage keys
const LOCAL_STORAGE_SAVED_SHORTLIST = 'collegedekoded_saved_shortlist';
const LOCAL_STORAGE_STUDENT_PROFILE = 'collegedekoded_student_profile';
const LOCAL_STORAGE_REPORTS = 'collegedekoded_data_reports';
const LOCAL_STORAGE_COLLEGES = 'collegedekoded_colleges';

// Initialize local colleges cache
function getStoredColleges(): College[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_COLLEGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  return INITIAL_COLLEGES;
}

export function saveStoredColleges(colleges: College[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_COLLEGES, JSON.stringify(colleges));
  } catch (e) {
    console.error('Failed to save colleges to local storage', e);
  }
}

// 1. Fetch colleges
export async function fetchColleges(): Promise<College[]> {
  try {
    const res = await fetch('/api/colleges');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.colleges) {
        saveStoredColleges(data.colleges);
        return data.colleges;
      }
    }
  } catch (err) {
    console.warn('Backend /api/colleges unreachable, utilizing local database', err);
  }
  return getStoredColleges();
}

// 2. Fetch single college
export async function fetchCollegeById(id: string): Promise<College | null> {
  try {
    const res = await fetch(`/api/colleges/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.college) {
        return data.college;
      }
    }
  } catch (err) {
    console.warn('Backend /api/colleges/:id unreachable, using local match', err);
  }
  const all = getStoredColleges();
  return all.find((c) => c.id === id || c.slug === id) || null;
}

// 3. Conversational Counselor
export async function sendCounselorMessage(
  messages: Array<{ sender: 'ai' | 'user'; text: string }>,
  currentProfile: Partial<StudentProfile>
): Promise<{
  replyText: string;
  extractedUpdates: Partial<StudentProfile>;
  suggestedQuickReplies: string[];
}> {
  try {
    const res = await fetch('/api/counselor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, currentProfile }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          replyText: data.replyText,
          extractedUpdates: data.extractedUpdates || {},
          suggestedQuickReplies: data.suggestedQuickReplies || [],
        };
      }
    }
  } catch (err) {
    console.warn('Backend counselor chat error, running client heuristics', err);
  }

  // Fallback heuristic client counseling
  const latest = messages[messages.length - 1]?.text || '';
  const lower = latest.toLowerCase();
  const updates: Partial<StudentProfile> = {};

  const pct = latest.match(/(\d{2,3}(?:\.\d+)?)\s*%/);
  if (pct) updates.class12Percentage = parseFloat(pct[1]);

  if (lower.includes('pcm')) updates.class12Stream = 'PCM';
  else if (lower.includes('commerce')) updates.class12Stream = 'Commerce with Maths';

  if (lower.includes('b.tech') || lower.includes('btech') || lower.includes('computer')) {
    updates.targetDegree = 'B.Tech';
  } else if (lower.includes('bba') || lower.includes('management')) {
    updates.targetDegree = 'BBA';
  } else if (lower.includes('bca')) {
    updates.targetDegree = 'BCA';
  }

  if (lower.includes('jee')) {
    updates.entranceExams = [{ examName: 'JEE Main', status: 'Taken' }];
  } else if (lower.includes('cuet')) {
    updates.entranceExams = [{ examName: 'CUET-UG', status: 'Taken' }];
  }

  return {
    replyText:
      'I noted your input. Let us align on your primary goals: What is your 12th percentage, degree preference, and total budget limit?',
    extractedUpdates: updates,
    suggestedQuickReplies: ['92% in PCM', 'B.Tech Computer Science', 'Under ₹12 Lakhs budget', 'Delhi NCR / Bangalore'],
  };
}

// 4. Recommend Colleges (Run Decision Engine)
export async function getRecommendations(profile: StudentProfile): Promise<CollegeRecommendation[]> {
  try {
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.recommendations) {
        return data.recommendations;
      }
    }
  } catch (err) {
    console.warn('Server recommendation unavailable, executing local decision engine', err);
  }

  const colleges = getStoredColleges();
  return runDecisionEngine(colleges, profile);
}

// 5. Ask AI about specific college
export async function askAiAboutCollege(collegeId: string, question: string): Promise<string> {
  try {
    const res = await fetch(`/api/colleges/${encodeURIComponent(collegeId)}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.answer) {
        return data.answer;
      }
    }
  } catch (e) {
    console.warn('Direct college AI query failed', e);
  }
  const col = await fetchCollegeById(collegeId);
  if (!col) return 'College data not found.';
  return `Official verified record for ${col.name} (audited ${col.lastVerifiedDate}): Course fee is ₹${(col.courses[0]?.fees.totalCourseFee / 100000).toFixed(1)}L, median CTC is ₹${col.courses[0]?.placements.medianCtcLpa} LPA. Verification source: ${col.officialSources[0]?.title || 'Institutional filing'}.`;
}

// 6. Report incorrect data
export async function submitDataErrorReport(reportData: {
  collegeId: string;
  collegeName: string;
  fieldFlagged: string;
  reportedValue: string;
  expectedValue: string;
  sourceProofUrl: string;
  userNotes: string;
}): Promise<DataErrorReport> {
  try {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.report) {
        return data.report;
      }
    }
  } catch (err) {
    console.warn('Backend report error, storing locally', err);
  }

  const newReport: DataErrorReport = {
    id: `rep-client-${Date.now()}`,
    ...reportData,
    reportedAt: new Date().toISOString(),
    status: 'Pending Review',
  };

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS);
    const list: DataErrorReport[] = raw ? JSON.parse(raw) : [...INITIAL_ERROR_REPORTS];
    list.unshift(newReport);
    localStorage.setItem(LOCAL_STORAGE_REPORTS, JSON.stringify(list));
  } catch (e) {}

  return newReport;
}

// 7. Get error reports (Admin)
export async function fetchReports(): Promise<DataErrorReport[]> {
  try {
    const res = await fetch('/api/admin/reports');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.reports) {
        return data.reports;
      }
    }
  } catch (e) {
    console.warn('Admin fetch reports fallback to local');
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REPORTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return INITIAL_ERROR_REPORTS;
}

// 8. Update error report status (Admin)
export async function updateReportStatus(
  id: string,
  status: 'Pending Review' | 'Verified & Updated' | 'Rejected',
  adminNotes?: string
): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/reports/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes }),
    });
    if (res.ok) return true;
  } catch (e) {
    console.warn('Update report status fallback');
  }
  return true;
}

// 9. Save and retrieve student profile in localStorage
export function getSavedStudentProfile(): StudentProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STUDENT_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_STUDENT_PROFILE, JSON.stringify(profile));
  } catch (e) {}
}

// 10. Saved Shortlist Management
export function getSavedShortlist(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SAVED_SHORTLIST);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

export function toggleSaveCollege(collegeId: string): string[] {
  const current = getSavedShortlist();
  let updated: string[];
  if (current.includes(collegeId)) {
    updated = current.filter((id) => id !== collegeId);
  } else {
    updated = [...current, collegeId];
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_SAVED_SHORTLIST, JSON.stringify(updated));
  } catch (e) {}
  return updated;
}
