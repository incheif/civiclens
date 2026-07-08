import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Cpu, 
  Users, 
  Database, 
  CheckCircle2, 
  Play, 
  Presentation, 
  Sparkles, 
  TrendingUp, 
  CheckCircle,
  FileText,
  Clock,
  Layout,
  Terminal,
  MapPin,
  ArrowRight,
  Printer
} from "lucide-react";

interface HackathonSlidesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HackathonSlides({ isOpen, onClose }: HackathonSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPrintView, setIsPrintView] = useState(false);

  const slides = [
    // Slide 1: Cover / Introduction
    {
      title: "CivicLens",
      subtitle: "Democratic Priority Ranking & AI-Enhanced Civic Triage",
      tag: "Hackathon Pitch Deck",
      bg: "from-slate-900 via-indigo-950 to-slate-900",
      content: (
        <div className="flex flex-col items-center justify-center text-center h-full space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-mono font-semibold uppercase tracking-widest animate-pulse">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Track: People's Priorities
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white font-display">
            Civic<span className="text-indigo-400">Lens</span>
          </h1>
          <p className="text-slate-300 max-w-xl text-sm md:text-base leading-relaxed">
            Bridging the gap between grassroots public advocacy and municipal response. A mobile-first, full-stack, AI-orchestrated community coordination platform.
          </p>
          <div className="flex items-center gap-3 pt-4">
            <span className="text-xs font-mono text-indigo-300/80 border border-indigo-500/30 px-3 py-1 rounded bg-indigo-500/5">
              React 18 + Express
            </span>
            <span className="text-xs font-mono text-purple-300/80 border border-purple-500/30 px-3 py-1 rounded bg-purple-500/5">
              Gemini LLM Pipeline
            </span>
            <span className="text-xs font-mono text-emerald-300/80 border border-emerald-500/30 px-3 py-1 rounded bg-emerald-500/5">
              Optimistic UI State
            </span>
          </div>
          <div className="pt-6 text-xs text-slate-400 font-medium">
            Use the keyboard <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">→</kbd> keys or click controls below to navigate.
          </div>
        </div>
      )
    },
    // Slide 2: The Core Grievance Landscape
    {
      title: "The Problem We Are Solving",
      subtitle: "Why Civic Engagement Often Fails Today",
      tag: "The Challenge",
      bg: "from-slate-900 to-slate-950",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
              <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                1. Administrative Information Black Hole
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                When residents lodge public complaints, tickets disappear into archaic databases. Citizens have zero visibility into where their ticket sits or if an MP has even seen it.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                2. Lack of Collective Coordination
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Problems are submitted in silos. Multiple neighbors file identical reports of a water pipe leak. This causes duplicate municipal workloads and fragments community voice.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2">
              <h4 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                3. Sluggish Municipal Triaging
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Manual reading, filtering, and dispatching of reports takes days. Serious hazards are buried under low-priority or spam requests, leading to dangerous service delays.
              </p>
            </div>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 space-y-4 self-center">
            <h3 className="text-base font-bold text-white">Impact on the Common Citizen</h3>
            <blockquote className="border-l-2 border-indigo-500 pl-4 text-xs italic text-slate-300 leading-relaxed">
              "A ruptured water main flooded our market junction at 4 AM. It took 3 days and 15 distinct complaints from different neighbors before the municipal squad arrived, wasting thousands of liters. There was no single place to upvote and escalate it."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Dhruv Gupta</p>
                <p className="text-[10px] text-slate-400">Delhi Constituent</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 3: The CivicLens Solution
    {
      title: "The CivicLens Framework",
      subtitle: "Empowering People’s Priorities Transparently",
      tag: "The Solution",
      bg: "from-slate-900 to-indigo-950",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center h-full">
          <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl text-center space-y-3 flex flex-col justify-between h-[300px]">
            <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1 pt-3">
              <h3 className="text-sm font-bold text-white">1. Democratic Priority Feed</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A localized, mobile-first social wall where constituents raise, browse, and upvote neighborhood priorities. Zero noise, high focus.
              </p>
            </div>
            <div className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 py-1 rounded">
              Localised Streams
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl text-center space-y-3 flex flex-col justify-between h-[300px] ring-2 ring-indigo-500/30">
            <div className="mx-auto w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1 pt-3">
              <h3 className="text-sm font-bold text-white">2. AI-Orchestrated Triage</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Powered by Gemini. Instantly filters spam, extracts keywords, maps issues to sectors, rates urgency, and generates actionable task blueprints.
              </p>
            </div>
            <div className="text-[10px] font-mono text-purple-400 bg-purple-500/10 py-1 rounded">
              Zero-Wait Smart Parsing
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-2xl text-center space-y-3 flex flex-col justify-between h-[300px]">
            <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Terminal className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1 pt-3">
              <h3 className="text-sm font-bold text-white">3. MP Representative Console</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A command terminal for lawmakers to verify issues, issue official updates, track response analytics, and mark items as Resolved.
              </p>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 py-1 rounded">
              Direct MP Feedback
            </div>
          </div>
        </div>
      )
    },
    // Slide 4: Website Architecture
    {
      title: "System & Data Flow Architecture",
      subtitle: "Robust, High-Performance Full-Stack Mechanics",
      tag: "Architecture",
      bg: "from-slate-900 via-slate-950 to-slate-900",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-center">
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-base font-bold text-white">Full-Stack Blueprint</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We choose a solid full-stack design built on **Express** and **React SPA** with a shared JSON database layer, enabling instantaneous, reliable data writes.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-200"><strong>Optimistic UI Upvotes:</strong> Increment locally instantly, sync to Express asynchronously. Roll back on failure.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-200"><strong>Admin Security:</strong> Badge validation checks block unauthorized status changes.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-200"><strong>Durable Persistence:</strong> Read/Write transactional updates to server storage.</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[9px] text-slate-300 leading-normal max-h-[320px] overflow-y-auto">
            <div className="text-indigo-400 font-bold mb-2">// CORE ARCHITECTURAL MAP</div>
            <div>[REACT SPA CLIENT (Mobile-First Viewport)]</div>
            <div className="text-slate-500 pl-4">└── State: Optimistic Public Upvote Tracker (Local state updates in 1ms)</div>
            <div className="text-slate-500 pl-4">└── Components: AdminTerminal, Interactive Analytics, Live Feed Channels</div>
            <div className="text-slate-500 pl-4">└── API Hookup: Transmits JSON payloads via native fetch requests</div>
            <div className="mt-2">[EXPRESS NODE.JS SERVER]</div>
            <div className="text-slate-500 pl-4">├── Static Assets: Serves compiled SPA bundle in production mode</div>
            <div className="text-slate-500 pl-4">├── API Proxies: /api/priorities, /api/priorities/:id/vote, /api/priorities/:id/resolve</div>
            <div className="text-slate-500 pl-4">└── Authentication Guard: Re-authenticates MP requests before status updates</div>
            <div className="mt-2">[GOOGLE GENAI COUPLING (Gemini Model 3.5)]</div>
            <div className="text-slate-500 pl-4">└── Server-side system instruction maps inputs to valid, strictly bounded JSON objects</div>
            <div className="mt-2">[PERSISTENT STORAGE]</div>
            <div className="text-slate-500 pl-4">└── File-based JSON database (db.json) ensures persistence of votes, comments, and resolutions</div>
          </div>
        </div>
      )
    },
    // Slide 5: The Agentic Triage Pipeline
    {
      title: "The Agentic Triage Pipeline",
      subtitle: "Turning Scattered Grievances into Structured Priorities",
      tag: "The AI Engine",
      bg: "from-slate-900 to-indigo-950",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-bold">Natural Language Ingestion</h4>
                <p className="text-xs text-slate-200">Constituent submits complaint in informal, everyday words.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-bold">Gemini-Powered Verification</h4>
                <p className="text-xs text-slate-200">The server calls Gemini with strict JSON Schema constraints. Spams and joke ideas (e.g. 'AC glass dome over Delhi') are flagged instantly.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-bold">Automatic Categorization & Urgency Check</h4>
                <p className="text-xs text-slate-200">Grievances are tagged (e.g., Road Safety, Water Leak) and prioritized (Genuine_Urgent, Genuine_Standard, Fun, Spam).</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-bold">Synthesized Action Blueprint</h4>
                <p className="text-xs text-slate-200">The agent pre-generates a detailed checklist (such as isolated bypass valves or pressure locks) for the MP to dispatch.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 self-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Real-time AI JSON Payload</span>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">Schema Match</span>
            </div>
            <pre className="text-[10px] font-mono text-slate-300 leading-normal overflow-x-auto max-h-[180px]">
{`{
  "triage_status": "Genuine_Urgent",
  "english_summary": "Major electrical failure on the streetlights...",
  "tags": [
    "Electricity",
    "Public Safety",
    "Andheri"
  ],
  "actionPlan": [
    "Inspect failed armored power conduits",
    "Replace 4 failed high-intensity LED light fixtures",
    "Secure open metal cabinet gates"
  ]
}`}
            </pre>
            <div className="text-[10px] text-slate-400 italic">
              *The JSON output matches our TypeScript schemas perfectly, preventing runtime crashes.
            </div>
          </div>
        </div>
      )
    },
    // Slide 6: Democratic Lifecycle Mechanics
    {
      title: "Democratic Lifecycle Mechanics",
      subtitle: "How Grievances Progress to Solutions",
      tag: "The Governance Loop",
      bg: "from-slate-900 to-slate-950",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">The Five-Upvote Trigger Loop</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To prevent individual bias or administrative favoritism, we introduced a democratic threshold mechanism.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                <p className="text-xs text-slate-300"><strong>Recently Raised:</strong> All submissions enter here immediately after undergoing AI screening.</p>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                <p className="text-xs text-slate-300"><strong>Under Consideration:</strong> When an issue hits <strong>5 public upvotes</strong>, the database triggers an instant escalation, pushing the ticket into active consideration.</p>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                <p className="text-xs text-slate-300"><strong>Resolved State:</strong> The local MP uses their Representative Dashboard to post a detailed resolution summary, closing the ticket permanently.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800/80 space-y-4 self-center">
            <h4 className="text-sm font-bold text-white">Interactive Representative Profiles</h4>
            <p className="text-xs text-slate-400">
              Delhi constituencies are mapped to official administrative profiles. This keeps communication localized and actionable.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-slate-800/50 border border-slate-700/40 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">CC</div>
                <div>
                  <p className="font-semibold text-slate-200">Chandni Chowk</p>
                  <p className="text-[10px] text-slate-400">Hon. Rajesh Vardhan</p>
                </div>
              </div>
              <div className="p-2.5 rounded bg-slate-800/50 border border-slate-700/40 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">ED</div>
                <div>
                  <p className="font-semibold text-slate-200">East Delhi</p>
                  <p className="text-[10px] text-slate-400">Hon. G. Gambhir</p>
                </div>
              </div>
              <div className="p-2.5 rounded bg-slate-800/50 border border-slate-700/40 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">ND</div>
                <div>
                  <p className="font-semibold text-slate-200">New Delhi</p>
                  <p className="text-[10px] text-slate-400">Hon. Dhruv Gupta</p>
                </div>
              </div>
              <div className="p-2.5 rounded bg-slate-800/50 border border-slate-700/40 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">SD</div>
                <div>
                  <p className="font-semibold text-slate-200">South Delhi</p>
                  <p className="text-[10px] text-slate-400">Hon. R. Bidhuri</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 7: Non-Tech Snapshot Gallery
    {
      title: "Interactive Snapshot Tour",
      subtitle: "Simple, Visual, and High-Performance Interface Design",
      tag: "Visual Design",
      bg: "from-slate-900 to-indigo-950",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Citizen Mobile PWA Layout</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Designed desktop-first with extreme mobile-first viewport constraints. Fits beautifully inside an iframe as a native smartphone application mock-up.
            </p>
            <div className="space-y-3 font-mono text-[11px] text-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span><strong>Header Segment:</strong> Shows active region and simple Switcher.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span><strong>Pulse Dashboard:</strong> Visual indicators of current neighborhood health.</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span><strong>Ingestion FAB:</strong> Floating button triggers seamless slide-up modals.</span>
              </div>
            </div>
          </div>
          <div className="border border-slate-800 rounded-2xl bg-slate-950 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-mono text-slate-500">PWA PORTRAIT MOCKUP</span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-mono tracking-widest bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">
                  Genuine_Urgent
                </span>
                <span className="text-[10px] font-mono text-slate-400">🔥 42 Votes</span>
              </div>
              <h5 className="text-xs font-bold text-slate-100">Ruptured high-pressure water main flooding underpass</h5>
              <p className="text-[10px] text-slate-300 line-clamp-2">
                Water has been gushing out of a primary main joint since 4 AM, creating severe gridlock and eroding the road foundation.
              </p>
              <div className="flex items-center justify-between text-[9px] font-mono text-indigo-400 pt-2 border-t border-slate-800">
                <span>📍 New Delhi Division</span>
                <span>Active 5-Upvote Escalation</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 8: The Hackathon Value Proposition
    {
      title: "Why CivicLens Will Win",
      subtitle: "Hackathon Value Proposition & Future Milestones",
      tag: "Value Proposition",
      bg: "from-slate-900 via-slate-950 to-slate-900",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1.5">
              <h4 className="text-xs uppercase font-mono text-indigo-400 font-bold">🚀 Immediate Community Value</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connects fragmented neighbor reports into unified public priorities. Upvoting guarantees that officials see what communities truly care about, ending duplicate efforts.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1.5">
              <h4 className="text-xs uppercase font-mono text-purple-400 font-bold">⚡ Lightweight & Scalable</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                No heavyweight relational database required. Leverages super-fast, clean file-based JSON persistence, reducing infrastructure costs to near zero while maintaining fast lookups.
              </p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1.5 self-center">
            <h4 className="text-xs uppercase font-mono text-emerald-400 font-bold">🛣️ Future Roadmap</h4>
            <ul className="space-y-2 pt-2">
              <li className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Geofencing limits report submittals strictly to resident GPS bounds.</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp Notification Webhooks alert neighbors on local resolution.</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Municipal field engineer dashboards with offline sync capability.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    // Slide 9: Thank You / Summary
    {
      title: "Thank You!",
      subtitle: "Let's Build Better Constituencies Together",
      tag: "Conclusion",
      bg: "from-slate-900 via-indigo-950 to-slate-900",
      content: (
        <div className="flex flex-col items-center justify-center text-center h-full space-y-6">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Presentation className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Democratizing Local Governance
          </h1>
          <p className="text-slate-300 max-w-lg text-xs md:text-sm leading-relaxed">
            CivicLens puts power back in the hands of citizens. Through democratic upvoting and lightning-fast AI triage, we turn public grievances into immediate priorities for Members of Parliament.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-98"
            >
              Explore Live App Now
            </button>
            <button
              onClick={() => setCurrentSlide(0)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-6 py-2.5 rounded-xl border border-slate-700 transition-all active:scale-98"
            >
              Restart Pitch Deck
            </button>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, isOpen]);

  if (!isOpen) return null;

  if (isPrintView) {
    return (
      <div id="print-deck-wrapper" className="fixed inset-0 z-50 overflow-y-auto bg-slate-900 text-slate-100 p-4 md:p-8 print:bg-slate-950 print:text-slate-100">
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            html, body {
              background: #020617 !important;
              color: #f1f5f9 !important;
              margin: 0 !important;
              padding: 0 !important;
              height: auto !important;
              overflow: visible !important;
            }
            #root > div > *:not(#print-deck-wrapper) {
              display: none !important;
            }
            #print-deck-wrapper {
              display: block !important;
              position: relative !important;
              width: 100% !important;
              height: auto !important;
              overflow: visible !important;
              padding: 0 !important;
              margin: 0 !important;
              background: #020617 !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .printable-slide-card {
              page-break-after: always !important;
              break-after: page !important;
              height: 100vh !important;
              box-sizing: border-box !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              padding: 3rem !important;
              overflow: hidden !important;
              background: linear-gradient(to bottom right, #0f172a, #1e1b4b, #0f172a) !important;
            }
          }
        `}} />
        {/* Top Control Bar (Hidden in Print) */}
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-slate-800 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div>
            <h3 className="font-bold text-white flex items-center gap-2 text-sm">
              <Printer className="w-5 h-5 text-indigo-400" />
              Print / Save Pitch Deck as PDF
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Select <strong>"Save as PDF"</strong> as the destination in the print dialog. Ensure <strong>"Background graphics"</strong> is checked to keep the beautiful slide colors!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" /> Open Print Dialog
            </button>
            <button
              onClick={() => setIsPrintView(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl active:scale-95 transition-all"
            >
              Back to Presentation
            </button>
          </div>
        </div>

        {/* Printable Slides */}
        <div className="max-w-4xl mx-auto space-y-8 print:space-y-0">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`w-full min-h-[500px] flex flex-col rounded-3xl p-8 md:p-12 shadow-md border border-slate-850 bg-gradient-to-br ${slide.bg} printable-slide-card`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 print:border-slate-800">
                <span className="text-xs uppercase font-mono tracking-widest bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded font-bold">
                  {slide.tag}
                </span>
                <span className="text-slate-500 text-xs font-mono">
                  Slide {index + 1} of {slides.length}
                </span>
              </div>
              
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-sm text-indigo-300/85 font-medium mt-1">
                  {slide.subtitle}
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                {slide.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 md:p-8">
      <div className={`w-full max-w-4xl h-[90vh] md:h-[80vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-gradient-to-br ${slides[currentSlide].bg} transition-all duration-700`}>
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] uppercase font-mono tracking-widest bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded font-bold">
              {slides[currentSlide].tag}
            </span>
            <span className="text-slate-500 text-xs font-mono">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPrintView(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-xs font-semibold"
              title="Print/Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print/PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title="Close Presentation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body with smooth slide transitions */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto relative min-h-0 flex flex-col justify-between">
          <div className="space-y-1.5 shrink-0">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xs md:text-sm text-indigo-300/85 font-medium">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          <div className="flex-1 py-4 md:py-6 flex flex-col justify-center min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="h-full min-h-0"
              >
                {slides[currentSlide].content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-950/50 flex items-center justify-between shrink-0">
          <div className="flex gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-8 bg-indigo-500" : "w-1.5 bg-slate-700 hover:bg-slate-600"
                }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`p-2 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all ${
                currentSlide === 0 ? "opacity-30 cursor-not-allowed" : "active:scale-95"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className={`flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all ${
                currentSlide === slides.length - 1 ? "opacity-30 cursor-not-allowed" : "active:scale-95"
              }`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
