import React, { useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, ExternalLink, Search } from 'lucide-react';
import { NOC_2021_REFERENCE } from '../data/nocDatabase';
import type { NocCodeInfo } from '../types';

/**
 * NOC reference browser. The data is a curated subset of the official NOC
 * 2021 classification; every entry links to its official ESDC profile so
 * users can verify it. Nothing on this page is generated.
 */

const CATEGORY_ORDER = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
] as const;

const TEER_LABELS: Record<number, string> = {
  0: 'TEER 0 - management',
  1: 'TEER 1 - university degree',
  2: 'TEER 2 - college/technical or supervisory',
  3: 'TEER 3 - college/apprenticeship',
  4: 'TEER 4 - secondary school or on-the-job',
  5: 'TEER 5 - short demonstration or no formal education',
};

export const NocDirectoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string>(
    NOC_2021_REFERENCE[0]?.code ?? '',
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const noc of NOC_2021_REFERENCE) {
      counts.set(noc.category, (counts.get(noc.category) ?? 0) + 1);
    }
    return counts;
  }, []);

  const categoryLabelById = useMemo(() => {
    const labels = new Map<string, string>();
    for (const noc of NOC_2021_REFERENCE) {
      if (!labels.has(noc.category)) labels.set(noc.category, noc.categoryLabel);
    }
    return labels;
  }, []);

  const filteredNocs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return NOC_2021_REFERENCE.filter((noc) => {
      if (activeCategory && noc.category !== activeCategory) return false;
      if (!q) return true;
      return (
        noc.code.includes(q) ||
        noc.title.toLowerCase().includes(q) ||
        noc.exampleTitles.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchTerm, activeCategory]);

  const activeNoc: NocCodeInfo | undefined =
    NOC_2021_REFERENCE.find((n) => n.code === selectedCode) ??
    filteredNocs[0] ??
    NOC_2021_REFERENCE[0];

  const grouped =
    activeCategory === null
      ? (Object.entries(
          filteredNocs.reduce<Record<string, NocCodeInfo[]>>((acc, noc) => {
            (acc[noc.category] ??= []).push(noc);
            return acc;
          }, {}),
        ) as Array<[string, NocCodeInfo[]]>)
          .sort((a, b) => a[0].localeCompare(b[0]))
      : [[activeCategory, filteredNocs] as [string, NocCodeInfo[]]];

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-300 text-xs font-semibold w-fit">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reference data - candidates, never conclusions</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
          National Occupational Classification (NOC 2021) Reference
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          A categorized reference set of {NOC_2021_REFERENCE.length} NOC 2021
          occupations across all ten broad categories - from management,
          business, and health to trades, sales, agriculture, and
          manufacturing. Titles and lead statements come from the official NOC
          2021 dataset, and every entry links to its official profile for
          verification. This list is a starting point for classification
          thinking, never a determination.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by NOC code, title, or example job title (e.g. nurse, welder, accountant)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 shadow-inner"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
              activeCategory === null
                ? 'bg-sky-950 border-sky-500 text-sky-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            All ({NOC_2021_REFERENCE.length})
          </button>
          {CATEGORY_ORDER.filter((c) => categoryCounts.has(c)).map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition text-left ${
                  isActive
                    ? 'bg-sky-950 border-sky-500 text-sky-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
                title={categoryLabelById.get(cat)}
              >
                {cat} · {categoryLabelById.get(cat)} (
                {categoryCounts.get(cat)})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Reference codes ({filteredNocs.length})
            </h3>
            <span className="text-[11px] text-sky-400 font-medium">
              Click to inspect
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredNocs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                No codes match your search. This reference set is a curated
                subset of NOC 2021 - the official directory covers all 500+
                unit groups.
              </p>
            ) : (
              grouped.map(([cat, nocs]) => (
                <div key={cat} className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 sticky top-0 bg-slate-900 py-1">
                    {cat} · {categoryLabelById.get(cat)}
                  </div>
                  {nocs.map((noc) => {
                    const isSelected = selectedCode === noc.code;
                    return (
                      <button
                        key={noc.code}
                        onClick={() => setSelectedCode(noc.code)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                          isSelected
                            ? 'bg-sky-950/70 border-sky-500 text-sky-100 shadow-md'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-slate-900 border border-sky-800/50 inline-block">
                          NOC {noc.code}
                        </span>
                        <span className="ml-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                          {TEER_LABELS[noc.teer]?.split(' - ')[0] ??
                            `TEER ${noc.teer}`}
                        </span>
                        <div className="font-bold text-sm text-slate-100 leading-snug">
                          {noc.title}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {noc.leadStatement}
                        </p>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-slate-100">
          {activeNoc && (
            <>
              <div className="border-b border-slate-800 pb-5 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-2xl font-black text-sky-400 font-mono tracking-wide">
                    NOC {activeNoc.code}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {TEER_LABELS[activeNoc.teer] ?? `TEER ${activeNoc.teer}`}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Category {activeNoc.category} ·{' '}
                    {activeNoc.categoryLabel}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {activeNoc.title}
                </h3>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Official lead statement (NOC 2021)
                </h4>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 border-l-4 border-l-sky-500 text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;{activeNoc.leadStatement}&rdquo;
                </div>
              </div>

              {activeNoc.exampleTitles.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Common job titles people search for
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNoc.exampleTitles.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={activeNoc.profileUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-sky-700 hover:bg-sky-600 text-white text-xs font-bold shadow transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open the official NOC profile to verify</span>
              </a>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block text-amber-300">
                    Reference data, not a determination:
                  </span>
                  <p className="text-amber-200/90 leading-relaxed">
                    This set is a curated subset of the official classification,
                    and the &ldquo;common job titles&rdquo; labels above are
                    informal search helpers, not part of the official entry.
                    NOC classifications are made against official lead
                    statements and duty descriptions - only you (or an official
                    determination) can map real duties to a code. Always verify
                    at the official NOC profile linked above.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
