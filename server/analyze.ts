/**
 * runAnalysis: validate input -> call the model -> enforce output integrity ->
 * return a deterministic AlignmentBrief. Pure orchestration: no Express, no
 * Vercel, no Vite. Both server.ts (local dev) and api/analyze.ts (Vercel)
 * import this single entry point.
 */
import {
  AnalysisError,
  CONTRACT_VERSION,
  assertNoScores,
  enforceNocIntegrity,
  enforceQuoteIntegrity,
  normalizeText,
  validateAnalyzeInput,
  type AlignmentBrief,
  type AnalyzeRequestBody,
} from './schema';
import { SYSTEM_INSTRUCTION, buildUserPrompt } from './prompts';
import { generateStructured } from './groq';

export const DISCLAIMER =
  'This report describes only what is quoted from the job advert and your own input. It is not advice on licensing, work authorization, or immigration eligibility, and it cannot tell you whether you will be hired. Verify every requirement with the official source before you rely on it.';

/**
 * Executes a full analysis run.
 *
 * Throws AnalysisError with the HTTP status/code of the error contract:
 * - 400 INVALID_INPUT (missing/empty required fields)
 * - 413 PAYLOAD_TOO_LARGE
 * - 502 AI_INVALID_OUTPUT (schema, scores, or quote validation failure)
 * - 503 AI_UNAVAILABLE (missing key, model down, or all models failed)
 */
export async function runAnalysis(
  body: AnalyzeRequestBody,
): Promise<AlignmentBrief> {
  const { input, normalizedPosting } = validateAnalyzeInput(body);

  const prompt = buildUserPrompt(input);

  const { brief: modelBrief, modelUsed } = await generateStructured(
    SYSTEM_INSTRUCTION,
    prompt,
  );

  // --- Server-side anti-fabrication gate (runs before anything is returned) ---

  // 1. Quote integrity: every sourceQuote must be contiguous in the normalized
  //    advert; every evidence quote contiguous in the candidate's own text.
  //    The candidate corpus is the CV/experience text PLUS every optional
  //    context field the user filled in (education, certifications, languages,
  //    location, extras) - all of it is the user's own words and legitimate
  //    evidence. Drops invalid items, downgrades unsupported statuses, and
  //    refuses the whole brief when too much fails.
  const candidateEvidenceCorpus = [
    input.candidateText,
    input.educationText ?? '',
    input.certificationsText ?? '',
    input.languageText ?? '',
    input.currentLocationText ?? '',
    ...Object.values(input.extras),
  ]
    .filter((s) => s.trim().length > 0)
    .join('\n\n');

  const validated = enforceQuoteIntegrity(
    modelBrief.requirements,
    modelBrief.hardConstraints,
    normalizedPosting,
    normalizeText(candidateEvidenceCorpus),
  );

  if (validated.droppedRequirementCount > 0) {
    console.info(
      `[CareerProof] Dropped ${validated.droppedRequirementCount} requirement(s) that failed quote verification (model: ${modelUsed}).`,
    );
  }

  // 2. NOC integrity: unknown codes become 'model_asserted' with confidence
  //    capped at 'low' plus an unresolvedQuestion. Import here to avoid a
  //    client-bundle dependency on the database file.
  const { NOC_2021_TECH_CODES } = await import('../src/data/nocDatabase');
  const { nocCandidates, extraUnresolvedQuestions } = enforceNocIntegrity(
    modelBrief.interpretation.nocCandidates,
    NOC_2021_TECH_CODES.map((noc) => noc.code),
  );

  const brief: AlignmentBrief = {
    contractVersion: CONTRACT_VERSION,
    posting: {
      title: modelBrief.posting.title,
      organization: modelBrief.posting.organization,
      location: modelBrief.posting.location,
      deadline: modelBrief.posting.deadline,
      sourceUrl: input.postingUrl,
    },
    interpretation: {
      likelyOccupationTitle: modelBrief.interpretation.likelyOccupationTitle,
      nocCandidates,
      ambiguityNotes: modelBrief.interpretation.ambiguityNotes,
    },
    requirements: validated.requirements,
    hardConstraints: validated.hardConstraints,
    assumptions: modelBrief.assumptions,
    unresolvedQuestions: [
      ...modelBrief.unresolvedQuestions,
      ...extraUnresolvedQuestions,
    ],
    // 3. Counts are recomputed server-side. Model-supplied counts are ignored.
    counts: validated.counts,
    disclaimer: DISCLAIMER,
  };

  // 4. Final sanity check: no score-like fields or percentages anywhere.
  assertNoScores(brief);

  return brief;
}
