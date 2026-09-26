import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Send, ExternalLink, HelpCircle, CheckCircle, Info } from 'lucide-react';
import { College } from '../types';
import { askAiAboutCollege } from '../services/api';

interface AskAiDrawerProps {
  college: College | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AskAiDrawer: React.FC<AskAiDrawerProps> = ({ college, isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  if (!isOpen || !college) return null;

  const quickQuestions = [
    `What is the exact 4-year tuition + hostel cost for ${college.shortName}?`,
    `What was the official median CTC and top tech recruiters?`,
    `What are the honest student complaints and attendance rules?`,
    `What is the 12th board percentage & entrance cutoff for CSE/BBA?`,
  ];

  const handleAsk = async (qText: string) => {
    if (!qText.trim()) return;
    setQuestion(qText);
    setIsLoading(true);
    setAnswer(null);

    try {
      const res = await askAiAboutCollege(college.id, qText);
      setAnswer(res);
    } catch (e) {
      console.error(e);
      setAnswer('Unable to query college records at this moment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Ask AI: {college.shortName}
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Grounded
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Audited against official NIRF &amp; Institute filings ({college.lastVerifiedDate})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anti-hallucination banner */}
        <div className="bg-indigo-50/70 border-b border-indigo-100 px-6 py-2.5 flex items-center gap-2 text-xs text-indigo-900 font-medium">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            Zero-Hallucination Policy: Answers are restricted strictly to verified institutional records.
          </span>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick suggestions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Suggested Decision Inquiries
            </h4>
            <div className="space-y-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-xs font-medium text-slate-700 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span>{q}</span>
                  <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Answer section */}
          {isLoading && (
            <div className="p-6 rounded-2xl border border-indigo-100 bg-indigo-50/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                <span>Cross-referencing verified audit tables for {college.shortName}...</span>
              </div>
              <div className="h-4 bg-indigo-100/70 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-indigo-100/70 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-indigo-100/70 rounded animate-pulse w-1/2" />
            </div>
          )}

          {answer && !isLoading && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Verified AI Synthesis
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Audited: {college.lastVerifiedDate}
                  </span>
                </div>
                <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line space-y-2">
                  {answer}
                </div>
              </div>

              {/* Source citations */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Official Verification Citations
                </h5>
                <ul className="space-y-1.5 text-xs">
                  {college.officialSources.map((src, i) => (
                    <li key={i} className="flex items-center justify-between text-slate-600">
                      <span className="truncate pr-2 font-medium">{src.title}</span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-[11px] shrink-0 font-semibold"
                      >
                        Source PDF <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(question);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask a specific question about ${college.shortName}...`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            Grounded directly on {college.name} structured audit record.
          </p>
        </div>
      </div>
    </div>
  );
};
