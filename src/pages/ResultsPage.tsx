import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Bookmark, 
  Layers, 
  HelpCircle, 
  ExternalLink, 
  Info, 
  Filter, 
  TrendingUp, 
  IndianRupee, 
  MapPin, 
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  Share2
} from 'lucide-react';
import { College, CollegeRecommendation, StudentProfile } from '../types';

interface ResultsPageProps {
  recommendations: CollegeRecommendation[];
  profile: StudentProfile;
  savedCollegeIds: string[];
  compareCollegeIds: string[];
  onToggleSave: (collegeId: string) => void;
  onToggleCompare: (collegeId: string) => void;
  onSelectCollege: (college: College) => void;
  onOpenAskAi: (college: College) => void;
  onOpenReportModal: (collegeId?: string) => void;
  onEditProfile: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  recommendations,
  profile,
  savedCollegeIds,
  compareCollegeIds,
  onToggleSave,
  onToggleCompare,
  onSelectCollege,
  onOpenAskAi,
  onOpenReportModal,
  onEditProfile,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'fit' | 'median' | 'fee'>('fit');
  const [showIneligibleOnly, setShowIneligibleOnly] = useState(false);
  const [expandedBreakdownId, setExpandedBreakdownId] = useState<string | null>(null);

  // Filter recommendations
  let filtered = recommendations.filter((rec) => {
    if (!showIneligibleOnly && !rec.hardConstraintsPassed) return false;
    if (showIneligibleOnly && rec.hardConstraintsPassed) return false;

    if (filterCategory === 'safe') return rec.fitCategory === 'Safe / Strong Match';
    if (filterCategory === 'target') return rec.fitCategory === 'Target / High Match';
    if (filterCategory === 'dream') return rec.fitCategory === 'Dream / High Reach';
    return true;
  });

  // Sort recommendations
  filtered.sort((a, b) => {
    if (sortBy === 'fit') return b.fitScore - a.fitScore;
    if (sortBy === 'median') {
      return (b.matchedCourse.placements.medianCtcLpa || 0) - (a.matchedCourse.placements.medianCtcLpa || 0);
    }
    if (sortBy === 'fee') {
      return a.matchedCourse.fees.totalCourseFee - b.matchedCourse.fees.totalCourseFee;
    }
    return 0;
  });

  const passedCount = recommendations.filter((r) => r.hardConstraintsPassed).length;
  const failedCount = recommendations.filter((r) => !r.hardConstraintsPassed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Shortlist Header & Profile Summary */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Your Personalized College Shortlist
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {passedCount} Eligible Matches
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Grounded in verified institutional filings • Hard eligibility constraints applied first
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onEditProfile}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Refine Parameters</span>
            </button>
          </div>
        </div>

