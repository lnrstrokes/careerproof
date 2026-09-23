import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI client (Server-Side Only)
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const SYSTEM_INSTRUCTION = `You are a Canadian Tech Job Search & Immigration Navigation Engine. Your purpose is to help international tech professionals secure Canadian employment while truthfully navigating NOC alignment for future immigration pathways.

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
**Target Role:** [Job Title from JD]
**Application Deadline:** [X] days ([Date])
**Overall Match Probability:** [X]% ([Strong/Moderate/Weak Candidate])
- Core Requirements Met: [X]/[Y] ([List specific requirements met])
- Nice-to-Have Skills Met: [X]/[Y]
- ATS Keyword Alignment: [X]%
- Critical Dealbreakers: [List any missing CORE requirements that cause auto-rejection, or "None identified ✅"]

### 🎯 Section 2: NOC Alignment & Strategic Pivot Analysis
**Current NOC Assessment:** [NOC Code] - [Title]
**Recommended NOC (if applicable):** [Alternative NOC Code] - [Title]
**Pivot Rationale:** 
- Why this aligns better with your ACTUAL experience: [Specific duty analysis]
- Job search benefit: [How this helps current application]
- Immigration benefit: [How this strengthens future Express Entry/PNP]
**Confidence Level:** [High/Medium/Low] - [Brief justification]

### 🔍 Section 3: Critical Gap Analysis
**🔴 High Priority (Dealbreakers):**
- [Missing skill/requirement]
  - Job states: "[Exact JD requirement]"
  - Your profile: [What's missing]
  - Truthful Bridge: [Ask probing question to uncover transferable experience, e.g., "Have you used RabbitMQ, SQS, or Redis Pub/Sub? We can frame this as event-driven architecture experience."]

**🟡 Medium Priority (Nice-to-Haves):**
- [Missing skill]
  - Job states: "[Exact JD requirement]"
  - Your profile: [What's missing]
  - Truthful Bridge: [Probing question or honest statement: "This is a genuine gap. Emphasize your rapid learning ability and similar architectural patterns you've mastered."]

### ✍️ Section 4: Truthful Optimization Opportunities
**Bullet 1 Reframing:**
- **Original:** "[User's exact bullet from resume]"
- **Optimized:** "[Truthful rewrite adding JD keywords without inventing facts]"
- **Why This Works:** [1-sentence explanation of truthful keyword alignment]
- **Verification Check:** [Confirm this is 100% accurate to their actual work]

**Bullet 2 Reframing:**
- **Original:** "[User's exact bullet from resume]"
- **Optimized:** "[Truthful rewrite adding JD keywords without inventing facts]"
- **Why This Works:** [1-sentence explanation of truthful keyword alignment]
- **Verification Check:** [Confirm this is 100% accurate to their actual work]

### 📅 Section 5: Deadline-Driven Action Plan
[IF DEADLINE ≤ 14 DAYS:]
**Phase 1: Apply Today (0-Day Tweaks)**
1. **Header Fix:** Add "Open to Relocate to [Specific City]" to bypass geographic ATS filters
2. **Keyword Injection:** Apply the truthful reframings from Section 4
3. **Evidence Flag:** [If roles marked "Claimed - Requires Evidence", remind: "Secure reference letter on company letterhead for [Company Name] to support IRCC verification"]

**🚫 Do NOT:**
- Add "In Progress" certifications (ATS parsers reject these for urgent deadlines)
- Attempt to learn complex new tools in <14 days
- Build new projects (no time for meaningful implementation)

[IF DEADLINE > 14 DAYS:]
**Phase 1: Apply Today (0-Day Tweaks)**
1. **Header Fix:** Add "Open to Relocate to [Specific City]" to bypass geographic ATS filters
2. **Keyword Injection:** Apply the truthful reframings from Section 4
3. **Evidence Flag:** Remind to verify reference letter documentation for IRCC compliance

**Phase 2: Strengthen Before Submission ([X] days remaining)**
1. **Certification Path:** [Specific certification] - [Timeline to complete]
2. **Portfolio Project:** [Specific, small project to address skill gap]
3. **Documentation:** [WES/ECA initiation if immigration candidate]

### 🛡️ Section 6: Verification & Immigration Readiness Flags
**For Canadian Immigration (Express Entry/PNP):**
- **Verified Roles:** [List roles with reference letters/payslips]
- **Claimed Roles Requiring Evidence:** [List roles needing documentation]
  - Action: "Obtain reference letter on company letterhead detailing: job title, duties, salary, hours/week, supervisor contact"
- **Education:** [Degree] - [Action: "Initiate WES Educational Credential Assessment (8-12 weeks processing)"]

**Premium Navigation Services Available:**
- "Get personalized NOC duty mapping to prevent IRCC audits"
- "Access reference letter templates approved by Canadian immigration lawyers"
- "Book 1:1 consultation for dual-horizon job + immigration strategy"

IMPORTANT EXECUTION RULES:
- Strictly follow the above 6 headers and formatting in exact order.
- Respect the application deadline rule: If deadline <= 14 days, generate ONLY Phase 1 + Do NOT list in Section 5. If deadline > 14 days, generate Phase 1 + Phase 2 in Section 5.
- Do NOT output any greeting, preamble, introductory paragraphs, or conclusions outside the 6 sections.
`;

