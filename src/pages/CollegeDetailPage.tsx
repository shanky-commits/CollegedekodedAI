import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  Bookmark, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Building, 
  Calendar, 
  IndianRupee, 
  GraduationCap, 
  Users, 
  FileText, 
  Clock, 
  Award,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { College, StudentExperience } from '../types';

interface CollegeDetailPageProps {
  college: College;
  onBack: () => void;
  isSaved: boolean;
  isCompared: boolean;
  onToggleSave: () => void;
  onToggleCompare: () => void;
  onOpenAskAi: () => void;
  onOpenReportModal: () => void;
}

export const CollegeDetailPage: React.FC<CollegeDetailPageProps> = ({
  college,
  onBack,
  isSaved,
  isCompared,
  onToggleSave,
  onToggleCompare,
  onOpenAskAi,
  onOpenReportModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'courses_fees' | 'placements' | 'admissions' | 'hostel_campus' | 'student_experience' | 'sources'
  >('overview');

  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const currentCourse = college.courses[selectedCourseIndex] || college.courses[0];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'courses_fees', label: 'Courses & Fees' },
    { id: 'placements', label: 'Verified Placements' },
    { id: 'admissions', label: 'Eligibility & Exams' },
    { id: 'hostel_campus', label: 'Hostel & Campus' },
    { id: 'student_experience', label: 'Student Ground Reality' },
    { id: 'sources', label: 'Audit Trail & Sources' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Matches</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReportModal}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 px-3 py-2 rounded-xl border border-amber-200 hover:bg-amber-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Report Error on this College</span>
          </button>

          <button
            onClick={onToggleCompare}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isCompared
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isCompared ? 'In Comparison' : 'Compare'}</span>
          </button>

          <button
            onClick={onToggleSave}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              isSaved
                ? 'bg-amber-500 border-amber-500 text-white'
                : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* College Banner & Verified Verification Status */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
          <img
            src={college.heroImageUrl}
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />

          {/* Verification Badge */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-emerald-800 border border-emerald-200 text-xs font-extrabold flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{college.verificationStatus}</span>
            </div>
            <div className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-semibold">
              {college.collegeType}
            </div>
          </div>

          {/* Quick AI Trigger button */}
          <button
            onClick={onOpenAskAi}
            className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Ask AI About {college.shortName}</span>
          </button>

          {/* Title & Key Stats in Banner */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <MapPin className="w-3.5 h-3.5" />
              <span>{college.address}</span>
              <span>•</span>
              <span>Est. {college.establishedYear}</span>
              {college.nirfRankEngg && (
                <>
                  <span>•</span>
                  <span className="font-bold text-amber-300">NIRF Engineering #{college.nirfRankEngg}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {college.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl line-clamp-2">
              {college.tagline}
            </p>
          </div>
        </div>

        {/* Verification Metadata Sub-Bar */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-900">Official Audit:</span>
            <span>{college.verifiedBy}</span>
            <span>•</span>
            <span className="font-mono text-slate-500">Last Audited: {college.lastVerifiedDate}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={college.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 text-xs"
            >
              <span>Official Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Distinction Reminder Pill */}
      <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs text-indigo-900">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Data Integrity Distinction:</strong> Official institutional facts are certified from official disclosures. Student experiences are honest qualitative reports from verified cohorts.
          </span>
        </div>
      </div>

      {/* Deep-Dive Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-1 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Institutional Overview
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {college.tagline} Located across a {college.campusLife.campusAreaAcres}-acre campus in {college.city}, {college.name} operates under {college.collegeType} jurisdiction with NAAC accreditation {college.naacGrade || 'Accredited'}.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">NIRF Rank</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {college.nirfRankEngg ? `#${college.nirfRankEngg} (Engg)` : `#${college.nirfRankOverall || 'N/A'}`}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Campus Area</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {college.campusLife.campusAreaAcres} Acres
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Metro Connectivity</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {college.campusLife.metroConnectivityKm} km away
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Ground Reality Summary */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Student Ground Reality Pros &amp; Cons
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold">
                  From {college.studentExperiences.length} Verified Reviews
                </span>
              </div>

              {college.studentExperiences[0] && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                    <span className="font-bold text-emerald-900">Reported Highlights</span>
                    <ul className="space-y-1 text-slate-700 text-[11px]">
                      {college.studentExperiences[0].honestPros.map((p, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                    <span className="font-bold text-amber-900">Reported Concerns</span>
                    <ul className="space-y-1 text-slate-700 text-[11px]">
                      {college.studentExperiences[0].honestCons.map((c, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-amber-600 font-bold shrink-0">!</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quick Action Box & Ask AI */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-md space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Grounded AI Inquiries</span>
              </div>
              <h3 className="text-base font-extrabold">
                Have specific doubts about {college.shortName}?
              </h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Ask our anti-hallucination agent about hostel curfews, true fee revisions, or placement reality.
              </p>
              <button
                onClick={onOpenAskAi}
                className="w-full py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-slate-100 text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Start Grounded Q&amp;A</span>
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Audited Verification Sources
              </h4>
              <ul className="space-y-2">
                {college.officialSources.map((src, i) => (
                  <li key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="font-semibold text-slate-800 truncate">{src.title}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{src.sourceType}</span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        PDF <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Courses & Exact Fees */}
      {activeTab === 'courses_fees' && (
        <div className="space-y-6">
          {/* Course selector if multiple */}
          {college.courses.length > 1 && (
            <div className="flex gap-2 pb-2 overflow-x-auto">
              {college.courses.map((c, idx) => (
                <button
                  key={c.courseId}
                  onClick={() => setSelectedCourseIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    selectedCourseIndex === idx
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {c.degree} - {c.specialization}
                </button>
              ))}
            </div>
          )}

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {currentCourse.degree} in {currentCourse.specialization}
                </h3>
                <p className="text-xs text-slate-500">
                  Duration: {currentCourse.durationYears} Years • Total Approved Seats: {currentCourse.seatsTotal}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500">Official Total Course Tuition</div>
                <div className="text-2xl font-extrabold text-slate-900">
                  ₹{(currentCourse.fees.totalCourseFee / 100000).toFixed(2)} Lakhs
                </div>
              </div>
            </div>

            {/* Fee Breakdown Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                Verified Itemized Fee Schedule
              </h4>
              <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-3.5">Fee Head</th>
                      <th className="p-3.5">Amount (INR)</th>
                      <th className="p-3.5">Frequency</th>
                      <th className="p-3.5">Refundability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    <tr>
                      <td className="p-3.5 font-medium">Tuition Fee</td>
                      <td className="p-3.5 font-bold">₹{currentCourse.fees.tuitionFeePerYear.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-slate-500">Per Academic Year</td>
                      <td className="p-3.5 text-slate-500">Non-refundable after session start</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium">One-Time Admission / Registration Fee</td>
                      <td className="p-3.5 font-bold">₹{currentCourse.fees.oneTimeAdmissionFee.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-slate-500">One-time at admission</td>
                      <td className="p-3.5 text-slate-500">Non-refundable</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium">Caution Deposit / Institute Security</td>
                      <td className="p-3.5 font-bold">₹{currentCourse.fees.cautionDepositRefundable.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-slate-500">One-time</td>
                      <td className="p-3.5 text-emerald-700 font-semibold">100% Refundable on graduation</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium">Annual Academic &amp; Exam Charges</td>
                      <td className="p-3.5 font-bold">₹{currentCourse.fees.otherAcademicChargesPerYear.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-slate-500">Annual</td>
                      <td className="p-3.5 text-slate-500">Non-refundable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-mono">
                Source Document: {currentCourse.fees.officialDocRef} • Audited: {currentCourse.fees.lastAuditedDate}
              </p>
            </div>

            {/* Scholarships & Aid */}
            {currentCourse.scholarships.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Institutional Scholarships &amp; Tuition Waivers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentCourse.scholarships.map((sch, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-1">
                      <span className="font-bold text-indigo-900 block">{sch.title}</span>
                      <p className="text-slate-600 text-[11px]"><strong>Criteria:</strong> {sch.criteria}</p>
                      <span className="inline-block font-semibold text-emerald-800 text-[11px] bg-emerald-100 px-2 py-0.5 rounded">
                        Benefit: {sch.benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Verified Placements */}
      {activeTab === 'placements' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Verified Placement Statistics
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  NIRF Certified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official audited figures for Batch {currentCourse.placements.academicYear}
              </p>
            </div>

            <a
              href={currentCourse.placements.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Download Official Placement Filing</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Median CTC</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                ₹{currentCourse.placements.medianCtcLpa} LPA
              </div>
              <span className="text-[10px] text-slate-500">Real median across all placed students</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Average CTC</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                ₹{currentCourse.placements.averageCtcLpa} LPA
              </div>
              <span className="text-[10px] text-slate-500">Mean package for course</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Domestic Highest</span>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">
                ₹{currentCourse.placements.highestDomesticCtcLpa} LPA
              </div>
              <span className="text-[10px] text-slate-500">Verified domestic offer</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase">Placement %</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {currentCourse.placements.placementPercentage}%
              </div>
              <span className="text-[10px] text-slate-500">{currentCourse.placements.totalOffers}+ total offers logged</span>
            </div>
          </div>

          {/* Top recruiters */}
          <div className="space-y-3 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Verified Major Recruiters
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentCourse.placements.topRecruiters.map((recruiter, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  {recruiter}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Eligibility & Exams */}
      {activeTab === 'admissions' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Hard Eligibility &amp; Entrance Exam Requirements
            </h3>
            <p className="text-slate-500">
              Strict cutoffs verified against official admission brochures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 text-xs block">
                Class 12th Board Examination Criteria
              </span>
              <div className="space-y-1 text-slate-600 text-[11px]">
                <p><strong>Minimum Board Percentage:</strong> {currentCourse.eligibility.min12thPercentage}% aggregate.</p>
                <p><strong>Mandatory Subjects:</strong> {currentCourse.eligibility.mandatorySubjects.join(', ')}.</p>
                <p><strong>Approved Stream:</strong> {currentCourse.eligibility.streamRequired.join(' or ')}.</p>
                {currentCourse.eligibility.categoryRelaxationNotes && (
                  <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    {currentCourse.eligibility.categoryRelaxationNotes}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 text-xs block">
                Accepted Entrance Examinations
              </span>
              <ul className="space-y-2">
                {currentCourse.entranceExams.map((exam, i) => (
                  <li key={i} className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px]">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{exam.examName}</span>
                      <span className="text-indigo-600">{exam.counselingAuthority}</span>
                    </div>
                    <p className="text-slate-600 mt-1">Typical Cutoff: {exam.typicalCutoffRange}</p>
                    {exam.lastYearClosingCutoff && (
                      <p className="text-slate-500 font-mono text-[10px]">
                        Last Year Cutoff: {exam.lastYearClosingCutoff}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Hostel & Campus */}
      {activeTab === 'hostel_campus' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Hostel, Mess &amp; Campus Rules
            </h3>
            <p className="text-slate-500">
              Verified ground reality regarding accommodation, security, and attendance policies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 text-xs block">
                Hostel Facilities &amp; Charges
              </span>
              <div className="space-y-1.5 text-slate-600 text-[11px]">
                <p><strong>Annual Fee:</strong> Approx ₹{college.hostel.feePerYear.toLocaleString('en-IN')}/year ({college.hostel.messIncluded ? 'Mess Included' : 'Mess Extra'}).</p>
                <p><strong>Room Types:</strong> {college.hostel.occupancyOptions.join(', ')}.</p>
                <p><strong>Curfew Rule:</strong> {college.hostel.curfewTime || 'No strict curfew'}.</p>
                <p><strong>Hygiene Rating:</strong> {college.hostel.hygieneRating} / 5.0</p>
                <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  {college.hostel.remarks}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 text-xs block">
                Campus Attendance &amp; Culture
              </span>
              <div className="space-y-1.5 text-slate-600 text-[11px]">
                <p><strong>Attendance Policy:</strong> {college.campusLife.attendancePolicy}.</p>
                <p><strong>Student Clubs:</strong> {college.campusLife.studentClubsCount}+ active societies.</p>
                <p><strong>Annual Fests:</strong> {college.campusLife.annualFests.join(', ')}.</p>
                <p><strong>Sports Infrastructure:</strong> {college.campusLife.sportsFacilities.join(', ')}.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Student Ground Reality */}
      {activeTab === 'student_experience' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Student Ground Reality Reviews
              </h3>
              <p className="text-xs text-slate-500">
                Honest, unmoderated feedback from verified current students and alumni.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {college.studentExperiences.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{rev.userType}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-mono">
                      {rev.studentBatch}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{rev.dateAdded}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="font-bold text-emerald-900 block mb-1">What Works Great:</span>
                    <ul className="space-y-1 text-slate-700">
                      {rev.honestPros.map((p, idx) => (
                        <li key={idx}>• {p}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-1">What to Watch Out For:</span>
                    <ul className="space-y-1 text-slate-700">
                      {rev.honestCons.map((c, idx) => (
                        <li key={idx}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 italic">
                  &ldquo;{rev.groundRealityComment}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Sources & Audit Trail */}
      {activeTab === 'sources' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Official Data Sources &amp; Audit History
            </h3>
            <p className="text-slate-500">
              Primary documents used to calibrate this institution&apos;s decision parameters.
            </p>
          </div>

          <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
            {college.officialSources.map((src, i) => (
              <div key={i} className="p-4 bg-slate-50 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{src.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                    <span>Source: {src.sourceType}</span>
                    <span>•</span>
                    <span>Academic Year: {src.academicYear}</span>
                    <span>•</span>
                    <span>Verified: {src.lastVerifiedDate}</span>
                  </div>
                </div>

                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1 shrink-0"
                >
                  <span>Primary PDF</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
