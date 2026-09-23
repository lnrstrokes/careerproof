# SYSTEM AUDIT & ARCHITECTURAL HANDOFF
**Project:** Canadian Tech Job Search & Immigration Navigation Engine
**Applet ID:** `f141131c-9626-45a4-bd20-8e2ed6489361`
**Date of Audit:** 2026-09-23

---

## TABLE OF CONTENTS
1. [Phase 1 — Inventory & Topology](#phase-1--inventory--topology)
2. [Phase 2 — Stack & Runtime](#phase-2--stack--runtime)
3. [Phase 3 — Architecture & Data Flow](#phase-3--architecture--data-flow)
4. [Phase 4 — Prompts & Model Behavior](#phase-4--prompts--model-behavior)
5. [Phase 5 — Data & Schemas](#phase-5--data--schemas)
6. [Phase 6 — Deployment & Ops](#phase-6--deployment--ops)
7. [Phase 7 — Critical Findings & Defects](#phase-7--critical-findings--defects)
8. [Phase 8 — Roadmap & Remediation Plan](#phase-8--roadmap--remediation-plan)

---

## PHASE 1 — INVENTORY & TOPOLOGY

### 1. Complete File Inventory

| File Path | Lines | Bytes | Language / Type | 1-Line Purpose | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/.env.example` | 10 | 445 | Config / Env | Template for required runtime environment variables (`GEMINI_API_KEY`, `APP_URL`). | **VERIFIED** |
| `/.gitignore` | 9 | 73 | Config / Git | Specifies deliberately untracked and build output files to ignore. | **VERIFIED** |
| `/bun.lock` | 852 | 96,724 | Lockfile | Lockfile for Bun package dependencies. | **VERIFIED** |
| `/index.html` | 19 | 878 | HTML5 | Web application HTML entry point and metadata viewport specification. | **VERIFIED** |
| `/metadata.json` | 7 | 301 | JSON | AI Studio applet manifest declaring name, description, and runtime capabilities. | **VERIFIED** |
| `/package.json` | 37 | 984 | JSON | Node.js project manifest, dependencies, and lifecycle build scripts. | **VERIFIED** |
| `/server.ts` | 472 | 22,737 | TypeScript | Express backend, Gemini AI API integration, fallback engines, and Vite middleware. | **VERIFIED** |
| `/tsconfig.json` | 27 | 508 | JSON | TypeScript compiler configuration (ES2022, bundler module resolution). | **VERIFIED** |
| `/vite.config.ts` | 23 | 708 | TypeScript | Vite bundler config with React plugin, Tailwind CSS v4, and HMR controls. | **VERIFIED** |
| `/src/main.tsx` | 11 | 231 | TypeScript (React) | Client-side React DOM root bootstrap mounting `<App />`. | **VERIFIED** |
| `/src/index.css` | 2 | 23 | CSS | Global stylesheet importing `@import "tailwindcss";`. | **VERIFIED** |
| `/src/App.tsx` | 294 | 13,661 | TypeScript (React) | Root application layout, navigation tabs, state management, and API orchestration. | **VERIFIED** |
| `/src/types.ts` | 60 | 1,258 | TypeScript | Domain TypeScript interfaces (`CandidateInput`, `WorkExperience`, `NocCodeInfo`, etc.). | **VERIFIED** |
| `/src/data/nocDatabase.ts` | 183 | 7,806 | TypeScript | Static registry of 10 Canadian tech NOC 2021 codes, duties, and provincial matrices. | **VERIFIED** |
| `/src/data/presets.ts` | 220 | 10,266 | TypeScript | Fixture scenarios (Toronto full-stack, Vancouver data pivot, Calgary DevOps). | **VERIFIED** |
| `/src/components/Header.tsx` | 111 | 4,873 | TypeScript (React) | Application navigation bar, tab switches, and live guidance status indicators. | **VERIFIED** |
| `/src/components/AssessmentForm.tsx` | 465 | 21,697 | TypeScript (React) | Comprehensive candidate input form, CV heuristic scanner, and experience tracker. | **VERIFIED** |
| `/src/components/MandatoryAssessmentView.tsx` | 303 | 13,553 | TypeScript (React) | Accordion viewer for 6 mandatory assessment sections and NOC strategic pivot card. | **VERIFIED** |
| `/src/components/NocDirectoryPage.tsx` | 297 | 17,013 | TypeScript (React) | Interactive NOC code directory with search, duty breakdowns, and provincial matrices. | **VERIFIED** |
| `/src/components/ReferenceLetterPage.tsx` | 324 | 15,702 | TypeScript (React) | Dedicated tab for configuring and previewing IRCC reference letters. | **VERIFIED** |
| `/src/components/ReferenceLetterModal.tsx` | 281 | 12,371 | TypeScript (React) | Modal dialog for generating AI-powered IRCC employment reference letters. | **VERIFIED** |
| `/src/components/AtsCvBuilderSection.tsx` | 185 | 9,762 | TypeScript (React) | Canadian ATS-compliant resume preview with blurred premium sections. | **VERIFIED** |
| `/src/components/NocLookupModal.tsx` | 208 | 10,940 | TypeScript (React) | Quick-access modal dialog for searching and inspecting NOC codes from reports. | **VERIFIED** |
| `/src/components/PremiumNavigationModal.tsx` | 149 | 8,220 | TypeScript (React) | Modal presenting immigration insurance value proposition and tier features. | **VERIFIED** |

---

### 2. Directory Topology

```
/
├── .env.example
├── .gitignore
├── bun.lock
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── types.ts
    ├── components/
    │   ├── AssessmentForm.tsx
    │   ├── AtsCvBuilderSection.tsx
    │   ├── Header.tsx
    │   ├── MandatoryAssessmentView.tsx
    │   ├── NocDirectoryPage.tsx
    │   ├── NocLookupModal.tsx
    │   ├── PremiumNavigationModal.tsx
    │   ├── ReferenceLetterModal.tsx
    │   └── ReferenceLetterPage.tsx
    └── data/
        ├── nocDatabase.ts
        └── presets.ts
```

---

### 3. Application Entry Points

- **Client Entry Point**: `/src/main.tsx` (Bootstraps `App.tsx` into `#root` inside `/index.html`).
- **Development Server Entry Point**: `/server.ts` via `tsx server.ts` (Binds Express to port 3000 and mounts Vite in middleware mode).
- **Production Server Entry Point**: `/dist/server.cjs` via `node dist/server.cjs` (Express serving precompiled static assets from `/dist`).
- **Configuration Entry Points**: `/vite.config.ts`, `/tsconfig.json`, `/metadata.json`.

---

### 4. Git Repository Status

- **Status**: No `.git` directory present in container filesystem (managed as cloud workspace).
- **Ignored Patterns**: `node_modules/`, `build/`, `dist/`, `coverage/`, `.DS_Store`, `*.log`, `.env*` (except `!.env.example`).

---

### 5. Lines of Code Summary by Language

| Language / Format | Files | Total Lines | Code Percentage |
| :--- | :--- | :--- | :--- |
| **TypeScript / TSX** | 16 | 3,574 | 79.1% |
| **JSON** | 3 | 71 | 1.6% |
| **HTML** | 1 | 19 | 0.4% |
| **CSS** | 1 | 2 | 0.05% |
| **Config & Lockfiles** | 3 | 871 | 18.9% |
| **Total** | **24** | **4,537** | **100.0%** |

---

## PHASE 2 — STACK & RUNTIME

### 1. Core Stack & Runtime Specifications

| Category | Technology | Exact Version / Identifier | Evidence Status | Citation |
| :--- | :--- | :--- | :--- | :--- |
| **Runtime Environment** | Node.js | v20+ (`@types/node` `^22.14.0`) | **VERIFIED** | `/package.json`:27 |
| **Package Manager** | Bun / npm (Bun lockfile present: `bun.lock`) | `bun.lock` in root | **VERIFIED** | `/bun.lock` (repo root) |
| **Frontend Framework** | React | `^19.0.1` | **VERIFIED** | `/package.json`:21 |
| **Frontend DOM** | React DOM | `^19.0.1` | **VERIFIED** | `/package.json`:22 |
| **Language** | TypeScript | `~5.8.2` (ES2022 target) | **VERIFIED** | `/package.json`:32, `/tsconfig.json`:3-4 |
| **Bundler / Dev Server** | Vite | `^6.2.3` | **VERIFIED** | `/package.json`:24, 33 |
| **Server Framework** | Express | `^4.21.2` (with `@types/express` `^4.17.21`) | **VERIFIED** | `/package.json`:18, 34 |
| **Server Bundler** | esbuild | `^0.25.0` | **VERIFIED** | `/package.json`:29 |
| **TypeScript Execution** | tsx | `^4.21.0` | **VERIFIED** | `/package.json`:31 |
| **CSS / Styling** | Tailwind CSS v4 | `^4.1.14` with `@tailwindcss/vite` `^4.1.14` | **VERIFIED** | `/package.json`:15, 30 |
| **UI Icon Library** | Lucide React | `^0.546.0` | **VERIFIED** | `/package.json`:19 |
| **UI Animation Library** | Motion (Framer Motion) | `^12.23.24` | **VERIFIED** | `/package.json`:20 |
| **Markdown Renderer** | react-markdown | `^10.1.0` | **VERIFIED** | `/package.json`:23 |
| **Environment Config** | dotenv | `^17.2.3` | **VERIFIED** | `/package.json`:17 |

---

### 2. AI SDK & Model Identifiers

| Parameter | Value | Evidence Status | Citation |
| :--- | :--- | :--- | :--- |
| **AI SDK** | `@google/genai` (version `^2.4.0`) | **VERIFIED** | `/package.json`:14, `/server.ts`:4 |
| **Primary Model** | `gemini-2.5-flash` | **VERIFIED** | `/server.ts`:141 |
| **Secondary Fallback Model** | `gemini-3.7-flash` | **VERIFIED** | `/server.ts`:142 |
| **Tertiary Fallback Model** | `gemini-3.1-pro-preview` | **VERIFIED** | `/server.ts`:143 |
| **Quaternary Fallback Model** | `gemini-flash-latest` | **VERIFIED** | `/server.ts`:144 |
| **Determinism Fallback** | Hardcoded deterministic engine (`generateFallbackAssessment`) | **VERIFIED** | `/server.ts`:183-324, 384-386 |
| **Generation Temperature** | `0.2` (low entropy for factual consistency) | **VERIFIED** | `/server.ts`:381 |

---

### 3. Execution, Build, & Deployment Commands

All lifecycle scripts are defined in `/package.json`:6-12.

| Script Name | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `tsx server.ts` | Launches Node.js backend on port 3000 with Vite middleware in SPA mode. |
| `npm run build` | `vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs` | Builds static assets into `/dist` and bundles `server.ts` into `/dist/server.cjs`. |
| `npm run start` | `node dist/server.cjs` | Runs the production CJS server hosting static assets from `/dist`. |
| `npm run clean` | `rm -rf dist server.cjs` | Removes built artifacts. |
| `npm run lint` | `tsc --noEmit` | Executes TypeScript type checking across the entire project. |

---

### 4. Routing, State Management, & Persistence

| Architecture Domain | Current Implementation | Evidence Status | Citation |
| :--- | :--- | :--- | :--- |
| **Routing Architecture** | **In-memory tab state** (`'assessment' \| 'noc-directory' \| 'ref-letter' \| 'ats-cv'`) controlled via `useState` in `App.tsx`. No `react-router` or window hash routing used. | **VERIFIED** | `/src/App.tsx`:16, `/src/components/Header.tsx`:4, 36-67 |
| **State Management** | **React local & lifted state** (`useState`, `useMemo`). No Redux, Zustand, or Context API. | **VERIFIED** | `/src/App.tsx`:16-26, `/src/components/AssessmentForm.tsx`:12-25 |
| **Persistence (Storage)** | **None (Zero persistence)**. No `localStorage`, `sessionStorage`, cookies, IndexedDB, or SQL/NoSQL database. Form state and assessment results are lost upon page reload. | **VERIFIED** | `/src/App.tsx`:15-45 (Reload triggers Preset 0) |
| **External Services** | **Google Gemini API** (`https://generativelanguage.googleapis.com`) called exclusively server-side via `@google/genai`. | **VERIFIED** | `/server.ts`:14-28, 134-180 |

---

## PHASE 3 — ARCHITECTURE & DATA FLOW

### 1. Compact End-to-End Data Flow Diagram

```
[ User Interaction ]
   │
   ├─► Inputs: Resume, Job Description, Deadline, City, WES ECA, Roles
   │      │
   │      ├─► [AssessmentForm.tsx] (Client-side regex evaluation)
   │      │      ├─► Real-time Nigerian marker & ATS compliance checks (useMemo)
   │      │      └─► "Auto-Extract from CV" populates WorkExperience[] state
   │      │
   │      └─► User clicks "Generate Truthful Assessment" (or on initial load)
   │             │
   │             ▼
   │      [App.tsx :: runAnalysis]
   │             │
   │             ▼ HTTP POST /api/analyze (JSON payload: CandidateInput)
   │      [server.ts :: Express Router]
   │             │
   │             ├─► Format Structured Prompt + SYSTEM_INSTRUCTION
   │             │
   │             ├─► [generateWithRetry] (Server-Side)
   │             │      ├─► Try 1: gemini-2.5-flash
   │             │      ├─► Try 2: gemini-3.7-flash
   │             │      ├─► Try 3: gemini-3.1-pro-preview
   │             │      └─► Try 4: gemini-flash-latest
   │             │
   │             └─► (On 429 quota exhaustion, timeout, or failure)
   │                    └─► [generateFallbackAssessment] (Deterministic local engine)
   │             │
   │             ▼ HTTP 200 { success: true, markdownAnalysis: string }
   │      [App.tsx] -> setAnalysisResult(markdownAnalysis)
   │             │
   │             ▼
   │      [MandatoryAssessmentView.tsx]
   │             ├─► Regex-splits markdown into 6 distinct sections
   │             ├─► Manages accordion expanded/collapsed state (useState)
   │             ├─► Detects NOC mismatch & displays Strategic Pivot Card
   │             └─► Deep-links to NOC Directory & Ref Letter generator
   │
   ├─► [NocDirectoryPage.tsx] (Client-only state & filtering)
   │      └─► Searches / filters static nocDatabase.ts; deep-links to Ref Letter tab
   │
   ├─► [ReferenceLetterModal.tsx] -> POST /api/reference-letter -> Gemini / Fallback
   │   [ReferenceLetterPage.tsx]  -> Client-side synthesis from nocDatabase.ts -> Blur locked
   │
   └─► [AtsCvBuilderSection.tsx] (Client-only dynamic template)
          └─► Regex-extracts candidate name, tech skills, and duties -> Blur locked
```

---

### 2. Major Feature Execution & Data Flow Table

| Feature | User Action | Component | State & Triggers | API / Model Invocation | Output Handling | Loading / Error Behavior | Status | Citation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Dual-Horizon Assessment** | Click "Generate Truthful Assessment" | `AssessmentForm.tsx` & `App.tsx` | `isLoading=true`, `analysisResult=null` | `POST /api/analyze` calling `@google/genai` | Returns `{ success: true, markdownAnalysis }`; rendered by `MandatoryAssessmentView.tsx`. | Spin indicator; 3-attempt HTTP retry with backoff. If 429/503, returns deterministic fallback. | **VERIFIED** | `/src/App.tsx`:66-92, `/server.ts`:340-399 |
| **CV Heuristic Audit** | Types or pastes raw resume text | `AssessmentForm.tsx` | Computed `cvWarnings` via `useMemo` | None (Client regex) | Regex tests for `lagos\|abuja\|nysc`, marital status, LGA, DOB, and quantified metrics. | Instantaneous synchronous banner update. No errors possible. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:27-44, 180-230 |
| **Work Experience Extractor** | Clicks "Auto-Extract from CV" | `AssessmentForm.tsx` | Updates `experiences` state | None (Client regex) | Splits text by newline and matches job title patterns (`Senior\|Engineer\|Developer`) and dates. | Populates table; sets `hasReferenceLetter=false` ("Claimed - Requires Evidence"). | **VERIFIED** | `/src/components/AssessmentForm.tsx`:80-115 |
| **Assessment Breakdown** | Clicks accordion header | `MandatoryAssessmentView.tsx` | `openSections` | None (Client state) | Splits markdown string using regex (`/^### Section \d+:? /m`) into 6 keyed arrays. | Collapses / expands section cards cleanly without re-fetching. | **VERIFIED** | `/src/components/MandatoryAssessmentView.tsx`:42-70 |
| **NOC Directory & PNP Matrix** | Types keyword or selects NOC card | `NocDirectoryPage.tsx` | `searchTerm`, `selectedCode` | None (Static query) | Filters `NOC_2021_TECH_CODES` by code, title, keywords. Displays duties & Ontario/BC/Alberta PNP cards. | Immediate client filter. Shows empty result message on no match. | **VERIFIED** | `/src/components/NocDirectoryPage.tsx`:15-60 |
| **Reference Letter (Modal)** | Configures fields and clicks "Generate IRCC Draft" | `ReferenceLetterModal.tsx` | `isLoading=true`, `letterResult=null` | `POST /api/reference-letter` | Returns `{ success: true, letterDraft }`. Displays draft behind frosted-glass overlay with unlock CTA. | Spin animation; network retries. Degrades to `generateFallbackReferenceLetter`. | **VERIFIED** | `/src/components/ReferenceLetterModal.tsx`:34-75, `/server.ts`:401-448 |
| **Reference Letter (Page)** | Configures fields and clicks "Generate IRCC Draft" | `ReferenceLetterPage.tsx` | `isLoading=true`, `letterResult=null` | None (Client template) | Concatenates inputs with `selectedNocInfo.mainDuties`. Displays formatted letter behind blur lock. | 600ms simulated loading timer via `setTimeout`. | **VERIFIED** | `/src/components/ReferenceLetterPage.tsx`:33-70 |
| **Canadian ATS CV Preview** | Navigates to "Canadian ATS CV" tab | `AtsCvBuilderSection.tsx` | Derived from props | None (Client regex) | Regex extracts candidate full name, matches 16 technical keywords, pulls first bullet point. | Rendered immediately upon tab switch. | **VERIFIED** | `/src/components/AtsCvBuilderSection.tsx`:20-40, 90-180 |

---

## PHASE 4 — PROMPTS & MODEL BEHAVIOR

### 1. System Prompt: Dual-Horizon Assessment Engine

- **File Path**: `/server.ts`:30-132
- **Evidence Status**: **VERIFIED**
- **Inputs**: None directly; applied as `systemInstruction` in `ai.models.generateContent`.
- **Expected Output Shape**: Raw markdown string adhering to 6 mandatory numbered section headers (`### 📊 Section 1:` through `### 🛡️ Section 6:`).
- **Where Consumed**: Sent to client as `{ success: true, markdownAnalysis }` and parsed by `/src/components/MandatoryAssessmentView.tsx`:42-70.

```markdown
You are a Canadian Tech Job Search & Immigration Navigation Engine. Your purpose is to help international tech professionals secure Canadian employment while truthfully navigating NOC alignment for future immigration pathways.

CORE PRINCIPLES:
1. JOB SEARCH FIRST: Optimize for getting interviews, not immigration points. Immigration readiness is a byproduct of job search optimization.
2. TRUTHFUL REFRAMING ONLY: Never invent experience, metrics, certifications, or projects. Only reframe, clarify, or highlight transferable aspects of what the user explicitly provided.
3. AUTOMATIC ASSESSMENT: Generate analysis immediately upon receiving resume + job description. No button clicks, no confirmation prompts.
4. NOC PIVOT INTELLIGENCE: Recommend NOC code changes ONLY when the user's actual experience aligns better with an alternative NOC, explaining why it strengthens both job applications AND future immigration options.
5. DEADLINE-DRIVEN LOGIC: All recommendations must respect the application deadline. Never suggest "In Progress" certifications for deadlines <14 days.

🚫 STRICTLY BANNED OUTPUTS:
- "Canadian Immigration Readiness Score" or gamified immigration points
- "Nigerian Context & Canadian NOC Mapping Guide" (generic educational content)
- "Generate Bridge Project" or any fabricated projects/experience
- "Re-Optimize AI" buttons or magic optimization promises
- Generic tips like "Highlight remote contracts" without specific actionable reframing
- Recommending certifications as "In Progress" for urgent deadlines (<14 days)

✅ MANDATORY OUTPUT STRUCTURE (Generate in this EXACT order):
### 📊 Section 1: Automatic Job Match Assessment
...
### 🎯 Section 2: NOC Alignment & Strategic Pivot Analysis
...
### 🔍 Section 3: Critical Gap Analysis
...
### ✍️ Section 4: Truthful Optimization Opportunities
...
### 📅 Section 5: Deadline-Driven Action Plan
...
### 🛡️ Section 6: Verification & Immigration Readiness Flags
...
IMPORTANT EXECUTION RULES:
- Strictly follow the above 6 headers and formatting in exact order.
- Respect the application deadline rule: If deadline <= 14 days, generate ONLY Phase 1 + Do NOT list in Section 5. If deadline > 14 days, generate Phase 1 + Phase 2 in Section 5.
- Do NOT output any greeting, preamble, introductory paragraphs, or conclusions outside the 6 sections.
```

---

### 2. User Prompt Template: `/api/analyze`

- **File Path**: `/server.ts`:353-376
- **Evidence Status**: **VERIFIED**

```typescript
// Bounded Excerpt from /server.ts:353-376
const prompt = `Perform the Canadian Tech Job Search & Immigration Navigation analysis for this candidate:

CANDIDATE PROFILE:
Target Role Requested: ${targetRole || 'Not specified'}
Target Canadian City: ${targetCity || 'Toronto, ON'}
Application Deadline: ${deadlineDays || 7} days (${deadlineDate || 'Upcoming'})
Current Assumed NOC Code: ${currentNocCode || '21232 (Software developers and programmers)'}
Education: ${educationDegree || 'Computer Science Degree'}
WES ECA Status: ${hasWesEca ? 'Completed & Verified' : 'Not Started'}

STRUCTURED WORK EXPERIENCE & VERIFICATION:
${experienceContext}

CANDIDATE RESUME:
"""
${resumeText}
"""

TARGET JOB DESCRIPTION:
"""
${jobDescriptionText}
"""

Generate the complete assessment now adhering strictly to the MANDATORY 6 SECTIONS in exact order.`;
```

---

### 3. User Prompt Template: `/api/reference-letter`

- **File Path**: `/server.ts`:410-426
- **Evidence Status**: **VERIFIED**

```typescript
// Bounded Excerpt from /server.ts:410-426
const prompt = `Generate an official IRCC-compliant Canadian Immigration Employment Reference Letter Draft for an international tech professional.

DETAILS:
- Company Name: ${companyName || '[Company Name]'}
- Official Role Title: ${roleTitle || '[Job Title]'}
- Target NOC Code: ${nocCode || '21232 Software Developers and Programmers'}
- Employment Period: ${startDate || 'YYYY-MM'} to ${endDate || 'Present'}
- Hours Per Week: ${hoursPerWeek || '40 hours/week (Full-Time)'}
- Annual Salary / Compensation: ${salary || '[Salary Amount + Currency]'}
- Main Key Duties: ${duties || 'Software design, web development, code review, API integration'}

REQUIREMENTS FOR IRCC REFERENCE LETTER:
1. Formal official letterhead layout placeholders.
2. Clear confirmation of full-time employment, exact dates, job title, hours/week, and annual salary.
3. 5-7 bullet points of duties written to match the specified NOC lead statement and duties truthfully without generic fluff.
4. Official supervisor / HR signature block containing name, title, company email, and official contact phone number.
5. Explicit note highlighting IRCC checklist compliance.`;
```

---

### 4. Model Parameters & Inference Configuration

| Parameter | `/api/analyze` Setting | `/api/reference-letter` Setting | Citation |
| :--- | :--- | :--- | :--- |
| **Model** | `gemini-2.5-flash` (primary) | `gemini-2.5-flash` (primary) | `/server.ts`:141 |
| **Temperature** | `0.2` | `0.1` | `/server.ts`:381, 430 |
| **TopP / TopK** | Default (unspecified in SDK call) | Default (unspecified in SDK call) | `/server.ts`:151-159 |
| **Max Tokens** | Default (unspecified in SDK call) | Default (unspecified in SDK call) | `/server.ts`:151-159 |
| **Response Schema (JSON)** | None (Outputs raw markdown) | None (Outputs raw text) | `/server.ts`:151-159 |
| **Safety Settings** | Default Google GenAI settings | Default Google GenAI settings | `/server.ts`:151-159 |
| **Tool / Function Declarations** | None (`tools: []`) | None (`tools: []`) | `/server.ts`:151-159 |

---

### 5. Retry, Model Cascade, & Error Fallback Logic

- **Model Cascade List**: `["gemini-2.5-flash", "gemini-3.7-flash", "gemini-3.1-pro-preview", "gemini-flash-latest"]` (`/server.ts`:140-145).
- **Retry Bounds**: 2 attempts per candidate model with a 500ms delay between attempts (`/server.ts`:149, 176).
- **Fast-Fail Conditions**: If status code `429`, `503`, `404` or error text includes `"quota"`, `"exhausted"`, `"rate-limit"`, or `"high demand"`, the loop immediately aborts the current model and advances to the next candidate model (`/server.ts`:167-173).
- **Deterministic Hardcoded Fallbacks**:
  - If all 4 models fail or `GEMINI_API_KEY` is missing/invalid, `/server.ts` executes `generateFallbackAssessment(req.body)` (`/server.ts`:186-268) and `generateFallbackReferenceLetter(req.body)` (`/server.ts`:271-322).
  - The API always returns HTTP `200` with `{ success: true, markdownAnalysis }` or `{ success: true, letterDraft }` to prevent UI blanking.

---

### 6. Known Prompt & Behavioral Ambiguities

| Area | Current Behavior | Evidence Status | Citation |
| :--- | :--- | :--- | :--- |
| **No Structured JSON Output** | The model outputs freeform markdown instead of structured JSON. The frontend relies on regular expressions (`markdownContent.split(/^### Section \d+:? /m)`) to parse the sections. If the model alters the header syntax slightly (e.g. omitting the emoji or colon), the split parser fails or groups sections together. | **VERIFIED** | `/server.ts`:378-382, `/src/components/MandatoryAssessmentView.tsx`:42-70 |
| **NOC Pivot Detection Parser** | The frontend detects a recommended pivot by scanning markdown with `markdownContent.match(/\*\*Recommended NOC \(if applicable\):\*\*\s*([^\n\r]+)/i)`. If the model writes "N/A" or "None", the UI treats that string as the recommended NOC unless specifically filtered. | **VERIFIED** | `/src/components/MandatoryAssessmentView.tsx`:35-37 |
| **Zero Grounding Verification** | The prompt commands the model not to invent metrics or roles ("TRUTHFUL REFRAMING ONLY"), but without a tool execution step or grounding retrieval, LLM hallucinations remain dependent entirely on system instruction adherence. | **VERIFIED** | `/server.ts`:34 |

---

## PHASE 5 — DATA & SCHEMAS

### 1. User Input Fields & Validation Rules

| Input Field Name | UI Label / Element | Type | Validation Rules (Client / Server) | Evidence Status | Citation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `resumeText` | "Paste Candidate Resume / CV Text" (`<textarea>`) | `string` | **Required**: Client checks `!resumeText.trim()` (`alert()`); Server checks `!resumeText` and returns HTTP `400`. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:143-145, `/server.ts`:340-342 |
| `jobDescriptionText` | "Paste Canadian Job Posting Text" (`<textarea>`) | `string` | **Required**: Client checks `!jobDescriptionText.trim()` (`alert()`); Server checks `!jobDescriptionText` and returns HTTP `400`. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:143-145, `/server.ts`:340-342 |
| `targetRole` | "Target Canadian Tech Role" (`<input type="text">`) | `string` | Optional on client (defaults to preset title); fallback to `'Not specified'` on server. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:264-270, `/server.ts`:356 |
| `targetCity` | "Target Canadian City & Province" (`<input type="text">`) | `string` | Optional on client; fallback to `'Toronto, ON'` on server. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:277-283, `/server.ts`:357 |
| `deadlineDays` | "Application Deadline Urgency" (Radio buttons: 5, 10, 21, 30 days) | `number` | Restricted to preset radio integers or positive number; fallback to `7` on server. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:290-310, `/server.ts`:358 |
| `deadlineDate` | Computed from `deadlineDays` (`string`) | `string` | Auto-calculated date string (`YYYY-MM-DD`); fallback to `'Upcoming'` on server. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:18-20, `/server.ts`:358 |
| `educationDegree` | "Highest Completed Degree & University" (`<input type="text">`) | `string` | Optional; fallback to `'Degree Extracted from CV'` on client, `'Computer Science Degree'` on server. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:155, `/server.ts`:360 |
| `hasWesEca` | "WES Educational Credential Assessment (ECA) Verified" (`<input type="checkbox">`) | `boolean` | Boolean toggle; false by default if unchecked. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:328-333, `/server.ts`:361 |
| `experiences` | "IRCC Work Experience & Letterhead Tracker" (Dynamic rows) | `WorkExperience[]` | Optional; rows can be added, deleted, or auto-extracted. Default fallback string if empty. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:335-420, `/server.ts`:349-351 |

---

### 2. Domain Data Types & Interfaces

All TypeScript interfaces are declared in `/src/types.ts`:1-60.

```typescript
// Bounded Excerpt from /src/types.ts:1-36
export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  hasReferenceLetter: boolean;
  hasPayslips: boolean;
  isVerified: boolean;
}

export interface CandidateInput {
  resumeText: string;
  jobDescriptionText: string;
  jobTitle: string;
  companyName: string;
  targetCity: string;
  deadlineDays: number;
  deadlineDate: string;
  currentNocCode?: string;
  educationDegree: string;
  hasWesEca: boolean;
  experiences: WorkExperience[];
}

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
```

---

### 3. API Request & Response Shapes

#### Endpoint: `POST /api/analyze` (`/server.ts`:325-399)

- **Request Body**:
  ```json
  {
    "resumeText": "string (raw markdown/plain text)",
    "jobDescriptionText": "string (raw text)",
    "jobTitle": "string",
    "targetRole": "string (optional/mismatched)",
    "companyName": "string",
    "targetCity": "string",
    "deadlineDays": 7,
    "deadlineDate": "YYYY-MM-DD",
    "currentNocCode": "string (optional)",
    "educationDegree": "string",
    "hasWesEca": true,
    "experiences": [
      {
        "id": "exp-1",
        "company": "PayTech",
        "role": "Senior Engineer",
        "startDate": "2022-01-01",
        "endDate": "Present",
        "bullets": ["Led payment routing microservices"],
        "hasReferenceLetter": true,
        "hasPayslips": true,
        "isVerified": true
      }
    ]
  }
  ```
- **Response Body (HTTP 200)**:
  ```json
  {
    "success": true,
    "markdownAnalysis": "### 📊 Section 1: Automatic Job Match Assessment\n..."
  }
  ```
- **Error Response (HTTP 400)**:
  ```json
  {
    "error": "Resume and Job Description are required."
  }
  ```

#### Endpoint: `POST /api/reference-letter` (`/server.ts`:401-448)

- **Request Body**:
  ```json
  {
    "companyName": "string",
    "roleTitle": "string",
    "nocCode": "string",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM | Present",
    "duties": "string",
    "hoursPerWeek": "string",
    "salary": "string"
  }
  ```
- **Response Body (HTTP 200)**:
  ```json
  {
    "success": true,
    "letterDraft": "[OFFICIAL COMPANY LETTERHEAD]\n..."
  }
  ```

---

### 4. Sample / Fixture Data & Purpose

| Fixture Identifier | Title / Context | Purpose | Citation |
| :--- | :--- | :--- | :--- |
| `urgent-toronto-fullstack` | **Emanuel Adebayo** (Lagos, Nigeria applying to Toronto fintech, 5-day deadline) | Tests urgent (<14 day) deadline logic, Nigerian institution/NYSC parsing, and WES ECA verification. Loaded automatically on first boot. | `/src/data/presets.ts`:4-95, `/src/App.tsx`:29-44 |
| `pivot-vancouver-noc` | **Rahul Sharma** (Bangalore, India evaluating NOC 21232 to 21223 pivot, 21-day deadline) | Tests medium-term (>14 day) deadline roadmap (Phase 1 + Phase 2) and strategic NOC code pivoting from software engineering to data engineering. | `/src/data/presets.ts`:98-168 |
| `cloud-calgary-ops` | **Lucas Santos** (São Paulo, Brazil applying to Calgary cloud role, 10-day deadline) | Tests single-company experience parsing, Alberta Accelerated Tech Pathway alignment, and cloud certification gap analysis. | `/src/data/presets.ts`:170-219 |
| `NOC_2021_TECH_CODES` | 10 Tech NOC entries (21232, 21231, 21230, 21234, 21223, 21222, 21211, 22221, 21311, 21233) | Official ESDC 2021 lead statements and main duties used for reference letter templates and provincial matrix lookups. | `/src/data/nocDatabase.ts`:1-183 |

---

### 5. Field Discrepancies, Mismatches, & Unused Attributes

| Field Name | Where Declared | Discrepancy / Problem | Impact | Evidence Status | Citation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`jobTitle` vs. `targetRole`** | `CandidateInput` (`src/types.ts`:16) sends `jobTitle: targetRole`. | Server (`server.ts`:330) destructures `targetRole`, NOT `jobTitle`. | When submitting via the UI form, `req.body.targetRole` is undefined on the server, causing the prompt at `server.ts`:356 to fall back to `"Target Role Requested: Not specified"`. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:150, `/server.ts`:330, 356 |
| **`companyName`** | Declared in `CandidateInput` (`src/types.ts`:17). | Hardcoded to `""` in `AssessmentForm.tsx`:151; no `<input>` field exists in the form. | Field is ignored by the server for assessment generation. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:151 |
| **`currentNocCode`** | Declared in `CandidateInput` (`src/types.ts`:21). | Not passed by `AssessmentForm.tsx`:147-158. | Server destructures `currentNocCode` as undefined, defaulting to `'21232 (Software developers and programmers)'` in `server.ts`:359. | **VERIFIED** | `/src/components/AssessmentForm.tsx`:147-158, `/server.ts`:359 |
| **`WorkExperience.bullets` & `isVerified`** | Declared in `WorkExperience` (`src/types.ts`:7, 10). | Captured in UI and passed over HTTP in `experiences` array. | Unused in prompt construction at `server.ts`:350 (only `role`, `company`, dates, `hasReferenceLetter`, and `hasPayslips` are formatted). | **VERIFIED** | `/server.ts`:349-351 |
| **`AnalysisResponse` Extra Fields** | `matchScore`, `targetRole`, `recommendedNoc`, `criticalDealbreakersCount` in `src/types.ts`:55-58. | Declared in interface, but never returned by `/api/analyze`. | Server only returns `{ success: true, markdownAnalysis }`. Client reads `data.markdownAnalysis` directly and ignores other interface fields. | **VERIFIED** | `/server.ts`:388-391, `/src/App.tsx`:75-80 |

---

## PHASE 6 — DEPLOYMENT & OPS

### 1. Hosting & Infrastructure

| Attribute | Specification | Evidence Status | Citation |
| :--- | :--- | :--- | :--- |
| **Hosting Platform** | Google Cloud Run (`europe-west1` region) managed by Google AI Studio Build platform. | **VERIFIED** | System runtime metadata (`*.europe-west1.run.app`) |
| **Development URL** | `https://ais-dev-*.europe-west1.run.app` | **VERIFIED** | System runtime metadata |
| **Shared / Production URL** | `https://ais-pre-*.europe-west1.run.app` | **VERIFIED** | System runtime metadata |
| **Applet Identifier** | `f141131c-9626-45a4-bd20-8e2ed6489361` | **VERIFIED** | System instructions (`<applet_id>`) |
| **Runtime Port** | `3000` (Server binds to `0.0.0.0:3000`) | **VERIFIED** | `/server.ts`:10, 466 |
| **Server Architecture** | Single container hosting Node.js Express backend and serving compiled Vite SPA. | **VERIFIED** | `/server.ts`:450-469 |

---

### 2. Build & Artifact Generation

- **Build Script**: `npm run build` (`/package.json`:8)
  ```bash
  vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs
  ```
- **Build Output Directory**: `/dist` (`.gitignore`:3)
  - `/dist/index.html` (Vite client HTML)
  - `/dist/assets/*` (Bundled JS/CSS chunks)
  - `/dist/server.cjs` (Standalone CommonJS Express server bundle generated by esbuild)
  - `/dist/server.cjs.map` (Node source map)
- **Production Start Command**: `npm run start` (`node dist/server.cjs`) (`/package.json`:9)

---

### 3. Environment Variables Grouped by Purpose

*(All secret values redacted; variable names only)*

| Variable Name | Purpose & Classification | Where Read | Evidence Status | Citation |
| :--- | :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | **Secret**: Authentication key for Google GenAI SDK. Injected automatically by AI Studio secrets manager. | `server.ts:16` via `process.env.GEMINI_API_KEY` | **VERIFIED** | `/.env.example`:4, `/server.ts`:16 |
| `APP_URL` | **Platform**: The public Cloud Run service URL. Used for self-referential links or callbacks. | `/.env.example:9` | **VERIFIED** | `/.env.example`:9 |
| `NODE_ENV` | **Runtime**: Determines whether Express mounts Vite development middleware (`!== "production"`) or serves static files from `/dist` (`=== "production"`). | `server.ts:452` via `process.env.NODE_ENV` | **VERIFIED** | `/server.ts`:452 |
| `DISABLE_HMR` | **Platform Tooling**: Disables file watching and Vite Hot Module Replacement to reduce CPU usage and avoid iframe flickering during automated edits. | `vite.config.ts:17,19` via `process.env.DISABLE_HMR` | **VERIFIED** | `/vite.config.ts`:17-19 |
| `PORT` | **Runtime**: Server listening port. Hardcoded to `3000`. | `server.ts:10` (`const PORT = 3000;`) | **VERIFIED** | `/server.ts`:10 |

---

### 4. Network, CORS, Quota, & Security Configurations

| Setting | Configuration | Evidence Status | Citation |
| :--- | :--- | :--- | :--- |
| **CORS Policy** | **None configured**. Express does not import or use `cors` middleware. Client requests use relative paths (`/api/analyze`, `/api/reference-letter`) on the same origin. | **VERIFIED** | `/server.ts`:1-13 |
| **Request Payload Limit** | `express.json({ limit: "10mb" })` (Permits large resume and job description text bodies). | **VERIFIED** | `/server.ts`:12 |
| **Static File Fallback** | In production, any unmatched route falls back to `/dist/index.html` (`app.get("*")`). | **VERIFIED** | `/server.ts`:461-463 |
| **Gemini Quota Management** | Upstream Google GenAI free tier quotas apply. Rate limits (HTTP 429) or timeouts trigger sequential fallback through 4 models, ultimately executing local deterministic generators. | **VERIFIED** | `/server.ts`:140-182, 383-386 |
| **Platform Capabilities** | Declared capability: `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`. Empty frame permissions: `requestFramePermissions: []`. | **VERIFIED** | `/metadata.json`:4-5 |

---

## PHASE 7 — CRITICAL FINDINGS & DEFECTS

### Summary of Defects by Severity

| Severity | Defect Count | Primary Domain |
| :--- | :--- | :--- |
| **CRITICAL** | 0 | No fatal server-crashing errors or exposed secrets detected. |
| **HIGH** | 2 | API request parameter mismatch; Fragile LLM markdown section parser. |
| **MEDIUM** | 4 | Divergent Reference Letter implementations; Zero client persistence; Mocked Stripe checkout; Unthrottled API endpoints. |
| **LOW** | 2 | Interface field bloat; UI alert() triggers in sandboxed iframe. |

---

### Detailed Findings & Defect Catalog

#### 1. [HIGH] `targetRole` vs. `jobTitle` Parameter Mismatch
- **What is broken**: The client submits `{ jobTitle: targetRole }`, but the backend route expects `req.body.targetRole`.
- **File & Lines**: `/src/components/AssessmentForm.tsx`:150, `/server.ts`:330, 356
- **Trigger Condition**: Any user assessment submitted through the manual input form (or when changing the target role).
- **Impact**: In `/server.ts`:356, `targetRole` evaluates to `undefined`, so the prompt sent to Gemini states `Target Role Requested: Not specified`, degrading the AI's ability to tailor Section 1 and Section 4 to the specific target role.
- **Recommended Fix**: Update `AssessmentForm.tsx`:150 to pass `targetRole` in the payload (or have `server.ts`:330 accept `req.body.targetRole || req.body.jobTitle`).
- **Evidence Status**: **VERIFIED**

#### 2. [HIGH] Fragile Freeform Regex Section Parser
- **What is broken**: The frontend relies on splitting raw LLM output using the regex `markdownContent.split(/^### Section \d+:? /m)`.
- **File & Lines**: `/src/components/MandatoryAssessmentView.tsx`:42-70
- **Trigger Condition**: When Gemini generates headers with emoji prefixes (e.g. `### 📊 Section 1:`, `### 🎯 Section 2:` as instructed in `SYSTEM_INSTRUCTION`:49, 58) or slight markdown variations.
- **Impact**: The regex split fails to match `### 📊 Section 1:`, causing all 6 sections to be lumped together under a single card or dropped, breaking the accordion state and deep links.
- **Recommended Fix**: Update the regex splitter to tolerate optional emojis (`/^### (?:[^\n]*? )?Section \d+:? /m`) or switch the API to JSON structured output.
- **Evidence Status**: **VERIFIED**

#### 3. [MEDIUM] Architectural Divergence in Reference Letter Generation
- **What is broken**: Two separate implementations generate reference letters with differing logic.
- **File & Lines**: `/src/components/ReferenceLetterPage.tsx`:33-65 vs. `/src/components/ReferenceLetterModal.tsx`:34-75
- **Trigger Condition**: Generating a reference letter from the "IRCC Ref Letter" tab vs. generating from the quick-action modal in the assessment report.
- **Impact**: The modal sends a `POST /api/reference-letter` request to invoke the backend Gemini API, whereas the tab page uses a client-side hardcoded string template with a fake 600ms `setTimeout()`, resulting in inconsistent outputs across screens.
- **Recommended Fix**: Unify both views to call the backend `/api/reference-letter` endpoint.
- **Evidence Status**: **VERIFIED**

#### 4. [MEDIUM] Zero Persistence (Complete Data Loss on Page Refresh)
- **What is broken**: There is no persistence layer (`localStorage`, `sessionStorage`, or backend database).
- **File & Lines**: `/src/App.tsx`:15-45
- **Trigger Condition**: User reloads the page, navigates away, or the dev container restarts.
- **Impact**: All candidate inputs, extracted work experiences, and generated assessments are immediately wiped, resetting the app to default Preset 0.
- **Recommended Fix**: Save form inputs and active analysis to `localStorage` on change and restore them on mount.
- **Evidence Status**: **VERIFIED**

#### 5. [MEDIUM] Mocked Stripe / Billing Flow
- **What is broken**: Premium immigration insurance upgrade buttons trigger browser alerts instead of a payment checkout.
- **File & Lines**: `/src/components/PremiumNavigationModal.tsx`:124
- **Trigger Condition**: User clicks "Activate Protection" in the immigration insurance modal.
- **Impact**: Users cannot purchase services or transition from the free tier to premium features.
- **Recommended Fix**: Integrate Stripe Checkout session redirect or an email intake modal.
- **Evidence Status**: **VERIFIED**

#### 6. [MEDIUM] Unauthenticated & Unthrottled Public API Routes
- **What is broken**: `/api/analyze` and `/api/reference-letter` lack rate-limiting and authentication middleware.
- **File & Lines**: `/server.ts`:325-448
- **Trigger Condition**: Automated scripts or high volumes of requests sent to the public Cloud Run URL.
- **Impact**: Malicious actors or excessive traffic can exhaust Google GenAI API quotas and cause server resource exhaustion.
- **Recommended Fix**: Implement `express-rate-limit` middleware on `/api/*` routes.
- **Evidence Status**: **VERIFIED**

#### 7. [LOW] Mismatched / Dead Interface Attributes
- **What is broken**: Several interface properties are defined but never populated or utilized.
- **File & Lines**: `/src/types.ts`:13-25, 53-60, `/server.ts`:349-351
- **Trigger Condition**: Application compilation and network transfer.
- **Impact**: `AnalysisResponse` defines `matchScore`, `targetRole`, `recommendedNoc`, and `criticalDealbreakersCount` which the server never sends; `WorkExperience.bullets` and `isVerified` are transmitted over HTTP but ignored during prompt formatting.
- **Recommended Fix**: Prune unused interface properties or incorporate `WorkExperience.bullets` into the prompt.
- **Evidence Status**: **VERIFIED**

#### 8. [LOW] Use of `alert()` Inside Sandboxed iFrame Environment
- **What is broken**: UI triggers `alert()` for form validation and checkout confirmation.
- **File & Lines**: `/src/components/AssessmentForm.tsx`:144, `/src/components/PremiumNavigationModal.tsx`:124
- **Trigger Condition**: Submitting an empty form or clicking "Activate Protection".
- **Impact**: `window.alert()` blocks the JavaScript event loop and can fail or be suppressed in sandboxed iframe environments.
- **Recommended Fix**: Replace `window.alert()` with in-app banner notifications or toast components.
- **Evidence Status**: **VERIFIED**

---

## PHASE 8 — ROADMAP & REMEDIATION PLAN

### 1. Prioritized Remediation Phases

| Phase | Focus Area | Primary Objectives | Estimated Effort | Risk Level |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Immediate Defect Remediation** | Core Prompting & Parsing Reliability | Fix `targetRole` parameter mismatch, update markdown section regex to handle emojis, and replace `window.alert()` calls. | 1–2 hours | Low |
| **Phase 2: Architectural Unification & Persistence** | State & Feature Consistency | Unify Reference Letter generation across tab/modal and introduce `localStorage` persistence for form inputs and assessment history. | 2–4 hours | Low–Medium |
| **Phase 3: Production Hardening & Monetization** | Security, Scale, & Monetization | Implement rate limiting on `/api/*`, support structured JSON output with schemas, and connect Stripe checkout or lead capture. | 4–8 hours | Medium |

---

### 2. Detailed Remediation Action Items

#### Phase 1: Immediate Defect Remediation (P0)

* **Action 1.1: Resolve `targetRole` vs. `jobTitle` Parameter Mismatch**
  - **Files Impacted**: `/src/components/AssessmentForm.tsx`:150, `/server.ts`:330
  - **Changes Required**:
    1. In `/src/components/AssessmentForm.tsx`, include `targetRole` in the submission payload: `onSubmit({ ...input, targetRole: targetRole, jobTitle: targetRole })`.
    2. In `/server.ts`, fall back gracefully: `const targetRole = req.body.targetRole || req.body.jobTitle || 'Not specified';`.
  - **Verification**: Submit a manual assessment with target role "Lead Cloud Architect"; verify backend prompt log states `Target Role Requested: Lead Cloud Architect`.

* **Action 1.2: Harden Markdown Section Parser Against Emojis and Formatting Variations**
  - **Files Impacted**: `/src/components/MandatoryAssessmentView.tsx`:44-55
  - **Changes Required**: Update the split regex to match headers with or without emoji prefixes:
    ```typescript
    const rawSections = markdownContent.split(/^### (?:[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]\s*)?Section \d+:?/mu);
    ```
  - **Verification**: Test rendering with both clean markdown headers (`### Section 1:`) and emoji-prefixed headers (`### 📊 Section 1:`).

* **Action 1.3: Eliminate Blocking `alert()` Calls**
  - **Files Impacted**: `/src/components/AssessmentForm.tsx`:144, `/src/components/PremiumNavigationModal.tsx`:124
  - **Changes Required**: Replace `alert()` with inline validation banners or standard modal states to maintain compatibility with iframe sandboxes.
  - **Verification**: Test empty form submission; confirm validation warning displays inline without triggering browser dialogs.

---

#### Phase 2: Architectural Unification & Persistence (P1)

* **Action 2.1: Unify Reference Letter Generation Flow**
  - **Files Impacted**: `/src/components/ReferenceLetterPage.tsx`:33-65
  - **Changes Required**: Refactor `ReferenceLetterPage.tsx` to invoke `fetchWithRetry('/api/reference-letter', ...)` instead of compiling a local template with a fake `setTimeout()`, matching the behavior in `ReferenceLetterModal.tsx`.
  - **Verification**: Generate letters from both the modal and the dedicated tab; verify identical API payloads and server-side responses.

* **Action 2.2: Add Client-Side `localStorage` Persistence**
  - **Files Impacted**: `/src/App.tsx`:15-45, `/src/components/AssessmentForm.tsx`:12-25
  - **Changes Required**:
    1. Persist `CandidateInput` and `analysisResult` to `localStorage` under `cantech_resume_draft` and `cantech_last_analysis`.
    2. Read from `localStorage` on initial mount; fall back to `PRESET_SCENARIOS[0]` only when storage is empty.
  - **Verification**: Edit form inputs, reload browser tab, and confirm inputs and assessment reports persist without data loss.

* **Action 2.3: Clean Up Unused Interface Types**
  - **Files Impacted**: `/src/types.ts`:13-25, 53-60, `/server.ts`:349-351
  - **Changes Required**: Either remove unpopulated fields (`matchScore`, `criticalDealbreakersCount`) from `AnalysisResponse` or incorporate `WorkExperience.bullets` directly into the prompt context for Gemini.
  - **Verification**: Run `npm run lint` (`tsc --noEmit`) to verify clean type checking.

---

#### Phase 3: Production Hardening & Monetization (P2)

* **Action 3.1: Enforce API Rate Limiting**
  - **Files Impacted**: `/server.ts`:9-13
  - **Changes Required**: Install `express-rate-limit` and configure a rate limiter (e.g. 15 requests per 15-minute window per IP) on `/api/analyze` and `/api/reference-letter`.
  - **Verification**: Send 20 rapid requests via test script; verify HTTP `429 Too Many Requests` is returned after limit is exceeded.

* **Action 3.2: Transition from Freeform Markdown to Structured JSON Schemas**
  - **Files Impacted**: `/server.ts`:155, 378-382, `/src/components/MandatoryAssessmentView.tsx`
  - **Changes Required**:
    1. Configure `@google/genai` to use `responseMimeType: "application/json"` with a defined `responseSchema`.
    2. Model returns structured JSON with discrete fields for `matchScore`, `recommendedNoc`, `criticalDealbreakers`, and `sections`.
    3. Eliminates all regex-based string parsing on the frontend.
  - **Verification**: Run end-to-end analysis; verify zero parser errors and complete type safety from backend to UI.

* **Action 3.3: Production Billing Integration / Real Lead Intake**
  - **Files Impacted**: `/src/components/PremiumNavigationModal.tsx`:120-145
  - **Changes Required**: Replace placeholder button with a Stripe Checkout session redirect or a structured intake form capturing email and consultation preferences.
  - **Verification**: Click "Activate Protection"; verify redirect to Stripe checkout or display of functional consultation scheduling intake.

---

### 3. Verification & Compliance Matrix

| Milestone | Target Test | Expected Result |
| :--- | :--- | :--- |
| **Lint & Type Safety** | `npm run lint` (`tsc --noEmit`) | Clean build with zero TypeScript errors across all `.ts` and `.tsx` files. |
| **Production Build** | `npm run build` | Vite static bundle and esbuild `dist/server.cjs` output cleanly with sourcemaps. |
| **Server Startup** | `node dist/server.cjs` | Server binds to `http://0.0.0.0:3000` and correctly handles SPA routing and API endpoints. |
| **Deterministic Fallback** | Test `/api/analyze` without `GEMINI_API_KEY` | Server returns HTTP 200 with structured fallback assessment; UI displays all 6 sections intact. |
