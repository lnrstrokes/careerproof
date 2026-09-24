# CareerProof — Canada Application Alignment

An occupation-agnostic, evidence-traceable job application alignment tool.
CareerProof compares **one job advert** against **your CV or your own written
statements** and reports, requirement by requirement, what your own words
support.

Design rules enforced in code (see `server/schema.ts`, `server/analyze.ts`,
`server/groq.ts`):

- Every reported requirement quotes the advert **character-for-character**, or
  it is not included.
- A requirement is marked **Supported** only when your own input (the CV, the
  statement text, or an optional context field) contains a verbatim quote that
  proves it. No quote → not supported.
- **Not determined** (`unknown`) is used when your input is silent.
  Absence of evidence is not evidence of absence.
- Licence, work authorization, location, and schedule requirements are always
  **hard constraints** to verify in the real world.
- No scores, percentages, probabilities, or rankings — the server rejects any
  output containing them.
- No resume rewriting. The model may only point at evidence you already gave.
- If the model's output fails schema or quote validation, you get an error —
  never placeholder, sample, or canned content.

## How the analysis works

1. You paste a job advert and your CV (or plain written statements).
2. The server sends both to Groq's OpenAI-compatible API (`GROQ_API_KEY`,
   JSON mode) over a cascade of current production models:
   `llama-3.3-70b-versatile` → `openai/gpt-oss-120b` → `openai/gpt-oss-20b`
   → `llama-3.1-8b-instant`.
3. Every returned requirement is re-verified server-side: the advert quote
   must exist verbatim in the advert, and every evidence quote must exist
   verbatim in the text you supplied. Unsupported claims are downgraded to
   *Not determined*; too many failures and the whole brief is discarded with
   an error instead of being served.

## Local development

```bash
npm install
npm run dev        # tsx server.ts — Express + Vite middleware on :3000
npm run lint       # tsc --noEmit
npm test           # vitest run
```

Set your Groq API key for local dev either by creating a `.env` file:

```
GROQ_API_KEY=your-key-here
```

or by running `vercel env pull .env` after adding the key to your Vercel
project. (`.env.example` shows the variable.)

## Deploying to Vercel

1. Import the repository into Vercel (framework preset: **Vite**).
2. Under **Project Settings → Environment Variables**, add `GROQ_API_KEY`
   for both **Production** and **Preview**.
3. Deploy. `vercel.json` configures:
   - build command `vite build` (no server bundling in the platform build)
   - static output in `dist/`
   - `api/analyze.ts` as a serverless function (`maxDuration` 60s)
   - an SPA rewrite that excludes `/api/*` routes

Local values can be synced from Vercel with:

```bash
vercel link
vercel env pull .env
```

## API

`POST /api/analyze`

```json
{
  "postingText": "full job advert text (required, max 20,000 chars)",
  "candidateText": "your CV/resume content or your own statements (required, max 20,000 chars)",
  "postingUrl": "optional",
  "educationText": "optional correction/supplement to the CV",
  "certificationsText": "optional correction/supplement to the CV",
  "languageText": "optional correction/supplement to the CV",
  "currentLocationText": "optional correction/supplement to the CV",
  "targetProvinces": ["optional", "array"]
}
```

Evidence quotes may come from `candidateText` **or** any of the optional
context fields — all of it is treated as the candidate's own words and is
verified verbatim before anything is shown.

Success: `200 { success: true, brief: AlignmentBrief }`

Error contract — there are no exceptions, and no fallback content is ever
generated:

| Status | Code | When |
|-------:|------|------|
| 400 | `INVALID_INPUT` | missing/empty required input (`fields` lists them) |
| 413 | `PAYLOAD_TOO_LARGE` | body over 1 MB or a text field over 20,000 chars |
| 502 | `AI_INVALID_OUTPUT` | model output failed schema or quote validation |
| 503 | `AI_UNAVAILABLE` | model unavailable/rate-limited after all retries |

## Limits — what this tool cannot know

CareerProof cannot and does not tell you any of the following:

- **No employer hiring probability.** Nothing in the output predicts whether
  an employer will interview or hire you. There are no scores or percentages
  anywhere in the output.
- **No labour market data.** No demand statistics, salary surveys, vacancy
  counts, or market outlooks for any occupation or region.
- **No licensing determinations.** It cannot tell you whether a regulator
  would accept your credentials, whether you need re-certification, or which
  body governs your occupation in a province. Licensing requirements must be
  confirmed with the regulator itself.
- **No immigration eligibility.** It does not assess eligibility for any
  immigration program, does not assign or evaluate classification codes for
  official use, and never states whether you qualify for anything. Immigration
  questions must be verified with the official government source.
- **Nothing that is not quoted from your own input.** Every finding traces to
  either the advert text or the CV/statements you supplied. If you did not
  write it, the tool treats it as *Not determined*.

The NOC reference set in `src/data/nocDatabase.ts` is a curated, categorized
subset of the official NOC 2021 classification: 174 occupations across all ten
broad categories, with titles and lead statements copied verbatim from the
official dataset and a link to each entry's official ESDC profile. Informal
"common job titles" labels are search helpers only. NOC codes shown in a brief
are candidates to verify against the official Government of Canada NOC, never
conclusions.
