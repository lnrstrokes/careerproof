/**
 * Shared contract for the CareerProof analysis pipeline.
 * Pure zod + TypeScript only. No Express, no Vercel, no Vite imports here.
 */
import { z } from 'zod';

export const CONTRACT_VERSION = '1.0' as const;

export type EvidenceStatus =
  | 'supported'
  | 'transferable'
  | 'missing'
  | 'unknown'
  | 'hard_constraint';

export interface CandidateEvidence {
  quote: string;
  spanStart: number;
  spanEnd: number;
}

export interface Requirement {
  id: string;
  /** Plain restatement of the advert requirement; adds no new facts. */
  text: string;
  /** MUST be a verbatim contiguous substring of the job advert. */
  sourceQuote: string;
  spanStart: number;
  spanEnd: number;
  type:
    | 'duty'
    | 'skill'
    | 'education'
    | 'experience'
    | 'certification'
    | 'licence'
    | 'language'
    | 'location'
    | 'work_authorization'
    | 'schedule'
    | 'other';
  importance: 'mandatory' | 'preferred' | 'unclear';
  status: EvidenceStatus;
  /** Quotes copied from the USER'S OWN input. Empty when none. */
  candidateEvidence: CandidateEvidence[];
  rationale: string;
  action: string | null;
  verificationQuestion: string | null;
}

export interface NocCandidate {
  code: string;
  title: string;
  confidence: 'high' | 'medium' | 'low';
  rationale: string;
  source: 'nocDatabase' | 'model_asserted';
}

export interface AlignmentBrief {
  contractVersion: '1.0';
  posting: {
    title: string;
    organization: string | null;
    location: string | null;
    deadline: string | null;
    sourceUrl: string | null;
  };
  interpretation: {
    likelyOccupationTitle: string | null;
    nocCandidates: NocCandidate[];
    ambiguityNotes: string[];
  };
  requirements: Requirement[];
  hardConstraints: Requirement[];
  assumptions: string[];
  unresolvedQuestions: string[];
  counts: {
    supported: number;
    transferable: number;
    missing: number;
    unknown: number;
    hard_constraint: number;
  };
  disclaimer: string;
}

/** Shape of one entry in src/data/nocDatabase.ts (local reference data). */
export interface NocCodeInfo {
  code: string;
  title: string;
  teer: number;
  leadStatement: string;
  mainDuties: string[];
  exampleTitles: string[];
  expressEntryEligible: boolean;
  pnpHighDemandProvinces: string[];
}

/** Raw request body accepted by POST /api/analyze (before normalization). */
export interface AnalyzeRequestBody {
  postingText?: unknown;
  jobDescriptionText?: unknown;
  resumeText?: unknown;
  candidateText?: unknown;
  dutiesText?: unknown;
  educationText?: unknown;
  certificationsText?: unknown;
  languageText?: unknown;
  currentLocationText?: unknown;
  targetProvinces?: unknown;
  postingUrl?: unknown;
  [key: string]: unknown;
}

/** Normalized, size-checked input handed to the model. */
export interface AnalyzeInput {
  postingText: string;
  candidateText: string;
  postingUrl: string | null;
  educationText: string | null;
  certificationsText: string | null;
  languageText: string | null;
  currentLocationText: string | null;
  targetProvinces: string[];
  extras: Record<string, string>;
}

/** Typed error thrown by runAnalysis and mapped to the HTTP error contract. */
export class AnalysisError extends Error {
  constructor(
    public httpStatus: number,
    public code: string,
    message: string,
    public fields?: string[],
  ) {
    super(message);
    this.name = 'AnalysisError';
  }
}

export interface ErrorPayload {
  success: false;
  code: string;
  message: string;
  fields?: string[];
}

/**
 * Single source of truth for the error contract. Never carries content:
 * on any failure the user receives only status + code + message, never
 * model output or fallback text.
 */
export function toErrorPayload(error: unknown): {
  status: number;
  body: ErrorPayload;
} {
  if (error instanceof AnalysisError) {
    return {
      status: error.httpStatus,
      body: {
        success: false,
        code: error.code,
        message: error.message,
        ...(error.fields ? { fields: error.fields } : {}),
      },
    };
  }
  console.error('[CareerProof] Unexpected error:', error);
  return {
    status: 503,
    body: {
      success: false,
      code: 'AI_UNAVAILABLE',
      message:
        'Analysis is temporarily unavailable. Nothing was generated - please try again.',
    },
  };
}

