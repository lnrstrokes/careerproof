import React, { useState, useEffect } from 'react';
import { Header, AppTab } from './components/Header';
import { AssessmentForm } from './components/AssessmentForm';
import { AtsCvBuilderSection } from './components/AtsCvBuilderSection';
import { MandatoryAssessmentView } from './components/MandatoryAssessmentView';
import { NocDirectoryPage } from './components/NocDirectoryPage';
import { ReferenceLetterPage } from './components/ReferenceLetterPage';
import { NocLookupModal } from './components/NocLookupModal';
import { ReferenceLetterModal } from './components/ReferenceLetterModal';
import { PremiumNavigationModal } from './components/PremiumNavigationModal';
import { CandidateInput } from './types';
import { PRESET_SCENARIOS } from './data/presets';
import { Sparkles, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('assessment');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeNocCode, setActiveNocCode] = useState<string>('21232');
  const [lastInput, setLastInput] = useState<CandidateInput | null>(null);

  // Modals for fallback or direct triggers
  const [isNocModalOpen, setIsNocModalOpen] = useState(false);
  const [isRefLetterModalOpen, setIsRefLetterModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  // Run automatic assessment on initial load using Preset 0
  useEffect(() => {
    const preset0 = PRESET_SCENARIOS[0];
    const initialInput: CandidateInput = {
      resumeText: preset0.resumeText,
      jobDescriptionText: preset0.jobDescriptionText,
      jobTitle: preset0.targetRole,
      companyName: 'Interac FinTech',
      targetCity: preset0.targetCity,
      deadlineDays: preset0.deadlineDays,
      deadlineDate: preset0.deadlineDate,
      educationDegree: preset0.educationDegree,
      hasWesEca: preset0.hasWesEca,
      experiences: preset0.experiences,
    };
    runAnalysis(initialInput);
  }, []);

  // Helper for network retries during startup/boot
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delayMs = 1000): Promise<Response> => {
    try {
      const res = await fetch(url, options);
      if (!res.ok && (res.status === 502 || res.status === 503 || res.status === 504)) {
        if (retries > 0) {
          await new Promise(r => setTimeout(r, delayMs));
          return fetchWithRetry(url, options, retries - 1, delayMs * 1.5);
        }
      }
      return res;
    } catch (err) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, delayMs));
        return fetchWithRetry(url, options, retries - 1, delayMs * 1.5);
      }
      throw err;
    }
  };

  const runAnalysis = async (input: CandidateInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    setAnalysisResult(null);
    setLastInput(input);

    try {
      const response = await fetchWithRetry('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (data.success && data.markdownAnalysis) {
        setAnalysisResult(data.markdownAnalysis);
      } else {
        setErrorMessage(data.error || 'Failed to generate assessment. High demand on AI model - please try again.');
      }
    } catch (err: any) {
      console.error("Analysis fetch error:", err);
      setErrorMessage('Unable to connect to assessment service. Click "Retry Assessment" below to try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-900 selection:text-white">
      {/* Header with Page Tab Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'noc-directory' && (
          <NocDirectoryPage
            onSelectNocForRefLetter={(nocCode) => {
              setActiveNocCode(nocCode);
              setActiveTab('ref-letter');
            }}
            onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
          />
        )}

        {activeTab === 'ref-letter' && (
          <ReferenceLetterPage
            defaultNoc={activeNocCode}
            defaultRole={lastInput?.jobTitle || PRESET_SCENARIOS[0].targetRole}
            onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
          />
        )}

        {activeTab === 'ats-cv' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                Canadian ATS Standard CV Builder
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Formatted specifically for Workday, Greenhouse, and Taleo ATS screeners in Canada without illegal personal photos, marital status, or age markers.
              </p>
            </div>
            <AtsCvBuilderSection
              targetRole={lastInput?.jobTitle || PRESET_SCENARIOS[0].targetRole}
              targetCity={lastInput?.targetCity || PRESET_SCENARIOS[0].targetCity}
              resumeText={lastInput?.resumeText || PRESET_SCENARIOS[0].resumeText}
              experiences={lastInput?.experiences || PRESET_SCENARIOS[0].experiences}
              hasWesEca={lastInput?.hasWesEca ?? PRESET_SCENARIOS[0].hasWesEca}
              onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="space-y-8">
            {/* Intro Hero Banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dual-Horizon Strategy Engine</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                  Canadian Tech Job Match &amp; NOC Navigation Engine
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Optimize your resume for immediate Canadian tech callbacks while truthfully protecting your NOC duty alignment for future Express Entry &amp; PNP Permanent Residency.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Truthful Reframing</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>NOC 2021 Matrix Aligned</span>
                </div>
              </div>
            </div>

            {/* Form and Results Layout */}
            <div className="space-y-8">
              {/* Section A: Inputs & Presets */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Input Profile &amp; Job Target
                  </h3>
                  <span className="text-xs text-slate-500">Auto-evaluates immediately</span>
                </div>
                <AssessmentForm onSubmit={runAnalysis} isLoading={isLoading} />
              </section>

              {/* Section B: Generated Assessment Output */}
              <section id="assessment-output" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                    <span>Automatic Assessment Output</span>
                    {isLoading && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-800 animate-pulse">
                        Evaluating...
                      </span>
                    )}
                  </h3>
                </div>

                {isLoading ? (
                  <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
                    <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
                    <div>
                      <h4 className="text-base font-bold text-slate-200">Generating Truthful Assessment</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Evaluating ATS Keyword Alignment, NOC 2021 Duties, Deadline-Driven Tweaks, &amp; IRCC Evidence Flags...
                      </p>
                    </div>
                  </div>
                ) : errorMessage ? (
                  <div className="p-6 sm:p-8 rounded-2xl bg-red-950/40 border border-red-800/80 text-center space-y-4 shadow-xl">
                    <div className="w-10 h-10 mx-auto rounded-full bg-red-900/60 border border-red-700 flex items-center justify-center text-red-300 font-bold text-lg">
                      !
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-red-200">Assessment Request Error</h4>
                      <p className="text-xs text-red-300/90 mt-1 max-w-md mx-auto leading-relaxed">
                        {errorMessage}
                      </p>
                    </div>
                    {lastInput && (
                      <button
                        onClick={() => runAnalysis(lastInput)}
                        className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-semibold shadow transition"
                      >
                        Retry Assessment
                      </button>
                    )}
                  </div>
                ) : analysisResult ? (
                  <MandatoryAssessmentView
                    markdownContent={analysisResult}
                    onOpenNocDirectory={() => setActiveTab('noc-directory')}
                    onOpenRefLetterBuilder={() => setActiveTab('ref-letter')}
                    onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
                  />
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
                    Submit the form above to view your automatic job match &amp; NOC alignment report.
                  </div>
                )}
              </section>

              {/* Section C: Canadian ATS CV Builder Preview */}
              <section id="ats-cv-preview">
                <AtsCvBuilderSection
                  targetRole={lastInput?.jobTitle || PRESET_SCENARIOS[0].targetRole}
                  targetCity={lastInput?.targetCity || PRESET_SCENARIOS[0].targetCity}
                  resumeText={lastInput?.resumeText || PRESET_SCENARIOS[0].resumeText}
                  experiences={lastInput?.experiences || PRESET_SCENARIOS[0].experiences}
                  hasWesEca={lastInput?.hasWesEca ?? PRESET_SCENARIOS[0].hasWesEca}
                  onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
                />
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>CanTech Job Search &amp; NOC Navigation Engine © 2026. Designed for international tech professionals.</p>
          <p className="mt-1 text-[11px] text-slate-600">
            Adheres strictly to ESDC NOC 2021 rules &amp; IRCC Ministerial Instructions.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <NocLookupModal
        isOpen={isNocModalOpen}
        onClose={() => setIsNocModalOpen(false)}
        onSelectNoc={(code) => {
          setActiveNocCode(code);
          setActiveTab('ref-letter');
        }}
      />

      <ReferenceLetterModal
        isOpen={isRefLetterModalOpen}
        onClose={() => setIsRefLetterModalOpen(false)}
        onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
        defaultNoc={activeNocCode}
      />

      <PremiumNavigationModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
      />
    </div>
  );
}

