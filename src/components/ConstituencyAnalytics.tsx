import React from "react";
import { 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Building2, 
  Sparkles,
  Award
} from "lucide-react";
import { CivicIssue } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ConstituencyAnalyticsProps {
  issues: CivicIssue[];
  constituency: string;
}

export default function ConstituencyAnalytics({ issues, constituency }: ConstituencyAnalyticsProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  // Filter issues of current constituency
  const localIssues = issues.filter(i => i.constituency === constituency);
  const total = localIssues.length;
  
  // Calculate specific states
  const resolvedCount = localIssues.filter(i => i.funnelState === "Resolved").length;
  const underConsiderationCount = localIssues.filter(i => i.funnelState === "Under Consideration").length;
  const inProgressCount = localIssues.filter(i => i.funnelState === "Dispatched/In Progress").length;
  const urgentCount = localIssues.filter(
    i => i.aiTriage?.triage_status === "Genuine_Urgent" && i.funnelState !== "Resolved" && i.funnelState !== "Rejected"
  ).length;
  
  // Total community upvotes (Engagement)
  const totalUpvotes = localIssues.reduce((acc, i) => acc + (i.votes || 0), 0);

  // Resolution Rate Percentage
  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  // Compute department statistics
  const depts = ["PWD", "Water", "Utilities", "Sanitation", "General"] as const;
  const departmentStats = depts.map(dept => {
    const deptIssues = localIssues.filter(i => i.department === dept);
    const deptTotal = deptIssues.length;
    const deptResolved = deptIssues.filter(i => i.funnelState === "Resolved").length;
    const rate = deptTotal > 0 ? Math.round((deptResolved / deptTotal) * 100) : 0;
    return { name: dept, total: deptTotal, resolved: deptResolved, rate };
  }).filter(d => d.total > 0); // only show departments with active reports

  // Determine top-performing department (highest resolution rate with at least 1 resolved issue)
  const topDept = [...departmentStats]
    .filter(d => d.resolved > 0)
    .sort((a, b) => b.rate - a.rate || b.resolved - a.resolved)[0];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200">
      {/* Header Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-slate-50/70 border-b border-slate-150 flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Constituency Metrics & Pulse
            </h4>
            <p className="text-[10px] font-mono text-slate-400">
              {total} ACTIVE TICKET{total !== 1 ? "S" : ""} REPORTED
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-600 border border-indigo-100/60 px-2 py-0.5 rounded">
            {resolutionRate}% RESOLVED
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expandable Dashboard Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              
              {/* Core Gauges Tray */}
              <div className="grid grid-cols-12 gap-3">
                {/* Circular Gauge Block */}
                <div className="col-span-5 bg-slate-50/80 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-100 relative">
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wider absolute top-2">
                    Resolution
                  </span>
                  <div className="relative w-16 h-16 mt-2 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        className="stroke-slate-200"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        className="stroke-indigo-600 transition-all duration-500"
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 * (1 - resolutionRate / 100)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-sm font-display font-black text-slate-800 leading-none">
                        {resolutionRate}%
                      </span>
                      <span className="text-[7px] text-slate-400 font-bold uppercase leading-none mt-0.5">
                        Rate
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid stats (Urgent, In Progress, Votes) */}
                <div className="col-span-7 grid grid-cols-2 gap-2">
                  <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex flex-col justify-between">
                    <p className="text-[8px] font-mono text-slate-400 uppercase leading-none">
                      Urgent Alerts
                    </p>
                    <div className="flex items-end justify-between mt-1">
                      <span className={`text-sm font-display font-black ${urgentCount > 0 ? "text-rose-500" : "text-slate-700"}`}>
                        {urgentCount}
                      </span>
                      {urgentCount > 0 ? (
                        <div className="relative flex h-2 w-2 mb-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </div>
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mb-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex flex-col justify-between">
                    <p className="text-[8px] font-mono text-slate-400 uppercase leading-none">
                      Active Crew
                    </p>
                    <div className="flex items-end justify-between mt-1">
                      <span className="text-sm font-display font-black text-slate-700">
                        {inProgressCount}
                      </span>
                      <Building2 className={`w-3.5 h-3.5 mb-0.5 ${inProgressCount > 0 ? "text-amber-500 animate-pulse" : "text-slate-400"}`} />
                    </div>
                  </div>

                  <div className="col-span-2 bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-mono text-slate-400 uppercase leading-none">
                        Community Support
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                        Total Citizen Upvotes
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-base font-display font-black text-indigo-600">
                        {totalUpvotes}
                      </span>
                      <Users className="w-4 h-4 text-indigo-500/80" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Department League & Outstanding Performance */}
              {departmentStats.length > 0 ? (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-slate-400">
                    <span>MUNICIPAL PERFORMANCE MATRIX</span>
                    <span>RESOLUTION RATE</span>
                  </div>
                  
                  <div className="space-y-2">
                    {departmentStats.map((dept) => (
                      <div key={dept.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            {dept.name} Department
                            <span className="text-[9px] font-mono text-slate-400 font-normal">
                              ({dept.resolved}/{dept.total} resolved)
                            </span>
                          </span>
                          <span className="font-mono font-bold text-slate-800">
                            {dept.rate}%
                          </span>
                        </div>
                        {/* Dynamic Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${dept.rate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Top Performer Badge */}
                  {topDept && (
                    <div className="mt-3 bg-emerald-50/60 border border-emerald-100/80 p-2.5 rounded-xl flex items-center gap-2">
                      <div className="p-1.5 bg-emerald-500 text-white rounded-lg shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-emerald-800 flex items-center gap-1 leading-tight">
                          Top Division: {topDept.name} Department
                          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                        </p>
                        <p className="text-[9px] text-emerald-600 leading-snug">
                          Led with {topDept.resolved} resolved cases ({topDept.rate}% efficiency rate). Outstanding civic support!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-2.5 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-[11px] text-slate-500">
                    No department workload logged yet in this constituency.
                  </p>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
