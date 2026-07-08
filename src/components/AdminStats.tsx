import React from "react";
import { ShieldCheck, Loader2, Sparkles, AlertTriangle, CheckSquare } from "lucide-react";
import { CivicIssue } from "../types";

interface AdminStatsProps {
  issues: CivicIssue[];
  constituency: string;
}

export default function AdminStats({ issues, constituency }: AdminStatsProps) {
  // Filter issues for active constituency
  const constituencyIssues = issues.filter(i => i.constituency === constituency);

  const totalRaised = constituencyIssues.length;
  const underConsideration = constituencyIssues.filter(i => i.funnelState === "Under Consideration").length;
  const resolvedCount = constituencyIssues.filter(i => i.funnelState === "Resolved").length;
  const urgentCount = constituencyIssues.filter(i => i.aiTriage?.triage_status === "Genuine_Urgent" && i.funnelState !== "Resolved").length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-lg space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span className="font-display font-semibold text-sm text-slate-100">
            MP Command Console Dashboard
          </span>
        </div>
        <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
          SYSTEM ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-lg">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total Filed</p>
          <p className="text-xl font-display font-bold text-slate-100 mt-0.5">{totalRaised}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-lg">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Under Evaluation</p>
          <p className="text-xl font-display font-bold text-indigo-400 mt-0.5">{underConsideration}</p>
        </div>
        <div className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-lg">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Urgent Action Required</p>
          <p className="text-xl font-display font-bold text-rose-500 mt-0.5 flex items-center gap-1">
            {urgentCount}
            {urgentCount > 0 && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />}
          </p>
        </div>
        <div className="bg-slate-950 border border-slate-800/80 p-2.5 rounded-lg">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Resolutions Logged</p>
          <p className="text-xl font-display font-bold text-emerald-400 mt-0.5">{resolvedCount}</p>
        </div>
      </div>

      <div className="bg-emerald-950/20 border border-emerald-500/10 p-2 rounded-lg flex items-center gap-2 text-xs text-emerald-300">
        <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
        <p className="leading-tight font-mono text-[10px]">
          Gemini 3.5 Auto-Triage handles initial pipeline classification. Urgent issues trigger high-priority alerts instantly.
        </p>
      </div>
    </div>
  );
}
