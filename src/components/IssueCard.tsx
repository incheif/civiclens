import React from "react";
import { 
  ThumbsUp, 
  MapPin, 
  Calendar, 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Send,
  ExternalLink,
  Loader2,
  MessageSquare
} from "lucide-react";
import { CivicIssue } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface IssueCardProps {
  key?: React.Key;
  issue: CivicIssue;
  currentUserEmail: string;
  isAdminMode: boolean;
  onVote: (issueId: string) => void;
  onResolve: (issueId: string, adminReply: string) => void;
  onRefresh?: () => Promise<void>;
}

export default function IssueCard({
  issue,
  currentUserEmail,
  isAdminMode,
  onVote,
  onResolve,
  onRefresh
}: IssueCardProps) {
  const [isResolving, setIsResolving] = React.useState(false);
  const [adminResponseText, setAdminResponseText] = React.useState("");
  const [submittingResolution, setSubmittingResolution] = React.useState(false);

  // Comments local toggles & form
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);
  const [newCommentText, setNewCommentText] = React.useState("");
  const [submittingComment, setSubmittingComment] = React.useState(false);

  // Regional Translation States
  const [currentLang, setCurrentLang] = React.useState("English");
  const [translationCache, setTranslationCache] = React.useState<Record<string, { title: string; description: string; summary: string }>>({});
  const [translating, setTranslating] = React.useState(false);

  const handleLanguageChange = async (lang: string) => {
    if (lang === "English") {
      setCurrentLang("English");
      return;
    }

    if (translationCache[lang]) {
      setCurrentLang(lang);
      return;
    }

    setTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: issue.title,
          description: issue.description,
          summary: issue.aiTriage?.english_summary || "",
          targetLanguage: lang
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.translation) {
          setTranslationCache(prev => ({
            ...prev,
            [lang]: data.translation
          }));
          setCurrentLang(lang);
        }
      }
    } catch (err) {
      console.error("Failed to translate issue:", err);
    } finally {
      setTranslating(false);
    }
  };

  const displayedTitle = currentLang === "English" ? issue.title : (translationCache[currentLang]?.title || issue.title);
  const displayedDesc = currentLang === "English" ? issue.description : (translationCache[currentLang]?.description || issue.description);
  const displayedSummary = currentLang === "English" ? (issue.aiTriage?.english_summary || "") : (translationCache[currentLang]?.summary || (issue.aiTriage?.english_summary || ""));

  const hasVoted = issue.votedUserEmails?.includes(currentUserEmail);
  const isResolved = issue.funnelState === "Resolved";
  const isRejected = issue.funnelState === "Rejected";

  const getTriageBadgeStyle = (status?: string) => {
    switch (status) {
      case "Genuine_Urgent":
        return "bg-rose-50 text-rose-700 border-rose-150 ring-rose-500/10";
      case "Genuine_Standard":
        return "bg-amber-50 text-amber-700 border-amber-150 ring-amber-500/10";
      case "Fun":
        return "bg-emerald-50 text-emerald-700 border-emerald-150 ring-emerald-500/10";
      case "Spam":
        return "bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/5";
      default:
        return "bg-slate-50 text-slate-500 border-slate-100 ring-slate-500/5";
    }
  };

  const getFunnelBadgeStyle = (state: string) => {
    switch (state) {
      case "Recently Raised":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Under Consideration":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Rejected":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminResponseText.trim()) return;

    setSubmittingResolution(true);
    try {
      await onResolve(issue.id, adminResponseText);
      setIsResolving(false);
      setAdminResponseText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingResolution(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/priorities/${issue.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: currentUserEmail ? currentUserEmail.split("@")[0] : "Citizen",
          authorEmail: currentUserEmail || "",
          authorAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUserEmail || "Citizen")}`,
          text: newCommentText.trim()
        })
      });

      if (!response.ok) {
        throw new Error("Failed to post comment");
      }

      setNewCommentText("");
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      console.error(err);
      alert("Error posting comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-shadow relative ${
        isResolved 
          ? "border-emerald-200 ring-2 ring-emerald-500/5" 
          : issue.aiTriage?.triage_status === "Genuine_Urgent" && !isRejected
            ? "border-rose-200 ring-2 ring-rose-500/5"
            : "border-slate-200"
      }`}
    >
      {/* Decorative Top Accent Bar matching professional polish design */}
      {isResolved ? (
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
      ) : isRejected ? (
        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500/60" />
      ) : issue.aiTriage?.triage_status === "Genuine_Urgent" ? (
        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
      ) : issue.funnelState === "Under Consideration" ? (
        <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600" />
      ) : (
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
      )}

      {/* Header Info Banner */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/70 border-b border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <img
            src={issue.authorAvatar}
            alt={issue.authorName}
            className="w-6 h-6 rounded-full bg-slate-100 object-cover border border-slate-200/60"
          />
          <div>
            <p className="text-[11px] font-medium text-slate-700 truncate max-w-[130px]">
              {issue.authorName}
            </p>
            {issue.authorEmail && !issue.isAnonymous && (
              <p className="text-[9px] font-mono text-slate-400 leading-none">
                {issue.authorEmail}
              </p>
            )}
          </div>
        </div>

        {/* Funnel State Indicator */}
        <span className={`text-[9px] font-mono uppercase tracking-wider font-semibold border px-2 py-0.5 rounded-full ${getFunnelBadgeStyle(issue.funnelState)}`}>
          {issue.funnelState}
        </span>
      </div>

      <div className="p-4 space-y-3.5">
        {/* Title & Description */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display font-bold text-slate-900 text-sm leading-tight tracking-tight flex-1">
              {displayedTitle}
            </h2>
            
            {/* Translation Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200/60 rounded-full px-2.5 py-1 text-[10px] shrink-0 shadow-3xs">
              <span className="flex items-center justify-center">
                {translating ? (
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                ) : (
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                )}
              </span>
              <select
                value={currentLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                disabled={translating}
                className="bg-transparent border-none text-slate-600 font-semibold focus:outline-none cursor-pointer text-[10px] pr-1 py-0"
              >
                <option value="English">ENG</option>
                <option value="Hindi">HIN (हिंदी)</option>
                <option value="Tamil">TAM (தமிழ்)</option>
                <option value="Kannada">KAN (ಕನ್ನಡ)</option>
                <option value="Bengali">BEN (বাংলা)</option>
                <option value="Telugu">TEL (తెలుగు)</option>
                <option value="Marathi">MAR (मराठी)</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed break-words whitespace-pre-wrap">
            {displayedDesc}
          </p>
        </div>

        {/* Media Attachments Previewer */}
        {issue.attachment && (
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-slate-50/40 p-2 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pb-1 border-b border-slate-100/60">
              <span className="flex items-center gap-1">
                {issue.attachment.type.startsWith("image/") && <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />}
                {issue.attachment.type.startsWith("video/") && <VideoIcon className="w-3.5 h-3.5 text-rose-500" />}
                {issue.attachment.type.includes("pdf") && <FileText className="w-3.5 h-3.5 text-amber-500" />}
                {issue.attachment.name}
              </span>
              <span>ATTACHMENT</span>
            </div>

            {/* Inline Media Rendering */}
            {issue.attachment.type.startsWith("image/") && (
              <div className="relative max-h-48 rounded-lg overflow-hidden border border-slate-100 bg-white">
                <img
                  src={issue.attachment.data}
                  alt={issue.attachment.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full max-h-48 object-cover"
                />
              </div>
            )}

            {issue.attachment.type.startsWith("video/") && (
              <div className="relative max-h-48 rounded-lg overflow-hidden border border-slate-100 bg-black">
                <video
                  src={issue.attachment.data}
                  controls
                  className="w-full h-full max-h-48 object-contain"
                />
              </div>
            )}

            {issue.attachment.type.includes("pdf") && (
              <div className="bg-white border border-slate-100 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-50 text-rose-500 rounded">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 truncate max-w-[150px]">
                      {issue.attachment.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">Supporting Document</p>
                  </div>
                </div>
                <a
                  href={issue.attachment.data}
                  download={issue.attachment.name}
                  className="p-1.5 hover:bg-slate-50 text-indigo-600 rounded border border-slate-200 flex items-center gap-1 text-[10px] font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </a>
              </div>
            )}
          </div>
        )}

        {/* Gemini AI Auto-Triage Block */}
        {issue.aiTriage && (
          <div className="bg-slate-50 border border-slate-150/80 rounded-lg p-3 space-y-2 relative overflow-hidden">
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1">
              <span className="text-[8px] font-mono uppercase tracking-widest text-indigo-600 font-semibold flex items-center gap-0.5 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                <Sparkles className="w-2.5 h-2.5 animate-pulse" /> Gemini AI Triage
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-mono uppercase font-semibold tracking-wider px-2 py-0.5 rounded-md border ${getTriageBadgeStyle(issue.aiTriage.triage_status)}`}>
                  {issue.aiTriage.triage_status.replace("_", " ")}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(issue.aiTriage.analyzedAt || issue.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed italic pr-12">
                "{displayedSummary}"
              </p>
            </div>

            {/* Keyword tags */}
            {issue.aiTriage.tags && issue.aiTriage.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {issue.aiTriage.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-mono bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Official Administrative Response Card & Status Comments */}
        {isResolved && (
          <div className="mt-4 p-3.5 bg-slate-50 rounded-lg border-l-4 border-indigo-600 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600" /> Admin Response
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                {issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleDateString() : ""}
              </span>
            </div>
            
            <div 
              className="text-xs text-slate-700 leading-relaxed font-medium admin-reply-content space-y-1"
              dangerouslySetInnerHTML={{
                __html: issue.adminReply?.startsWith("<") 
                  ? issue.adminReply 
                  : `<p className="italic">"${issue.adminReply}"</p>`
              }}
            />

            {issue.validationPhotoUrl && (
              <div className="mt-2.5 rounded-lg overflow-hidden border border-slate-200">
                <img 
                  src={issue.validationPhotoUrl} 
                  alt="Official Photo Validation" 
                  className="w-full h-40 object-cover"
                />
              </div>
            )}

            <div className="text-[9px] font-mono text-slate-400/90 pt-0.5">
              Sign-off Authority: <span className="font-semibold text-slate-600">{issue.resolvedBy}</span>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="mt-4 p-3.5 bg-rose-50/60 rounded-lg border-l-4 border-rose-500 space-y-1 shadow-3xs">
            <div className="flex items-center justify-between pb-1 border-b border-rose-100">
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-700 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Triage Flag: Spam / Out of Scope
              </span>
            </div>
            <p className="text-xs text-rose-900 leading-relaxed font-semibold">
              This submission was flagged by Gemini AI as irrelevant, out-of-scope, or spam.
            </p>
            <p className="text-[11px] text-slate-500 italic leading-snug">
              "Administrative priorities are reserved for genuine municipal concerns."
            </p>
          </div>
        )}

        {issue.funnelState === "Under Consideration" && (
          <div className="mt-4 p-3.5 bg-indigo-50/60 rounded-lg border-l-4 border-indigo-500 space-y-1 shadow-3xs">
            <div className="flex items-center justify-between pb-1 border-b border-indigo-100">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> AI Handshake Verified
              </span>
            </div>
            <p className="text-xs text-indigo-950 leading-relaxed font-semibold">
              Under Consideration: Currently being audited for active deployment.
            </p>
            <p className="text-[11px] text-slate-500 leading-snug">
              This ticket has been officially marked as genuine regional work and is awaiting department dispatch.
            </p>
          </div>
        )}

        {issue.funnelState === "Dispatched/In Progress" && (
          <div className="mt-4 p-3.5 bg-amber-50/60 rounded-lg border-l-4 border-amber-500 space-y-1 shadow-3xs">
            <div className="flex items-center justify-between pb-1 border-b border-amber-100">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-700 font-bold flex items-center gap-1">
                <Send className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Active Dispatched Order
              </span>
              {issue.dispatchedAt && (
                <span className="text-[9px] font-mono text-slate-400">
                  {new Date(issue.dispatchedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-semibold">
              Crew Dispatched: Task force assigned to {issue.department || "PWD"} is active.
            </p>
            {issue.dispatchLog && (
              <p className="text-[11px] text-slate-600 font-mono italic">
                Log: {issue.dispatchLog}
              </p>
            )}
            <p className="text-[11px] text-slate-500 leading-snug">
              The target department has been authorized to deploy resources to repair and stabilize the site.
            </p>
          </div>
        )}

        {/* Card Footer controls: Votes and Regional Metadata */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate max-w-[120px]">{issue.constituency}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Citizen voting trigger with optimistic UI feedback (Always allowed, even if resolved/rejected) */}
            <button
              onClick={() => onVote(issue.id)}
              disabled={hasVoted}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-all duration-200 ${
                hasVoted
                  ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-semibold cursor-default"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600 active:scale-95 cursor-pointer"
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? "fill-indigo-500 text-indigo-600" : ""}`} />
              <span>{issue.votes || 0}</span>
            </button>

            {/* Citizen comments trigger and count indicator (Always allowed) */}
            <button
              type="button"
              onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                isCommentsOpen
                  ? "bg-slate-100 border-slate-300 text-slate-800 font-semibold"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600 active:scale-95"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{issue.comments?.length || 0}</span>
            </button>
          </div>
        </div>

        {/* Collapsible interactive comments list & posting form */}
        <AnimatePresence>
          {isCommentsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-100 bg-slate-50/60 p-3.5 space-y-3.5"
            >
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Comments ({issue.comments?.length || 0})
              </h4>

              {/* Comments scroll area */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {issue.comments && issue.comments.length > 0 ? (
                  issue.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2 items-start text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="w-6.5 h-6.5 rounded-full bg-slate-200 shrink-0 object-cover"
                      />
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-900 truncate max-w-[150px]">
                            {comment.authorName}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="leading-relaxed text-slate-600 break-words font-medium">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] font-mono text-slate-400 text-center py-2.5 italic">
                    No comments yet. Share your thoughts or ask a question!
                  </p>
                )}
              </div>

              {/* Input reply form (Always active) */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  required
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Post constructive comment..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 text-slate-700 font-medium"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !newCommentText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0 uppercase tracking-wider font-mono text-[10px]"
                >
                  {submittingComment ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>Post</span>
                      <Send className="w-3 h-3" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Administration Actions Triggered exclusively inside MP Terminal View */}
        {isAdminMode && !isResolved && !isRejected && (
          <div className="border-t border-slate-100 pt-3 mt-1 space-y-2">
            {!isResolving ? (
              <button
                onClick={() => setIsResolving(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all"
              >
                <CheckCircle className="w-4 h-4" /> Resolve Priority Issue
              </button>
            ) : (
              <AnimatePresence>
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleResolveSubmit}
                  className="space-y-2 bg-slate-900 p-3 rounded-lg border border-slate-800"
                >
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-300">
                    Verified MP Resolution Report Notice
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={adminResponseText}
                    onChange={(e) => setAdminResponseText(e.target.value)}
                    placeholder="Enter official resolution details (e.g., 'Municipal repair dispatch. Concrete restoration finalized as of 07/06.')"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-600"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submittingResolution}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 px-3 rounded text-xs flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {submittingResolution ? "Publishing..." : "Publish Resolution"}
                      <Send className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsResolving(false);
                        setAdminResponseText("");
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.form>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}
