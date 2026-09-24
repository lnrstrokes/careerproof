import React, { useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, Search } from 'lucide-react';
import { NOC_2021_TECH_CODES } from '../data/nocDatabase';

export const NocDirectoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCode, setSelectedCode] = useState<string>(
    NOC_2021_TECH_CODES[0]?.code ?? '',
  );

  const filteredNocs = NOC_2021_TECH_CODES.filter(
    (noc) =>
      noc.code.includes(searchTerm) ||
      noc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noc.exampleTitles.some((t) =>
        t.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const activeNoc =
    NOC_2021_TECH_CODES.find((n) => n.code === selectedCode) ??
    NOC_2021_TECH_CODES[0];

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
          A small local reference list of NOC 2021 codes, titles, lead
          statements, and example titles. It is a starting point for
          classification thinking only. Always verify against the official
          Government of Canada NOC before relying on any code.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by NOC code, title, or example job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 shadow-inner"
          />
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

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredNocs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                No codes match your search.
              </p>
            ) : (
              filteredNocs.map((noc) => {
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
                    <div className="font-bold text-sm text-slate-100 leading-snug">
                      {noc.title}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {noc.leadStatement}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-slate-100">
          {activeNoc && (
            <>
              <div className="border-b border-slate-800 pb-5">
                <span className="text-2xl font-black text-sky-400 font-mono tracking-wide">
                  NOC {activeNoc.code}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {activeNoc.title}
                </h3>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Lead statement (local reference data)
                </h4>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 border-l-4 border-l-sky-500 text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;{activeNoc.leadStatement}&rdquo;
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Example main duties from the local reference entry</span>
                </h4>
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {activeNoc.mainDuties.map((duty, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start space-x-3"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span className="leading-relaxed">{duty}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Example job titles in this entry
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

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block text-amber-300">
                    This list is illustrative, not authoritative:
                  </span>
                  <p className="text-amber-200/90 leading-relaxed">
                    It covers only a handful of occupations. NOC classifications
                    are made against official lead statements and duty
                    descriptions, and only you (or an official determination)
                    can map real duties to a code. Verify at the Government of
                    Canada NOC website.
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