// ---------------------------------------------------------------------------
// Zod schemas for the model's structured output
// ---------------------------------------------------------------------------

const evidenceStatusSchema = z.enum([
  'supported',
  'transferable',
  'missing',
  'unknown',
  'hard_constraint',
]);

const candidateEvidenceSchema = z.object({
  quote: z.string(),
  spanStart: z.number().int().min(0).default(0),
  spanEnd: z.number().int().min(0).default(0),
});

const requirementSchema = z.object({
  id: z.string(),
  text: z.string(),
  sourceQuote: z.string(),
  spanStart: z.number().int().min(0).default(0),
  spanEnd: z.number().int().min(0).default(0),
  type: z.enum([
    'duty',
    'skill',
    'education',
    'experience',
    'certification',
    'licence',
    'language',
    'location',
    'work_authorization',
    'schedule',
    'other',
  ]),
  importance: z.enum(['mandatory', 'preferred', 'unclear']),
  status: evidenceStatusSchema,
  candidateEvidence: z.array(candidateEvidenceSchema),
  rationale: z.string(),
  action: z.string().nullable().default(null),
  verificationQuestion: z.string().nullable().default(null),
});

const nocCandidateSchema = z.object({
  code: z.string(),
  title: z.string(),
  confidence: z.enum(['high', 'medium', 'low']),
  rationale: z.string(),
  source: z.enum(['nocDatabase', 'model_asserted']).default('model_asserted'),
});

export const alignmentBriefSchema = z.object({
  contractVersion: z.literal('1.0'),
  posting: z.object({
    title: z.string(),
    organization: z.string().nullable().default(null),
    location: z.string().nullable().default(null),
    deadline: z.string().nullable().default(null),
    sourceUrl: z.string().nullable().default(null),
  }),
  interpretation: z.object({
    likelyOccupationTitle: z.string().nullable().default(null),
    nocCandidates: z.array(nocCandidateSchema).default([]),
    ambiguityNotes: z.array(z.string()).default([]),
  }),
  requirements: z.array(requirementSchema).default([]),
  hardConstraints: z.array(requirementSchema).default([]),
  assumptions: z.array(z.string()).default([]),
  unresolvedQuestions: z.array(z.string()).default([]),
  counts: z
    .object({
      supported: z.number().default(0),
      transferable: z.number().default(0),
      missing: z.number().default(0),
      unknown: z.number().default(0),
      hard_constraint: z.number().default(0),
    })
    .default({
      supported: 0,
      transferable: 0,
      missing: 0,
      unknown: 0,
      hard_constraint: 0,
    }),
  disclaimer: z.string(),
});

// ---------------------------------------------------------------------------
// Input validation + normalization
// ---------------------------------------------------------------------------

export const MAX_TEXT_FIELD_LENGTH = 20_000;
export const MAX_PAYLOAD_BYTES = 1_000_000; // 1 MB
export const MIN_QUOTE_LENGTH = 4;
/** If more than this fraction of requirements fail quote validation, refuse the brief. */
export const MAX_FAILED_QUOTE_FRACTION = 0.3;

/**
 * Collapse whitespace, normalize curly quotes/dashes to ASCII equivalents.
 * Applied to both the advert and the candidate text before substring checks,
 * and identically to quotes before verification.
 */
