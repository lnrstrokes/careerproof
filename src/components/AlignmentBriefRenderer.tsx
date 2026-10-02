import React, { useState } from 'react';
import {
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
  Sparkles,
  Target,
} from 'lucide-react';
import type { AlignmentBrief, EvidenceStatus, Requirement } from '../types';

// ---------------------------------------------------------------------------
// Status metadata (plain language, no scores anywhere)
// ---------------------------------------------------------------------------

const STATUS_META: Record<
  EvidenceStatus,
  {
    label: string;
    plain: string;
    badge: string;
    /**
     * Tally-tile background. These must stay literal class strings in the
     * source: Tailwind v4 scans source text for whole class tokens, so a
     * background assembled at runtime (e.g. `${color}/40`) is never generated.
     */
    tile: string;
    icon: React.ReactNode;
  }
> = {
  supported: {
    label: 'Supported',
    plain: 'Your own text, quoted below, shows you meet this requirement.',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    tile: 'bg-emerald-950/40 border-emerald-800',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  transferable: {
    label: 'Transferable',
    plain:
      'Your quoted experience is close, but not a direct match. Read the rationale.',
    badge: 'bg-sky-950 text-sky-300 border-sky-800',
    tile: 'bg-sky-950/40 border-sky-800',
    icon: <Scale className="w-3.5 h-3.5" />,
  },
  missing: {
    label: 'Missing',
    plain:
      'The advert requires this AND your own text shows you do not meet it.',
    badge: 'bg-red-950 text-red-300 border-red-800',
    tile: 'bg-red-950/40 border-red-800',
    icon: <Ban className="w-3.5 h-3.5" />,
  },
  unknown: {
    label: 'Not determined',
    plain:
      'Your CV says nothing about this. That is not the same as missing it.',
    badge: 'bg-slate-800 text-slate-300 border-slate-600',
    tile: 'bg-slate-800/40 border-slate-600',
    icon: <HelpCircle className="w-3.5 h-3.5" />,
  },
  hard_constraint: {
    label: 'Verify in real life',
    plain:
      'Licences, work authorization, location, and schedules cannot be proven from text. Check with the official source.',
    badge: 'bg-amber-950 text-amber-300 border-amber-800',
    tile: 'bg-amber-950/40 border-amber-800',
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
  },
};

const StatusBadge: React.FC<{ status: EvidenceStatus }> = ({ status }) => {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded border text-[11px] font-bold ${meta.badge}`}
    >
      {meta.icon}
      <span>{meta.label}</span>
    </span>
  );
};

// ---------------------------------------------------------------------------
// Verdict banner: instant answer, then a detailed plain-language summary
// ---------------------------------------------------------------------------

type Verdict = {
  tone: 'ready' | 'almost' | 'gaps';
  headline: string;
  subline: string;
  banner: string;
};

function computeVerdict(brief: AlignmentBrief): Verdict {
  const all = [...brief.requirements, ...brief.hardConstraints];
  const mandatory = all.filter((r) => r.importance === 'mandatory');
  const mandatoryMissing = mandatory.filter((r) => r.status === 'missing');
  const mandatoryUnknown = mandatory.filter((r) => r.status === 'unknown');
  const hardConstraints = brief.hardConstraints.filter(
    (r) => r.status === 'hard_constraint',
  );

  if (mandatoryMissing.length > 0) {
    return {
      tone: 'gaps',
      headline: 'Not yet - your CV shows clear gaps against this job',
      subline: `${mandatoryMissing.length} mandatory requirement${mandatoryMissing.length === 1 ? '' : 's'} your CV shows you do not meet. Read the gaps below before spending time on this application.`,
      banner:
        'bg-red-950/30 border-red-900/70 text-red-200',
    };
  }
  if (mandatoryUnknown.length > 0 || hardConstraints.length > 0) {
    return {
      tone: 'almost',
      headline: 'Close - your CV covers the core, a few things need confirming',
      subline: `Your CV supports the key requirements, but ${mandatoryUnknown.length + hardConstraints.length} item${mandatoryUnknown.length + hardConstraints.length === 1 ? '' : 's'} cannot be proven from text alone. Confirm those and you can apply with confidence.`,
      banner:
        'bg-amber-950/25 border-amber-900/70 text-amber-200',
    };
  }
  return {
    tone: 'ready',
    headline: 'Strong fit - your CV supports every requirement we could check',
    subline: 'Every quoted requirement is backed by your own CV text below. Verify the official details, then apply.',
    banner:
      'bg-emerald-950/30 border-emerald-900/70 text-emerald-200',
  };
}

const SummarySection: React.FC<{ brief: AlignmentBrief }> = ({ brief }) => {
  const verdict = computeVerdict(brief);
  const all = [...brief.requirements, ...brief.hardConstraints];
  const mandatory = all.filter((r) => r.importance === 'mandatory');
  const preferred = all.filter((r) => r.importance !== 'mandatory');

  const supportedCount = all.filter((r) => r.status === 'supported').length;
  const transferableCount = all.filter((r) => r.status === 'transferable').length;
  const missingCount = all.filter((r) => r.status === 'missing').length;
  const unknownCount = all.filter((r) => r.status === 'unknown').length;
  const verifyCount = brief.hardConstraints.filter(
    (r) => r.status === 'hard_constraint',
  ).length;

  // "proves" must mean proven: 'transferable' is by definition NOT a direct
  // match and is already listed under "Areas to strengthen". Including it here
  // would show the same requirement as both proven and outstanding.
  const mandatoryCovered = mandatory.filter((r) => r.status === 'supported');

  const verdictIcon =
    verdict.tone === 'ready' ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
    ) : verdict.tone === 'almost' ? (
      <ShieldAlert className="w-5 h-5 text-amber-400" />
    ) : (
      <FileWarning className="w-5 h-5 text-red-400" />
    );

  return (
    <div className="space-y-4">
      {/* Verdict banner */}
      <div className={`p-5 rounded-2xl border ${verdict.banner} space-y-1.5`}>
        <div className="flex items-start space-x-2.5">
          {verdictIcon}
          <div className="space-y-1">
            <h3 className="text-base font-black leading-snug">{verdict.headline}</h3>
            <p className="text-xs leading-relaxed opacity-90">{verdict.subline}</p>
          </div>
        </div>
      </div>

      {/* Tally bar: numbers of requirements in each state (not a score) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(
          [
            ['supported', supportedCount],
            ['transferable', transferableCount],
            ['missing', missingCount],
            ['unknown', unknownCount],
            ['hard_constraint', verifyCount],
          ] as Array<[EvidenceStatus, number]>
        ).map(([status, count]) => {
          const meta = STATUS_META[status];
          return (
            <div
              key={status}
              className={`p-3 rounded-xl border ${meta.tile} flex flex-col items-center text-center space-y-0.5`}
            >
              {meta.icon}
              <span className="text-xl font-black leading-none">{count}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed plain-language summary */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>In plain words</span>
        </h4>
        <div className="text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            The advert &ldquo;<span className="text-slate-100 font-semibold">{brief.posting.title}</span>&rdquo;
            {' '}lists {all.length} requirement{all.length === 1 ? '' : 's'} we could quote
            {mandatory.length > 0 && ` (${mandatory.length} mandatory${preferred.length > 0 ? `, ${preferred.length} preferred` : ''})`}.
            Your CV clearly supports <span className="text-emerald-300 font-semibold">{supportedCount}</span>
            {supportedCount === 1 ? ' of them' : ` of them`}
            {transferableCount > 0 && (
              <>
                , with <span className="text-sky-300 font-semibold">{transferableCount}</span> close-but-not-exact
              </>
            )}
            .
          </p>
          {mandatoryCovered.length > 0 && (
            <p>
              The core requirements your CV proves:{' '}
              <span className="text-slate-100">
                {mandatoryCovered.map((r) => r.text.replace(/\.$/, '')).join('; ')}.
              </span>
            </p>
          )}
          {missingCount > 0 && (
            <p>
              Your CV shows you do not meet{' '}
              <span className="text-red-300 font-semibold">{missingCount}</span>{' '}
              requirement{missingCount === 1 ? '' : 's'} - these are real gaps, not
              just things your CV forgot to mention.
            </p>
          )}
          {unknownCount > 0 && (
            <p>
              For <span className="text-slate-100 font-semibold">{unknownCount}</span>{' '}
              requirement{unknownCount === 1 ? '' : 's'}, your CV is silent - the tool
              cannot tell either way. If you actually have this evidence, add it to
              your CV and analyze again; the status only changes when it can quote you.
            </p>
          )}
          {verifyCount > 0 && (
            <p>
              <span className="text-amber-300 font-semibold">{verifyCount}</span>{' '}
              item{verifyCount === 1 ? '' : 's'} - licences, registration, or
              scheduling - cannot be proven from any document. Only the official
              source (the regulator or the employer) can confirm those.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Warning strip for gaps (certification / licence / etc.) - shown inline
// ---------------------------------------------------------------------------

const GapWarnings: React.FC<{ brief: AlignmentBrief }> = ({ brief }) => {
  const all = [...brief.requirements, ...brief.hardConstraints];
  // Only 'missing' is a gap. 'unknown' items are reported in their own
  // "Needs verification" section - listing them under a red "Gaps" heading
  // would contradict the note that says the two are not the same.
  const gaps = all.filter(
    (r) => r.importance === 'mandatory' && r.status === 'missing',
  );

  if (gaps.length === 0) return null;

  return (
    <section className="p-5 rounded-2xl bg-red-950/20 border border-red-900/60 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-red-300 flex items-center space-x-1.5">
        <FileWarning className="w-4 h-4" />
        <span>
          Gaps - mandatory requirements your CV does not establish
        </span>
      </h3>
      <ul className="space-y-2.5">
        {gaps.map((req) => (
          <li
            key={`gap-${req.id}`}
            className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2"
          >
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={req.status} />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                {req.type === 'certification'
                  ? 'certification warning'
                  : req.type === 'licence'
                    ? 'licence warning'
                    : `${req.type} · mandatory`}
              </span>
            </div>
            <p className="text-slate-100 font-semibold leading-snug">{req.text}</p>
            <p className="text-slate-400 italic leading-relaxed">
              &ldquo;{req.sourceQuote}&rdquo;
            </p>
            <div className="pt-1 border-t border-slate-800/70 flex items-start space-x-2">
              <Target className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-200/90 leading-relaxed">
                {req.verificationQuestion ?? req.action ?? 'Add the missing evidence to your CV and analyze again.'}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-slate-500 leading-relaxed">
        Requirements your CV is merely silent about are not listed here - those
        appear under &ldquo;Needs verification&rdquo; below.
      </p>
    </section>
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
  const hasEvidence = requirement.candidateEvidence.length > 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 py-3 flex items-start justify-between gap-3 text-left hover:bg-slate-800/60 transition"
      >
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={requirement.status} />
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
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <Quote className="w-3 h-3" />
              <span>Job advert says</span>
            </span>
            <p className="text-slate-200 italic leading-relaxed">
              &ldquo;{requirement.sourceQuote}&rdquo;
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
              <Quote className="w-3 h-3" />
              <span>Your CV says</span>
            </span>
            {hasEvidence ? (
              requirement.candidateEvidence.map((evidence, i) => (
                <p key={i} className="text-emerald-200/90 italic leading-relaxed">
                  &ldquo;{evidence.quote}&rdquo;
                </p>
              ))
            ) : (
              <p className="text-slate-400">
                {requirement.status === 'hard_constraint'
                  ? 'This cannot be established from CV text. Check it with the official source.'
                  : 'Nothing in your CV covers this.'}
              </p>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Why
            </span>
            <p className="text-slate-300 leading-relaxed mt-1">
              {requirement.rationale}
            </p>
          </div>

          {requirement.action && (
            <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-900/60 flex items-start space-x-2">
              <Target className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
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
  const all = [...brief.requirements, ...brief.hardConstraints];
  const unknowns = all.filter((r) => r.status === 'unknown');

  return (
    <div className="space-y-6">
      {/* Posting header */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
        <h3 className="text-lg font-bold text-slate-100">
          {brief.posting.title}
        </h3>
        <p className="text-xs text-slate-400">
          {[brief.posting.organization, brief.posting.location, brief.posting.deadline]
            .filter(Boolean)
            .join(' · ') || 'Posting details: Not determined'}
        </p>
      </div>

      {/* Verdict + tally + plain-words summary */}
      <SummarySection brief={brief} />

      {/* Gaps first - the action area */}
      <GapWarnings brief={brief} />

      {/* Hard constraints - licences etc. */}
      {brief.hardConstraints.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>Verify with the official source</span>
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
            Preferred / nice-to-have
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

      {/* Areas to strengthen */}
      {(() => {
        const strengthen = all.filter(
          (r) =>
            r.status === 'transferable' ||
            (r.importance !== 'mandatory' && (r.status === 'missing' || r.status === 'unknown')),
        );
        if (strengthen.length === 0) return null;
        return (
          <section className="p-5 rounded-2xl bg-sky-950/20 border border-sky-900/60 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center space-x-1.5">
              <Scale className="w-4 h-4" />
              <span>Areas to strengthen - close these before applying</span>
            </h3>
            <ul className="space-y-2.5">
              {strengthen.map((req) => (
                <li
                  key={`strength-${req.id}`}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={req.status} />
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                      {req.type} · {req.importance}
                    </span>
                  </div>
                  <p className="text-slate-100 font-semibold leading-snug">{req.text}</p>
                  {req.rationale && (
                    <p className="text-slate-400 leading-relaxed">{req.rationale}</p>
                  )}
                  {req.action && (
                    <div className="pt-1 border-t border-slate-800/70 flex items-start space-x-2">
                      <Target className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <p className="text-sky-200/90 leading-relaxed">{req.action}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })()}

      {/* Needs verification area for unknowns */}
      {unknowns.length > 0 && (
        <section className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Needs verification - your CV was silent on these</span>
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
            CV and analyze again, or verify it directly.
          </p>
        </section>
      )}

      {/* Assumptions */}
      {brief.assumptions.length > 0 && (
        <section className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Assumptions the analysis made</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            {brief.assumptions.map((a, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-slate-500 mt-0.5">•</span>
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
