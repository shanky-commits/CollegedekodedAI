import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ReportErrorModal } from './components/ReportErrorModal';
import { AskAiDrawer } from './components/AskAiDrawer';

import { HomePage } from './pages/HomePage';
import { CounselorPage } from './pages/CounselorPage';
import { ResultsPage } from './pages/ResultsPage';
import { CollegeDetailPage } from './pages/CollegeDetailPage';
import { ComparePage } from './pages/ComparePage';
import { ShortlistPage } from './pages/ShortlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { ExplorePage } from './pages/ExplorePage';
import { TrustPage } from './pages/TrustPage';
import { AdminPage } from './pages/AdminPage';
import { PartnerPage } from './pages/PartnerPage';
import { SystemDocsPage } from './pages/SystemDocsPage';

import { College, CollegeRecommendation, StudentProfile } from './types';
import { 
  fetchColleges, 
  getRecommendations, 
  getSavedShortlist, 
  toggleSaveCollege, 
  getSavedStudentProfile, 
  saveStudentProfile 
} from './services/api';
import { INITIAL_COLLEGES } from './data/colleges';
import { Layers, ArrowRight, X } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [colleges, setColleges] = useState<College[]>(INITIAL_COLLEGES);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(INITIAL_COLLEGES[0] || null);

  // Student Profile
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const existing = getSavedStudentProfile();
    if (existing) return existing;
    return {
      id: `std-${Date.now()}`,
      fullName: 'Aspirant',
      class12Percentage: 86,
      class12Stream: 'PCM',
      targetDegree: 'B.Tech',
      targetSpecialization: 'Computer Science & Engineering',
      careerGoal: 'High-growth tech engineer or product builder',
      entranceExams: [{ examName: 'JEE Main', status: 'Taken', scoreOrPercentile: '93%ile' }],
      preferredCities: ['Delhi NCR', 'Bengaluru'],
      relocationPreference: 'Anywhere in India',
      totalBudgetLimit: 1600000,
      hostelPreference: 'Flexible',
      placementPriority: 'Crucial (High ROI & >10 LPA)',
      campusLifePriority: 'Vibrant clubs & events',
      collegeTypePreference: 'All',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  // Recommendations
  const [recommendations, setRecommendations] = useState<CollegeRecommendation[]>([]);

  // Saved & Compared
  const [savedCollegeIds, setSavedCollegeIds] = useState<string[]>([]);
  const [compareCollegeIds, setCompareCollegeIds] = useState<string[]>([]);

  // Modals & Drawers
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportCollegeId, setReportCollegeId] = useState<string | undefined>(undefined);
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const [askAiCollege, setAskAiCollege] = useState<College | null>(null);

  // Initial data loading
  useEffect(() => {
    const init = async () => {
      const data = await fetchColleges();
      if (data && data.length > 0) {
        setColleges(data);
      }
      const saved = getSavedShortlist();
      setSavedCollegeIds(saved);
    };
    init();
  }, []);

  // Handlers
  const handleMatchesReady = async (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    saveStudentProfile(updatedProfile);
    const recs = await getRecommendations(updatedProfile);
    setRecommendations(recs);
    setActivePage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCollege = (college: College) => {
    setSelectedCollege(college);
    setActivePage('college-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSave = (collegeId: string) => {
    const updated = toggleSaveCollege(collegeId);
    setSavedCollegeIds(updated);
  };

  const handleToggleCompare = (collegeId: string) => {
    setCompareCollegeIds((prev) => {
      if (prev.includes(collegeId)) {
        return prev.filter((id) => id !== collegeId);
      }
      if (prev.length >= 4) {
        return prev; // max 4
      }
      return [...prev, collegeId];
    });
  };

  const handleOpenAskAi = (college: College) => {
    setAskAiCollege(college);
    setIsAskAiOpen(true);
  };

  const handleOpenReportModal = (collegeId?: string) => {
    setReportCollegeId(collegeId);
    setIsReportModalOpen(true);
  };

  const savedColleges = colleges.filter((c) => savedCollegeIds.includes(c.id));
  const comparedColleges = colleges.filter((c) => compareCollegeIds.includes(c.id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={(p) => {
          setActivePage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={savedCollegeIds.length}
        compareCount={compareCollegeIds.length}
        onOpenReportModal={() => handleOpenReportModal()}
      />

      {/* Main Pages Switcher */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            colleges={colleges}
            setActivePage={(p) => {
              setActivePage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectCollege={handleSelectCollege}
            onOpenReportModal={() => handleOpenReportModal()}
          />
        )}

        {activePage === 'counselor' && (
          <CounselorPage
            initialProfile={profile}
            onMatchesReady={handleMatchesReady}
          />
        )}

        {activePage === 'results' && (
          <ResultsPage
            recommendations={recommendations.length > 0 ? recommendations : []}
            profile={profile}
            savedCollegeIds={savedCollegeIds}
            compareCollegeIds={compareCollegeIds}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onSelectCollege={handleSelectCollege}
            onOpenAskAi={handleOpenAskAi}
            onOpenReportModal={handleOpenReportModal}
            onEditProfile={() => setActivePage('profile')}
          />
        )}

        {activePage === 'college-detail' && selectedCollege && (
          <CollegeDetailPage
            college={selectedCollege}
            onBack={() => {
              if (recommendations.length > 0) setActivePage('results');
              else setActivePage('explore');
            }}
            isSaved={savedCollegeIds.includes(selectedCollege.id)}
            isCompared={compareCollegeIds.includes(selectedCollege.id)}
            onToggleSave={() => handleToggleSave(selectedCollege.id)}
            onToggleCompare={() => handleToggleCompare(selectedCollege.id)}
            onOpenAskAi={() => handleOpenAskAi(selectedCollege)}
            onOpenReportModal={() => handleOpenReportModal(selectedCollege.id)}
          />
        )}

        {activePage === 'compare' && (
          <ComparePage
            compareColleges={comparedColleges}
            allColleges={colleges}
            onRemoveFromCompare={(id) =>
              setCompareCollegeIds((prev) => prev.filter((cId) => cId !== id))
            }
            onAddToCompare={(id) => {
              if (compareCollegeIds.length < 4 && !compareCollegeIds.includes(id)) {
                setCompareCollegeIds([...compareCollegeIds, id]);
              }
            }}
            onSelectCollege={handleSelectCollege}
            onOpenAskAi={handleOpenAskAi}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'shortlist' && (
          <ShortlistPage
            savedColleges={savedColleges}
            onRemoveFromShortlist={handleToggleSave}
            onSelectCollege={handleSelectCollege}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage
            profile={profile}
            onUpdateProfile={(updated) => setProfile(updated)}
            onRunMatches={handleMatchesReady}
          />
        )}

        {activePage === 'explore' && (
          <ExplorePage
            colleges={colleges}
            savedCollegeIds={savedCollegeIds}
            compareCollegeIds={compareCollegeIds}
            onToggleSave={handleToggleSave}
            onToggleCompare={handleToggleCompare}
            onSelectCollege={handleSelectCollege}
            onOpenAskAi={handleOpenAskAi}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'trust' && <TrustPage />}

        {activePage === 'admin' && (
          <AdminPage
            colleges={colleges}
            onUpdateColleges={(updated) => setColleges(updated)}
          />
        )}

        {activePage === 'partner' && <PartnerPage />}

        {activePage === 'blueprint' && <SystemDocsPage />}
      </main>

      {/* Floating Compare Dock (if 1 or more colleges added to compare) */}
      {compareCollegeIds.length > 0 && activePage !== 'compare' && (
        <div className="fixed bottom-4 right-4 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl p-3 px-4 flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
              {compareCollegeIds.length}
            </div>
            <span>College{compareCollegeIds.length > 1 ? 's' : ''} in comparison tray</span>
          </div>

          <button
            onClick={() => setActivePage('compare')}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCompareCollegeIds([])}
            className="p-1 text-slate-400 hover:text-white"
            title="Clear compare tray"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <ReportErrorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        colleges={colleges}
        preselectedCollegeId={reportCollegeId}
      />

      <AskAiDrawer
        college={askAiCollege}
        isOpen={isAskAiOpen}
        onClose={() => setIsAskAiOpen(false)}
      />

      {/* Footer */}
      <Footer
        setActivePage={(p) => {
          setActivePage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenReportModal={() => handleOpenReportModal()}
      />

    </div>
  );
}
