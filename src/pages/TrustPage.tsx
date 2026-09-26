import React from 'react';
import { 
  ShieldCheck, 
  FileCheck, 
  Search, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  FileText,
  Clock
} from 'lucide-react';

export const TrustPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Institutional Verification Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How CollegeDekoded AI Audits Educational Data
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          In India, college admissions portals monetize by selling student leads and showcasing biased sponsored rankings. Here is our 4-tier verification protocol that guarantees truth and prevents AI hallucination.
        </p>
      </div>

      {/* 4 Pillars of Data Integrity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Primary Government &amp; Gazette Sources Only
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We never ingest marketing brochures or blog listicles. Every fee number and median placement CTC is bound directly to primary official disclosures:
          </p>
          <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
            <li>MHRD NIRF Submissions (Table 1: Sanctioned Intake &amp; Placement CTC)</li>
            <li>AICTE Mandatory Disclosures signed by the Institute Director</li>
            <li>State Admission Cell Gazettes (JAC Delhi, KEA Karnataka, JoSAA)</li>
            <li>University Senate Fee Regulatory Committee notifications</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Zero-Hallucination AI Architecture
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard LLMs invent convincing cutoffs and placement packages when asked questions about colleges. Our platform implements an uncompromising system boundary:
          </p>
          <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
            <li>AI is restricted strictly to the verified JSON database record</li>
            <li>Strict instruction: Say &ldquo;Data not verified / available&rdquo; instead of guessing</li>
            <li>Clear visual distinction between official facts and student opinions</li>
            <li>Mandatory source URL and last verified date stamped on every response</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Hard Eligibility Constraints First
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Other platforms give students false hopes with arbitrary &lsquo;admission chances&rsquo;. We separate:
          </p>
          <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
            <li><strong>Hard Constraints:</strong> Stream match, 12th % cutoff, compulsory entrance exams</li>
            <li><strong>Preferences:</strong> Budget ROI, campus culture, location, and student reviews</li>
            <li>Fit Score is transparently labeled as a preference match, never a guarantee</li>
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            4
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Community Audit &amp; Error Flagging
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Colleges revise fee structures or hostel rules each academic year. We empower users and faculty to report discrepancies:
          </p>
          <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
            <li>1-click &ldquo;Report Data Error&rdquo; with mandatory official proof URL</li>
            <li>Automated audit tickets reviewed by human academic editors within 24 hours</li>
            <li>Transparent revision log on institutional profiles</li>
          </ul>
        </div>

      </div>

      {/* Freshness Cycle */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Audit Cycle &amp; Stale Data Protocol</span>
        </div>
        <h3 className="text-lg font-bold">
          Semi-Annual Verification Frequency
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Every college profile undergoes a mandatory re-audit every 6 months or whenever a new NIRF report or State Admission Cell brochure is published. Any record older than 180 days is automatically flagged with an &ldquo;Audit In Progress&rdquo; badge until newly gazetted numbers are verified.
        </p>
      </div>

    </div>
  );
};
