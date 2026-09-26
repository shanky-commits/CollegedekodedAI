import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  IndianRupee, 
  GraduationCap, 
  ArrowRight,
  Bookmark,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { College } from '../types';

interface ExplorePageProps {
  colleges: College[];
  savedCollegeIds: string[];
  compareCollegeIds: string[];
  onToggleSave: (collegeId: string) => void;
  onToggleCompare: (collegeId: string) => void;
  onSelectCollege: (college: College) => void;
  onOpenAskAi: (college: College) => void;
  setActivePage: (page: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  colleges,
  savedCollegeIds,
  compareCollegeIds,
  onToggleSave,
  onToggleCompare,
  onSelectCollege,
  onOpenAskAi,
  setActivePage,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegree, setSelectedDegree] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxFeeLimit, setMaxFeeLimit] = useState<number>(3000000);

  const seoIntentPresets = [
    { label: 'B.Tech CSE in Delhi NCR under ₹15L', degree: 'B.Tech', city: 'Delhi', maxFee: 1500000 },
    { label: 'Premier Colleges in Bengaluru', degree: 'all', city: 'Bengaluru', maxFee: 3000000 },
    { label: 'Top BBA / Management Options', degree: 'BBA', city: 'all', maxFee: 3000000 },
    { label: 'Autonomous & Deemed Universities', degree: 'all', city: 'all', type: 'Deemed University' },
  ];

  const filtered = colleges.filter((c) => {
    // Search query
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courses.some((course) =>
        course.specialization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    if (!matchesSearch) return false;

    // Degree filter
    if (selectedDegree !== 'all') {
      const hasDegree = c.courses.some((course) => course.degree === selectedDegree);
      if (!hasDegree) return false;
    }

    // City filter
    if (selectedCity !== 'all') {
      if (!c.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    }

    // College type filter
    if (selectedType !== 'all') {
      if (c.collegeType !== selectedType) return false;
    }

    // Fee filter
    const primaryCourse = c.courses[0];
    if (primaryCourse && primaryCourse.fees.totalCourseFee > maxFeeLimit) {
      return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Verified Indian College Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filtered.length} Institutions Audited
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Every record features official fee schedules, NIRF placement audit files, and mandatory AICTE disclosures.
          </p>
        </div>

        <button
          onClick={() => setActivePage('counselor')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch AI Matching</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SEO High-Intent Quick Filter Strip */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 text-xs">
        <span className="font-bold text-slate-500 pl-1">High-Intent Filters:</span>
        {seoIntentPresets.map((preset, i) => (
          <button
            key={i}
            onClick={() => {
              if (preset.degree) setSelectedDegree(preset.degree);
              if (preset.city) setSelectedCity(preset.city);
              if (preset.maxFee) setMaxFeeLimit(preset.maxFee);
              if (preset.type) setSelectedType(preset.type);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-semibold transition-colors cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs">
        
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by college name, city, course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Degree filter */}
        <div>
          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Degrees</option>
            <option value="B.Tech">B.Tech / B.E.</option>
            <option value="BBA">BBA / BMS</option>
            <option value="BCA">BCA</option>
          </select>
        </div>

        {/* City filter */}
        <div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Locations</option>
            <option value="Delhi">Delhi NCR</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Pune">Pune</option>
            <option value="Patiala">Punjab / Patiala</option>
            <option value="Manipal">Manipal / Karnataka</option>
          </select>
        </div>

        {/* College Type */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Institution Types</option>
            <option value="State Govt">State Govt</option>
            <option value="Central Govt">Central Govt</option>
            <option value="Deemed University">Deemed University</option>
            <option value="Private Tier-1">Private Tier-1</option>
            <option value="Private Autonomous">Private Autonomous</option>
          </select>
        </div>

      </div>

      {/* College Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((college) => {
          const course = college.courses[0];
          const isSaved = savedCollegeIds.includes(college.id);
          const isCompared = compareCollegeIds.includes(college.id);

          return (
            <div
              key={college.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover-lift flex flex-col justify-between shadow-xs"
            >
              <div>
                {/* Image */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={college.heroImageUrl}
                    alt={college.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[10px] font-bold text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{college.verificationStatus}</span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleSave(college.id)}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                        isSaved
                          ? 'bg-amber-500 text-white'
                          : 'bg-white/90 text-slate-700 hover:bg-white'
                      }`}
                      title="Save college"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => onToggleCompare(college.id)}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                        isCompared
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/90 text-slate-700 hover:bg-white'
                      }`}
                      title="Compare college"
                    >
                      <Layers className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{college.city}, {college.state}</span>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {college.collegeType}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectCollege(college)}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {college.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {college.tagline}
                  </p>

                  {course && (
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Total Fee</span>
                        <span className="font-bold text-slate-900">
                          ₹{(course.fees.totalCourseFee / 100000).toFixed(1)} Lakhs
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50">
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase">Median CTC</span>
                        <span className="font-bold text-emerald-700">
                          ₹{course.placements.medianCtcLpa} LPA
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onOpenAskAi(college)}
                  className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>

                <button
                  onClick={() => onSelectCollege(college)}
                  className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer flex items-center gap-1"
                >
                  <span>Audit Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
