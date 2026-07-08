import React, { useState, useEffect } from "react";
import { CivicIssue, FunnelState, AdminProfile, CONSTITUENCIES, STATE_CONSTITUENCIES, STATES } from "../types";
import { 
  Building2, CheckCircle2, AlertCircle, RefreshCw, 
  ArrowRight, Mail, ClipboardCheck, ArrowLeft, Image as ImageIcon, 
  MapPin, Clock, Send, Camera, User, BadgeAlert, FileText, Check, 
  ShieldCheck, Plus, X, Edit, Trash, Sparkles, UserPlus, Info
} from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";

interface AdminTerminalProps {
  issues: CivicIssue[];
  onRefresh: () => Promise<void>;
  currentUserEmail: string;
}

export function AdminTerminal({ issues, onRefresh, currentUserEmail }: AdminTerminalProps) {
  // 1. ADMIN PROFILE PERSISTENCE & MANAGEMENT
  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>(() => {
    const saved = localStorage.getItem("civiclens_admin_profiles");
    let profiles = [
      {
        id: "admin-1",
        name: "Hon. Meera Sen",
        email: "meera.sen@mp.gov.in",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
        constituency: "New Delhi",
        badgeId: "MP-DL-04"
      },
      {
        id: "admin-cc",
        name: "Hon. Rajesh Vardhan",
        email: "rajesh.vardhan@mp.gov.in",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
        constituency: "Chandni Chowk",
        badgeId: "MP-DL-01"
      },
      {
        id: "admin-ed",
        name: "Hon. Gautam Gambhir",
        email: "gautam.g@mp.gov.in",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        constituency: "East Delhi",
        badgeId: "MP-DL-03"
      },
      {
        id: "admin-ned",
        name: "Hon. Manoj Tiwari",
        email: "manoj.tiwari@mp.gov.in",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        constituency: "North East Delhi",
        badgeId: "MP-DL-02"
      },
      {
        id: "admin-nwd",
        name: "Hon. Hans Raj Hans",
        email: "hansraj@mp.gov.in",
        avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150",
        constituency: "North West Delhi",
        badgeId: "MP-DL-05"
      },
      {
        id: "admin-sd",
        name: "Hon. Ramesh Bidhuri",
        email: "ramesh.b@mp.gov.in",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
        constituency: "South Delhi",
        badgeId: "MP-DL-06"
      },
      {
        id: "admin-wd",
        name: "Hon. Parvesh Verma",
        email: "parvesh.v@mp.gov.in",
        avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150",
        constituency: "West Delhi",
        badgeId: "MP-DL-07"
      },
      {
        id: "admin-2",
        name: "Hon. K. R. Gowda",
        email: "kr.gowda@mp.gov.in",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        constituency: "Bengaluru South",
        badgeId: "MP-KA-09"
      },
      {
        id: "admin-3",
        name: "Hon. Aditya Thackeray",
        email: "aditya.t@mp.gov.in",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        constituency: "Mumbai North-West",
        badgeId: "MP-MH-12"
      }
    ];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge saved profiles, but keep any of our default ones that are missing
          const savedIds = new Set(parsed.map(p => p.id));
          const missingDefaults = profiles.filter(p => !savedIds.has(p.id));
          profiles = [...parsed, ...missingDefaults];
        }
      } catch (e) {
        // Fallback
      }
    }

    // Auto-migrate old "New Delhi Central" to standard "New Delhi"
    return profiles.map(p => {
      if (p.constituency === "New Delhi Central" || !p.constituency) {
        return { ...p, constituency: "New Delhi" };
      }
      return p;
    });
  });

  const [activeAdminProfile, setActiveAdminProfile] = useState<AdminProfile>(() => {
    const savedId = localStorage.getItem("civiclens_active_admin_id");
    if (savedId) {
      const found = adminProfiles.find(p => p.id === savedId);
      if (found) {
        if (found.constituency === "New Delhi Central" || !found.constituency) {
          return { ...found, constituency: "New Delhi" };
        }
        return found;
      }
    }
    const defaultProfile = adminProfiles[0];
    if (defaultProfile.constituency === "New Delhi Central" || !defaultProfile.constituency) {
      return { ...defaultProfile, constituency: "New Delhi" };
    }
    return defaultProfile;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("civiclens_admin_profiles", JSON.stringify(adminProfiles));
  }, [adminProfiles]);

  useEffect(() => {
    localStorage.setItem("civiclens_active_admin_id", activeAdminProfile.id);
  }, [activeAdminProfile]);

  // UI toggle states
  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Profile creation form states
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminState, setNewAdminState] = useState("Delhi");
  const [newAdminConstituency, setNewAdminConstituency] = useState("New Delhi");
  const [newAdminBadgeId, setNewAdminBadgeId] = useState("");
  const [newAdminAvatar, setNewAdminAvatar] = useState("");

  // Sync constituency when selected state in profile creation changes
  useEffect(() => {
    const list = STATE_CONSTITUENCIES[newAdminState] || [];
    if (list.length > 0) {
      setNewAdminConstituency(list[0]);
    }
  }, [newAdminState]);

  // 2. CIVIC ISSUE SELECTION & ACTION DRAWER
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [drawerTab, setDrawerTab] = useState<"actions" | "edit">("actions");
  
  // Quick actions form states
  const [emailDraft, setEmailDraft] = useState("");
  const [resolutionText, setResolutionText] = useState("");
  const [validationPhoto, setValidationPhoto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<"PWD" | "Water" | "Utilities" | "Sanitation" | "General">("PWD");
  const [mediaPreviewId, setMediaPreviewId] = useState<string | null>(null);

  // 3. EDIT FORM METADATA STATE (Full Override Capability)
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editConstituency, setEditConstituency] = useState("");
  const [editDept, setEditDept] = useState<"PWD" | "Water" | "Utilities" | "Sanitation" | "General">("General");
  const [editState, setEditState] = useState<FunnelState>("Recently Raised");
  const [editVotes, setEditVotes] = useState(0);
  const [editDispatchLog, setEditDispatchLog] = useState("");
  const [editAdminReply, setEditAdminReply] = useState("");
  const [editValidationPhoto, setEditValidationPhoto] = useState("");
  const [editTriageSummary, setEditTriageSummary] = useState("");
  const [editTriageStatus, setEditTriageStatus] = useState<any>("Genuine_Standard");
  const [editTriageTags, setEditTriageTags] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Sync Quick action drafts & Edit metadata when selectedIssue changes
  useEffect(() => {
    if (selectedIssue) {
      // 1. Quick actions drafts
      const dept = selectedIssue.department || "PWD";
      setSelectedDepartment(dept);
      
      const summary = selectedIssue.aiTriage?.english_summary || selectedIssue.description;
      const severity = selectedIssue.aiTriage?.triage_status || "Genuine_Standard";
      
      const draft = `TO: compliance-officer@${dept.toLowerCase()}-municipal.gov
SUBJECT: URGENT COMPLIANCE DIRECTIVE: PRIORITY CIVIC WORK ORDER #${selectedIssue.id}

ADMINISTRATIVE DETAILS:
- Subject: ${selectedIssue.title}
- Community Support: ${selectedIssue.votes} Active Resignations / Votes
- Regional Urgency Level: ${severity.replace("_", " ")}
- Location Constituency: ${selectedIssue.constituency}

CRITICAL SUMMARY (AI TRIAGED):
"${summary}"

CIVIC COMPLIANCE ACTION DIRECTIVE:
You are hereby authorized and directed to dispatch a municipal technical field team immediately to the physical coordinates mentioned. Retain and submit photo-compliance evidence upon remediation.

Best regards,
Office of Administrative Priorities, CivicLens Terminal`;
      
      setEmailDraft(draft);
      setResolutionText(selectedIssue.adminReply || "");
      setValidationPhoto(selectedIssue.validationPhotoUrl || "");

      // 2. Full metadata override values
      setEditTitle(selectedIssue.title || "");
      setEditDesc(selectedIssue.description || "");
      setEditConstituency(selectedIssue.constituency || "");
      setEditDept(selectedIssue.department || "General");
      setEditState(selectedIssue.funnelState || "Recently Raised");
      setEditVotes(selectedIssue.votes || 0);
      setEditDispatchLog(selectedIssue.dispatchLog || "");
      setEditAdminReply(selectedIssue.adminReply || "");
      setEditValidationPhoto(selectedIssue.validationPhotoUrl || "");
      setEditTriageSummary(selectedIssue.aiTriage?.english_summary || "");
      setEditTriageStatus(selectedIssue.aiTriage?.triage_status || "Genuine_Standard");
      setEditTriageTags(selectedIssue.aiTriage?.tags?.join(", ") || "");
    }
  }, [selectedIssue]);

  // Handle Quick Dispatch to Department
  const handleApproveAndDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/priorities/${selectedIssue.id}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          department: selectedDepartment,
          dispatchedBy: activeAdminProfile.email || currentUserEmail,
          emailDraftText: emailDraft
        })
      });

      if (!response.ok) {
        throw new Error("Failed to dispatch ticket.");
      }

      const data = await response.json();
      await onRefresh();
      setSelectedIssue(data.issue);
      alert(`Success! Ticket dispatched successfully to ${selectedDepartment} Department.`);
    } catch (error) {
      console.error(error);
      alert("Error dispatching ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Quick Resolution Notice
  const handleResolveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    if (!resolutionText.trim()) {
      alert("Please provide the official resolution notice text.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/priorities/${selectedIssue.id}/resolve-override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminReply: resolutionText,
          validationPhotoUrl: validationPhoto || undefined,
          resolvedBy: `Verified Administrator: ${activeAdminProfile.name}`
        })
      });

      if (!response.ok) {
        throw new Error("Failed to resolve ticket.");
      }

      await onRefresh();
      setSelectedIssue(null);
      alert("Success! Priority ticket marked as Resolved. Feed updated.");
    } catch (error) {
      console.error(error);
      alert("Error resolving ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Full Ticket Metadata Edit (Requirement 1: Edit All Tickets)
  const handleSaveFullEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    if (!editTitle.trim() || !editDesc.trim()) {
      alert("Title and description are required.");
      return;
    }

    setIsSavingEdit(true);
    try {
      const response = await fetch(`/api/priorities/${selectedIssue.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          description: editDesc,
          constituency: editConstituency,
          department: editDept,
          funnelState: editState,
          votes: editVotes,
          dispatchLog: editDispatchLog || undefined,
          adminReply: editAdminReply || undefined,
          validationPhotoUrl: editValidationPhoto || undefined,
          aiTriageSummary: editTriageSummary,
          aiTriageStatus: editTriageStatus,
          aiTriageTags: editTriageTags
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update ticket.");
      }

      const data = await response.json();
      await onRefresh();
      setSelectedIssue(data.issue);
      setDrawerTab("actions");
      alert("Success! Priority ticket updated successfully.");
    } catch (error: any) {
      console.error(error);
      alert(`Error updating ticket: ${error.message}`);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Creating New Admin Profile (Requirement 2: Create Admin Profile)
  const handleCreateAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminBadgeId.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    const defaultAvatars = [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150"
    ];
    const avatarToUse = newAdminAvatar.trim() || defaultAvatars[adminProfiles.length % defaultAvatars.length];

    const newProfile: AdminProfile = {
      id: "admin-" + Date.now(),
      name: newAdminName,
      email: newAdminEmail,
      avatar: avatarToUse,
      constituency: newAdminConstituency,
      badgeId: newAdminBadgeId
    };

    const updated = [...adminProfiles, newProfile];
    setAdminProfiles(updated);
    setActiveAdminProfile(newProfile);
    
    // Clear forms & close modal
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminBadgeId("");
    setNewAdminAvatar("");
    setIsCreateModalOpen(false);
    setSelectedIssue(null); // Clear selected to avoid mismatching lanes
    alert(`Admin Profile created successfully! Designated constituency: ${newProfile.constituency}`);
  };

  // 4. REGIONAL ACCESS CONTROL FILTER (Requirement 2: Access its constituency grievances only)
  const activeConstituency = activeAdminProfile.constituency;
  const adminIssues = issues.filter(issue => issue.constituency === activeConstituency);

  // Strategic Metrics Computations (Scoped strictly to the admin's constituency)
  const totalTicketsInConstituency = adminIssues.length;
  const activeGrievances = adminIssues.filter(i => i.funnelState !== "Resolved" && i.funnelState !== "Rejected").length;
  const resolvedCases = adminIssues.filter(i => i.funnelState === "Resolved").length;
  const rejectedCases = adminIssues.filter(i => i.funnelState === "Rejected").length;

  const openTickets = adminIssues.filter(i => i.funnelState !== "Resolved" && i.funnelState !== "Rejected");
  const deptBreakdown = {
    PWD: openTickets.filter(i => i.department === "PWD").length,
    Water: openTickets.filter(i => i.department === "Water").length,
    Utilities: openTickets.filter(i => i.department === "Utilities").length,
    Sanitation: openTickets.filter(i => i.department === "Sanitation").length,
    General: openTickets.filter(i => !i.department || i.department === "General").length
  };

  // Complete 4 Agile Kanban Lanes
  const recentlyRaisedIssues = adminIssues.filter(i => i.funnelState === "Recently Raised");
  const underConsiderationIssues = adminIssues.filter(i => i.funnelState === "Under Consideration");
  const dispatchedIssues = adminIssues.filter(i => i.funnelState === "Dispatched/In Progress");
  const completedOrRejectedIssues = adminIssues.filter(i => i.funnelState === "Resolved" || i.funnelState === "Rejected");

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-slate-50 overflow-hidden font-sans relative">
      
      {/* 1. Profile Switcher & Strategic Metrics Banner */}
      <section className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row items-stretch gap-4 shrink-0 shadow-2xs relative">
        
        {/* Dynamic Admin Profile Card */}
        <div className="flex-1 min-w-[320px] bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-md flex items-center justify-between gap-3 relative">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative shrink-0">
              <img
                src={activeAdminProfile.avatar}
                alt={activeAdminProfile.name}
                className="w-12 h-12 rounded-full border-2 border-emerald-500 object-cover bg-slate-800"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full border border-slate-900">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-sm text-slate-100 truncate">{activeAdminProfile.name}</h3>
                <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 shrink-0 font-bold">
                  {activeAdminProfile.badgeId}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">{activeAdminProfile.email}</p>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span>Constituency: <strong className="font-bold underline">{activeAdminProfile.constituency}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={() => setIsProfileSwitcherOpen(!isProfileSwitcherOpen)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded-lg text-slate-200 transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Switch Profile
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold rounded-lg text-white transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              New Profile
            </button>
          </div>

          {/* Switcher Dropdown (Positioned absolutely inside the banner) */}
          {isProfileSwitcherOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileSwitcherOpen(false)} />
              <div className="absolute right-4 top-20 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3.5 z-50 text-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                    Choose Admin Profile
                  </h4>
                  <button onClick={() => setIsProfileSwitcherOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {adminProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveAdminProfile(p);
                        setIsProfileSwitcherOpen(false);
                        setSelectedIssue(null);
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center gap-2.5 transition-all ${
                        activeAdminProfile.id === p.id 
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold" 
                          : "hover:bg-slate-800 border border-transparent text-slate-300"
                      }`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div className="truncate min-w-0">
                        <p className="text-xs font-bold truncate">{p.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono truncate">{p.constituency} • {p.badgeId}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Metrics Grid columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 lg:w-[48%]">
          
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center gap-2.5">
            <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100/40 shrink-0">
              <AlertCircle className="w-4 h-4 text-indigo-600 animate-pulse" />
            </div>
            <div>
              <div className="text-[9px] font-mono font-bold uppercase text-slate-400 leading-none">Active Issues</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">{activeGrievances}</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center gap-2.5">
            <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100/40 shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-[9px] font-mono font-bold uppercase text-slate-400 leading-none">Resolved</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">{resolvedCases}</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex items-center gap-2.5 col-span-2 sm:col-span-1">
            <div className="bg-rose-50 p-2 rounded-lg border border-rose-100/40 shrink-0">
              <BadgeAlert className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <div className="text-[9px] font-mono font-bold uppercase text-slate-400 leading-none">Rejected/Spam</div>
              <div className="text-lg font-black text-slate-800 mt-0.5">{rejectedCases}</div>
            </div>
          </div>

        </div>

        {/* Department Distribution Mini bar */}
        <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl flex flex-col justify-center lg:w-[28%] shrink-0">
          <div className="text-[9px] font-mono font-bold uppercase text-slate-400 mb-1 flex items-center justify-between">
            <span>Department Queue Load</span>
            <span className="text-indigo-600 font-bold bg-indigo-50 px-1 rounded text-[8px]">ACTIVE AUDIT</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 text-center">
            <div className="p-1 bg-white rounded shadow-3xs border border-slate-100">
              <div className="text-[8px] font-mono font-bold text-slate-500">PWD</div>
              <div className="text-xs font-black text-slate-800">{deptBreakdown.PWD}</div>
            </div>
            <div className="p-1 bg-white rounded shadow-3xs border border-slate-100">
              <div className="text-[8px] font-mono font-bold text-blue-500">H2O</div>
              <div className="text-xs font-black text-blue-600">{deptBreakdown.Water}</div>
            </div>
            <div className="p-1 bg-white rounded shadow-3xs border border-slate-100">
              <div className="text-[8px] font-mono font-bold text-purple-500">UTIL</div>
              <div className="text-xs font-black text-purple-600">{deptBreakdown.Utilities}</div>
            </div>
            <div className="p-1 bg-white rounded shadow-3xs border border-slate-100">
              <div className="text-[8px] font-mono font-bold text-amber-500">SANI</div>
              <div className="text-xs font-black text-amber-600">{deptBreakdown.Sanitation}</div>
            </div>
            <div className="p-1 bg-white rounded shadow-3xs border border-slate-100">
              <div className="text-[8px] font-mono font-bold text-slate-400">GEN</div>
              <div className="text-xs font-black text-slate-500">{deptBreakdown.General}</div>
            </div>
          </div>
        </div>

      </section>

      {/* 2. Main Terminal Grid Area with 4 Agile Kanban Lanes */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Kanban Board Container */}
        <section className="flex-1 overflow-x-auto p-4 flex gap-4 items-stretch bg-slate-50">
          
          {/* LANE 1: RECENTLY RAISED */}
          <div className="w-[300px] flex flex-col bg-slate-200/40 border border-slate-200/80 rounded-xl overflow-hidden shrink-0">
            <div className="px-3.5 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-3xs shrink-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">Recently Raised</h3>
              </div>
              <span className="text-[9px] font-bold font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full shrink-0">
                {recentlyRaisedIssues.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
              {recentlyRaisedIssues.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                  <FileText className="w-7 h-7 opacity-40 mb-1.5" />
                  <p className="text-[11px] font-bold">No recently raised cases.</p>
                  <p className="text-[9px] text-slate-400">Citizen submissions are blank.</p>
                </div>
              ) : (
                recentlyRaisedIssues.map(issue => (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className={`bg-white border rounded-xl p-3.5 cursor-pointer transition-all hover:shadow-md hover:border-slate-300 relative group ${
                      selectedIssue?.id === issue.id 
                        ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs" 
                        : "border-slate-200 shadow-3xs"
                    }`}
                  >
                    <div className="absolute top-0 right-0 h-1 w-12 bg-slate-400 rounded-tr-xl" />
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">
                        #{issue.id.slice(-5)}
                      </span>
                      <span className="px-1 py-0.2 rounded text-[8px] font-bold border bg-slate-50 text-slate-600 border-slate-100 font-mono uppercase">
                        Fresh
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {issue.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-normal">
                      {issue.description}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold uppercase">
                        {issue.department || "GEN"}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {issue.votes} Votes
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LANE 2: UNDER CONSIDERATION */}
          <div className="w-[300px] flex flex-col bg-slate-200/40 border border-slate-200/80 rounded-xl overflow-hidden shrink-0">
            <div className="px-3.5 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-3xs shrink-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">Under Consideration</h3>
              </div>
              <span className="text-[9px] font-bold font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full shrink-0">
                {underConsiderationIssues.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
              {underConsiderationIssues.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                  <ClipboardCheck className="w-7 h-7 opacity-40 mb-1.5" />
                  <p className="text-[11px] font-bold">No active triage queue.</p>
                  <p className="text-[9px] text-slate-400">Approve or upvote items to promote.</p>
                </div>
              ) : (
                underConsiderationIssues.map(issue => (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className={`bg-white border rounded-xl p-3.5 cursor-pointer transition-all hover:shadow-md hover:border-slate-300 relative group ${
                      selectedIssue?.id === issue.id 
                        ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs" 
                        : "border-slate-200 shadow-3xs"
                    }`}
                  >
                    <div className="absolute top-0 right-0 h-1 w-12 bg-amber-400 rounded-tr-xl" />
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">
                        #{issue.id.slice(-5)}
                      </span>
                      <span className={`px-1 py-0.2 rounded text-[8px] font-bold border font-mono ${
                        issue.aiTriage?.triage_status === "Genuine_Urgent"
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : "bg-indigo-50 text-indigo-700 border-indigo-100"
                      }`}>
                        {issue.aiTriage?.triage_status === "Genuine_Urgent" ? "Urgent" : "Standard"}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {issue.title}
                    </h4>
                    
                    <div className="mt-2 p-1.5 bg-indigo-50/50 rounded-lg border border-indigo-100/20 text-[10px] text-indigo-900 leading-relaxed italic">
                      "{issue.aiTriage?.english_summary || issue.description}"
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-bold uppercase">
                        {issue.department || "PWD"}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {issue.votes} Votes
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LANE 3: DISPATCHED / IN PROGRESS */}
          <div className="w-[300px] flex flex-col bg-slate-200/40 border border-slate-200/80 rounded-xl overflow-hidden shrink-0">
            <div className="px-3.5 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-3xs shrink-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">Dispatched & Active</h3>
              </div>
              <span className="text-[9px] font-bold font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full shrink-0">
                {dispatchedIssues.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
              {dispatchedIssues.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                  <Send className="w-7 h-7 opacity-40 mb-1.5" />
                  <p className="text-[11px] font-bold">No active crew orders.</p>
                  <p className="text-[9px] text-slate-400">Select under consideration to dispatch.</p>
                </div>
              ) : (
                dispatchedIssues.map(issue => (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className={`bg-white border rounded-xl p-3.5 cursor-pointer transition-all hover:shadow-md hover:border-slate-300 relative group ${
                      selectedIssue?.id === issue.id 
                        ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs" 
                        : "border-slate-200 shadow-3xs"
                    }`}
                  >
                    <div className="absolute top-0 right-0 h-1 w-12 bg-indigo-500 rounded-tr-xl" />
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">
                        #{issue.id.slice(-5)}
                      </span>
                      <span className="px-1 py-0.2 rounded text-[8px] font-bold border font-mono bg-amber-50 text-amber-700 border-amber-100">
                        Dispatched
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {issue.title}
                    </h4>

                    <div className="mt-1.5 px-2 py-1 bg-slate-50 border-l-2 border-indigo-500 text-[9px] font-mono text-slate-600 truncate">
                      {issue.dispatchLog || `Field crew active`}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded font-bold uppercase">
                        {issue.department || "PWD"}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {issue.votes} Votes
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LANE 4: COMPLETED / REJECTED CASES */}
          <div className="w-[300px] flex flex-col bg-slate-200/40 border border-slate-200/80 rounded-xl overflow-hidden shrink-0">
            <div className="px-3.5 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-3xs shrink-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">Resolved & Closed</h3>
              </div>
              <span className="text-[9px] font-bold font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full shrink-0">
                {completedOrRejectedIssues.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
              {completedOrRejectedIssues.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
                  <CheckCircle2 className="w-7 h-7 opacity-40 mb-1.5" />
                  <p className="text-[11px] font-bold">No closed tickets yet.</p>
                  <p className="text-[9px] text-slate-400">Completed items aggregate here.</p>
                </div>
              ) : (
                completedOrRejectedIssues.map(issue => (
                  <div
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue)}
                    className={`bg-white border rounded-xl p-3.5 cursor-pointer transition-all hover:shadow-md hover:border-slate-300 relative group ${
                      selectedIssue?.id === issue.id 
                        ? "border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs" 
                        : "border-slate-200 shadow-3xs"
                    }`}
                  >
                    <div className={`absolute top-0 right-0 h-1 w-12 rounded-tr-xl ${
                      issue.funnelState === "Rejected" ? "bg-rose-500" : "bg-emerald-500"
                    }`} />
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">
                        #{issue.id.slice(-5)}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold border font-mono ${
                        issue.funnelState === "Rejected"
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}>
                        {issue.funnelState}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {issue.title}
                    </h4>
                    
                    <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {issue.description}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold uppercase">
                        {issue.department || "GEN"}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {issue.votes} Votes
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

        {/* 3. COMPLIANCE & EDIT OVERRIDE DRAWER PANEL */}
        <aside className="w-[430px] bg-white border-l border-slate-200 flex flex-col h-full shrink-0 shadow-xl overflow-hidden relative">
          {selectedIssue ? (
            <div className="flex flex-col h-full overflow-hidden">
              
              {/* Drawer Sticky Top Section */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <h3 className="text-xs font-bold text-slate-800 tracking-tight uppercase font-mono truncate">
                      Grievance Compliance
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedIssue(null)}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Close Drawer
                  </button>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-3xs">
                  <div className="flex items-center justify-between text-[8px] font-mono text-slate-400 font-bold">
                    <span>ID: {selectedIssue.id}</span>
                    <span className="text-indigo-600 uppercase bg-indigo-50 px-1 py-0.2 rounded">
                      {selectedIssue.constituency}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-800 line-clamp-1">{selectedIssue.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{selectedIssue.description}</p>
                </div>

                {/* TAB SWITCHER: Actions Console vs. Edit Metadata Form (Requirement 1: Edit all tickets) */}
                <div className="flex p-0.5 bg-slate-200 rounded-lg border border-slate-300/40">
                  <button
                    onClick={() => setDrawerTab("actions")}
                    className={`flex-1 py-1.5 text-center text-xs font-bold rounded-md transition-all ${
                      drawerTab === "actions" 
                        ? "bg-white text-slate-800 shadow-3xs" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Action Workflows
                  </button>
                  <button
                    onClick={() => setDrawerTab("edit")}
                    className={`flex-1 py-1.5 text-center text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1 ${
                      drawerTab === "edit" 
                        ? "bg-indigo-600 text-white shadow-3xs" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit Ticket Metadata
                  </button>
                </div>
              </div>

              {/* Scrollable drawer body */}
              <div className="flex-1 overflow-y-auto p-4">
                
                {drawerTab === "actions" ? (
                  /* ACTIONS WORKFLOW PANEL */
                  <div className="space-y-4">
                    
                    {/* A. If Under Consideration, offer Dispatch workflow */}
                    {selectedIssue.funnelState === "Under Consideration" && (
                      <form onSubmit={handleApproveAndDispatch} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                            Target Municipal Department
                          </label>
                          <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="PWD">PWD (Public Works Dept)</option>
                            <option value="Water">Water Supply & Hydro Board</option>
                            <option value="Utilities">Utilities & Power Grid</option>
                            <option value="Sanitation">Sanitation & Municipal Waste</option>
                            <option value="General">General Administrative Office</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                            <span>Formal Government Email Draft</span>
                            <span className="text-indigo-600 flex items-center gap-0.5 text-[9px] font-mono">
                              <Mail className="w-3 h-3" /> Auto-Generated
                            </span>
                          </label>
                          <textarea
                            value={emailDraft}
                            onChange={(e) => setEmailDraft(e.target.value)}
                            rows={8}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {isSubmitting ? "Dispatching..." : "Approve & Dispatch Department"}
                        </button>
                      </form>
                    )}

                    {/* B. If Dispatched, allow resolution Notice */}
                    {selectedIssue.funnelState === "Dispatched/In Progress" && (
                      <form onSubmit={handleResolveOverride} className="space-y-4">
                        <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 space-y-1">
                          <h5 className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Task Force Status: Active
                          </h5>
                          <p className="text-[10px] text-indigo-900 leading-normal">
                            This ticket has active dispatched crews on site. Provide the official work closure report below to mark as resolved.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                            Resolution Notice Notice (HTML Rich Text)
                          </label>
                          <RichTextEditor 
                            value={resolutionText}
                            onChange={setResolutionText}
                            placeholder="e.g. <p><strong>PWD Maintenance Complete:</strong> Sealed rupture on Ring Road.</p>"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5" /> Photo Validation Link (Optional)
                          </label>
                          <input
                            type="url"
                            value={validationPhoto}
                            onChange={(e) => setValidationPhoto(e.target.value)}
                            placeholder="https://images.unsplash.com/... or evidence link"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {isSubmitting ? "Updating..." : "Commit Resolution Notice"}
                        </button>
                      </form>
                    )}

                    {/* C. If Recently Raised, nudge promotion workflow */}
                    {selectedIssue.funnelState === "Recently Raised" && (
                      <div className="p-4 border border-dashed rounded-xl bg-slate-50 space-y-3.5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                          <h5 className="text-xs font-bold">Un-Dispatched Citizen Submission</h5>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          This priority is freshly logged. To process this grievance through government workflows, please switch to the <strong>Edit Ticket Metadata</strong> tab above and update its state to <strong>Under Consideration</strong> or <strong>Dispatched/In Progress</strong>.
                        </p>
                      </div>
                    )}

                    {/* D. If Resolved, show closed summary details */}
                    {selectedIssue.funnelState === "Resolved" && (
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 text-xs leading-relaxed space-y-2">
                        <p className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> This Priority Has Been Resolved
                        </p>
                        <div 
                          className="text-slate-700 text-[11px] space-y-1 bg-white/70 p-3 rounded-lg border border-emerald-200/50 leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: selectedIssue.adminReply || "" }} 
                        />
                        {selectedIssue.validationPhotoUrl && (
                          <div className="mt-2.5 rounded-lg overflow-hidden border border-emerald-100 shadow-xs">
                            <img 
                              src={selectedIssue.validationPhotoUrl} 
                              alt="Validation Evidence" 
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        )}
                        <p className="text-[9px] text-slate-400 text-right mt-1 font-mono">
                          Resolved by: {selectedIssue.resolvedBy || "Office of Administrator"}
                        </p>
                      </div>
                    )}

                    {/* E. If Rejected, show spam summary details */}
                    {selectedIssue.funnelState === "Rejected" && (
                      <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-rose-900 text-xs leading-relaxed space-y-2">
                        <p className="font-bold flex items-center gap-1.5">
                          <BadgeAlert className="w-4 h-4 text-rose-600" /> Ticket Closed & Flagged (Out-of-Scope)
                        </p>
                        <p className="text-[11px] text-rose-950 font-medium leading-relaxed bg-white/50 p-2.5 rounded-lg">
                          Flagged status: Irrelevant municipal focus or duplicates. Standard compliance resources bypassed.
                        </p>
                        <p className="text-[10px] text-slate-500 italic mt-1 leading-snug">
                          "Administrator: Triage bypass enforced based on geographic guidelines."
                        </p>
                      </div>
                    )}

                    {/* General Triage Summary Detail */}
                    {selectedIssue.aiTriage && (
                      <div className="mt-3 p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/30 space-y-2 text-[11px]">
                        <h5 className="font-bold text-indigo-800 uppercase text-[9px] tracking-wider font-mono flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Gemini Core Triage Log
                        </h5>
                        <p className="text-slate-600 leading-normal italic">
                          "{selectedIssue.aiTriage.english_summary}"
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {selectedIssue.aiTriage.tags?.map((tag) => (
                            <span key={tag} className="bg-white px-2 py-0.5 rounded text-[9px] font-mono text-indigo-600 border border-indigo-100 font-semibold shadow-3xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  /* FULL METADATA EDIT FORM (Requirement 1: Admin can edit any ticket!) */
                  <form onSubmit={handleSaveFullEdit} className="space-y-4">
                    
                    <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-950 rounded-xl text-[11px] leading-relaxed flex gap-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                      <div>
                        <strong className="font-bold">Administrative Override:</strong> You are editing a ticket in the database. All edits sync in real-time.
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                        Grievance Title
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                        Detailed Description
                      </label>
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={4}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                          Constituency Region
                        </label>
                        <select
                          value={editConstituency}
                          onChange={(e) => setEditConstituency(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {CONSTITUENCIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                          Department
                        </label>
                        <select
                          value={editDept}
                          onChange={(e) => setEditDept(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="PWD">PWD</option>
                          <option value="Water">Water Supply</option>
                          <option value="Utilities">Utilities</option>
                          <option value="Sanitation">Sanitation</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                          Funnel State (Status)
                        </label>
                        <select
                          value={editState}
                          onChange={(e) => setEditState(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Recently Raised">Recently Raised</option>
                          <option value="Under Consideration">Under Consideration</option>
                          <option value="Dispatched/In Progress">Dispatched/In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected (Spam)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                          Community Support (Votes)
                        </label>
                        <input
                          type="number"
                          value={editVotes}
                          min="0"
                          onChange={(e) => setEditVotes(Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                        Department Dispatch Log Log
                      </label>
                      <input
                        type="text"
                        value={editDispatchLog}
                        onChange={(e) => setEditDispatchLog(e.target.value)}
                        placeholder="e.g. Dispatched to Water Department on 07/06/2026"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                        Validation Photo URL URL
                      </label>
                      <input
                        type="text"
                        value={editValidationPhoto}
                        onChange={(e) => setEditValidationPhoto(e.target.value)}
                        placeholder="Image URL link for completed proof"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-mono text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                        Official Resolution Reply (HTML Notice)
                      </label>
                      <RichTextEditor 
                        value={editAdminReply}
                        onChange={setEditAdminReply}
                        placeholder="Rich text format closure message..."
                      />
                    </div>

                    <div className="border-t border-slate-200 pt-3 mt-2 space-y-3">
                      <h5 className="text-[9px] font-mono font-bold uppercase text-indigo-600 tracking-wider">
                        Gemini AI Triage Fields
                      </h5>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                          AI English Summary Summary
                        </label>
                        <input
                          type="text"
                          value={editTriageSummary}
                          onChange={(e) => setEditTriageSummary(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                            AI Status Status
                          </label>
                          <select
                            value={editTriageStatus}
                            onChange={(e) => setEditTriageStatus(e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="Genuine_Urgent">Genuine Urgent</option>
                            <option value="Genuine_Standard">Genuine Standard</option>
                            <option value="Fun">Fun (Soft / Community)</option>
                            <option value="Spam">Spam / Out of Scope</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                            AI Tags (Comma Separated)
                          </label>
                          <input
                            type="text"
                            value={editTriageTags}
                            onChange={(e) => setEditTriageTags(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setDrawerTab("actions")}
                        className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingEdit}
                        className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-1 transition-all cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        {isSavingEdit ? "Saving..." : "Save Changes"}
                      </button>
                    </div>

                  </form>
                )}

              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-2">
              <Building2 className="w-10 h-10 opacity-30 animate-pulse" />
              <p className="text-xs font-bold text-slate-600">Administrative Drawer</p>
              <p className="text-[11px] leading-relaxed max-w-xs mx-auto">
                Select any active grievance ticket from the Kanban lanes on the left to review summaries, dispatch municipal crews, or override full metadata.
              </p>
            </div>
          )}
        </aside>

      </div>

      {/* 3. CREATE ADMIN PROFILE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-display font-bold text-sm flex items-center gap-1.5 uppercase font-mono tracking-wider">
                <UserPlus className="w-4.5 h-4.5 text-emerald-400" />
                Register MP Admin Profile
              </h3>
              <button 
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdminProfile} className="p-5 space-y-4 text-slate-800">
              
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2 text-emerald-950 text-[11px] leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong className="font-bold">Access Boundaries Notice:</strong> Once created, this profile will strictly render and process priority tickets belonging solely to its designated constituency.
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Administrator Full Name (e.g. Honorable MP) *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Hon. Rajesh Patil"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Official Gov Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="e.g. r.patil@mp.gov.in"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Select State *
                  </label>
                  <select
                    value={newAdminState}
                    onChange={(e) => setNewAdminState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Designated Constituency *
                  </label>
                  <select
                    value={newAdminConstituency}
                    onChange={(e) => setNewAdminConstituency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {(STATE_CONSTITUENCIES[newAdminState] || []).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Administrative Badge ID *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminBadgeId}
                  onChange={(e) => setNewAdminBadgeId(e.target.value)}
                  placeholder="e.g. MP-MH-15"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Custom Avatar Image Link (Optional)
                </label>
                <input
                  type="url"
                  value={newAdminAvatar}
                  onChange={(e) => setNewAdminAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/... or leave empty"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Register Profile
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