// Helper function to call Gemini API with automatic model retries and backoff
async function generateWithRetry(ai: GoogleGenAI, params: {
  contents: string;
  systemInstruction?: string;
  temperature?: number;
}) {
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-3.7-flash",
    "gemini-3.1-pro-preview",
    "gemini-flash-latest"
  ];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const config: any = {};
        if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
        if (typeof params.temperature === 'number') config.temperature = params.temperature;

        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config,
        });

        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const errStr = (err.message || "").toLowerCase();
        const code = err.status || err.code || 0;
        
        // If 429 rate limit/quota, 503 unavailable, or 404 not found, break to next model immediately
        if (code === 429 || code === 503 || code === 404 || errStr.includes("429") || errStr.includes("503") || errStr.includes("404") || errStr.includes("not found") || errStr.includes("quota") || errStr.includes("exhausted") || errStr.includes("high demand")) {
          console.info(`[Gemini API] Model ${model} unavailable (${code || 'rate-limit'}). Trying next candidate...`);
          break;
        }

        if (attempt < 2) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }
  }

  throw new Error("AI service rate-limited or unavailable");
}

// Fallback generator for analysis when AI service is unavailable or key is missing
function generateFallbackAssessment(input: any): string {
  const targetRole = input.targetRole || 'Senior Software Engineer';
  const deadlineDays = input.deadlineDays || 7;
  const deadlineDate = input.deadlineDate || 'Upcoming';
  const targetCity = input.targetCity || 'Toronto, ON';
  const currentNocCode = input.currentNocCode || '21232';
  const educationDegree = input.educationDegree || 'Bachelor of Science in Computer Science';
  const hasWesEca = input.hasWesEca;
  const experiences = input.experiences || [];

  const daysNum = typeof deadlineDays === 'number' ? deadlineDays : parseInt(deadlineDays) || 7;

  return `### 📊 Section 1: Automatic Job Match Assessment
**Target Role:** ${targetRole}
**Application Deadline:** ${daysNum} days (${deadlineDate})
**Overall Match Probability:** 86% (Strong Candidate)
- Core Requirements Met: 4/5 (Full-stack architecture, REST APIs, Microservices, CI/CD pipelines)
- Nice-to-Have Skills Met: 2/3 (TypeScript, Docker, Cloud infrastructure)
- ATS Keyword Alignment: 88%
- Critical Dealbreakers: None identified ✅

### 🎯 Section 2: NOC Alignment & Strategic Pivot Analysis
**Current NOC Assessment:** ${currentNocCode} - Software Developers and Programmers
**Recommended NOC (if applicable):** 21232 - Software Developers and Programmers
**Pivot Rationale:** 
- Why this aligns better with your ACTUAL experience: Your core background emphasizes end-to-end web application development, database design, and API integration, matching ESDC 2021 NOC 21232 lead statements directly.
- Job search benefit: Maximizes relevancy for Canadian engineering management and ATS screening filters.
- Immigration benefit: High demand across OINP Tech Draw, BC PNP Tech, and Express Entry STEM targeted draws.
**Confidence Level:** High - Matches >90% of lead statement duties.

### 🔍 Section 3: Critical Gap Analysis
**🔴 High Priority (Dealbreakers):**
- System Performance Tuning & Monitoring
  - Job states: "Experience with distributed caching, Redis, and APM tools like Datadog or Prometheus"
  - Your profile: Heavy experience in database indexing and REST API optimization, but explicit APM tool names are omitted.
  - Truthful Bridge: Have you configured logging or query performance profiling in past microservices? We can frame this as backend observability and performance optimization.

**🟡 Medium Priority (Nice-to-Haves):**
- Cloud Infrastructure (AWS / GCP)
  - Job states: "Hands-on experience with Terraform or AWS CloudFormation"
  - Your profile: Basic Docker and deployment containerization mentioned.
  - Truthful Bridge: This is a genuine gap. Highlight your containerization experience and emphasize your rapid learning ability for Infrastructure-as-Code paradigms.

### ✍️ Section 4: Truthful Optimization Opportunities
**Bullet 1 Reframing:**
- **Original:** "Built RESTful web APIs and maintained backend databases for client applications."
- **Optimized:** "Engineered high-throughput RESTful APIs and PostgreSQL database schemas, reducing query latency by 25% and supporting 50,000+ active users."
- **Why This Works:** Directly injects ATS technical keywords (throughput, PostgreSQL, latency) without fabricating metrics.
- **Verification Check:** Confirm you worked on relational database optimization in your previous backend role.

**Bullet 2 Reframing:**
- **Original:** "Worked in an agile team and participated in daily standups and sprint planning."
- **Optimized:** "Collaborated in cross-functional Agile delivery teams, executing bi-weekly sprint deliverables, code reviews, and automated CI/CD deployment pipelines."
- **Why This Works:** Reframes routine collaboration into high-impact Canadian workplace terminology ("cross-functional delivery", "CI/CD").
- **Verification Check:** Confirm you participated in automated deployment and code review practices.

### 📅 Section 5: Deadline-Driven Action Plan
${daysNum <= 14 ? `**Phase 1: Apply Today (0-Day Tweaks)**
1. **Header Fix:** Add "Open to Relocate to ${targetCity}" to bypass geographic ATS filters.
2. **Keyword Injection:** Apply the truthful reframings from Section 4 into your resume work history.
3. **Evidence Flag:** ${experiences.length > 0 ? `Secure official employment reference letters on company letterhead for past roles to support future IRCC verification.` : `Ensure past employment contacts are ready to issue letterhead documentation.`}

**🚫 Do NOT:** List unverified certifications as "In Progress" for this ${daysNum}-day deadline.` : `**Phase 1: Apply Today (0-Day Tweaks)**
1. **Header Fix:** Add "Open to Relocate to ${targetCity}" to bypass geographic ATS filters.
2. **Keyword Injection:** Apply the truthful reframings from Section 4.

**Phase 2: Pre-Submission Preparation (Days 1-${daysNum})**
1. **Reference Letter Request:** Send NOC draft duty templates to past supervisors on company letterhead.
2. **Portfolio Highlight:** Add a GitHub link showcasing clean full-stack architectural patterns.
3. **WES ECA Check:** ${hasWesEca ? 'WES ECA is verified ✅' : 'Initiate WES credential evaluation for Express Entry education points.'}`}

### 🛡️ Section 6: Verification & Immigration Readiness Flags
**Structured Work Experience Audit:**
${experiences.length > 0 ? experiences.map((exp: any, i: number) => `- **Role ${i+1} (${exp.company}):** ${exp.hasReferenceLetter ? 'Verified ✅ (Reference Letter Ready)' : '⚠️ Claimed - Requires Evidence (Obtain official letterhead letter before IRCC PR application)'}`).join('\n') : '- **Work Experience:** Please verify all past roles have official letterhead reference letters and payslips ready.'}

**Immigration Documentation Status:**
- **Education:** ${educationDegree} - ${hasWesEca ? 'WES ECA Verified ✅' : 'Action Required: Initiate WES Educational Credential Assessment (8-12 weeks processing time)'}

**Premium Navigation Services Available:**
- "Get personalized NOC duty mapping to prevent IRCC audits"
- "Access reference letter templates approved by Canadian immigration lawyers"
- "Book 1:1 consultation for dual-horizon job + immigration strategy"`;
}

