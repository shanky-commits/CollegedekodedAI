import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle, 
  GraduationCap, 
  MapPin, 
  Layers, 
  SlidersHorizontal,
  Award,
  Users
} from 'lucide-react';
import { College } from '../types';

interface HomePageProps {
  colleges: College[];
  setActivePage: (page: string) => void;
  onSelectCollege: (college: College) => void;
  onOpenReportModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  colleges,
  setActivePage,
  onSelectCollege,
  onOpenReportModal,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredColleges = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courses.some((course) => course.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const curatedShortcuts = [
    { label: 'B.Tech CSE in Delhi NCR under ₹15L', query: 'Delhi' },
    { label: 'Top Tech ROI in Bengaluru', query: 'Bengaluru' },
    { label: 'Tier-1 BBA & BMS Colleges', query: 'BBA' },
    { label: 'Direct Board Merit Options', query: 'Thapar' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Trust Banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Verified Educational Data • Zero Sponsored Rankings</span>
          </div>

          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              The Indian College Decision Engine That <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">Never Hallucinates</span>.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-normal">
              Talk naturally with our AI about your 12th marks, entrance exams, location, and true budget. We apply hard eligibility filters first, then recommend colleges using transparent fit scores—backed strictly by NIRF, AICTE, and State Gazettes.
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActivePage('counselor')}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Talk to AI Counselor (Free)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActivePage('explore')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-500" />
                <span>Browse Verified Directory</span>
              </button>
            </div>
          </div>

          {/* Quick Search & Filter Bar */}
          <div className="mt-10 p-2 bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-4xl">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search college name, city (e.g. Delhi NCR, Bengaluru), course (e.g. CSE, BBA)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => setActivePage('explore')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Search</span>
              </button>
            </div>

            {/* Quick shortcuts */}
            <div className="flex flex-wrap items-center gap-2 px-3 pt-3 pb-1 border-t border-slate-100 mt-2 text-xs">
              <span className="font-semibold text-slate-400">High Intent:</span>
              {curatedShortcuts.map((sc, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSearchQuery(sc.query);
                    setActivePage('explore');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors font-medium cursor-pointer"
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trust Metric Counters */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-2xl font-extrabold text-slate-900">₹0</div>
              <div className="text-xs text-slate-500 font-medium">Paid College Promotion Bias</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-2xl font-extrabold text-indigo-600">100%</div>
              <div className="text-xs text-slate-500 font-medium">NIRF / AICTE Verified Source Linked</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-2xl font-extrabold text-emerald-600">Dual-Layer</div>
              <div className="text-xs text-slate-500 font-medium">Hard Eligibility + Preference Fit</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="text-2xl font-extrabold text-slate-900">Zero</div>
              <div className="text-xs text-slate-500 font-medium">Arbitrary Admission Guarantees</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem: Why College Decision in India is Broken */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
              The Reality Check
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Why Traditional College Portals Mislead Indian Students
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Standard education websites generate revenue by selling your phone number to private university call centers and highlighting whoever pays the highest advertising fee. They inflate placement packages with unverified &lsquo;off-campus international offers&rsquo; and hide ₹4-6 Lakhs in compulsory hostel and exam charges.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-red-900/40 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Old Portals &amp; Generic AI Chatbots</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• Invent fake 99% placement numbers and hallucinate cutoffs</li>
                <li>• Rank colleges based on who paid for sponsored ads</li>
                <li>• Sell your personal contact details to aggressive telecallers</li>
                <li>• Present misleading &lsquo;admission chances&rsquo; without hard eligibility checks</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-emerald-900/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>CollegeDekoded AI Engine</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• Hard eligibility constraints checked before scoring (Stream, 12th %, Exams)</li>
                <li>• Transparent multi-factor Fit Score (0-100%) with explicit trade-offs</li>
                <li>• Official source URL and audit date attached to every single record</li>
                <li>• Honest student ground reality: actual attendance rules, mess quality, curfews</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Colleges Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sample Audited Colleges (Launch Cohort)
            </h2>
            <p className="text-sm text-slate-500">
              Verified with official 2024 NIRF reports, AICTE disclosures, and JAC/JoSAA cutoffs.
            </p>
          </div>
          <button
            onClick={() => setActivePage('explore')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All {colleges.length} Verified Colleges</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.slice(0, 6).map((college) => {
            const primaryCourse = college.courses[0];
            return (
              <div
                key={college.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover-lift flex flex-col justify-between"
              >
                <div>
                  {/* Image & Verified Tag */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={college.heroImageUrl}
                      alt={college.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[11px] font-bold text-emerald-800 border border-emerald-200 shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{college.verificationStatus}</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-[11px] font-semibold text-white">
                      {college.collegeType}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{college.city}, {college.state}</span>
                      {college.nirfRankEngg && (
                        <span className="ml-auto px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                          NIRF Engg #{college.nirfRankEngg}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {college.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {college.tagline}
                    </p>

                    {/* Verified Metrics Grid */}
                    {primaryCourse && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div className="p-2 rounded-lg bg-slate-50">
                          <span className="block text-[10px] text-slate-500 font-medium">4-Yr Total Fee</span>
                          <span className="font-bold text-slate-900">
                            ₹{(primaryCourse.fees.totalCourseFee / 100000).toFixed(1)} Lakhs
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50">
                          <span className="block text-[10px] text-slate-500 font-medium">Median Package</span>
                          <span className="font-bold text-emerald-700">
                            ₹{primaryCourse.placements.medianCtcLpa} LPA
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[10px]">
                    Audited: {college.lastVerifiedDate}
                  </span>
                  <button
                    onClick={() => {
                      onSelectCollege(college);
                      setActivePage('college-detail');
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
                  >
                    <span>View Audit Record</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Step-by-Step */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-slate-200 rounded-3xl p-8 sm:p-12 bg-white space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How the Decision Engine Works
            </h2>
            <p className="text-sm text-slate-600">
              Built by senior educational researchers to eliminate bias, opaque cutoffs, and predatory counselling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Conversational Onboarding</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chat naturally with AI about your 12th marks, target degrees, exams, and true budget. No exhausting 30-field forms.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Hard Constraint Filtering</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We disqualify or flag colleges that fail strict eligibility: mandatory subjects, minimum percentage, or entrance exams.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Transparent Fit Scoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rank remaining colleges using a 100-point transparent preference score: budget ROI, academics, culture, and location.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">Grounded Explanations &amp; Trade-offs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Understand why each college was recommended, what trade-offs exist (hostel curfew, strict attendance), and download comparison sheets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-emerald-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-extrabold tracking-tight">
              Ready to find your college shortlist?
            </h3>
            <p className="text-sm text-indigo-100">
              No phone numbers required, no telemarketers. Just data-grounded decision clarity in under 3 minutes.
            </p>
          </div>
          <button
            onClick={() => setActivePage('counselor')}
            className="px-6 py-3.5 bg-white text-indigo-900 font-bold rounded-xl text-sm shadow-md hover:bg-slate-50 transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Start Free AI Counseling</span>
          </button>
        </div>
      </section>

    </div>
  );
};
