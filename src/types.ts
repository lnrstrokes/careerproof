/**
 * Shared client-side types. The AlignmentBrief contract lives in
 * server/schema.ts (pure zod + TS, safe to import type-only from src/).
 */
export type {
  AlignmentBrief,
  AnalyzeInput,
  AnalyzeRequestBody,
  CandidateEvidence,
  EvidenceStatus,
  NocCandidate,
  NocCodeInfo,
  Requirement,
} from '../server/schema';

export type AppTab = 'assessment' | 'noc-directory' | 'ats-cv';

/** POST /api/analyze success payload. */
export interface AnalysisResponse {
  success: true;
  brief: import('../server/schema').AlignmentBrief;
}

/** POST /api/analyze error payload (the only alternative to success). */
export interface AnalysisErrorPayload {
  success: false;
  code: 'INVALID_INPUT' | 'PAYLOAD_TOO_LARGE' | 'AI_INVALID_OUTPUT' | 'AI_UNAVAILABLE';
  message: string;
  fields?: string[];
}

export type AnalysisResultPayload = AnalysisResponse | AnalysisErrorPayload;
