import React, { useState } from 'react';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, Upload, Lock, FileText } from 'lucide-react';

export const PartnerPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [instituteName, setInstituteName] = useState('');
  const [repName, setRepName] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [aicteCode, setAicteCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>University Verification &amp; Institutional Gateway (B2B)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Claim &amp; Audit Your Official Institution Profile
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          CollegeDekoded AI never accepts paid placement promotion or sponsored ranking auctions. Accredited institutions can claim their verified profile to submit official fee regulatory gazettes, NIRF audit tables, and verified admissions dates directly.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Institutional Verification Request Received
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Our registrar auditing desk has dispatched a verification token to your official institutional email ({officialEmail}). We will schedule a registrar verification call within 48 business hours.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Institution Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. National Institute of Technology..."
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                AICTE / UGC Permanent Institute Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 1-12345678"
                value={aicteCode}
                onChange={(e) => setAicteCode(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Registrar / Dean / Admissions Head Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. R. Sharma"
                value={repName}
                onChange={(e) => setRepName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Official Institutional Email (.ac.in / .edu.in) <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="registrar@university.ac.in"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Generic emails (gmail/yahoo) will be automatically rejected.
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-indigo-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Non-Sponsored Institutional Policy
            </span>
            <p className="text-[11px] text-slate-600">
              Claiming your profile enables direct document submissions (fee gazettes, NIRF audit tables). It does not grant preferential ranking algorithm weights.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Submit Profile Claim Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
