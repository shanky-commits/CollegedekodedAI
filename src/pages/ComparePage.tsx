import React from 'react';
import { 
  Layers, 
  X, 
  Plus, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  Share2, 
  MapPin, 
  AlertTriangle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { College } from '../types';

interface ComparePageProps {
  compareColleges: College[];
  allColleges: College[];
  onRemoveFromCompare: (collegeId: string) => void;
  onAddToCompare: (collegeId: string) => void;
  onSelectCollege: (college: College) => void;
  onOpenAskAi: (college: College) => void;
  setActivePage: (page: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  compareColleges,
  allColleges,
  onRemoveFromCompare,
  onAddToCompare,
  onSelectCollege,
  onOpenAskAi,
  setActivePage,
}) => {
  const [selectedToAdd, setSelectedToAdd] = React.useState('');

  const availableColleges = allColleges.filter(
    (c) => !compareColleges.some((comp) => comp.id === c.id)
  );

  if (compareColleges.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          No Colleges Selected for Comparison
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Add 2 to 4 colleges from your personalized shortlist or verified directory to compare fees, median placements, attendance rules, and ROI side by side.
        </p>
        <button
          onClick={() => setActivePage('explore')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-2"
        >
          <span>Browse Colleges to Compare</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Side-by-Side College Decision Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparing {compareColleges.length} institution{compareColleges.length > 1 ? 's' : ''} across verified metrics • Zero sponsored bias
          </p>
        </div>

        {/* Add more dropdown */}
        {compareColleges.length < 4 && availableColleges.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={selectedToAdd}
              onChange={(e) => {
                if (e.target.value) {
                  onAddToCompare(e.target.value);
                  setSelectedToAdd('');
                }
              }}
              className="text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">+ Add college to compare...</option>
              {availableColleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full border-collapse text-left text-xs min-w-[700px]">
          
          {/* Header row: College titles & remove buttons */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 w-1/4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                Decision Parameter
              </th>
              {compareColleges.map((college) => (
                <th key={college.id} className="p-4 w-1/4 align-top">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {college.collegeType}
                      </span>
                      <button
                        onClick={() => onRemoveFromCompare(college.id)}
                        className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 
                      onClick={() => onSelectCollege(college)}
                      className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                    >
                      {college.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">{college.city}, {college.state}</p>

                    <button
                      onClick={() => onOpenAskAi(college)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer block"
                    >
                      Ask AI about {college.shortName} →
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-800">
            
            {/* Total 4-Year Tuition */}
            <tr>
              <td className="p-4 font-bold bg-slate-50/50 text-slate-700">
                4-Year Total Tuition Fee
              </td>
              {compareColleges.map((c) => {
                const course = c.courses[0];
                return (
                  <td key={c.id} className="p-4">
                    <div className="text-base font-extrabold text-slate-900">
                      ₹{(course.fees.totalCourseFee / 100000).toFixed(2)} Lakhs
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                      ₹{course.fees.tuitionFeePerYear.toLocaleString('en-IN')}/yr
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Hostel & Mess Cost */}
            <tr>
              <td className="p-4 font-bold bg-slate-50/50 text-slate-700">
                Hostel + Mess Fee / Year
              </td>
              {compareColleges.map((c) => (
                <td key={c.id} className="p-4">
                  {c.hostel.available ? (
                    <div>
                      <span className="font-bold text-slate-900">
                        ₹{(c.hostel.feePerYear / 1000).toFixed(0)}k / year
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {c.hostel.messIncluded ? 'Mess Included' : 'Mess extra'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-amber-700 font-semibold">No Hostel (Day Scholar only)</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Total Investment (Tuition + Hostel) */}
            <tr>
              <td className="p-4 font-bold bg-slate-50/50 text-indigo-900">
                Total 4-Year Investment
              </td>
              {compareColleges.map((c) => {
                const course = c.courses[0];
                const total = course.fees.totalCourseFee + c.hostel.feePerYear * course.durationYears;
                return (
                  <td key={c.id} className="p-4 bg-indigo-50/20">
                    <div className="text-base font-extrabold text-indigo-700">
                      ₹{(total / 100000).toFixed(1)} Lakhs
                    </div>
                    <span className="text-[10px] text-slate-500">Tuition + Standard Hostel</span>
                  </td>
                );
              })}
            </tr>

            {/* Verified Median CTC */}
            <tr>
              <td className="p-4 font-bold bg-slate-50/50 text-slate-700">
                Verified Placement Median CTC
              </td>
              {compareColleges.map((c) => {
                const course = c.courses[0];
                return (
                  <td key={c.id} className="p-4">
                    <div className="text-base font-extrabold text-emerald-700">
                      ₹{course.placements.medianCtcLpa} LPA
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Avg: ₹{course.placements.averageCtcLpa}L • {course.placements.placementPercentage}% placed
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Simple ROI Index */}
            <tr>
              <td className="p-4 font-bold bg-slate-50/50 text-slate-700">
                Investment Recovery (ROI Index)
              </td>
              {compareColleges.map((c) => {
                const course = c.courses[0];
                const total = course.fees.totalCourseFee + c.hostel.feePerYear * course.durationYears;
                const recoveryYears = (total / (course.placements.medianCtcLpa * 100000)).toFixed(1);
                return (
                  <td key={c.id} className="p-4">
                    <div className="font-bold text-slate-900">
                      ~{recoveryYears} Years
                    </div>
                    <span className="text-[10px] text-slate-400">Total cost ÷ Median CTC</span>
                  </td>
                );
              })}
            </tr>

            {/* 12th Board Eligibility Cutoff */}
            <tr>
              <td className="p-4 font-bold bg-slate-50/50 text-slate-700">
                Class 12th Board Cutoff
              </td>
              {compareColleges.map((c) => {
                const course = c.courses[0];
                return (
                  <td key={c.id} className="p-4">
                    <span className="font-bold text-slate-900">
                      Min {course.eligibility.min12thPercentage}%
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Mandatory: {course.eligibility.mandatorySubjects.slice(0, 3).join(', ')}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Entrance Exam Cutoff */}
            <tr>
              <td className="p-4 font-bold bg-slate-50/50 text-slate-700">
                Entrance Exam &amp; Range
              </td>
              {compareColleges.map((c) => {
                const course = c.courses[0];
                const exam = course.entranceExams[0];
                return (
                  <td key={c.id} className="p-4">
                    {exam ? (
                      <div>
                        <span className="font-bold text-slate-900">{exam.examName}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {exam.typicalCutoffRange}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500">Direct 12th Merit</span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Attendance & Campus Discipline */}
            <tr>
              <td className="p-4 font-bold bg-slate-50/50 text-slate-700">
                Attendance Policy &amp; Rules
              </td>
              {compareColleges.map((c) => (
                <td key={c.id} className="p-4">
                  <p className="text-xs text-slate-700">
                    {c.campusLife.attendancePolicy}
                  </p>
                </td>
              ))}
            </tr>

            {/* Curfew & Hostel Rules */}
            <tr>
              <td className="p-4 font-bold bg-slate-50/50 text-slate-700">
                Hostel Curfew &amp; Atmosphere
              </td>
              {compareColleges.map((c) => (
                <td key={c.id} className="p-4">
                  <span className="font-semibold text-slate-800">
                    {c.hostel.curfewTime || 'No strict curfew'}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {c.hostel.remarks}
                  </span>
                </td>
              ))}
            </tr>

            {/* Top Reported Drawback */}
            <tr>
              <td className="p-4 font-bold bg-slate-50/50 text-amber-900">
                Reported Student Trade-off
              </td>
              {compareColleges.map((c) => {
                const drawback = c.studentExperiences[0]?.honestCons[0] || 'Standard academic workload';
                return (
                  <td key={c.id} className="p-4 bg-amber-50/30">
                    <span className="text-amber-900 font-medium">
                      &ldquo;{drawback}&rdquo;
                    </span>
                  </td>
                );
              })}
            </tr>

          </tbody>
        </table>
      </div>

    </div>
  );
};