        {/* Profile Parameters Pill Strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Active Filter:</span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
            12th: {profile.class12Percentage}% ({profile.class12Stream})
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
            Target: {profile.targetDegree}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
            Budget Cap: ₹{(profile.totalBudgetLimit / 100000).toFixed(1)}L
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
            Cities: {profile.preferredCities.join(', ') || 'Anywhere in India'}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
            Priority: {profile.placementPriority}
          </span>
        </div>

        {/* Transparency note */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Fit Score Notice:</strong> The score (0–100) reflects algorithmic alignment with your stated preferences (budget ROI, location, academics, campus life). It is <strong>NOT an admission guarantee</strong>. Official cutoffs are dictated strictly by counseling authorities (JAC, JoSAA, COMEDK).
          </span>
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 w-full sm:w-auto">
          <button
            onClick={() => {
              setFilterCategory('all');
              setShowIneligibleOnly(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterCategory === 'all' && !showIneligibleOnly
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Eligible ({passedCount})
          </button>
          <button
            onClick={() => {
              setFilterCategory('target');
              setShowIneligibleOnly(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterCategory === 'target' && !showIneligibleOnly
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Target / High Match
          </button>
          <button
            onClick={() => {
              setFilterCategory('safe');
              setShowIneligibleOnly(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterCategory === 'safe' && !showIneligibleOnly
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Safe Matches
          </button>
          {failedCount > 0 && (
            <button
              onClick={() => setShowIneligibleOnly(!showIneligibleOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                showIneligibleOnly
                  ? 'bg-red-50 text-red-700 border border-red-200 shadow-2xs'
                  : 'text-slate-500 hover:text-red-700'
              }`}
            >
              Ineligible / Filtered ({failedCount})
            </button>
          )}
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="text-slate-400 font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="fit">Fit Score (Highest First)</option>
            <option value="median">Placement Median (Highest CTC)</option>
            <option value="fee">Total Course Fee (Lowest First)</option>
          </select>
        </div>
      </div>

      {/* Recommended Colleges List */}
      <div className="space-y-6">
        {filtered.map((rec) => {
          const { college, matchedCourse } = rec;
          const isSaved = savedCollegeIds.includes(college.id);
          const isCompared = compareCollegeIds.includes(college.id);
          const isExpanded = expandedBreakdownId === matchedCourse.courseId;

          const totalCostEst =
            matchedCourse.fees.totalCourseFee +
            college.hostel.feePerYear * matchedCourse.durationYears;

          return (
            <div
              key={matchedCourse.courseId}
              className={`bg-white rounded-3xl border transition-all overflow-hidden shadow-xs hover:shadow-md ${
                !rec.hardConstraintsPassed
                  ? 'border-red-200 bg-red-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Card Main Block */}
              <div className="p-6 space-y-5">
                
                {/* Header row: Name, Fit Badge, Save & Compare */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 
                        onClick={() => {
                          onSelectCollege(college);
                        }}
                        className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {college.name}
                      </h2>
                      <span className="text-xs text-slate-400">({college.shortName})</span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {college.collegeType}
                      </span>

                      {college.nirfRankEngg && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          NIRF Engg #{college.nirfRankEngg}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {college.city}, {college.state}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">
                        {matchedCourse.degree} in {matchedCourse.specialization}
                      </span>
                      <span>•</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Audited: {college.lastVerifiedDate}
                      </span>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    {rec.hardConstraintsPassed ? (
                      <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{rec.fitScore}% Fit</span>
                        <span className="text-[10px] font-normal text-indigo-600 ml-1">
                          ({rec.fitCategory})
                        </span>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-xl bg-red-100 text-red-800 text-xs font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>Eligibility Cutoff Missed</span>
                      </div>
                    )}

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => onToggleSave(college.id)}
                      title={isSaved ? 'Remove from Saved' : 'Save to Shortlist'}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>

                    {/* Compare Toggle */}
                    <button
                      onClick={() => onToggleCompare(college.id)}
                      title={isCompared ? 'Remove from comparison' : 'Add to side-by-side compare'}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isCompared
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hard Constraint Failure Alerts if any */}
                {!rec.hardConstraintsPassed && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-1">
                    <span className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Hard Constraints Failed:
                    </span>
                    <ul className="list-disc list-inside text-red-800 pl-1 space-y-0.5">
                      {rec.hardConstraintFailures.map((failure, idx) => (
                        <li key={idx}>{failure}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Verified Metrics Strip (Fees, Placement, Eligibility, Entrance) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      4-Yr Total Investment
                    </span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      ₹{(totalCostEst / 100000).toFixed(1)} Lakhs
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Tuition: ₹{(matchedCourse.fees.totalCourseFee / 100000).toFixed(1)}L + Hostel
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      Verified Placement
                    </span>
                    <div className="text-sm font-bold text-emerald-700 mt-0.5">
                      ₹{matchedCourse.placements.medianCtcLpa} LPA Median
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block">
                      Avg: ₹{matchedCourse.placements.averageCtcLpa}L • {matchedCourse.placements.placementPercentage}% placed
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      12th Board Cutoff
                    </span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      Min {matchedCourse.eligibility.min12thPercentage}%
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Required: {matchedCourse.eligibility.streamRequired.join('/')}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                      Entrance Exams
                    </span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                      {matchedCourse.entranceExams.map((e) => e.examName).join(', ')}
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block">
                      {matchedCourse.entranceExams[0]?.typicalCutoffRange || 'Merit / Direct'}
                    </span>
                  </div>
                </div>

                {/* Why It Matches & Possible Trade-offs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Why it matches */}
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Why This Matches Your Stated Profile
                    </span>
                    <ul className="space-y-1.5 text-slate-700 text-[11px]">
                      {rec.whyItMatches.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Trade-offs to consider */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Drawbacks &amp; Ground Reality Trade-offs
                    </span>
                    <ul className="space-y-1.5 text-slate-700 text-[11px]">
                      {rec.tradeOffs.map((tradeOff, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold shrink-0">!</span>
                          <span>{tradeOff}</span>
                        </li>
                      ))}
                      {rec.tradeOffs.length === 0 && (
                        <li className="text-slate-500 italic">No significant drawback flags reported.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Transparent Fit Score Breakdown Drawer (Expandable) */}
                {isExpanded && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs animate-in fade-in duration-200">
                    <div className="flex items-center justify-between font-bold text-slate-800 pb-2 border-b border-slate-200">
                      <span>Transparent Scoring Methodology (Max 100 Points)</span>
                      <span className="font-mono text-indigo-600">{rec.fitScore} / 100 Pts</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="flex justify-between font-semibold text-slate-800 mb-1">
                          <span>Budget &amp; ROI Fit</span>
                          <span className="text-indigo-600">{rec.breakdown.budgetFitScore} / 25</span>
                        </div>
                        <p className="text-slate-500">{rec.breakdown.budgetFitNote}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="flex justify-between font-semibold text-slate-800 mb-1">
                          <span>Placement Fit</span>
                          <span className="text-indigo-600">{rec.breakdown.placementFitScore} / 25</span>
                        </div>
                        <p className="text-slate-500">{rec.breakdown.placementFitNote}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="flex justify-between font-semibold text-slate-800 mb-1">
                          <span>Academic &amp; Cutoff Cushion</span>
                          <span className="text-indigo-600">{rec.breakdown.academicFitScore} / 20</span>
                        </div>
                        <p className="text-slate-500">{rec.breakdown.academicFitNote}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <div className="flex justify-between font-semibold text-slate-800 mb-1">
                          <span>Campus Culture &amp; Rules</span>
                          <span className="text-indigo-600">{rec.breakdown.campusLifeFitScore} / 15</span>
                        </div>
                        <p className="text-slate-500">{rec.breakdown.campusLifeFitNote}</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Card Footer Bar: Actions, Citations & Grounded AI */}
              <div className="px-6 py-3.5 bg-slate-50/90 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setExpandedBreakdownId(isExpanded ? null : matchedCourse.courseId)
                    }
                    className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide' : 'Inspect'} Transparent Score Math</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    onClick={() => onOpenReportModal(college.id)}
                    className="text-amber-700 hover:text-amber-900 text-[11px] font-medium"
                  >
                    Report Data Error
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenAskAi(college)}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI About {college.shortName}</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectCollege(college);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <span>Deep Audit Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
