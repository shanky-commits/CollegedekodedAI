import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, Send, Link, Building } from 'lucide-react';
import { College } from '../types';
import { submitDataErrorReport } from '../services/api';

interface ReportErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  colleges: College[];
  preselectedCollegeId?: string;
  onReportSubmitted?: () => void;
}

export const ReportErrorModal: React.FC<ReportErrorModalProps> = ({
  isOpen,
  onClose,
  colleges,
  preselectedCollegeId,
  onReportSubmitted,
}) => {
  const [selectedCollegeId, setSelectedCollegeId] = useState(preselectedCollegeId || (colleges[0]?.id ?? ''));
  const [fieldFlagged, setFieldFlagged] = useState('Tuition Fee Per Year');
  const [reportedValue, setReportedValue] = useState('');
  const [expectedValue, setExpectedValue] = useState('');
  const [sourceProofUrl, setSourceProofUrl] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCollege = colleges.find((c) => c.id === selectedCollegeId) || colleges[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expectedValue.trim() || !sourceProofUrl.trim()) return;

    setIsSubmitting(true);
    try {
      const report = await submitDataErrorReport({
        collegeId: currentCollege?.id || 'general',
        collegeName: currentCollege?.name || 'General Inquiry',
        fieldFlagged,
        reportedValue: reportedValue.trim(),
        expectedValue: expectedValue.trim(),
        sourceProofUrl: sourceProofUrl.trim(),
        userNotes: userNotes.trim(),
      });

      setSubmittedTicket(report.id);
      if (onReportSubmitted) onReportSubmitted();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedTicket(null);
    setExpectedValue('');
    setReportedValue('');
    setSourceProofUrl('');
    setUserNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Report Data Discrepancy
              </h3>
              <p className="text-xs text-slate-500">
                Help keep Indian college data 100% verified &amp; audit-proof
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedTicket ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Audit Report Submitted!
            </h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Ticket <span className="font-mono font-semibold text-slate-800">#{submittedTicket}</span> has been logged. Our academic audit team will verify your submitted source URL within 24 hours.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* College selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Target Institution
              </label>
              <select
                value={selectedCollegeId}
                onChange={(e) => setSelectedCollegeId(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.city}, {c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Field selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Data Field with Discrepancy
              </label>
              <select
                value={fieldFlagged}
                onChange={(e) => setFieldFlagged(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Tuition Fee Per Year">Tuition Fee Per Year</option>
                <option value="Median Placement CTC">Median Placement CTC</option>
                <option value="Highest Domestic Package">Highest Domestic Package</option>
                <option value="Entrance Exam Cutoff Range">Entrance Exam Cutoff Range</option>
                <option value="Class 12th Eligibility Cutoff">Class 12th Eligibility Cutoff</option>
                <option value="Hostel / Mess Fee">Hostel / Mess Fee</option>
                <option value="Attendance Policy">Attendance Policy</option>
                <option value="Accreditation / NIRF Rank">Accreditation / NIRF Rank</option>
              </select>
            </div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Shown Value (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹2,29,000"
                  value={reportedValue}
                  onChange={(e) => setReportedValue(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Correct Verified Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹2,35,000 / 2025 rev"
                  value={expectedValue}
                  onChange={(e) => setExpectedValue(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Source proof URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Source Proof URL (PDF / Gazette / Portal) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Link className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="url"
                  required
                  placeholder="https://... (official prospectus, NIRF filing, or senate notification)"
                  value={sourceProofUrl}
                  onChange={(e) => setSourceProofUrl(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                We only accept primary sources (institute portal, NIRF, AICTE, State CET cell). Unverified blogs are not accepted.
              </p>
            </div>

            {/* User notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Context / Academic Year Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. As per page 14 of the official 2024-25 notification..."
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !expectedValue.trim() || !sourceProofUrl.trim()}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Logging...' : 'Submit to Audit Panel'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
