import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, ExternalLink, Briefcase, FileText, ArrowRight, ShieldCheck, Compass, MapPin, Sparkles } from 'lucide-react';
import { NOC_2021_TECH_CODES } from '../data/nocDatabase';

interface NocDirectoryPageProps {
  onSelectNocForRefLetter?: (nocCode: string) => void;
  onOpenPremiumModal?: () => void;
}

export const NocDirectoryPage: React.FC<NocDirectoryPageProps> = ({
  onSelectNocForRefLetter,
  onOpenPremiumModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCode, setSelectedCode] = useState<string>('21232');

  const filteredNocs = NOC_2021_TECH_CODES.filter(noc =>
    noc.code.includes(searchTerm) ||
    noc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    noc.exampleTitles.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeNoc = NOC_2021_TECH_CODES.find(n => n.code === selectedCode) || NOC_2021_TECH_CODES[0];

  return (
    <div className="space-y-6">
      {/* Page Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-300 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>NOC 2021 Directory &amp; Provincial Alignment Matrix</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">ESDC 2021 Release • TEER 0, 1, 2, 3</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
          National Occupational Classification (NOC 2021) Directory
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          IRCC immigration officers evaluate Permanent Residency applications against specific NOC lead statements and main duties. Explore tech NOC codes, verify duty compliance, and understand why your profile fits specific Canadian Provincial Nominee Programs (PNP).
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by NOC code (e.g. 21232), title (e.g. Software Developer), or skill keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 shadow-inner"
          />
        </div>
      </div>

      {/* Main Grid: Code Selector Sidebar + Wide Detailed Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* NOC Codes Selection Panel (4 Cols on lg) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Tech NOC Code ({filteredNocs.length})
            </h3>
            <span className="text-[11px] text-sky-400 font-medium">Click to inspect</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredNocs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No NOC codes match your search term.</p>
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
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sky-400 px-2 py-0.5 rounded bg-slate-900 border border-sky-800/50">
                        NOC {noc.code}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800/60">
                        TEER {noc.teer}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-100 leading-snug">{noc.title}</div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {noc.leadStatement}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Spacious Main Details Area (8 Cols on lg) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 text-slate-100">
          {activeNoc && (
            <>
              {/* Active Header Block */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-black text-sky-400 font-mono tracking-wide">
                      NOC {activeNoc.code}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      TEER {activeNoc.teer} • High Skilled Express Entry Eligible
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                    {activeNoc.title}
                  </h3>
                </div>

                {onSelectNocForRefLetter && (
                  <button
                    onClick={() => onSelectNocForRefLetter(activeNoc.code)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold transition shadow-md flex items-center space-x-2 border border-amber-500/30"
                  >
                    <FileText className="w-4 h-4 text-amber-200" />
                    <span>Build IRCC Reference Letter for NOC {activeNoc.code}</span>
                  </button>
                )}
              </div>

              {/* Official Lead Statement */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Official ESDC Lead Statement</span>
                </h4>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic border-l-4 border-l-sky-500">
                  "{activeNoc.leadStatement}"
                </div>
              </div>

              {/* Main Duties Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Primary Duties Checklist (IRCC Employment Verification Audit)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  IRCC officers require your official work reference letters to prove you performed at least 60-70% of these main duties:
                </p>
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {activeNoc.mainDuties.map((duty, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        ✓
                      </div>
                      <span className="leading-relaxed">{duty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Job Titles & High-Demand PNP Badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Common Canadian Job Titles
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNoc.exampleTitles.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Target PNP Provinces</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNoc.pnpHighDemandProvinces.map((prov, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 font-bold">
                        {prov}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SPACIOUS PROVINCIAL FIT EXPLAINER SECTION */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/50 border border-sky-800/60 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-sky-800/40 pb-3">
                  <div className="flex items-center space-x-2">
                    <Compass className="w-5 h-5 text-sky-400" />
                    <h4 className="text-sm font-bold text-sky-200 uppercase tracking-wider">
                      🍁 Why Your Candidate Profile Fits Suggested Provinces
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-bold">
                    PNP Immigration Analysis
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Canadian provinces run targeted stream invitations to address critical local tech skill shortages. Candidates with NOC {activeNoc.code} ({activeNoc.title}) qualify for expedited provincial nomination draws that award an immediate <strong>+600 CRS Points</strong> toward Express Entry Permanent Residency:
                </p>

                {/* Individual Spacious Provincial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  {/* Ontario Card */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 hover:border-emerald-500/50 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wide">
                        Ontario (OINP)
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                        +600 CRS
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">Human Capital Tech Draw</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      NOC {activeNoc.code} is on Ontario's priority tech occupation list. Express Entry candidates with 2+ years experience receive direct notifications of interest (NOI) in Toronto and Ottawa tech hubs.
                    </p>
                  </div>

                  {/* British Columbia Card */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 hover:border-sky-500/50 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-sky-300 uppercase tracking-wide">
                        British Columbia (BC PNP)
                      </span>
                      <span className="text-[10px] font-bold text-sky-400 px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800">
                        Weekly Tech Draws
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">BC PNP Tech Stream</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      BC PNP holds weekly targeted draws for NOC {activeNoc.code} with lower score cutoffs and priority 15-day provincial nomination processing for Vancouver candidates.
                    </p>
                  </div>

                  {/* Alberta Card */}
                  <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 hover:border-amber-500/50 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                        Alberta (AAIP)
                      </span>
                      <span className="text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800">
                        30-Day Fast Track
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">Accelerated Tech Pathway</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Fast-tracked 30-day nomination processing for software, data, and cloud engineering candidates seeking opportunities in Calgary and Edmonton's expanding tech sector.
                    </p>
                  </div>
                </div>

                {onOpenPremiumModal && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={onOpenPremiumModal}
                      className="px-4 py-2 rounded-xl bg-red-900/80 hover:bg-red-800 text-white text-xs font-bold transition flex items-center space-x-2 border border-red-700/60 shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Unlock Customized Provincial Nomination Strategy (Premium)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* IRCC Duty Audit Warning Box */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block text-amber-300">CRITICAL IRCC EMPLOYMENT AUDIT WARNING:</span>
                  <p className="text-amber-200/90 leading-relaxed">
                    IRCC visa officers do NOT verify job titles alone; they audit your work experience against these main duties. Your actual daily duties in official reference letters must cover at least 60-70% of NOC {activeNoc.code}'s lead statement to avoid Permanent Residency rejections under R205 / Express Entry regulations.
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