export function normalizeText(input: string): string {
  return input
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .replace(/[\u2013\u2014\u2012\u2013\u2212]/g, '-')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface ValidatedInput {
  input: AnalyzeInput;
  normalizedPosting: string;
  normalizedCandidate: string;
}

/**
 * Validates and normalizes the raw request body.
 * Throws AnalysisError with code INVALID_INPUT on missing/empty required fields,
 * PAYLOAD_TOO_LARGE when a text field exceeds the cap.
 */
export function validateAnalyzeInput(body: AnalyzeRequestBody): ValidatedInput {
  const fields: string[] = [];

  const postingRaw =
    typeof body.postingText === 'string'
      ? body.postingText
      : typeof body.jobDescriptionText === 'string'
        ? body.jobDescriptionText
        : '';
  const candidateRaw =
    typeof body.candidateText === 'string'
      ? body.candidateText
      : typeof body.resumeText === 'string'
        ? body.resumeText
        : '';

  if (!postingRaw.trim()) fields.push('postingText');
  if (!candidateRaw.trim()) fields.push('candidateText');

  if (fields.length > 0) {
    throw new AnalysisError(
      400,
      'INVALID_INPUT',
      'Required input is missing or empty. Nothing was generated.',
      fields,
    );
  }

  for (const [name, value] of [
    ['postingText', postingRaw],
    ['candidateText', candidateRaw],
  ] as const) {
    if (value.length > MAX_TEXT_FIELD_LENGTH) {
      throw new AnalysisError(
        413,
        'PAYLOAD_TOO_LARGE',
        `${name} exceeds the ${MAX_TEXT_FIELD_LENGTH} character limit. Please shorten it and try again.`,
      );
    }
  }

  const optionalFields: Array<[string, string]> = [];
  const collect = (name: string, value: unknown): void => {
    if (typeof value === 'string' && value.trim()) {
      if (value.length > MAX_TEXT_FIELD_LENGTH) {
        throw new AnalysisError(
          413,
          'PAYLOAD_TOO_LARGE',
          `${name} exceeds the ${MAX_TEXT_FIELD_LENGTH} character limit.`,
        );
      }
      optionalFields.push([name, value.trim()]);
    }
  };

  collect('educationText', body.educationText);
  collect('certificationsText', body.certificationsText);
  collect('languageText', body.languageText);
  collect('currentLocationText', body.currentLocationText);
  collect('postingUrl', body.postingUrl);
  collect('dutiesText', body.dutiesText);

  const optional = (name: string): string | null =>
    optionalFields.find(([n]) => n === name)?.[1] ?? null;

  const targetProvinces = Array.isArray(body.targetProvinces)
    ? body.targetProvinces.filter(
        (p): p is string => typeof p === 'string' && p.trim().length > 0,
      )
    : [];

  const postingText = postingRaw.trim();
  const candidateText = candidateRaw.trim();

  return {
    input: {
      postingText,
      candidateText,
      postingUrl: optional('postingUrl'),
      educationText: optional('educationText'),
      certificationsText: optional('certificationsText'),
      languageText: optional('languageText'),
      currentLocationText: optional('currentLocationText'),
      targetProvinces,
      extras: Object.fromEntries(
        optionalFields.filter(([n]) => n === 'dutiesText'),
      ),
    },
    normalizedPosting: normalizeText(postingText),
    normalizedCandidate: normalizeText(candidateText),
  };
}

// ---------------------------------------------------------------------------
// Server-side anti-fabrication gate
// ---------------------------------------------------------------------------

export interface QuoteValidationResult {
  requirements: Requirement[];
  hardConstraints: Requirement[];
  counts: AlignmentBrief['counts'];
  droppedRequirementCount: number;
  failedRequirementCount: number;
}

/** Recompute counts from the final requirement arrays. */
export function computeCounts(
  requirements: Requirement[],
  hardConstraints: Requirement[],
): AlignmentBrief['counts'] {
  const counts = {
    supported: 0,
    transferable: 0,
    missing: 0,
    unknown: 0,
    hard_constraint: 0,
  };
  for (const req of [...requirements, ...hardConstraints]) {
    counts[req.status] = (counts[req.status] ?? 0) + 1;
  }
  return counts;
}

/**
 * Enforces every quote-integrity rule against the normalized advert and
 * candidate text. Drops invalid requirements/evidence, downgrades unsupported
 * 'supported' statuses, recomputes counts, and flags catastrophic failures.
 */
export function enforceQuoteIntegrity(
  requirements: Requirement[],
  hardConstraints: Requirement[],
  normalizedPosting: string,
  normalizedCandidate: string,
): QuoteValidationResult {
  const dropped: string[] = [];

  const isValidQuote = (quote: string, haystack: string): boolean => {
    if (quote.length < MIN_QUOTE_LENGTH) return false;
    return haystack.includes(normalizeText(quote));
  };

  const isValidSourceQuote = (quote: string): boolean =>
    isValidQuote(quote, normalizedPosting);
  const isValidEvidenceQuote = (quote: string): boolean =>
    isValidQuote(quote, normalizedCandidate);

  const process = (list: Requirement[]): Requirement[] => {
    const kept: Requirement[] = [];
    for (const req of list) {
      // Rule: sourceQuote must be contiguous in the normalized advert.
      if (!isValidSourceQuote(req.sourceQuote)) {
        dropped.push(req.id);
        continue;
      }

      // Rule: evidence quotes must be contiguous in the candidate input.
      const evidence = (req.candidateEvidence ?? []).filter((e) =>
        isValidEvidenceQuote(e.quote),
      );

      let status = req.status;
      // Rule: 'supported' requires at least one valid evidence quote.
      if (status === 'supported' && evidence.length === 0) {
        status = 'unknown';
      }
      // Rule: a requirement with zero evidence may be at most 'unknown'.
      if (evidence.length === 0 && status === 'transferable') {
        status = 'unknown';
      }

      kept.push({ ...req, status, candidateEvidence: evidence });
    }
    return kept;
  };

  const validatedRequirements = process(requirements);
  const validatedHardConstraints = process(hardConstraints);

  const totalSubmitted = requirements.length + hardConstraints.length;
  const failedRequirementCount = dropped.length;

  if (
    totalSubmitted > 0 &&
    failedRequirementCount / totalSubmitted > MAX_FAILED_QUOTE_FRACTION
  ) {
    throw new AnalysisError(
      502,
      'AI_INVALID_OUTPUT',
      'The analysis output failed quote verification and was discarded. Nothing was generated - please try again.',
    );
  }

  return {
    requirements: validatedRequirements,
    hardConstraints: validatedHardConstraints,
    counts: computeCounts(validatedRequirements, validatedHardConstraints),
    droppedRequirementCount: failedRequirementCount,
    failedRequirementCount,
  };
}

/**
 * Recomputes NOC candidates: codes not present in the local database are
 * downgraded to source 'model_asserted' with confidence capped at 'low', and
 * an unresolvedQuestion is added telling the user to verify officially.
 */
export function enforceNocIntegrity(
  nocCandidates: NocCandidate[],
  databaseCodes: string[],
): { nocCandidates: NocCandidate[]; extraUnresolvedQuestions: string[] } {
  const known = new Set(databaseCodes);
  const extraQuestions: string[] = [];

  const adjusted = nocCandidates.map((noc) => {
    if (known.has(noc.code)) return noc;
    extraQuestions.push(
      `NOC ${noc.code} (${noc.title}) was suggested by the model but is not in the local reference database. Verify it against the official National Occupational Classification 2021 before relying on it.`,
    );
    return {
      ...noc,
      source: 'model_asserted' as const,
      confidence: 'low' as const,
    };
  });

  return { nocCandidates: adjusted, extraUnresolvedQuestions: extraQuestions };
}

// ---------------------------------------------------------------------------
// Output sanity: no scores, no percentages anywhere in the serialized brief
// ---------------------------------------------------------------------------

const SCORE_FIELD_PATTERN = /score|percent|percentage|probability|ranking|rating|rank|confidence_level/i;

/**
 * Scans the brief for fabricated numbers. Numeric fields that are part of the
 * evidence contract (span offsets, counts) are allowed; any field whose name
 * smells like a score, or any string containing a percentage figure, fails.
 */
export function assertNoScores(brief: AlignmentBrief): void {
  const visit = (value: unknown, path: string): void => {
    if (Array.isArray(value)) {
      value.forEach((item, i) => visit(item, `${path}[${i}]`));
      return;
    }
    if (value && typeof value === 'object') {
      for (const [key, v] of Object.entries(value)) {
        if (SCORE_FIELD_PATTERN.test(key)) {
          throw new AnalysisError(
            502,
            'AI_INVALID_OUTPUT',
            'The analysis output contained a score-like field and was discarded.',
          );
        }
        visit(v, path ? `${path}.${key}` : key);
      }
      return;
    }
    if (typeof value === 'string' && /(\d+\s*%|\b\d{1,3} percent\b)/i.test(value)) {
      throw new AnalysisError(
        502,
        'AI_INVALID_OUTPUT',
        'The analysis output contained a percentage and was discarded.',
      );
    }
  };
  visit(brief, '');
}
