import React from 'react';
import { X, ShieldAlert, CheckCircle2, ShieldCheck, ArrowRight, Lock, Award, Clock } from 'lucide-react';

interface PremiumNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumNavigationModal: React.FC<PremiumNavigationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-red-950/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Immigration Navigation Insurance</h2>
              <p className="text-xs text-slate-400">
                Protect your Permanent Residency timeline against high-risk IRCC duty audit rejections
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Tier Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free Tier</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">Included</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Job Search Optimization</h3>
              <p className="text-xs text-slate-400 mb-4">Focuses on getting you interviews with Canadian tech recruiters today.</p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Immediate Job Match &amp; ATS Score</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Truthful Resume Bullet Reframing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Deadline-Driven Action Plan</span>
                </li>
              </ul>
            </div>

            {/* Premium Tier Box */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-red-950/30 to-slate-950 border border-red-800/60 shadow-lg relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Premium Protection</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-900/80 text-red-200 border border-red-700">PR Insurance</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Immigration Pathway Protection</h3>
              <p className="text-xs text-slate-400 mb-4">Prevents costly NOC mismatch audit rejections that delay PR by 1-2 years.</p>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Line-by-Line IRCC Duty Audit Mapping</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Lawyer-Approved Reference Letter Templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Dual-Horizon Job + PNP Provincial Strategy</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Specific Risks Mitigated */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Critical Risks Mitigated By Premium</h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">NYSC / Internship Experience Duty Framing:</span> Early career roles (e.g., NYSC or junior contracts) require explicit duty framing to count towards Express Entry continuous work experience points.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Missing Official Letterhead Evidence:</span> Without reference letters explicitly detailing hours/week, salary, and duties on company letterhead, IRCC routinely rejects work history claims during PR processing.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">NOC Code Mismatch (e.g. 21231 vs 21232):</span> Picking the wrong NOC code affects both your immediate job interview callback rates AND future Provincial Nominee (OINP / BC PNP Tech) draw eligibility.
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-900/40 via-red-950 to-slate-900 border border-red-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-white">Secure Your Immigration Navigation Strategy</div>
              <p className="text-xs text-slate-300">1:1 Consultation + IRCC Compliant Letter Verification</p>
            </div>
            <button
              onClick={() => {
                alert('Thank you for choosing CanTech Navigation Insurance. A specialist will review your profile.');
                onClose();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition whitespace-nowrap flex items-center space-x-1.5"
            >
              <span>Activate Protection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center text-xs text-slate-500">
          <span>100% Truthful Alignment - No Fabricated Claims</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
