import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  Share2, 
  Download, 
  Check, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { College } from '../types';

interface ShortlistPageProps {
  savedColleges: College[];
  onRemoveFromShortlist: (collegeId: string) => void;
  onSelectCollege: (college: College) => void;
  setActivePage: (page: string) => void;
}

export const ShortlistPage: React.FC<ShortlistPageProps> = ({
  savedColleges,
  onRemoveFromShortlist,
  onSelectCollege,
  setActivePage,
}) => {
  const [copied, setCopied] = useState(false);
  const [userNotes, setUserNotes] = useState<{ [id: string]: string }>({});

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedColleges, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'CollegeDekoded_Shortlist.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (savedColleges.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-xs">
          <Bookmark className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Your Shortlist is Empty
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Save your favorite matching colleges from the recommendation engine or explore catalog to organize your application deadlines.
        </p>
        <button
          onClick={() => setActivePage('counselor')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Talk to AI Counselor</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Saved Shortlist &amp; Deadlines
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {savedColleges.length} Colleges
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep track of application portals, counseling authority rounds, and custom notes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Share Shortlist'}</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Shortlisted Cards Grid */}
      <div className="space-y-4">
        {savedColleges.map((college, index) => {
          const course = college.courses[0];
          const deadline = course.admissionsDeadlines[0];

          return (
            <div
              key={college.id}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3
                    onClick={() => onSelectCollege(college)}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                  >
                    {college.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                    {college.collegeType}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {college.city}, {college.state}
                  </span>
                  <span>•</span>
                  <span>Tuition: ₹{(course.fees.totalCourseFee / 100000).toFixed(1)}L</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">Median: ₹{course.placements.medianCtcLpa} LPA</span>
                </div>

                {/* Admission Deadline Status */}
                {deadline && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      {deadline.roundName} ({deadline.counselingAuthority}): {deadline.startDate} to {deadline.lastDate}
                    </span>
                    <a
                      href={deadline.officialPortalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-700 hover:underline font-bold inline-flex items-center gap-0.5 ml-1"
                    >
                      Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => onSelectCollege(college)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  View Profile
                </button>

                <button
                  onClick={() => onRemoveFromShortlist(college.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove from shortlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
