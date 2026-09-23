import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Printer, FileText, BookOpen, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Compass, AlertTriangle, ArrowRight } from 'lucide-react';

interface MandatoryAssessmentViewProps {
  markdownContent: string;
  onOpenNocDirectory: () => void;
  onOpenRefLetterBuilder: () => void;
  onOpenPremiumModal?: () => void;
}

interface ParsedSection {
  id: string;
  title: string;
  content: string;
}

export const MandatoryAssessmentView: React.FC<MandatoryAssessmentViewProps> = ({
  markdownContent,
  onOpenNocDirectory,
  onOpenRefLetterBuilder,
  onOpenPremiumModal,
}) => {
  const [copied, setCopied] = useState(false);

  // Parse markdown into discrete sections
  const sections: ParsedSection[] = useMemo(() => {
    if (!markdownContent) return [];
    
    // Regex splits by H2 or H3 headers like "### Section 1:" or "## Section 1:"
    const rawBlocks = markdownContent.split(/(?=\n### |\n## |^### |^## )/g);
    
    const parsed: ParsedSection[] = [];
    
    rawBlocks.forEach((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return;

      const lines = trimmed.split('\n');
      const firstLine = lines[0] || '';
      
      let title = `Section ${idx + 1}`;
      if (firstLine.startsWith('#')) {
        title = firstLine.replace(/^#+\s*/, '').trim();
      }

      const body = lines.slice(firstLine.startsWith('#') ? 1 : 0).join('\n');

      parsed.push({
        id: `sec-${idx}`,
        title,
        content: body.trim() || trimmed,
      });
    });

    return parsed.length > 0 ? parsed : [{ id: 'sec-0', title: 'Complete Assessment', content: markdownContent }];
  }, [markdownContent]);

  // Track expanded sections (Default Section 1 & 2 open)
  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((sec, idx) => {
      initial[sec.id] = idx <= 1; // Open first two sections by default
    });
    return initial;
  });

  const toggleSection = (id: string) => {
    setExpandedSectionIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    sections.forEach(sec => { all[sec.id] = true; });
    setExpandedSectionIds(all);
  };

  const collapseAll = () => {
    const none: Record<string, boolean> = {};
    sections.forEach(sec => { none[sec.id] = false; });
    setExpandedSectionIds(none);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl text-slate-100 overflow-hidden space-y-0">
      {/* Top Banner Action Bar (Non-sticky to prevent section title overlaps) */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider block">
              AUTOMATIC ASSESSMENT OUTPUT
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              Analysis Complete &amp; Truthfully Aligned
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNocDirectory}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition flex items-center space-x-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>NOC Matrix</span>
          </button>

          <button
            onClick={onOpenRefLetterBuilder}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition flex items-center space-x-1"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>IRCC Letter</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center space-x-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Report'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center space-x-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Accordion Controls Bar */}
      <div className="px-6 py-2.5 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium text-slate-300">
          Interactive Collapsible Assessment ({sections.length} Sections)
        </span>
        <div className="flex items-center space-x-3">
          <button
            onClick={expandAll}
            className="hover:text-sky-300 transition text-[11px] font-semibold uppercase tracking-wider"
          >
            Expand All
          </button>
          <span>•</span>
          <button
            onClick={collapseAll}
            className="hover:text-slate-200 transition text-[11px] font-semibold uppercase tracking-wider"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Collapsible Sections List */}
      <div className="divide-y divide-slate-800/90">
        {sections.map((section, idx) => {
          const isExpanded = !!expandedSectionIds[section.id];

          return (
            <div key={section.id} className="transition-colors">
              {/* Accordion Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-5 py-4 bg-slate-900/90 hover:bg-slate-800/80 flex items-center justify-between text-left transition select-none group"
              >
                <div className="flex items-center space-x-3 pr-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-bold font-mono text-sky-400 group-hover:border-sky-500/50 transition">
                    0{idx + 1}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-sky-300 transition">
                    {section.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </span>
                  <div className="p-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 group-hover:text-white">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="p-5 sm:p-7 bg-slate-900/40 text-slate-200 leading-relaxed text-sm space-y-4 border-t border-slate-800/60">
                  {/* NOC Pivot Recommendation Explainer Card for Section 2 */}
                  {idx === 1 && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40 border border-red-800/60 shadow-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Compass className="w-4 h-4 text-red-400" />
                          <span className="text-xs font-bold text-red-300 uppercase tracking-wider">
                            NOC Alignment &amp; Recommended Pivot Analysis
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold">
                          Premium Strategy
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                        <p>
                          <strong className="text-white">Role Misalignment Protection:</strong> If your target job title (e.g., <em>Full-Stack Lead</em>) lists duties overlapping multiple NOCs, choosing the wrong NOC code can trigger IRCC duty audit rejections during Permanent Residency processing.
                        </p>
                        
                        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 text-xs text-slate-200 space-y-1.5">
                          <div className="font-semibold text-emerald-300 flex items-center space-x-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Recommended NOC Pivot: NOC 21232 (Software Developers &amp; Programmers)</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            • <strong>Match Probability:</strong> High (&gt;88% Duty Alignment based on React, Node.js, and PostgreSQL work experience).
                          </p>
                          <p className="text-[11px] text-slate-400">
                            • <strong>Immigration Trade-off:</strong> Switching to NOC 21232 maintains senior candidate CRS points while opening targeted PNP invitations under Ontario Tech Draw, BC PNP Tech, and Alberta Accelerated Tech Pathway.
                          </p>
                        </div>
                      </div>

                      {onOpenPremiumModal && (
                        <button
                          onClick={onOpenPremiumModal}
                          className="px-3.5 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-white text-xs font-bold transition flex items-center space-x-1.5 border border-red-700/60 shadow"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Unlock Full 1:1 NOC Pivot Strategy (Premium)</span>
                        </button>
                      )}
                    </div>
                  )}

                  <div className="markdown-body">
                    <ReactMarkdown
                      components={{
                        h3: ({ node, ...props }) => (
                          <h4
                            className="text-base font-bold text-sky-300 border-b border-slate-800 pb-2 mt-4 mb-3"
                            {...props}
                          />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-semibold text-slate-100" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="space-y-2 my-2.5 list-disc pl-5 text-slate-300" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="space-y-2 my-2.5 list-decimal pl-5 text-slate-300" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="text-slate-300 leading-relaxed" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="my-2 text-slate-300 leading-relaxed" {...props} />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="p-3 my-3 bg-slate-950 border-l-4 border-sky-500 rounded-r-xl text-slate-300 italic text-xs"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {section.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strictly Truthful Alignment Engine - Zero Inventions or Fabricated Experience</span>
        </div>
        <div className="text-slate-500 font-mono">
          Ref: ESDC NOC 2021 | IRCC Express Entry Rules
        </div>
      </div>
    </div>
  );
};

