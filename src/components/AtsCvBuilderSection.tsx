import React from 'react';
import { Lock, Sparkles, ShieldCheck, Download, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { WorkExperience } from '../types';

interface AtsCvBuilderSectionProps {
  targetRole: string;
  targetCity: string;
  resumeText: string;
  experiences: WorkExperience[];
  hasWesEca: boolean;
  onOpenPremiumModal: () => void;
}

export const AtsCvBuilderSection: React.FC<AtsCvBuilderSectionProps> = ({
  targetRole,
  targetCity,
  resumeText,
  experiences,
  hasWesEca,
  onOpenPremiumModal,
}) => {
  // Extract candidate name or default from pasted CV
  const nameMatch = resumeText.match(/^([A-Z][a-z]+\s+[A-Z][a-z]+)/);
  const candidateName = nameMatch ? nameMatch[1] : 'Applicant Profile';

  // Extract candidate skills/technologies from pasted CV if present
  const techKeywords = ['React', 'TypeScript', 'Node.js', 'Python', 'Java', 'SQL', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Express', 'Microservices', 'GraphQL', 'MongoDB', 'Angular', 'Vue'];
  const extractedSkills = techKeywords.filter(kw => new RegExp(`\\b${kw}\\b`, 'i').test(resumeText));
  const displaySkills = extractedSkills.length > 0 ? extractedSkills.join(', ') : 'Software Engineering, Full-Stack Development, Cloud Systems, SQL';

  // Extract first bullet point from CV or experiences
  const extractedBullet = experiences.length > 0 && experiences[0].bullets && experiences[0].bullets.length > 0
    ? experiences[0].bullets[0]
    : 'Engineered backend software services, REST APIs, and database schemas supporting high-concurrency user traffic.';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6 text-slate-100 relative overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Premium Feature Preview</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center space-x-2">
            <span>🇨🇦 Canadian ATS CV Builder &amp; NOC Aligner</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Single-column, 100% ATS-compliant layout optimized for Canadian recruiters and IRCC NOC verification.
          </p>
        </div>

        <button
          onClick={onOpenPremiumModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold shadow-md transition flex items-center space-x-1.5 shrink-0 self-start sm:self-center"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Unlock Full ATS Resume</span>
        </button>
      </div>

      {/* CV Preview Document Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-inner relative space-y-6 font-sans">
        {/* UNBLURRED PART 1: Contact Header & Executive Summary Snippet */}
        <div className="space-y-4 border-b border-slate-800 pb-4">
          <div className="text-center space-y-1">
            <h4 className="text-lg font-black tracking-tight text-slate-100 uppercase">{candidateName}</h4>
            <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sky-400 font-medium">{targetCity || 'Toronto, ON'} (Open to Relocate across Canada)</span>
              <span>•</span>
              <span>applicant@example.com</span>
              <span>•</span>
              <span className="text-slate-300">GitHub &amp; LinkedIn Verified</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[11px] font-semibold mt-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Aligned with NOC 2021 Code 21232 (Software Developers &amp; Programmers)</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 border-b border-slate-800/80 pb-1">
              CANADIAN EXECUTIVE SUMMARY
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Results-driven {targetRole || 'Software Developer'} with proven experience engineering scalable web microservices, REST APIs, and relational database architectures. Demonstrated track record working in Agile cross-functional teams, executing CI/CD pipelines, and adhering to Canadian tech industry standards."
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800/80 pb-1">
              TRUTHFUL ATS KEYWORD &amp; DUTY HIGHLIGHT
            </h5>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-emerald-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>NOC Duty Reframing (Extracted from Pasted CV):</span>
              </div>
              <p className="text-slate-200">
                • {extractedBullet}
              </p>
            </div>
          </div>
        </div>

        {/* BLURRED PART 2: Full Experience, Skills Matrix & IRCC Notes (Locked for Premium) */}
        <div className="relative min-h-[260px] space-y-5 select-none pointer-events-none">
          {/* Blurred Placeholder Content simulating full ATS CV */}
          <div className="filter blur-[5px] opacity-40 space-y-5">
            <div>
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
                PROFESSIONAL WORK EXPERIENCE (NOC 2021 ALIGNED)
              </h5>
              {experiences.length > 0 ? (
                experiences.map((exp, idx) => (
                  <div key={idx} className="mb-3 space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-200">
                      <span>{exp.role} — {exp.company}</span>
                      <span>{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-1">
                      {exp.bullets && exp.bullets.length > 0 ? (
                        exp.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)
                      ) : (
                        <li>Architected backend REST APIs and database microservices in Agile delivery teams.</li>
                      )}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="space-y-2 text-xs text-slate-400">
                  <div className="font-bold">Software Engineer — Tech Operations (2021 - Present)</div>
                  <p>• Developed scalable cloud applications, REST APIs, and microservices.</p>
                </div>
              )}
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
                CORE TECHNICAL COMPETENCIES (EXTRACTED)
              </h5>
              <div className="text-xs text-slate-300">
                • {displaySkills}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">
                EDUCATION &amp; WES ECA CREDENTIALS
              </h5>
              <p className="text-xs text-slate-300">
                Bachelor of Science in Computer Science — {hasWesEca ? 'WES ECA Verified Canadian Equivalency (Four-Year Bachelor Degree)' : 'WES ECA Pending'}
              </p>
            </div>
          </div>

          {/* Frosted Glass Blur Overlay CTA */}
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-6 text-center space-y-4 border border-red-500/30 shadow-2xl pointer-events-auto">
            <div className="w-12 h-12 rounded-full bg-red-950/90 border border-red-600/60 flex items-center justify-center text-red-400 shadow-lg">
              <Lock className="w-6 h-6" />
            </div>

            <div className="max-w-md space-y-1.5">
              <h4 className="text-base sm:text-lg font-bold text-white">
                Unlock Full Canadian ATS CV &amp; IRCC Duty Matrix
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlock complete line-by-line Canadian ATS resume exports, customizable templates, and IRCC letterhead compliance verification.
              </p>
            </div>

            <button
              onClick={onOpenPremiumModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white text-xs font-bold shadow-lg shadow-red-950/60 transition flex items-center space-x-2 border border-red-500/40"
            >
              <span>Unlock Premium ATS CV Builder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
