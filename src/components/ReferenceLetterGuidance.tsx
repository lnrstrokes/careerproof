import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Info,
  ShieldCheck,
} from 'lucide-react';

const LETTER_ITEMS: Array<{ item: string; why: string }> = [
  {
    item: 'Issued on the employer\'s official company letterhead',
    why: 'The employer\'s real letterhead identifies the issuing organization.',
  },
  {
    item: 'Your exact job title as it appeared on the contract',
    why: 'The title the employer actually used, not a preferred equivalent.',
  },
  {
    item: 'Exact start date and end date of employment',
    why: 'Specific dates (day/month/year), not ranges or summaries.',
  },
  {
    item: 'Hours worked per week and employment status',
    why: 'Whether the role was full-time or part-time, and the regular weekly hours.',
  },
  {
    item: 'Annual salary or wage, with currency',
    why: 'The compensation actually paid, as recorded by the employer.',
  },
  {
    item: 'A detailed description of your main duties',
    why: 'Written by the employer, describing the work you actually performed.',
  },
  {
    item: 'Supervisor or issuer name and title',
    why: 'A real person the issuing body can contact if needed.',
  },
  {
    item: 'Signature from the issuer',
    why: 'An unsigned letter is not an employer statement.',
  },
];

/**
 * Static guidance panel. This is intentionally NON-generative: it produces no
 * letter text, contains no contact details, and never claims any document is
 * "IRCC-compliant" or "lawyer-approved". The letter itself must come from the
 * employer, who is the only party that can truthfully issue it.
 */
export const ReferenceLetterGuidance: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 text-xs font-semibold w-fit">
          <FileText className="w-3.5 h-3.5" />
          <span>Reference letter - what to ask your employer</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
          Reference letter - what to ask your employer
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          When a job application, credential process, or licensing body asks for
          an employment reference letter, the letter must be issued and signed by
          your employer. This page is a plain checklist for what to ask for. It
          does not generate letter text - a truthful letter can only come from
          the employer who observed the work.
        </p>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>What a Canadian employer letter should contain</span>
        </h3>
        <ul className="space-y-2.5">
          {LETTER_ITEMS.map(({ item, why }) => (
            <li
              key={item}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-slate-100">{item}</span>
                <span className="block text-slate-400 mt-0.5 leading-relaxed">
                  {why}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-amber-950/20 border border-amber-900/50 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>Accuracy is your responsibility</span>
        </h3>
        <ul className="space-y-2 text-xs text-amber-100/90 leading-relaxed list-disc pl-5">
          <li>
            The letter must be <strong>issued and signed by the employer</strong> - not
            drafted by you and passed off as an employer statement.
          </li>
          <li>
            Every statement in it must be <strong>accurate</strong>. Dates,
            titles, hours, salary, and duties must match the employer&rsquo;s
            own records.
          </li>
          <li>
            <strong>
              False or altered statements in an immigration application carry
              serious consequences
            </strong>
            , including refusal and multi-year bans for misrepresentation. If
            any detail is wrong, the employer must correct it - never alter it
            yourself.
          </li>
        </ul>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Different programs and bodies publish their own document
          requirements. This checklist is general guidance, not a determination
          of what any specific authority will accept - always confirm with the
          official source asking for the letter.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-2 text-[11px] text-slate-600">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>This panel generates nothing. There is no letter template, no draft, and no export.</span>
      </div>
    </div>
  );
};
