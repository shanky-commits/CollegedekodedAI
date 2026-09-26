import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  User, 
  CheckCircle, 
  AlertTriangle, 
  Sliders, 
  ArrowRight, 
  RefreshCw, 
  MapPin, 
  IndianRupee, 
  GraduationCap, 
  BookOpen, 
  Check, 
  Info,
  ShieldCheck,
  Building
} from 'lucide-react';
import { ChatMessage, StudentProfile } from '../types';
import { sendCounselorMessage, saveStudentProfile, getSavedStudentProfile } from '../services/api';

interface CounselorPageProps {
  onMatchesReady: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile | null;
}

export const CounselorPage: React.FC<CounselorPageProps> = ({
  onMatchesReady,
  initialProfile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: "Namaste! I'm your CollegeDekoded AI Counselor. I help Indian students find their best-fit colleges using verified NIRF and AICTE data—no sponsored rankings or unverified placement claims.\n\nTo run our hard eligibility checks: What is your Class 12th board percentage (or expected score) and stream?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuickReplies: [
        '92% in PCM',
        '85% in Commerce with Maths',
        '78% in PCM',
        '88% in Commerce',
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Active student profile state
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = initialProfile || getSavedStudentProfile();
    if (saved) return saved;
    return {
      id: `std-${Date.now()}`,
      fullName: 'Aspirant',
      class12Percentage: 85,
      class12Stream: 'PCM',
      targetDegree: 'B.Tech',
      targetSpecialization: 'Computer Science & Engineering',
      careerGoal: 'High-growth software engineer or product builder',
      entranceExams: [{ examName: 'JEE Main', status: 'Taken', scoreOrPercentile: '92%ile' }],
      preferredCities: ['Delhi NCR', 'Bengaluru'],
      relocationPreference: 'Anywhere in India',
      totalBudgetLimit: 1500000,
      hostelPreference: 'Flexible',
      placementPriority: 'Crucial (High ROI & >10 LPA)',
      campusLifePriority: 'Vibrant clubs & events',
      collegeTypePreference: 'All',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  // Calculate profile completeness score (0 to 100)
  const calculateCompleteness = (): number => {
    let score = 0;
    if (profile.class12Percentage > 0) score += 20;
    if (profile.class12Stream) score += 15;
    if (profile.targetDegree) score += 15;
    if (profile.entranceExams && profile.entranceExams.length > 0) score += 15;
    if (profile.totalBudgetLimit > 0) score += 15;
    if (profile.preferredCities && profile.preferredCities.length > 0) score += 10;
    if (profile.placementPriority) score += 10;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isAiTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsAiTyping(true);

    try {
      const historyForApi = newHistory.map((m) => ({
        sender: m.sender as 'ai' | 'user',
        text: m.text,
      }));

      const res = await sendCounselorMessage(historyForApi, profile);

      // Merge extracted updates
      if (res.extractedUpdates && Object.keys(res.extractedUpdates).length > 0) {
        setProfile((prev) => {
          const updated = {
            ...prev,
            ...res.extractedUpdates,
            updatedAt: new Date().toISOString(),
          };
          saveStudentProfile(updated as StudentProfile);
          return updated as StudentProfile;
        });
      }

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: res.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuickReplies: res.suggestedQuickReplies,
        extractedProfileUpdates: res.extractedUpdates,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackAiMsg: ChatMessage = {
        id: `msg-fallback-${Date.now()}`,
        sender: 'ai',
        text: 'I have logged those preferences. Let us inspect your matched colleges now with hard eligibility filters and transparent scoring.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuickReplies: ['Check my matches now', 'Edit my budget first'],
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const latestAiMessage = [...messages].reverse().find((m) => m.sender === 'ai');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Decision Counselor
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Interactive Dialogue
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Every answer is converted into a structured student profile and verified against real institutional databases.
          </p>
        </div>

        {/* Progress and CTA */}
        <div className="flex items-center gap-4">
          <div className="w-36 hidden sm:block">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
              <span>Profile Ready</span>
              <span className="text-indigo-600 font-bold">{completeness}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => onMatchesReady(profile)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Check My Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Dual-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Chat Area (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          
          {/* Chat messages stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isAi
                        ? 'bg-slate-100 text-slate-800 rounded-tl-xs'
                        : 'bg-indigo-600 text-white rounded-tr-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div
                      className={`text-[9px] mt-1.5 text-right font-mono ${
                        isAi ? 'text-slate-400' : 'text-indigo-200'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isAiTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="p-3 bg-slate-100 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick reply pills */}
          {latestAiMessage?.suggestedQuickReplies && latestAiMessage.suggestedQuickReplies.length > 0 && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-400 font-semibold self-center mr-1">
                Suggested:
              </span>
              {latestAiMessage.suggestedQuickReplies.map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(pill)}
                  disabled={isAiTyping}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-[11px] font-medium text-slate-700 transition-all cursor-pointer shadow-2xs"
                >
                  {pill}
                </button>
              ))}
            </div>
          )}

          {/* Chat input box */}
          <div className="p-3.5 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type your response (e.g. 91% in 12th PCM, JEE 94%ile, Delhi NCR, budget ₹15L)..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isAiTyping}
                className="flex-1 text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isAiTyping || !inputText.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right: Live Structured Profile & Constraint Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Detected Student Profile
                </h3>
                <p className="text-[10px] text-slate-500">
                  Extracted from dialogue in real-time
                </p>
              </div>
            </div>

            <button
              onClick={() => onMatchesReady(profile)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View Results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Hard Constraints Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Hard Eligibility Constraints
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Active Filter
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100">
                <span className="text-slate-500">Class 12th Board Score</span>
                <span className="font-bold text-slate-900">
                  {profile.class12Percentage}% ({profile.class12Stream})
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100">
                <span className="text-slate-500">Target Degree</span>
                <span className="font-bold text-indigo-700">
                  {profile.targetDegree} ({profile.targetSpecialization || 'Open'})
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100">
                <span className="text-slate-500">Entrance Exams</span>
                <span className="font-bold text-slate-900 truncate max-w-[180px]">
                  {profile.entranceExams.map((e) => e.examName).join(', ') || 'Direct / None'}
                </span>
              </div>
            </div>
          </div>

          {/* Preferences & Trade-offs Card */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Stated Preferences &amp; Limits
            </h4>

            {/* Budget limit */}
            <div className="p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                  Total Course Budget Cap
                </span>
                <span className="font-bold text-slate-900">
                  ₹{(profile.totalBudgetLimit / 100000).toFixed(1)} Lakhs
                </span>
              </div>
              <input
                type="range"
                min="400000"
                max="3000000"
                step="100000"
                value={profile.totalBudgetLimit}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setProfile((prev) => ({ ...prev, totalBudgetLimit: val }));
                }}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹4L (Govt)</span>
                <span>₹15L</span>
                <span>₹30L+ (Tier-1 Pvt)</span>
              </div>
            </div>

            {/* Locations */}
            <div className="p-3 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Preferred Locations
                </span>
                <span className="font-semibold text-slate-800">
                  {profile.preferredCities.join(', ') || 'Anywhere in India'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Relocation: {profile.relocationPreference}
              </p>
            </div>

            {/* Priorities pills */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl border border-slate-200">
                <span className="block text-[10px] text-slate-400 font-medium">Placement Priority</span>
                <span className="font-bold text-slate-800 text-[11px] truncate block">
                  {profile.placementPriority}
                </span>
              </div>
              <div className="p-2.5 rounded-xl border border-slate-200">
                <span className="block text-[10px] text-slate-400 font-medium">Campus Life Priority</span>
                <span className="font-bold text-slate-800 text-[11px] truncate block">
                  {profile.campusLifePriority}
                </span>
              </div>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="pt-2">
            <button
              onClick={() => onMatchesReady(profile)}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Apply Constraints &amp; Rank Colleges</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              We rank matching colleges by verified data alignment without sponsored bias.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
