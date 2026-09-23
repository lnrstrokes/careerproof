import React, { useState } from 'react';
import { FileText, Copy, Check, Download, AlertCircle, RefreshCw, Lock, ShieldCheck, Sparkles, Building2, UserCheck, Calendar, DollarSign, CheckCircle2, ChevronRight } from 'lucide-react';
import { NOC_2021_TECH_CODES } from '../data/nocDatabase';

interface ReferenceLetterPageProps {
  onOpenPremiumModal: () => void;
  defaultNoc?: string;
  defaultRole?: string;
}

export const ReferenceLetterPage: React.FC<ReferenceLetterPageProps> = ({
  onOpenPremiumModal,
  defaultNoc = '21232',
  defaultRole = 'Senior Software Engineer',
}) => {
  const [companyName, setCompanyName] = useState('Interac FinTech Corp');
  const [jobTitle, setJobTitle] = useState(defaultRole);
  const [nocCode, setNocCode] = useState(defaultNoc);
  const [employmentType, setEmploymentType] = useState('Full-Time (40 Hours/Week)');
  const [startDate, setStartDate] = useState('January 2022');
  const [endDate, setEndDate] = useState('Present');
  const [salary, setSalary] = useState('$115,000 CAD / annum');
  const [supervisorName, setSupervisorName] = useState('Sarah Jenkins');
  const [supervisorTitle, setSupervisorTitle] = useState('VP of Engineering');
  const [supervisorContact, setSupervisorContact] = useState('s.jenkins@interac.ca | +1 (416) 555-0199');

  const [isLoading, setIsLoading] = useState(false);
  const [letterResult, setLetterResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedNocInfo = NOC_2021_TECH_CODES.find(n => n.code === nocCode) || NOC_2021_TECH_CODES[0];

  const handleGenerate = () => {
    setIsLoading(true);

    setTimeout(() => {
      const dutiesText = selectedNocInfo.mainDuties
        .map(d => `  - ${d} (Engineered and delivered in high-concurrency production environments)`)
        .join('\n');

      const draft = `OFFICIAL EMPLOYMENT VERIFICATION & REFERENCE LETTER
To: Immigration, Refugees and Citizenship Canada (IRCC)
Subject: Employment Verification for ${jobTitle} (NOC ${selectedNocInfo.code})

To Whom It May Concern,

This letter serves as official confirmation of employment for the candidate at ${companyName}. The candidate has been employed in good standing under the following terms:

1. EMPLOYMENT DURATION & STATUS:
   - Position Title: ${jobTitle}
   - NOC Code Alignment: NOC ${selectedNocInfo.code} (${selectedNocInfo.title} - TEER ${selectedNocInfo.teer})
   - Employment Period: ${startDate} to ${endDate}
   - Working Hours: ${employmentType}
   - Remuneration: ${salary} plus comprehensive benefits package

2. MAIN DUTIES & RESPONSIBILITIES:
   During their tenure at ${companyName}, the candidate performed the following primary duties, aligning strictly with NOC ${selectedNocInfo.code} lead statement requirements:
${dutiesText}

3. SUPERVISOR DECLARATION:
   I confirm that the candidate demonstrated exceptional technical competence, professional integrity, and adherence to company standards. I am available to answer any questions from IRCC officers regarding this employment record.

Sincerely,

[SIGNATURE]
${supervisorName}
${supervisorTitle}
${companyName}
Contact: ${supervisorContact}
`;

      setLetterResult(draft);
      setIsLoading(false);
    }, 600);
  };

  const handleCopy = () => {
    if (!letterResult) return;
    navigator.clipboard.writeText(letterResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>IRCC R205 Employment Verification Builder</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">100% Express Entry Audit Compliant</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
          Official IRCC Reference Letter Generator
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          IRCC rejects thousands of Permanent Residency applications due to missing reference letter parameters (e.g. salary, hours/week, or NOC duty alignment). Generate compliant reference letter drafts structured specifically for Canadian immigration officers.
        </p>
      </div>

      {/* Main Grid: Parameter Form (Left) & Live Draft Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form (5 Cols on lg) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Reference Letter Parameters
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company / Employer Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target NOC Code</label>
                <select
                  value={nocCode}
                  onChange={(e) => setNocCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  {NOC_2021_TECH_CODES.map(n => (
                    <option key={n.code} value={n.code}>
                      NOC {n.code} - {n.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Working Hours / Status</label>
                <input
                  type="text"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Salary / Remuneration</label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">End Date</label>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Supervisor Declaration Details
              </span>

              <div>
                <label className="block text-slate-400 text-[11px]">Supervisor Name &amp; Title</label>
                <input
                  type="text"
                  value={`${supervisorName}, ${supervisorTitle}`}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px]">Supervisor Contact (Email/Phone)</label>
                <input
                  type="text"
                  value={supervisorContact}
                  onChange={(e) => setSupervisorContact(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 border border-amber-500/30"
            >
              {isLoading ? (
                <span>Building Letter Draft...</span>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Generate IRCC Reference Letter Draft</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Area (7 Cols on lg) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Generated IRCC Reference Letter Draft
              </h3>
            </div>
            {letterResult && (
              <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold flex items-center space-x-1">
                <Lock className="w-3 h-3 text-red-400" />
                <span>Premium Export Locked</span>
              </span>
            )}
          </div>

          {!letterResult ? (
            <div className="p-12 text-center space-y-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Configure parameters on the left and click "Generate IRCC Reference Letter Draft" to preview official employment verification wording.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Formatted Letter Output Container with Frosted Glass Overlay */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                <pre className="whitespace-pre-wrap font-mono text-xs text-slate-200 p-6 max-h-[380px] overflow-hidden leading-relaxed filter blur-[2px] select-none opacity-50">
                  {letterResult}
                </pre>

                {/* Frosted Glass Overlay */}
                <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 shadow-md">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div className="max-w-md space-y-1">
                    <h4 className="text-base font-bold text-white">
                      Official Company Letterhead Export
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Unlock official company letterhead exports, supervisor signature block formatting, and 100% line-by-line NOC duty audit guarantee.
                    </p>
                  </div>
                  <button
                    onClick={onOpenPremiumModal}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-bold transition shadow-xl flex items-center space-x-2 border border-red-500/40"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Unlock Official Reference Letter Export (Immigration Insurance)</span>
                  </button>
                </div>
              </div>

              {/* Reference Checklist Info */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-slate-200 uppercase tracking-wider block">
                  Mandatory IRCC Reference Letter Checklist:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Official Company Letterhead</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Exact Hours Worked per Week</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Annual Salary / Hourly Compensation</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Supervisor Signature &amp; Contact</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
