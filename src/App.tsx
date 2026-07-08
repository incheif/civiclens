import React from "react";
import { 
  Plus, 
  MapPin, 
  Globe, 
  Layers, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  Loader2, 
  Search,
  Filter,
  Sparkles,
  Inbox
} from "lucide-react";
import Header from "./components/Header";
import IssueCard from "./components/IssueCard";
import NewIssueModal from "./components/NewIssueModal";
import AdminStats from "./components/AdminStats";
import ConstituencyAnalytics from "./components/ConstituencyAnalytics";
import { CivicIssue, UserProfile, FunnelState } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { AdminTerminal } from "./components/AdminTerminal";
import { AuthModal } from "./components/AuthModal";
import HackathonSlides from "./components/HackathonSlides";

export default function App() {
  // 1. Current Session User (Dhruv Gupta, with local storage verification)
  const [user, setUser] = React.useState<UserProfile>(() => {
    const saved = localStorage.getItem("civiclens_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      email: "guptadhruv959@gmail.com",
      name: "Dhruv Gupta",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      constituency: "New Delhi"
    };
  });

  // 2. Application Core States
  const [issues, setIssues] = React.useState<CivicIssue[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("");

  // Filtering Controls
  const [activeStream, setActiveStream] = React.useState<"constituency" | "discover">("constituency");
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // View states
  const [isAdminMode, setIsAdminMode] = React.useState(false);
  const [isNewIssueModalOpen, setIsNewIssueModalOpen] = React.useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isSlidesOpen, setIsSlidesOpen] = React.useState(false);

  // 3. Fetch priorities from server on load
  const fetchPriorities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/priorities");
      if (!res.ok) {
        throw new Error("Failed to pull community priorities log.");
      }
      const data = await res.json();
      setIssues(data.issues || []);
      setErrorMsg("");
    } catch (err: any) {
      setErrorMsg(err.message || "Unable to establish secure handshake with CivicLens API.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPriorities();
  }, []);

  // 4. Handle Constituency updates in user profile
  const handleConstituencyChange = (newConstituency: string) => {
    setUser(prev => ({ ...prev, constituency: newConstituency }));
  };

  // 5. High-performance Optimistic Upvoting trigger
  const handleVote = async (issueId: string) => {
    // Locate target issue
    const targetIssue = issues.find(i => i.id === issueId);
    if (!targetIssue) return;

    // Guard against duplicate votes
    if (targetIssue.votedUserEmails?.includes(user.email)) return;

    // Optimistic Update: Save previous state for rollback
    const previousIssues = [...issues];

    // Compute updated state
    const updatedIssues = issues.map(issue => {
      if (issue.id === issueId) {
        const newVotes = (issue.votes || 0) + 1;
        const newVotedList = [...(issue.votedUserEmails || []), user.email];
        
        // Automated AI Promotion: Promotes issue to Under Consideration if upvotes exceed 5
        let nextFunnel = issue.funnelState;
        if (issue.funnelState === "Recently Raised" && newVotes >= 5 && issue.aiTriage?.triage_status !== "Fun") {
          nextFunnel = "Under Consideration" as FunnelState;
        }

        return {
          ...issue,
          votes: newVotes,
          votedUserEmails: newVotedList,
          funnelState: nextFunnel
        };
      }
      return issue;
    });

    setIssues(updatedIssues);

    try {
      const res = await fetch(`/api/priorities/${issueId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email })
      });

      if (!res.ok) {
        throw new Error("Upvote was not acknowledged by the server pipeline.");
      }
    } catch (err) {
      console.error("Upvote failed. Rolling back optimistic state:", err);
      setIssues(previousIssues);
    }
  };

  // 6. MP Administrative Resolution notice submission
  const handleResolve = async (issueId: string, adminReply: string) => {
    // Optimistic Update: Transition status instantly
    const previousIssues = [...issues];
    const updatedIssues = issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          funnelState: "Resolved" as FunnelState,
          adminReply,
          resolvedAt: new Date().toISOString(),
          resolvedBy: "MP Dhruv Gupta"
        };
      }
      return issue;
    });
    setIssues(updatedIssues);

    try {
      const res = await fetch(`/api/priorities/${issueId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminReply,
          resolvedBy: `MP ${user.name} (${user.constituency} Division)`
        })
      });

      if (!res.ok) {
        throw new Error("Official resolution was rejected by the server pipeline.");
      }
    } catch (err) {
      console.error("Resolution failed. Rolling back optimistic state:", err);
      setIssues(previousIssues);
    }
  };

  // 7. Handle new issue submission
  const handleNewIssueSubmit = async (data: {
    title: string;
    description: string;
    constituency: string;
    isAnonymous: boolean;
    attachment: any;
  }) => {
    const res = await fetch("/api/priorities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        authorName: user.name,
        authorEmail: user.email,
        authorAvatar: user.avatar
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to dispatch priority ticket to governance pipeline.");
    }

    const resData = await res.json();
    if (resData.success && resData.issue) {
      // Prepend newly generated issue directly into state
      setIssues(prev => [resData.issue, ...prev]);
    }
  };

  // 8. Dual-Stream pipeline
  const filteredIssues = issues.filter(issue => {
    // Public Citizen Mode
    // Stream 1: My Constituency -> Filter matching selected constituency
    if (activeStream === "constituency" && issue.constituency !== user.constituency) {
      return false;
    }
    
    // Stream 2: Discover -> Show all, but hide rejected/spam content from global streams
    if (activeStream === "discover" && issue.funnelState === "Rejected") {
      return false;
    }

    // Search query matched against title, description, or tags
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchDesc = issue.description.toLowerCase().includes(q);
      const matchTags = issue.aiTriage?.tags?.some(tag => tag.toLowerCase().includes(q)) || false;
      return matchTitle || matchDesc || matchTags;
    }

    return true;
  });

  // Sorted and prepared streams
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (activeStream === "discover") {
      return (b.votes || 0) - (a.votes || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className={`min-h-screen font-sans ${isAdminMode ? "bg-slate-900 text-slate-100" : "bg-slate-100 text-slate-800"}`}>
      
      {/* 1. GOVERNMENT & ADMINISTRATIVE TERMINAL (Full-Width Desktop Layout) */}
      {isAdminMode ? (
        <div className="w-full min-h-screen flex flex-col bg-slate-950">
          <Header 
            user={user} 
            onChangeConstituency={handleConstituencyChange}
            isAdminMode={isAdminMode}
            onToggleAdminMode={setIsAdminMode}
            onOpenSlides={() => setIsSlidesOpen(true)}
          />
          
          <AdminTerminal 
            issues={issues} 
            onRefresh={fetchPriorities} 
            currentUserEmail={user.email} 
          />
        </div>
      ) : (
        /* 2. CITIZEN PUBLIC PLATFORM (Centered PWA Mobile-First Viewport) */
        <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative shadow-2xl border-x bg-slate-50 border-slate-200">
          
          {/* Sticky App Header */}
          <Header 
            user={user} 
            onChangeConstituency={handleConstituencyChange}
            isAdminMode={isAdminMode}
            onToggleAdminMode={setIsAdminMode}
            onOpenSlides={() => setIsSlidesOpen(true)}
          />

          {/* Core Content Body */}
          <main className="flex-1 px-4 py-4 space-y-4 pb-28">
            
            {/* Geo-Targeting / User Profile Status Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-15">
                <MapPin className="w-24 h-24 text-white" />
              </div>
              <div className="relative z-10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-widest bg-white/20 text-white px-2 py-0.5 rounded font-bold">
                    Geo-Targeted Profile
                  </span>
                  <span className="text-[10px] font-mono text-indigo-100 bg-indigo-700/50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Google Verified
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold truncate">Region: {user.city ? `${user.city}, ${user.state}` : user.constituency}</h3>
                  <p className="text-[10px] text-indigo-100/90 leading-snug">
                    {user.city 
                      ? `Filtering My Constituency Feed to: ${user.city}, ${user.state}, ${user.country}.` 
                      : "Sync with Google Auth to unlock geo-targeted filtering of priorities."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full bg-white hover:bg-slate-50 text-indigo-600 font-bold text-xs py-2 rounded-xl shadow-xs transition-all active:scale-98"
                >
                  {user.city ? "Update Location / Profile" : "Connect Google Account"}
                </button>
              </div>
            </div>

            {/* Live Constituency Health & Pulse Dashboard */}
            <ConstituencyAnalytics issues={issues} constituency={user.constituency} />

            {/* Citizen Dual-Stream Channel Segments */}
            <div className="bg-slate-100 p-1.5 rounded-xl flex items-center border border-slate-200/80">
              <button
                id="my-constituency-stream"
                onClick={() => setActiveStream("constituency")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeStream === "constituency"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/40"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                My Constituency
              </button>
              <button
                id="discover-stream"
                onClick={() => setActiveStream("discover")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeStream === "discover"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/40"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                Discover
                <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded-md font-bold">
                  TRENDS
                </span>
              </button>
            </div>

            {/* Dynamic Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search community issues..."
                className="w-full text-xs rounded-xl py-2 pl-9 pr-4 bg-white border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* No Funnel state tabs anymore - we display comments & status on the post directly */}

            {/* Issue Cards Streams */}
            <div className="space-y-4 pt-1.5">
              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  <p className="text-xs font-mono text-slate-400">CONNECTING TO SECURE CLOUD GATEWAY...</p>
                </div>
              ) : errorMsg ? (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-center text-rose-800 text-xs font-semibold">
                  {errorMsg}
                </div>
              ) : sortedIssues.length === 0 ? (
                <div className="py-12 px-4 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-2">
                  <Inbox className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">No priority cases found</p>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {searchQuery 
                      ? "Try adjusting your search criteria or filters." 
                      : `Be the first to raise a civic priority ticket in ${user.constituency}!`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {sortedIssues.map((issue) => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        currentUserEmail={user.email}
                        isAdminMode={isAdminMode}
                        onVote={handleVote}
                        onResolve={handleResolve}
                        onRefresh={fetchPriorities}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </main>

          {/* Floating Ingestion Gateway Trigger (FAB) */}
          <div className="absolute bottom-6 right-6 z-30">
            <button
              id="raise-priority-fab"
              onClick={() => setIsNewIssueModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4.5 py-3 rounded-full shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95 transition-all text-xs tracking-wide border border-indigo-500/30"
            >
              <Plus className="w-4 h-4" />
              Raise Priority
            </button>
          </div>

          {/* Content Creation Slide-up Gateway Modal */}
          <AnimatePresence>
            {isNewIssueModalOpen && (
              <NewIssueModal
                onClose={() => setIsNewIssueModalOpen(false)}
                onSubmit={handleNewIssueSubmit}
                defaultConstituency={user.constituency}
                userEmail={user.email}
                userName={user.name}
              />
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Google Authentication & Location Customization Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={(updatedProfile) => {
          setUser(updatedProfile);
        }} 
      />

      {/* Interactive Hackathon Presentation Slideshow */}
      <HackathonSlides 
        isOpen={isSlidesOpen} 
        onClose={() => setIsSlidesOpen(false)} 
      />
    </div>
  );
}
