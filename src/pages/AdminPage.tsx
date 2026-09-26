import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Edit3, 
  BarChart3, 
  FileText, 
  ExternalLink, 
  Check, 
  RefreshCw,
  TrendingUp,
  Users
} from 'lucide-react';
import { College, DataErrorReport } from '../types';
import { fetchReports, updateReportStatus, saveStoredColleges } from '../services/api';

interface AdminPageProps {
  colleges: College[];
  onUpdateColleges: (updated: College[]) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ colleges, onUpdateColleges }) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'colleges' | 'reviews' | 'analytics'>('reports');
  const [reports, setReports] = useState<DataErrorReport[]>([]);
  const [selectedCollegeForEdit, setSelectedCollegeForEdit] = useState<College | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const list = await fetchReports();
    setReports(list);
  };

  const handleUpdateReportStatus = async (
    reportId: string,
    newStatus: 'Verified & Updated' | 'Rejected',
    notes?: string
  ) => {
    await updateReportStatus(reportId, newStatus, notes);
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: newStatus, adminNotes: notes } : r
      )
    );
    setActionSuccessMessage(`Report #${reportId} updated to ${newStatus}.`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleUpdateCollegeRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCollegeForEdit) return;

    const updatedList = colleges.map((c) =>
      c.id === selectedCollegeForEdit.id ? selectedCollegeForEdit : c
    );
    onUpdateColleges(updatedList);
    saveStoredColleges(updatedList);
    setSelectedCollegeForEdit(null);
    setActionSuccessMessage(`Updated record for ${selectedCollegeForEdit.name}.`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const pendingReportsCount = reports.filter((r) => r.status === 'Pending Review').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Academic Audit &amp; Admin Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
              Internal Portal
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit institutional disclosures, resolve user discrepancy tickets, and manage ground reality submissions.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="text-slate-400 block text-[10px]">Verified Colleges</span>
            <span className="font-bold text-slate-900 text-sm">{colleges.length}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs">
            <span className="text-amber-700 block text-[10px]">Pending Reports</span>
            <span className="font-bold text-amber-900 text-sm">{pendingReportsCount}</span>
          </div>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-1 pb-1">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Reported Discrepancies ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('colleges')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'colleges'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Manage Verified Colleges ({colleges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Recommendation Analytics</span>
        </button>
      </div>

      {/* Tab 1: User Reported Errors */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Community Audit Queue
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs"
              >
                <option value="all">All</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Verified & Updated">Verified &amp; Updated</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {reports
              .filter((r) => statusFilter === 'all' || r.status === statusFilter)
              .map((rep) => (
                <div
                  key={rep.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="font-mono text-slate-400 text-[10px]">#{rep.id}</span>
                      <h3 className="font-bold text-slate-900 text-sm">{rep.collegeName}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          rep.status === 'Pending Review'
                            ? 'bg-amber-100 text-amber-800'
                            : rep.status === 'Verified & Updated'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Field Flagged</span>
                      <span className="font-bold text-slate-800">{rep.fieldFlagged}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Reported Expected Value</span>
                      <span className="font-bold text-indigo-700">{rep.expectedValue}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Source Proof Link</span>
                      <a
                        href={rep.sourceProofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold truncate mt-0.5"
                      >
                        <span className="truncate">{rep.sourceProofUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  {rep.userNotes && (
                    <p className="text-slate-600 text-[11px] bg-slate-50 p-2.5 rounded-xl">
                      <strong>User Remark:</strong> {rep.userNotes}
                    </p>
                  )}

                  {/* Actions for Pending */}
                  {rep.status === 'Pending Review' && (
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() =>
                          handleUpdateReportStatus(
                            rep.id,
                            'Rejected',
                            'Source proof did not reflect official state gazette or senate order.'
                          )
                        }
                        className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold cursor-pointer"
                      >
                        Reject Ticket
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateReportStatus(
                            rep.id,
                            'Verified & Updated',
                            'Verified against official notification. Database updated.'
                          )
                        }
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        Approve &amp; Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 2: Colleges Management */}
      {activeTab === 'colleges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Verified Institutional Catalog
            </h2>
          </div>

          <div className="divide-y divide-slate-100 rounded-3xl border border-slate-200 bg-white overflow-hidden text-xs">
            {colleges.map((c) => {
              const primary = c.courses[0];
              return (
                <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {c.collegeType}
                      </span>
                    </div>
                    <p className="text-slate-500">
                      {c.city}, {c.state} • Total Fee: ₹{(primary.fees.totalCourseFee / 100000).toFixed(1)}L • Median: ₹{primary.placements.medianCtcLpa} LPA
                    </p>
                    <span className="text-[10px] font-mono text-slate-400">
                      Last Verified: {c.lastVerifiedDate} by {c.verifiedBy}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedCollegeForEdit(c)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold self-start sm:self-auto cursor-pointer"
                  >
                    Edit Record
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Matched Degrees</span>
            <div className="text-2xl font-extrabold text-slate-900">B.Tech CSE (68%)</div>
            <p className="text-xs text-slate-500">Followed by BBA / BMS (22%) and BCA (10%)</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Budget Cap</span>
            <div className="text-2xl font-extrabold text-indigo-600">₹14.5 Lakhs</div>
            <p className="text-xs text-slate-500">Across 4-year tuition &amp; hostel</p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Freshness Score</span>
            <div className="text-2xl font-extrabold text-emerald-600">98.4%</div>
            <p className="text-xs text-slate-500">Records audited within last 90 days</p>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {selectedCollegeForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900">
              Edit Verified Record: {selectedCollegeForEdit.name}
            </h3>

            <form onSubmit={handleUpdateCollegeRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Last Verified Date</label>
                <input
                  type="date"
                  value={selectedCollegeForEdit.lastVerifiedDate}
                  onChange={(e) =>
                    setSelectedCollegeForEdit({ ...selectedCollegeForEdit, lastVerifiedDate: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Verified By Authority</label>
                <input
                  type="text"
                  value={selectedCollegeForEdit.verifiedBy}
                  onChange={(e) =>
                    setSelectedCollegeForEdit({ ...selectedCollegeForEdit, verifiedBy: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tuition Fee Per Year (INR)
                </label>
                <input
                  type="number"
                  value={selectedCollegeForEdit.courses[0]?.fees.tuitionFeePerYear || 0}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const courses = [...selectedCollegeForEdit.courses];
                    if (courses[0]) {
                      courses[0].fees.tuitionFeePerYear = val;
                      courses[0].fees.totalCourseFee = val * courses[0].durationYears;
                    }
                    setSelectedCollegeForEdit({ ...selectedCollegeForEdit, courses });
                  }}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Placement Median CTC (LPA)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedCollegeForEdit.courses[0]?.placements.medianCtcLpa || 0}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    const courses = [...selectedCollegeForEdit.courses];
                    if (courses[0]) {
                      courses[0].placements.medianCtcLpa = val;
                    }
                    setSelectedCollegeForEdit({ ...selectedCollegeForEdit, courses });
                  }}
                  className="w-full rounded-xl border border-slate-300 p-2"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCollegeForEdit(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
