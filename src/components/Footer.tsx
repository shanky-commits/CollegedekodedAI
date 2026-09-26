import React from 'react';
import { ShieldCheck, CheckCircle2, FileCheck, HelpCircle } from 'lucide-react';

interface FooterProps {
  setActivePage: (page: string) => void;
  onOpenReportModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage, onOpenReportModal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-extrabold text-sm">
                CD
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                College<span className="text-indigo-400">Dekoded</span> AI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India&apos;s first transparent college decision engine. No paid college promotions, no biased rankings, no hallucinated numbers.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>NIRF &amp; AICTE Data Grounded</span>
            </div>
          </div>

          {/* Core Decision Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Decision Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActivePage('counselor')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI College Counselor
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('explore')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Verified College Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('compare')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Side-by-Side Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('shortlist')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Saved Shortlist &amp; Export
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Trust &amp; Auditing
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActivePage('trust')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Data Verification Methodology
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenReportModal}
                  className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Report Data Discrepancy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('blueprint')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  System Architecture &amp; Algorithm
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('admin')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admin Verification Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional Integrity Pledge */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>Zero-Hallucination Policy</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Our AI is strictly instructed to respond &ldquo;Data not verified / available&rdquo; rather than fabricate cutoffs, fees, or placements. Every fact is bound to an official gazette or prospectus.
            </p>
          </div>
        </div>

        {/* Bottom disclaimer bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            &copy; {new Date().getFullYear()} CollegeDekoded AI. Independent student decision platform.
          </p>
          <p className="text-[11px] text-slate-500 max-w-xl text-center md:text-right">
            Disclaimer: Fit scores are algorithmic compatibility indicators based on user-stated parameters. They do not constitute an admission guarantee. Always cross-check with official state counseling authority (JoSAA, JAC, CSAS, COMEDK).
          </p>
        </div>
      </div>
    </footer>
  );
};
