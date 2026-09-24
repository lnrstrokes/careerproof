import React, { useState } from 'react';
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileWarning,
  HelpCircle,
  Info,
  Scale,
  ShieldAlert,
  Quote,
} from 'lucide-react';
import type { AlignmentBrief, EvidenceStatus, Requirement } from '../types';

// ---------------------------------------------------------------------------
// Status metadata + legend (plain language, no scores anywhere)
// ---------------------------------------------------------------------------

const STATUS_META: Record<
  EvidenceStatus,
  { label: string; plain: string; badge: string; icon: React.ReactNode }
> = {
  supported: {
    label: 'Supported',
    plain:
      'Your own text, quoted below, shows you meet this requirement.',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  transferable: {
    label: 'Transferable',
    plain:
      'Your quoted experience is close, but not a direct match. Read the rationale.',
    badge: 'bg-sky-950 text-sky-300 border-sky-800',
    icon: <Scale className="w-3.5 h-3.5" />,
  },
  missing: {
    label: 'Missing',
    plain:
      'The advert requires this AND your own text shows you do not meet it.',
    badge: 'bg-red-950 text-red-300 border-red-800',
    icon: <Ban className="w-3.5 h-3.5" />,
  },
  unknown: {
    label: 'Not determined',
    plain:
      'Your input says nothing about this. That is not the same as missing it.',
    badge: 'bg-slate-800 text-slate-300 border-slate-600',
    icon: <HelpCircle className="w-3.5 h-3.5" />,
  },
  hard_constraint: {
    label: 'Verify in real life',
    plain:
      'Licences, work authorization, location, and schedules cannot be proven from text. Check with the official source.',
    badge: 'bg-amber-950 text-amber-300 border-amber-800',
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
  },
};

const StatusLegend: React.FC = () => (
  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
      <Info className="w-3.5 h-3.5 text-sky-400" />
      <span>What the status labels mean</span>
    </h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {(Object.keys(STATUS_META) as EvidenceStatus[]).map((status) => {
        const meta = STATUS_META[status];
        return (
          <div key={status} className="flex items-start space-x-2 text-xs">
            <span
              className={`shrink-0 inline-flex items-center space-x-1 px-2 py-0.5 rounded border font-semibold ${meta.badge}`}
            >
              {meta.icon}
              <span>{meta.label}</span>
            </span>
            <span className="text-slate-400 leading-relaxed">{meta.plain}</span>
          </div>
        );
      })}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Critical gaps + areas to strengthen (no scores - grouped requirement lists)
// ---------------------------------------------------------------------------

const CriticalGaps: React.FC<{ brief: AlignmentBrief }> = ({ brief }) => {
  const all = [...brief.hardConstraints, ...brief.requirements];

  // Gaps: mandatory requirements the input does not establish - either plainly
  // missing (the input contradicts/excludes them) or not determined (silent).
  const gaps = all.filter(
    (r) => r.importance === 'mandatory' && (r.status === 'missing' || r.status === 'unknown'),
  );

  // Strengthen: requirements met only partially (transferable) or non-mandatory
  // items the input does not establish. Each gets a concrete, non-writing step.
  const strengthen = all.filter(
    (r) =>
      r.status === 'transferable' ||
      (r.importance !== 'mandatory' && (r.status === 'missing' || r.status === 'unknown')),
  );

  if (gaps.length === 0 && strengthen.length === 0) return null;

  return (
    <>
      {gaps.length > 0 && (
        <section className="p-5 rounded-2xl bg-red-950/20 border border-red-900/60 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-300 flex items-center space-x-1.5">
            <FileWarning className="w-4 h-4" />
            <span>Critical gaps - mandatory requirements your CV does not establish</span>
          </h3>
          <ul className="space-y-2.5">
            {gaps.map((req) => (
              <li
                key={`gap-${req.id}`}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded border text-[11px] font-bold ${STATUS_META[req.status].badge}`}
                  >
                    {STATUS_META[req.status].icon}
                    <span>{STATUS_META[req.status].label}</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                    {req.type} · mandatory
                  </span>
                </div>
                <p className="text-slate-100 font-semibold leading-snug">{req.text}</p>
                <p className="text-slate-400 italic leading-relaxed">&ldquo;{req.sourceQuote}&rdquo;</p>
                {req.status === 'missing' ? (
                  req.action && (
                    <p className="text-amber-200/90 leading-relaxed">{req.action}</p>
                  )
                ) : (
                  (req.verificationQuestion ?? req.action) && (
                    <p className="text-amber-200/90 leading-relaxed">
                      {req.verificationQuestion ?? req.action}
                    </p>
                  )
                )}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            &ldquo;Not determined&rdquo; is not the same as missing: it means your CV was silent.
            If you have evidence for any item, add it to your CV text and analyze again -
            the status only changes when you can quote it.
          </p>
        </section>
      )}

      {strengthen.length > 0 && (
        <section className="p-5 rounded-2xl bg-sky-950/20 border border-sky-900/60 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center space-x-1.5">
            <Scale className="w-4 h-4" />
            <span>Areas to strengthen - close these before applying</span>
          </h3>
          <ul className="space-y-2.5">
            {strengthen.map((req) => (
              <li
                key={`strength-${req.id}`}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded border text-[11px] font-bold ${STATUS_META[req.status].badge}`}
                  >
                    {STATUS_META[req.status].icon}
                    <span>{STATUS_META[req.status].label}</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                    {req.type} · {req.importance}
                  </span>
                </div>
                <p className="text-slate-100 font-semibold leading-snug">{req.text}</p>
                {req.rationale && (
                  <p className="text-slate-400 leading-relaxed">{req.rationale}</p>
                )}
                {req.action && (
                  <p className="text-sky-200/90 leading-relaxed">{req.action}</p>
                )}
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            These are judgement calls based only on what you provided. Verify every
            requirement with the official source before acting on it.
          </p>
        </section>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
// Requirement card
// ---------------------------------------------------------------------------

const RequirementCard: React.FC<{ requirement: Requirement; defaultOpen: boolean }> = ({
  requirement,
  defaultOpen,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const meta = STATUS_META[requirement.status];
  const hasEvidence = requirement.candidateEvidence.length > 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-3 flex items-start justify-between gap-3 text-left hover:bg-slate-800/60 transition"
      >
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded border text-[11px] font-bold ${meta.badge}`}
            >
              {meta.icon}
              <span>{meta.label}</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              {requirement.type} · {requirement.importance}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-100 leading-snug">
            {requirement.text}
          </p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 text-xs border-t border-slate-800/70 pt-3">
          {/* The advert quote */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <Quote className="w-3 h-3" />
              <span>Job advert says</span>
            </span>
            <p className="text-slate-200 italic leading-relaxed">
              &ldquo;{requirement.sourceQuote}&rdquo;
            </p>
          </div>

          {/* The candidate evidence */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <Quote className="w-3 h-3" />
              <span>Your input says</span>
            </span>
            {hasEvidence ? (
              requirement.candidateEvidence.map((evidence, i) => (
                <p
                  key={i}
                  className="text-emerald-200/90 italic leading-relaxed"
                >
                  &ldquo;{evidence.quote}&rdquo;
                </p>
              ))
            ) : (
              <p className="text-slate-400">
                No evidence found in your input.
              </p>
            )}
          </div>

          {/* Rationale */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Why
            </span>
            <p className="text-slate-300 leading-relaxed mt-1">
              {requirement.rationale}
            </p>
          </div>

          {/* Action */}
          {requirement.action && (
            <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-900/60 flex items-start space-x-2">
              <FileWarning className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <p className="text-sky-200/90 leading-relaxed">{requirement.action}</p>
            </div>
          )}

          {requirement.verificationQuestion && (
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/50 flex items-start space-x-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-200/90 leading-relaxed">
                {requirement.verificationQuestion}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Counts strip (numbers of items only - not a score)
// ---------------------------------------------------------------------------

const CountsStrip: React.FC<{ brief: AlignmentBrief }> = ({ brief }) => {
  const entries: Array<[EvidenceStatus, number]> = [
    ['supported', brief.counts.supported],
    ['transferable', brief.counts.transferable],
    ['missing', brief.counts.missing],
    ['unknown', brief.counts.unknown],
    ['hard_constraint', brief.counts.hard_constraint],
  ];
  const meta = STATUS_META;
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
        Totals
      </span>
      {entries.map(([status, count]) => (
        <span
          key={status}
          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border font-semibold ${meta[status].badge}`}
        >
          {meta[status].icon}
          <span>{meta[status].label}</span>
          <span className="font-mono font-bold">{count}</span>
        </span>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main renderer
// ---------------------------------------------------------------------------

export const AlignmentBriefRenderer: React.FC<{ brief: AlignmentBrief }> = ({
  brief,
}) => {
  const mandatory = brief.requirements.filter(
    (r) => r.importance === 'mandatory',
  );
  const preferred = brief.requirements.filter(
    (r) => r.importance !== 'mandatory',
  );
  const unknowns = [...brief.requirements, ...brief.hardConstraints].filter(
    (r) => r.status === 'unknown',
  );

  return (
    <div className="space-y-6">
      {/* Posting header */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-slate-100">
            {brief.posting.title}
          </h3>
          <CountsStrip brief={brief} />
        </div>
        <p className="text-xs text-slate-400">
          {[brief.posting.organization, brief.posting.location, brief.posting.deadline]
            .filter(Boolean)
            .join(' · ') || 'Posting details: Not determined'}
        </p>
      </div>

      <StatusLegend />

      <CriticalGaps brief={brief} />

      {/* Hard constraints first */}
      {brief.hardConstraints.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Hard constraints - verify these with the official source</span>
          </h3>
          {brief.hardConstraints.map((req) => (
            <RequirementCard key={req.id} requirement={req} defaultOpen />
          ))}
        </section>
      )}

      {/* Mandatory requirements */}
      {mandatory.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Mandatory requirements
          </h3>
          {mandatory.map((req) => (
            <RequirementCard key={req.id} requirement={req} defaultOpen={false} />
          ))}
        </section>
      )}

      {/* Preferred requirements */}
      {preferred.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Preferred requirements
          </h3>
          {preferred.map((req) => (
            <RequirementCard key={req.id} requirement={req} defaultOpen={false} />
          ))}
        </section>
      )}

      {brief.requirements.length === 0 && brief.hardConstraints.length === 0 && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-sm text-slate-400 text-center">
          No requirements could be quoted from this advert, so nothing was
          reported. Check that you pasted the full advert text.
        </div>
      )}

      {/* Needs verification area for unknowns */}
      {unknowns.length > 0 && (
        <section className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Needs verification - your input was silent on these</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {unknowns.map((req) => (
              <li key={req.id} className="flex items-start space-x-2">
                <span className="text-slate-500 mt-0.5">•</span>
                <span>{req.text}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Not determined does not mean missing. Add this information to your
            input and analyze again, or verify it directly.
          </p>
        </section>
      )}

      {/* NOC candidates - explicitly presented as candidates, never conclusions */}
      {brief.interpretation.nocCandidates.length > 0 && (
        <section className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Possible NOC 2021 classifications - candidates only, verify officially</span>
          </h3>
          <div className="space-y-2">
            {brief.interpretation.nocCandidates.map((noc, i) => (
              <div
                key={`${noc.code}-${i}`}
                className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-sky-300">
                    NOC {noc.code}
                  </span>
                  <span className="text-slate-300">{noc.title}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-400">
                    {noc.confidence} confidence
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-400">
                    {noc.source === 'nocDatabase' ? 'from local reference list' : 'model suggested'}
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed">{noc.rationale}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Assumptions */}
      {brief.assumptions.length > 0 && (
        <section className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Assumptions the analysis made
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            {brief.assumptions.map((a, i) => (
              <li key={i} className="flex items-start space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Unresolved questions */}
      {brief.unresolvedQuestions.length > 0 && (
        <section className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Questions only you (or the employer) can answer
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            {brief.unresolvedQuestions.map((q, i) => (
              <li key={i} className="flex items-start space-x-2">
                <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {brief.disclaimer}
        </p>
      </div>
    </div>
  );
};

export default AlignmentBriefRenderer;