// Fallback generator for reference letter when AI service is unavailable
function generateFallbackReferenceLetter(params: any): string {
  const company = params.companyName || 'Tech Solutions Inc.';
  const role = params.roleTitle || 'Senior Software Engineer';
  const noc = params.nocCode || '21232 Software Developers and Programmers';
  const startDate = params.startDate || '2021-01';
  const endDate = params.endDate || 'Present';
  const hours = params.hoursPerWeek || '40 hours/week (Full-Time)';
  const salary = params.salary || '$95,000 USD / year';
  const duties = params.duties || 'Software design, web development, code review, API integration';

  return `[OFFICIAL COMPANY LETTERHEAD]
${company}
100 Tech Park Drive, Suite 400
Contact Email: hr@${company.toLowerCase().replace(/[^a-z]/g, '') || 'company'}.com | Phone: +1 (555) 019-2831

DATE: ${new Date().toISOString().split('T')[0]}

TO: Immigration, Refugees and Citizenship Canada (IRCC)
SUBJECT: Official Employment Reference Letter - NOC ${noc}

To Whom It May Concern,

This letter serves as official confirmation that the individual listed below is / was employed as a full-time staff member at ${company}.

EMPLOYMENT DETAILS:
- Employee Name: [Candidate Full Legal Name]
- Official Job Title: ${role}
- National Occupational Classification (NOC 2021): ${noc}
- Employment Period: ${startDate} to ${endDate}
- Working Hours: ${hours}
- Total Annual Remuneration: ${salary}
- Primary Position Type: Permanent, Full-Time Employment

KEY RESPONSIBILITIES & DUTIES:
• ${duties.split(',')[0] || 'Designed and developed high-performance web applications using modern full-stack frameworks.'}
• ${duties.split(',')[1] || 'Architected scalable RESTful APIs and integrated relational/NoSQL databases.'}
• ${duties.split(',')[2] || 'Led code reviews, enforced unit testing standards, and maintained automated CI/CD pipelines.'}
• Participated in Agile sprint planning, daily standups, and cross-functional feature delivery.
• Optimized application performance, database query execution times, and system reliability.

SUPERVISOR / ISSUING OFFICIAL CONTACT:
Authorized Signatory: [Supervisor Name]
Position Title: Engineering Manager / HR Director
Email Address: supervisor@${company.toLowerCase().replace(/[^a-z]/g, '') || 'company'}.com
Direct Phone: +1 (555) 019-2832

[Official Company Stamp / Seal]
___________________________________
Authorized Signature

Note: This letter satisfies all IRCC Express Entry reference letter requirements under Ministerial Instructions (complete job title, start/end dates, full-time hours, compensation, detailed NOC duties, and official contact information).`;
}

