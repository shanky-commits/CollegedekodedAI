import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  Database, 
  Cpu, 
  Terminal, 
  Calendar, 
  CheckCircle2, 
  Code2, 
  Sparkles,
  GitBranch,
  ShieldAlert
} from 'lucide-react';

export const SystemDocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('architecture');

  const sections = [
    { id: 'architecture', title: 'A. Product Architecture' },
    { id: 'userflow', title: 'B. User Flow' },
    { id: 'schema', title: 'C. Database Schemas' },
    { id: 'algorithm', title: 'D. Recommendation Algorithm' },
    { id: 'prompt', title: 'E. AI System Prompt' },
    { id: 'frontend', title: 'F. Frontend Structure' },
    { id: 'backend', title: 'G. Backend & API' },
    { id: 'testing', title: 'J. Testing & Verification' },
    { id: 'roadmap', title: 'L. 90-Day MVP Roadmap' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>Technical Architecture &amp; System Specification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          CollegeDekoded AI — Complete Technical Blueprint
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Full specification for product architects, full-stack engineers, and data auditor teams covering architecture, recommendation algorithm, anti-hallucination boundary, and 90-day execution roadmap.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-slate-200">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeSection === sec.id
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {sec.title}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
        
        {/* A. Product Architecture */}
        {activeSection === 'architecture' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>A. Practical Modern Stack &amp; Scalable Architecture</span>
            </h2>
            <p>
              To maintain low initial MVP cost while providing instant sub-second response times and auditability, CollegeDekoded AI employs a <strong>Hybrid Edge + Serverless Full-Stack Architecture</strong>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">1. Presentation Layer</span>
                <p className="text-[11px] text-slate-600">
                  React 19 + TypeScript + Vite + Tailwind CSS. Responsive, conversational counselor UI with live profile construction dock, zero-pill aesthetic, and instant local caching for offline capability.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">2. API &amp; Decision Layer</span>
                <p className="text-[11px] text-slate-600">
                  Node.js / Express proxy integrating Vite middleware in development and serving static dist in production. Encapsulates two-stage recommendation engine: Hard eligibility pruning followed by weighted preference scoring.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">3. Grounded AI &amp; Retrieval Layer</span>
                <p className="text-[11px] text-slate-600">
                  Google GenAI SDK (<code>gemini-3.8-flash</code>) running strictly on the server-side with structured JSON mode and strict retrieval-augmented context. The model is forbidden from guessing numbers not present in official institutional audit files.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* B. User Flow */}
        {activeSection === 'userflow' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-600" />
              <span>B. End-to-End Decision User Flow</span>
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700">
              <li><strong>Entry:</strong> Student arrives on landing page, searches directory or clicks &ldquo;Find colleges for me&rdquo;.</li>
              <li><strong>Conversational Guidance:</strong> AI Counselor asks high-impact, decision-relevant questions (12th % and stream, target degree, entrance exams taken, budget limit, location).</li>
              <li><strong>Dynamic Profile Extraction:</strong> Dialogue is translated into a normalized <code>StudentProfile</code> object shown in real-time in the side panel.</li>
              <li><strong>Hard Constraint Filtering:</strong> The engine checks 12th board cutoffs, stream mandates (e.g. PCM for B.Tech), compulsory entrance tests, and hard location constraints. Non-conforming colleges are filtered out or flagged.</li>
              <li><strong>Transparent Fit Scoring:</strong> Remaining colleges are scored out of 100 points across 5 transparent buckets: Budget &amp; ROI (25), Placement (25), Academic cushion (20), Campus culture (15), and Location match (15).</li>
              <li><strong>Review &amp; Trade-offs:</strong> Student views verified cards showing explicit &ldquo;Why it matches&rdquo; and &ldquo;Possible drawbacks/trade-offs&rdquo; (e.g. strict attendance, curfew).</li>
              <li><strong>Side-by-Side Comparison:</strong> Student selects 2–4 colleges to view exact tuition fees, hostel expenses, and years to recover cost.</li>
              <li><strong>Audit Verification &amp; Error Flagging:</strong> Student views official primary source documents (NIRF, gazettes) and can report any discrepancy via a 1-click verified ticket modal.</li>
            </ol>
          </div>
        )}

        {/* C. Database Schema */}
        {activeSection === 'schema' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>C. Normalized Database Schemas</span>
            </h2>
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto space-y-3">
              <pre>{`// Student Profile Entity
Table StudentProfile {
  id: UUID [pk]
  fullName: VARCHAR(100)
  class12Percentage: DECIMAL(5,2)
  class12Stream: ENUM ('PCM', 'PCB', 'Commerce with Maths', 'Commerce', 'Arts/Humanities')
  targetDegree: ENUM ('B.Tech', 'BBA', 'BCA', 'MBA', 'Any')
  totalBudgetLimit: DECIMAL(12,2) // Complete course fees + hostel
  preferredCities: JSONB // e.g. ["Delhi NCR", "Bengaluru"]
  relocationPreference: ENUM ('Anywhere in India', 'Within 500km', 'Home State / City Only')
  placementPriority: VARCHAR(50)
  campusLifePriority: VARCHAR(50)
}

// College Entity
Table College {
  id: VARCHAR(50) [pk]
  name: VARCHAR(200)
  collegeType: ENUM ('Central Govt', 'State Govt', 'Deemed University', 'Private Tier-1')
  city: VARCHAR(100)
  state: VARCHAR(100)
  nirfRankEngg: INTEGER [nullable]
  naacGrade: VARCHAR(10)
  lastVerifiedDate: DATE
  verifiedBy: VARCHAR(150)
  officialSources: JSONB // array of { title, url, sourceType, academicYear }
}

// Course & Fee Breakdown
Table CourseFeeRecord {
  courseId: VARCHAR(50) [pk]
  collegeId: VARCHAR(50) [ref: > College.id]
  degree: VARCHAR(50)
  specialization: VARCHAR(100)
  tuitionFeePerYear: DECIMAL(10,2)
  totalCourseFee: DECIMAL(12,2)
  medianCtcLpa: DECIMAL(5,2)
  min12thPercentage: DECIMAL(5,2)
  mandatorySubjects: JSONB
  sourceUrl: VARCHAR(500)
}`}</pre>
            </div>
          </div>
        )}

        {/* D. Recommendation Algorithm */}
        {activeSection === 'algorithm' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>D. Two-Stage Recommendation Algorithm</span>
            </h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">Stage 1: Hard Eligibility Filters</h4>
              <p className="text-[11px] text-slate-600">
                A college is marked failed or disqualified if: (1) Student 12th % &lt; College min eligibility cutoff, (2) Student stream does not match mandatory subjects, (3) College strictly requires an exam (e.g. JEE Main/BITSAT) that student hasn't taken, or (4) Total cost exceeds user's stated strict budget by &gt;35%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-xs">Stage 2: 100-Point Transparent Fit Scoring</h4>
              <ul className="text-[11px] text-slate-600 space-y-1">
                <li>• <strong>Budget &amp; ROI Fit (25 pts):</strong> Full 25 pts if within budget; graduated penalty for slight stretches with scholarship potential.</li>
                <li>• <strong>Placement Fit (25 pts):</strong> Evaluates median package (NIRF filed) and student's stated career salary priority.</li>
                <li>• <strong>Academic Cushion (20 pts):</strong> Compares student's score with historical cutoffs to provide safety buffers.</li>
                <li>• <strong>Campus Culture &amp; Rules (15 pts):</strong> Matches student preference for autonomy vs strict attendance rules.</li>
                <li>• <strong>Location Match (15 pts):</strong> Full points for target cities; national score for flexible students.</li>
              </ul>
            </div>
          </div>
        )}

        {/* E. AI System Prompt */}
        {activeSection === 'prompt' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>E. Grounded Anti-Hallucination System Prompt</span>
            </h2>
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
              <pre>{`SYSTEM INSTRUCTION:
You are the CollegeDekoded Fact Verification AI.
You operate under a strict ZERO-HALLUCINATION mandate.
RULES:
1. You are provided with a structured JSON record of the college.
2. NEVER fabricate, estimate, or extrapolate fees, cutoff percentiles, or placement packages.
3. If the user asks for a piece of information NOT present in the verified record:
   You MUST reply: "Data not verified / available in official records. Please verify directly with the admissions office."
4. Distinguish clearly between Official Institutional Facts (NIRF/AICTE) and Student Ground Reality Reviews.
5. Never state admission probability percentages. Use only transparent preference fit scores.`}</pre>
            </div>
          </div>
        )}

        {/* F. Frontend Structure */}
        {activeSection === 'frontend' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-600" />
              <span>F. Frontend Component Architecture</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Pages:</span>
                <p className="text-slate-500 mt-1">HomePage, CounselorPage, ResultsPage, CollegeDetailPage, ComparePage, ShortlistPage, ProfilePage, ExplorePage, TrustPage, AdminPage, PartnerPage, SystemDocsPage.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Key Shared Components:</span>
                <p className="text-slate-500 mt-1">Navbar (with live badges), Footer (trust manifesto), ReportErrorModal (user audit feedback), AskAiDrawer (grounded Q&amp;A drawer).</p>
              </div>
            </div>
          </div>
        )}

        {/* G. Backend & API */}
        {activeSection === 'backend' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              <span>G. Backend &amp; API Structure</span>
            </h2>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden font-mono text-[11px]">
              <div className="p-3 bg-slate-50 flex justify-between">
                <span className="text-indigo-600 font-bold">GET /api/colleges</span>
                <span className="text-slate-500">Retrieve all verified college audit records</span>
              </div>
              <div className="p-3 bg-white flex justify-between">
                <span className="text-indigo-600 font-bold">POST /api/counselor/chat</span>
                <span className="text-slate-500">Dialogue step + JSON student profile extraction</span>
              </div>
              <div className="p-3 bg-slate-50 flex justify-between">
                <span className="text-indigo-600 font-bold">POST /api/recommend</span>
                <span className="text-slate-500">Execute decision engine (hard filters + ranking)</span>
              </div>
              <div className="p-3 bg-white flex justify-between">
                <span className="text-indigo-600 font-bold">POST /api/colleges/:id/ask</span>
                <span className="text-slate-500">Strictly grounded anti-hallucination Q&amp;A</span>
              </div>
              <div className="p-3 bg-slate-50 flex justify-between">
                <span className="text-indigo-600 font-bold">POST /api/reports</span>
                <span className="text-slate-500">Submit community data discrepancy ticket</span>
              </div>
              <div className="p-3 bg-white flex justify-between">
                <span className="text-indigo-600 font-bold">GET /api/admin/reports</span>
                <span className="text-slate-500">Admin audit queue</span>
              </div>
            </div>
          </div>
        )}

        {/* J. Testing Plan */}
        {activeSection === 'testing' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>J. Testing &amp; Hallucination Prevention Plan</span>
            </h2>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">1. Hard Constraint Boundary Tests:</span>
                <p className="text-slate-500">Simulate students with 58% in 12th Board applying to DTU CSE (mandatory 60% requirement). Verify that the engine places the college in &ldquo;Ineligible&rdquo; and lists the exact percentage shortfall.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">2. Hallucination Trap Inquiries:</span>
                <p className="text-slate-500">Query the grounded AI endpoint with unverified questions such as &ldquo;What is the secret management quota fee for DTU?&rdquo; Verify that the model strictly refuses to speculate and states official policies only.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">3. Budget Disqualification Tests:</span>
                <p className="text-slate-500">Set total budget to ₹5 Lakhs and verify that high-fee private institutions (&gt;₹24L) fail hard budget constraints or receive transparent stretch penalties.</p>
              </div>
            </div>
          </div>
        )}

        {/* L. 90-Day MVP Roadmap */}
        {activeSection === 'roadmap' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>L. 90-Day MVP Execution Roadmap</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  Days 1 – 30
                </span>
                <h4 className="font-bold text-slate-900 text-xs">Core Launch Cohort</h4>
                <p className="text-[11px] text-slate-600">
                  Seed 100 top engineering &amp; management colleges across Delhi NCR, Bengaluru, and Pune. Verify against NIRF 2024. Validate conversational onboarding and transparent 100-pt fit algorithm.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  Days 31 – 60
                </span>
                <h4 className="font-bold text-slate-900 text-xs">State CET Expansion</h4>
                <p className="text-[11px] text-slate-600">
                  Integrate MHT-CET, COMEDK, KCET, and WBJEE counseling cutoffs. Expand catalog to 250 verified colleges. Roll out user error reporting audit desk and student ground reality moderation.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  Days 61 – 90
                </span>
                <h4 className="font-bold text-slate-900 text-xs">SEO &amp; Institutional Gateway</h4>
                <p className="text-[11px] text-slate-600">
                  Generate structured high-intent programmatic pages (e.g. &ldquo;B.Tech CSE in Noida under ₹12L&rdquo;). Open the B2B university verification claim portal for registrars to upload verified senate notices.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
