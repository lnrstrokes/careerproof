/**
 * Groq client, model cascade, and structured JSON generation.
 * Server-side only. Reads GROQ_API_KEY from the environment and talks to
 * Groq's OpenAI-compatible /chat/completions endpoint with plain fetch -
 * no SDK dependency. Replaces the former Gemini client with no change to
 * the error contract: on any failure the user gets an error, never content.
 *
 * Groq JSON mode guarantees valid JSON (the prompt must contain the word
 * "JSON", which SYSTEM_INSTRUCTION does). The payload is additionally
 * validated against the same zod schema for every model, as before.
 */
import { AnalysisError } from './schema';
import { alignmentBriefSchema, type AlignmentBrief } from './schema';

const GROQ_BASE_URL =
  (process.env.GROQ_BASE_URL ?? 'https://api.groq.com/openai/v1').replace(
    /\/+$/,
    '',
  );

/**
 * Current Groq production models, most capable first. Cascade order:
 * - llama-3.3-70b-versatile: strongest general model, default choice
 * - openai/gpt-oss-120b: strong open-weight fallback
 * - openai/gpt-oss-20b: fast mid-tier fallback
 * - llama-3.1-8b-instant: last-resort availability fallback
 */
export const MODEL_CASCADE = [
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'llama-3.1-8b-instant',
] as const;

export const GENERATION_TEMPERATURE = 0.2;
export const MAX_OUTPUT_TOKENS = 8192;
const ATTEMPTS_PER_MODEL = 2;
const RETRY_DELAY_MS = 500;
const REQUEST_TIMEOUT_MS = 45_000;

export interface StructuredGenerationResult {
  brief: AlignmentBrief;
  modelUsed: string;
}

interface GroqChatResponse {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string; type?: string; code?: string };
}

/**
 * The one and only way content can be produced. No key means nothing can be
 * generated, and per the error contract the user gets an error - never
 * synthesized content.
 */
function requireGroqApiKey(): string {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new AnalysisError(
      503,
      'AI_UNAVAILABLE',
      'Analysis is temporarily unavailable. Nothing was generated - please try again.',
    );
  }
  return apiKey;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  return JSON.parse(withoutFence);
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function messageLooksRetryable(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('429') ||
    lower.includes('rate limit') ||
    lower.includes('quota') ||
    lower.includes('overloaded') ||
    lower.includes('high demand') ||
    lower.includes('service unavailable') ||
    lower.includes('timeout')
  );
}

interface ChatAttemptError {
  status: number;
  message: string;
}

async function callGroqOnce(
  apiKey: string,
  model: string,
  systemInstruction: string,
  userPrompt: string,
): Promise<string> {
  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: GENERATION_TEMPERATURE,
      max_tokens: MAX_OUTPUT_TOKENS,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  let payload: GroqChatResponse | null = null;
  try {
    payload = (await response.json()) as GroqChatResponse;
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const apiMessage = payload?.error?.message ?? `HTTP ${response.status}`;
    throw {
      status: response.status,
      message: apiMessage,
    } satisfies ChatAttemptError;
  }

  const text = payload?.choices?.[0]?.message?.content ?? '';
  if (!text.trim()) {
    throw { status: 0, message: 'Empty response from model' } satisfies ChatAttemptError;
  }
  return text;
}

/**
 * Runs the model cascade over Groq. Every model receives the IDENTICAL
 * request shape and every response is validated against the SAME zod schema;
 * a schema failure counts as that model failing. Throws AnalysisError 503
 * when all attempts fail.
 */
export async function generateStructured(
  systemInstruction: string,
  userPrompt: string,
): Promise<StructuredGenerationResult> {
  const apiKey = requireGroqApiKey();
  let lastError: unknown = null;

  for (const model of MODEL_CASCADE) {
    for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt++) {
      try {
        const text = await callGroqOnce(
          apiKey,
          model,
          systemInstruction,
          userPrompt,
        );

        // Validate against the same zod schema for every model.
        const parsed = alignmentBriefSchema.parse(extractJson(text));
        return { brief: parsed as AlignmentBrief, modelUsed: model };
      } catch (err) {
        lastError = err;

        const status = (err as ChatAttemptError)?.status ?? 0;
        const message =
          (err as ChatAttemptError)?.message ?? String(err ?? '');

        // A 404 means the model id does not resolve (retired/renamed): drop
        // it from the effective cascade and move to the next model.
        if (status === 404) {
          console.info(
            `[CareerProof] Model ${model} not found (404). Removing from cascade and trying next candidate.`,
          );
          break;
        }

        if (err instanceof SyntaxError || (err as Error)?.name === 'ZodError') {
          console.info(
            `[CareerProof] Model ${model} produced invalid JSON/schema (attempt ${attempt}). Retrying...`,
          );
        } else if (isRetryableStatus(status) || messageLooksRetryable(message)) {
          console.info(
            `[CareerProof] Model ${model} rate-limited/unavailable (attempt ${attempt}). Retrying...`,
          );
          break; // transport-level failure: move to the next model now
        }

        if (attempt < ATTEMPTS_PER_MODEL) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
    }
  }

  console.error('[CareerProof] All models in the cascade failed.', lastError);
  throw new AnalysisError(
    503,
    'AI_UNAVAILABLE',
    'Analysis is temporarily unavailable. Nothing was generated - please try again.',
  );
}
