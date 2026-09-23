import React, { useState } from 'react';
import { X, Copy, Check, FileText, Download, AlertCircle, RefreshCw, Lock, ShieldCheck, Sparkles } from 'lucide-react';

interface ReferenceLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPremiumModal?: () => void;
  defaultRole?: string;
  defaultNoc?: string;
}

export const ReferenceLetterModal: React.FC<ReferenceLetterModalProps> = ({
  isOpen,
  onClose,
  onOpenPremiumModal,
  defaultRole = 'Senior Software Engineer',
  defaultNoc = '21232',
}) => {
  const [companyName, setCompanyName] = useState('Tech Solutions Inc.');
  const [roleTitle, setRoleTitle] = useState(defaultRole);
  const [nocCode, setNocCode] = useState(defaultNoc);
  const [startDate, setStartDate] = useState('2021-01');
  const [endDate, setEndDate] = useState('Present');
  const [salary, setSalary] = useState('$95,000 USD / year');
  const [hoursPerWeek, setHoursPerWeek] = useState('40 hours/week (Full-Time)');
  const [dutiesText, setDutiesText] = useState('Designed React/Node.js microservices, optimized PostgreSQL database queries, led code reviews, and managed CI/CD automated deployment pipelines.');
  
  const [isLoading, setIsLoading] = useState(false);
  const [letterResult, setLetterResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setLetterResult(null);
    
    const sendRequest = async (retries = 2): Promise<Response> => {
      try {
        return await fetch('/api/reference-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName,
            roleTitle,
            nocCode,
            startDate,
            endDate,
            salary,
            hoursPerWeek,
            duties: dutiesText,
          }),
        });
      } catch (err) {
        if (retries > 0) {
          await new Promise(r => setTimeout(r, 1000));
          return sendRequest(retries - 1);
        }
        throw err;
      }
    };

    try {
      const response = await sendRequest();
      const data = await response.json();
      if (data.success && data.letterDraft) {
        setLetterResult(data.letterDraft);
      } else {
        alert(data.error || 'Failed to generate reference letter draft.');
      }
    } catch (err) {
      console.error(err);
      alert('Unable to connect to reference letter service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!letterResult) return;
    navigator.clipboard.writeText(letterResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">IRCC Reference Letter Builder</h2>
              <p className="text-xs text-slate-400">
                Generate an official IRCC-compliant reference letter on company letterhead
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

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 text-xs text-amber-200 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">IRCC Reference Letter Criteria:</span> Letters MUST be printed on official company letterhead, specify start/end dates, full-time hours (≥30 hrs/wk), annual salary, job title, detailed duties matching NOC, and include the supervisor's official contact info.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title (as on contract)</label>
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target NOC Code</label>
              <input
                type="text"
                value={nocCode}
                onChange={(e) => setNocCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                placeholder="21232"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Salary &amp; Benefits</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Employment Dates</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Start (2021-01)"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="End (Present)"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hours Per Week</label>
              <input
                type="text"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Key Duties &amp; Technical Scope</label>
            <textarea
              rows={3}
              value={dutiesText}
              onChange={(e) => setDutiesText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Drafting IRCC Compliant Letter...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Generate Official Reference Letter Draft</span>
              </>
            )}
          </button>

          {/* Generated Result with Premium Lock */}
          {letterResult && (
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 relative">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Official IRCC Reference Letter Preview</span>
                </h4>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-red-400" />
                  <span>Premium Locked</span>
                </span>
              </div>

              {/* Letter Preview Container with Frosted Glass Overlay */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 p-4 max-h-[220px] overflow-hidden leading-relaxed filter blur-[2.5px] select-none opacity-60">
                  {letterResult}
                </pre>

                {/* Frosted Glass Unlock Overlay */}
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-2.5">
                  <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      IRCC Official Letterhead Export
                    </h5>
                    <p className="text-xs text-slate-400 max-w-sm mt-0.5">
                      Unlock official company letterhead formatting, supervisor signature blocks, and line-by-line ESDC NOC duty verification.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenPremiumModal) onOpenPremiumModal();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center space-x-1.5 border border-red-500/40"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Unlock Full Official Letter (Immigration Insurance)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
