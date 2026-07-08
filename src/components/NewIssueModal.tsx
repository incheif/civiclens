import React from "react";
import { 
  X, 
  MapPin, 
  Paperclip, 
  ShieldCheck, 
  ShieldAlert, 
  Plus, 
  FileText, 
  Trash2, 
  ImageIcon, 
  Video as VideoIcon, 
  Loader2,
  Sparkles
} from "lucide-react";
import { STATE_CONSTITUENCIES, SupportingFile } from "../types";
import { motion } from "motion/react";

interface NewIssueModalProps {
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    constituency: string;
    isAnonymous: boolean;
    attachment: SupportingFile | null;
  }) => Promise<void>;
  defaultConstituency: string;
  userEmail: string;
  userName: string;
}

export default function NewIssueModal({
  onClose,
  onSubmit,
  defaultConstituency,
  userEmail,
  userName
}: NewIssueModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [constituency, setConstituency] = React.useState(defaultConstituency);
  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [attachment, setAttachment] = React.useState<SupportingFile | null>(null);
  
  const [isDragging, setIsDragging] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Read file and encode to base64
  const processFile = (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("File is too large. Maximum size is 8MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        name: file.name,
        type: file.type,
        data: reader.result as string,
        size: file.size
      });
      setErrorMsg("");
    };
    reader.onerror = () => {
      setErrorMsg("Failed to process attachment file.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      await onSubmit({
        title,
        description,
        constituency,
        isAnonymous,
        attachment
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit civic priority issue. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden z-10"
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-display font-bold text-slate-900 text-base leading-tight">
              Raise Civic Priority
            </h2>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Governance Ingestion Pipeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-lg text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Issue Title */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Priority Subject / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Severe water logging under Highway Sector 4 junction"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Issue Description */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Detailed Case Explanation <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a thorough explanation of the issue, current impacts, exact local landmarks, and why it requires immediate administration attention..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Constituency Picker */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Target Civic Constituency <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
              >
                {Object.entries(STATE_CONSTITUENCIES).map(([stateName, consList]) => (
                  <optgroup key={stateName} label={stateName} className="font-sans font-semibold text-slate-800">
                    {consList.map((c) => (
                      <option key={c} value={c} className="font-sans font-medium text-slate-600">
                        {c}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Accountable Anonymity System Toggle */}
          <div className="bg-slate-50/80 border border-slate-150 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Post Anonymously (Hide Identity)
                </span>
                <span className="text-[10px] text-slate-400 leading-none">
                  Strip real author references on ingestion
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
              </label>
            </div>

            {/* Privacy Strip notice overlay */}
            {isAnonymous ? (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-md p-2.5 flex items-start gap-2 text-[10px] leading-tight">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-emerald-900">Anonymization Shield Active</span>
                  Your email ({userEmail}) and profile metadata will be completely scrubbed before saving. Public priority feeds will see the author as <span className="font-semibold">"Anonymous Resident of {constituency}"</span>.
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 text-amber-800 border border-amber-100 rounded-md p-2.5 flex items-start gap-2 text-[10px] leading-tight">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-amber-900">Posting Identifiably</span>
                  The priority ticket will be logged under your verified profile account name <span className="font-semibold">{userName}</span> to promote community trust and accountability.
                </div>
              </div>
            )}
          </div>

          {/* Media Drag & Drop Attachment Area */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Supporting Files & Assets <span className="text-slate-400 text-[10px] font-normal">(Video, Image, or PDF - Max 8MB)</span>
            </label>

            {!attachment ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50/40"
                    : "border-slate-200 hover:bg-slate-50/50"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,video/*,application/pdf"
                  className="hidden"
                />
                <Paperclip className="w-6 h-6 text-slate-400 mb-1.5" />
                <p className="text-[11px] font-semibold text-slate-700 leading-tight">
                  Drag and drop local asset file or click to choose
                </p>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5 uppercase">
                  PNG, JPG, MP4, or PDF document
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded">
                    {attachment.type.startsWith("image/") && <ImageIcon className="w-5 h-5" />}
                    {attachment.type.startsWith("video/") && <VideoIcon className="w-5 h-5" />}
                    {attachment.type.includes("pdf") && <FileText className="w-5 h-5 text-rose-500" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 truncate max-w-[150px]">
                      {attachment.name}
                    </p>
                    <p className="text-[9px] font-mono text-slate-400 uppercase">
                      {(attachment.size ? attachment.size / (1024 * 1024) : 0).toFixed(2)} MB • {attachment.type.split("/")[1]}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 border border-slate-200 hover:border-rose-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* AI Automated Pipeline Warning Header */}
          <div className="bg-indigo-50/40 border border-indigo-100/30 p-2.5 rounded-lg text-[10px] text-indigo-800 flex items-center gap-1.5 leading-snug">
            <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            <p className="font-mono text-[9px]">
              AI ASSIST: Submissions are fed directly through our server-side Gemini 3.5 multi-modal classification gate to filter spam and auto-triage emergency triggers.
            </p>
          </div>

          {/* Sticky Submit Button Drawer */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 px-4 rounded-xl text-xs font-semibold transition-colors"
            >
              Discard Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:shadow-indigo-500/10 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Triaging Case...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Submit Case
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
