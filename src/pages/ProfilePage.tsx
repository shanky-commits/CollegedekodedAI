import React, { useState } from 'react';
import { 
  User, 
  Save, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  IndianRupee, 
  MapPin, 
  GraduationCap, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { StreamType, StudentProfile } from '../types';
import { saveStudentProfile } from '../services/api';

interface ProfilePageProps {
  profile: StudentProfile;
  onUpdateProfile: (updated: StudentProfile) => void;
  onRunMatches: (updated: StudentProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onUpdateProfile,
  onRunMatches,
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [isSavedMessage, setIsSavedMessage] = useState(false);

  const streams: StreamType[] = [
    'PCM',
    'PCB',
    'Commerce with Maths',
    'Commerce',
    'Arts/Humanities',
    'Other',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    onUpdateProfile(updated);
    saveStudentProfile(updated);
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Student Decision Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure your academic scores, budget caps, and career goals to calibrate the decision engine.
          </p>
        </div>

        <button
          onClick={() => onRunMatches(formData)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Re-run Decision Engine</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {isSavedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile parameters updated successfully.</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 text-xs">
        
        {/* Section 1: Academic Scores & Stream */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>1. Academic Performance (Hard Eligibility)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Class 12th Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="40"
                max="100"
                step="0.1"
                required
                value={formData.class12Percentage}
                onChange={(e) => setFormData({ ...formData, class12Percentage: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Class 12th Academic Stream <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.class12Stream}
                onChange={(e) => setFormData({ ...formData, class12Stream: e.target.value as StreamType })}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                {streams.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Class 10th Percentage (Optional)
              </label>
              <input
                type="number"
                min="40"
                max="100"
                value={formData.class10Percentage || ''}
                onChange={(e) => setFormData({ ...formData, class10Percentage: parseFloat(e.target.value) || undefined })}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Target Degree & Career Goal */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>2. Target Degree &amp; Career Aspirations</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Degree</label>
              <select
                value={formData.targetDegree}
                onChange={(e) => setFormData({ ...formData, targetDegree: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="B.Tech">B.Tech / B.E. (Engineering)</option>
                <option value="BBA">BBA / BMS (Management)</option>
                <option value="BCA">BCA (Computer Applications)</option>
                <option value="MBA">MBA (Postgrad)</option>
                <option value="Any">Flexible / Any</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Specialization Interest</label>
              <input
                type="text"
                value={formData.targetSpecialization || ''}
                onChange={(e) => setFormData({ ...formData, targetSpecialization: e.target.value })}
                placeholder="e.g. Computer Science, AI & Data Science, Finance"
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Primary Career Goal</label>
              <input
                type="text"
                value={formData.careerGoal}
                onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                placeholder="e.g. Software engineer at top tech firm, quantitative finance, startup founder"
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Financial Budget Cap & Location */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-indigo-600" />
            <span>3. Financial Budget &amp; Location Boundary</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Total Course Budget Cap (INR)
              </label>
              <input
                type="number"
                step="50000"
                value={formData.totalBudgetLimit}
                onChange={(e) => setFormData({ ...formData, totalBudgetLimit: parseInt(e.target.value) || 0 })}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Current: ₹{(formData.totalBudgetLimit / 100000).toFixed(1)} Lakhs total tuition + hostel
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Relocation Willingness</label>
              <select
                value={formData.relocationPreference}
                onChange={(e) => setFormData({ ...formData, relocationPreference: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Anywhere in India">Anywhere in India</option>
                <option value="Within 500km">Within 500km</option>
                <option value="Home State / City Only">Home State / City Only (Strict Filter)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Priorities */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>4. Decision Priorities &amp; Campus Culture</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Placement Priority</label>
              <select
                value={formData.placementPriority}
                onChange={(e) => setFormData({ ...formData, placementPriority: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Crucial (High ROI & >10 LPA)">Crucial (High ROI &amp; &gt;10 LPA)</option>
                <option value="Important">Important</option>
                <option value="Balanced / Research focus">Balanced / Higher Studies</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Campus Life Priority</label>
              <select
                value={formData.campusLifePriority}
                onChange={(e) => setFormData({ ...formData, campusLifePriority: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Vibrant clubs & events">Vibrant clubs &amp; events</option>
                <option value="Moderate">Moderate</option>
                <option value="Strict academics preferred">Strict academics preferred</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Hostel Preference</label>
              <select
                value={formData.hostelPreference}
                onChange={(e) => setFormData({ ...formData, hostelPreference: e.target.value as any })}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Flexible">Flexible</option>
                <option value="Hostel mandatory">Hostel mandatory</option>
                <option value="Day Scholar preferred">Day Scholar preferred</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Parameters</span>
          </button>
        </div>

      </form>

    </div>
  );
};
