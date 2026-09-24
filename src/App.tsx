import React, { useCallback, useState } from 'react';
import { Header } from './components/Header';
import { AssessmentForm } from './components/AssessmentForm';
import { AlignmentBriefRenderer } from './components/AlignmentBriefRenderer';
import { NocDirectoryPage } from './components/NocDirectoryPage';
import { ReferenceLetterGuidance } from './components/ReferenceLetterGuidance';
import type { AlignmentBrief, AnalysisResultPayload } from './types';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const ERROR_TITLES: Record<string, string> = {
  INVALID_INPUT: 'Missing input',
  PAYLOAD_TOO_LARGE: 'Input too large',
  AI_INVALID_OUTPUT: 'Analysis was discarded',
  AI_UNAVAILABLE: 'Analysis unavailable',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'assessment' | 'noc-directory' | 'ref-letter'
  >('assessment');
  const [brief, setBrief] = useState<AlignmentBrief | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastInput, setLastInput] = useState<Record<string, unknown> | null>(
    null,
  );

  const runAnalysis = useCallback(
    async (input: Record<string, unknown>) => {
      setIsLoading(true);
      setErrorMessage(null);
      setErrorCode(null);
      setBrief(null);
      setLastInput(input);

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        let payload: AnalysisResultPayload | null = null;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        if (response.ok && payload && payload.success) {
          setBrief(payload.brief);
        } else if (payload && payload.success === false) {
          setErrorCode(payload.code);
          setErrorMessage(payload.message);
        } else {
          setErrorCode('AI_UNAVAILABLE');
          setErrorMessage(
            'Analysis is temporarily unavailable. Nothing was generated - please try again.',
          );
        }
      } catch {
        setErrorCode('AI_UNAVAILABLE');
        setErrorMessage(
          'Could not reach the analysis service. Nothing was generated - please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-900 selection:text-white">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'noc-directory' ? (
          <NocDirectoryPage />
        ) : activeTab === 'ref-letter' ? (
          <ReferenceLetterGuidance />
        ) : (
          <>
            {/* Intro banner */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 shadow-xl space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Evidence-traceable, any occupation</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                Canada Application Alignment
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
                CareerProof compares one job advert against your CV or your own
                written statements. Every finding quotes the advert and quotes
                you, or it is marked <em>Not determined</em>. It never scores
                you, never writes resume text, and never invents anything.
              </p>
            </div>

            <AssessmentForm onSubmit={runAnalysis} isLoading={isLoading} />

            {/* Output */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Alignment brief
              </h3>

              {isLoading ? (
                <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
                  <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <h4 className="text-base font-bold text-slate-200">
                      Comparing your CV against the advert
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Verifying every quote before anything is shown. This takes
                      a few seconds.
                    </p>
                  </div>
                </div>
              ) : errorMessage ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-red-950/40 border border-red-800/80 text-center space-y-4 shadow-xl">
                  <div className="w-10 h-10 mx-auto rounded-full bg-red-900/60 border border-red-700 flex items-center justify-center text-red-300">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-red-200">
                      {errorCode ? ERROR_TITLES[errorCode] ?? 'Analysis error' : 'Analysis error'}
                    </h4>
                    <p className="text-xs text-red-300/90 mt-1 max-w-md mx-auto leading-relaxed">
                      {errorMessage}
                    </p>
                  </div>
                  {lastInput && (
                    <button
                      onClick={() => runAnalysis(lastInput)}
                      className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white text-xs font-semibold shadow transition"
                    >
                      Try again
                    </button>
                  )}
                </div>
              ) : brief ? (
                <AlignmentBriefRenderer brief={brief} />
              ) : (
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
                  Fill in the form above to compare your CV against a job
                  advert. Nothing runs automatically.
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 space-y-1">
          <p>CareerProof - evidence-traceable application alignment.</p>
          <p className="text-[11px] text-slate-600">
            No hiring probability, no labour market data, no licensing
            determinations, no immigration eligibility. Verify everything with
            the official source.
          </p>
        </div>
      </footer>
    </div>
  );
}
