import React, { useState, useRef } from "react";
import { Bold, Italic, List, RefreshCw, Eye, Code, CheckSquare } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Enter official response..." }: RichTextEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert HTML tags at cursor position
  const insertTag = (startTag: string, endTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = startTag + (selectedText || "text") + endTag;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    // Refocus and select the inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, start + startTag.length + (selectedText || "text").length);
    }, 10);
  };

  const handleBold = () => insertTag("<strong>", "</strong>");
  const handleItalic = () => insertTag("<em>", "</em>");
  const handleList = () => insertTag("<ul>\n  <li>", "</li>\n</ul>");

  // Official Response Presets
  const applyTemplate = (type: "dispatched" | "completed" | "delayed") => {
    let template = "";
    if (type === "dispatched") {
      template = `<p><strong>Crew Dispatched:</strong> Municipal emergency task force has been mobilized to the site.</p><ul><li>Inspection completed at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</li><li>Equipment deployed: heavy tactical repair truck</li><li>Target repair duration: 4 hours</li></ul>`;
    } else if (type === "completed") {
      template = `<p><strong>Resolution Confirmed:</strong> Maintenance completed successfully.</p><ul><li>Rupture sealed / site stabilized</li><li>Tested and verified in full compliance with safety codes</li><li>Site cleaned and reopened to the general public</li></ul>`;
    } else if (type === "delayed") {
      template = `<p><strong>Pending Evaluation:</strong> Requires specialized technical inspection.</p><p><em>Notice:</em> A temporary barricade has been erected. Full structural excavation scheduled for tomorrow morning.</p>`;
    }
    onChange(template);
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
      {/* Formatting Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 gap-1.5 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleBold}
            disabled={isPreviewMode}
            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 disabled:opacity-40 transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleItalic}
            disabled={isPreviewMode}
            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 disabled:opacity-40 transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleList}
            disabled={isPreviewMode}
            className="p-1.5 rounded-md text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 disabled:opacity-40 transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <span className="h-4 w-px bg-slate-200 mx-1.5"></span>

          {/* Quick presets */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => applyTemplate("dispatched")}
              disabled={isPreviewMode}
              className="px-2 py-1 text-[10px] font-bold tracking-wide uppercase rounded-md border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors"
            >
              Dispatch
            </button>
            <button
              type="button"
              onClick={() => applyTemplate("completed")}
              disabled={isPreviewMode}
              className="px-2 py-1 text-[10px] font-bold tracking-wide uppercase rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              Complete
            </button>
          </div>
        </div>

        {/* Preview toggle */}
        <button
          type="button"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
            isPreviewMode
              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          {isPreviewMode ? (
            <>
              <Code className="w-3.5 h-3.5" />
              Edit HTML
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              Live Preview
            </>
          )}
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="relative">
        {isPreviewMode ? (
          <div className="min-h-[140px] max-h-[220px] overflow-y-auto p-4 bg-slate-50/50 prose prose-slate prose-sm max-w-none">
            {value.trim() ? (
              <div 
                className="text-xs text-slate-700 space-y-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: value }} 
              />
            ) : (
              <p className="text-xs text-slate-400 italic">No response preview available. Start typing above.</p>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[140px] max-h-[220px] p-3 text-xs font-mono text-slate-700 placeholder-slate-400 focus:outline-hidden bg-transparent border-none resize-y"
          />
        )}
      </div>
    </div>
  );
}