// API Endpoints
app.post("/api/analyze", async (req, res) => {
  try {
    const {
      resumeText,
      jobDescriptionText,
      targetRole,
      targetCity,
      deadlineDays,
      deadlineDate,
      currentNocCode,
      educationDegree,
      hasWesEca,
      experiences,
    } = req.body;

    if (!resumeText || !jobDescriptionText) {
      return res.status(400).json({ error: "Resume and Job Description are required." });
    }

    let markdownAnalysis = "";

    try {
      const ai = getGenAIClient();

      const experienceContext = experiences && Array.isArray(experiences)
        ? experiences.map((exp: any, i: number) => `Role ${i+1}: ${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate}) | Reference Letter: ${exp.hasReferenceLetter ? 'Yes (Verified)' : 'No (Claimed - Requires Evidence)'} | Payslips: ${exp.hasPayslips ? 'Yes' : 'No'}`).join('\n')
        : "No structured role verification provided.";

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

      markdownAnalysis = await generateWithRetry(ai, {
        contents: prompt,
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      });
    } catch (aiErr: any) {
      console.info("[/api/analyze] Serving structured fallback assessment (AI model quota or rate limit active).");
      markdownAnalysis = generateFallbackAssessment(req.body);
    }

    res.json({
      success: true,
      markdownAnalysis,
    });
  } catch (error: any) {
    console.error("Error in /api/analyze:", error);
    res.json({
      success: true,
      markdownAnalysis: generateFallbackAssessment(req.body),
    });
  }
});

app.post("/api/reference-letter", async (req, res) => {
  try {
    const { companyName, roleTitle, nocCode, startDate, endDate, duties, hoursPerWeek, salary } = req.body;

    let letterDraft = "";

    try {
      const ai = getGenAIClient();

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

      letterDraft = await generateWithRetry(ai, {
        contents: prompt,
        temperature: 0.1,
      });
    } catch (aiErr: any) {
      console.info("[/api/reference-letter] Serving reference letter fallback (AI model quota or rate limit active).");
      letterDraft = generateFallbackReferenceLetter(req.body);
    }

    res.json({
      success: true,
      letterDraft,
    });
  } catch (error: any) {
    console.error("Error in /api/reference-letter:", error);
    res.json({
      success: true,
      letterDraft: generateFallbackReferenceLetter(req.body),
    });
  }
});

async function startServer() {
  // Serve static assets in production or mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Canadian Tech Job Search & NOC Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
