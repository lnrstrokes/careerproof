import React, { useState } from 'react';
import { X, Search, CheckCircle2, AlertTriangle, ExternalLink, Briefcase } from 'lucide-react';
import { NOC_2021_TECH_CODES } from '../data/nocDatabase';

interface NocLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNoc?: (nocCode: string) => void;
}

export const NocLookupModal: React.FC<NocLookupModalProps> = ({ isOpen, onClose, onSelectNoc }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCode, setSelectedCode] = useState<string | null>('21232');

  if (!isOpen) return null;

  const filteredNocs = NOC_2021_TECH_CODES.filter(noc =>
    noc.code.includes(searchTerm) ||
    noc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    noc.exampleTitles.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activeNoc = NOC_2021_TECH_CODES.find(n => n.code === selectedCode) || NOC_2021_TECH_CODES[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">NOC 2021 Tech Occupation Directory</h2>
              <p className="text-xs text-slate-400">
                Official National Occupational Classification for Express Entry &amp; Provincial Nominee Programs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by NOC code (e.g., 21232), title (e.g., Software Developer), or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Content Body: Left sidebar lists codes, Right side shows active details */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          {/* List column */}
          <div className="p-3 overflow-y-auto max-h-[300px] md:max-h-none space-y-2 bg-slate-950/30">
            {filteredNocs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No NOC codes match search.</p>
            ) : (
              filteredNocs.map((noc) => (
                <button
                  key={noc.code}
                  onClick={() => setSelectedCode(noc.code)}
                  className={`w-full text-left p-3 rounded-xl border transition text-xs ${
                    selectedCode === noc.code
                      ? 'bg-sky-950/40 border-sky-500/50 text-sky-200'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-sky-400 px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800/50">
                      NOC {noc.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">TEER {noc.teer}</span>
                  </div>
                  <div className="font-semibold text-slate-100 truncate">{noc.title}</div>
                </button>
              ))
            )}
          </div>

          {/* Details column */}
          <div className="md:col-span-2 p-5 overflow-y-auto space-y-4 bg-slate-900/40">
            {activeNoc && (
              <>
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-sky-400 font-mono">NOC {activeNoc.code}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        TEER {activeNoc.teer} - High Skilled
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-white mt-1">{activeNoc.title}</h3>
                  </div>
                  {onSelectNoc && (
                    <button
                      onClick={() => {
                        onSelectNoc(activeNoc.code);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                    >
                      Use NOC {activeNoc.code}
                    </button>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Official IRCC Lead Statement</h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    "{activeNoc.leadStatement}"
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Duties (IRCC Audit Checklist)</h4>
                  <ul className="space-y-1.5">
                    {activeNoc.mainDuties.map((duty, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{duty}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase mb-1">Common Example Job Titles</h5>
                    <div className="flex flex-wrap gap-1">
                      {activeNoc.exampleTitles.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <h5 className="text-[11px] font-bold text-slate-400 uppercase mb-1">High-Demand Provinces (PNP)</h5>
                    <p className="text-xs text-emerald-400 font-medium">
                      {activeNoc.pnpHighDemandProvinces.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Provincial Fit Explainer Section */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center space-x-1.5">
                    <span>🍁 Why Candidate Profile Fits Suggested Provinces</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <strong className="text-emerald-300 block mb-0.5">Ontario (OINP Human Capital Tech Draw):</strong>
                      <span>NOC {activeNoc.code} ({activeNoc.title}) is explicitly listed on Ontario's targeted tech occupation list. Candidates in the Express Entry pool with 2+ years of experience receive direct invitations (granting +600 CRS points).</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <strong className="text-sky-300 block mb-0.5">British Columbia (BC PNP Tech Stream):</strong>
                      <span>BC PNP holds weekly targeted draws for NOC {activeNoc.code} with reduced score thresholds and expedited 15-day provincial nomination processing for tech candidates.</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <strong className="text-amber-300 block mb-0.5">Alberta (AAIP Accelerated Tech Pathway):</strong>
                      <span>Fast-track 30-day provincial nomination processing for candidates with software, data, or systems experience seeking tech opportunities in Calgary and Edmonton.</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">IRCC Duty Verification Warning:</span> IRCC officers audit reference letters against these EXACT main duties. Your job title does not need to match, but at least 60-70% of your listed daily duties in reference letters MUST align with this NOC lead statement.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Aligned with Canada ESDC NOC 2021 Matrix
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
