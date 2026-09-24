import React, { useState } from 'react';
import {
  AlertCircle,
  GraduationCap,
  Globe,
  Languages,
  Loader2,
  MapPin,
  Search,
  Target,
} from 'lucide-react';
import type { AnalyzeRequestBody } from '../types';

const MAX_TEXT_LENGTH = 20_000;

interface AssessmentFormProps {
  onSubmit: (input: AnalyzeRequestBody) => void;
  isLoading: boolean;
}

const textAreaClass =
  'w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500 leading-relaxed resize-y';
const inputClass =
  'w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500';
const labelClass =
  'block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1';

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [postingText, setPostingText] = useState('');
  const [candidateText, setCandidateText] = useState('');
  const [postingUrl, setPostingUrl] = useState('');
  const [educationText, setEducationText] = useState('');
  const [certificationsText, setCertificationsText] = useState('');
  const [languageText, setLanguageText] = useState('');
  const [currentLocationText, setCurrentLocationText] = useState('');
  const [targetProvincesText, setTargetProvincesText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!postingText.trim()) {
      setValidationError('Paste the job advert text - the analysis quotes it directly.');
      return;
    }
    if (!candidateText.trim()) {
      setValidationError(
        'Paste your CV or resume content - this is what gets quoted back as evidence.',
      );
      return;
    }
    if (postingText.length > MAX_TEXT_LENGTH) {
      setValidationError(
        `The job advert is ${postingText.length.toLocaleString()} characters. The limit is ${MAX_TEXT_LENGTH.toLocaleString()}. Please shorten it.`,
      );
      return;
    }
    if (candidateText.length > MAX_TEXT_LENGTH) {
      setValidationError(
        `Your CV text is ${candidateText.length.toLocaleString()} characters. The limit is ${MAX_TEXT_LENGTH.toLocaleString()}. Please shorten it.`,
      );
      return;
    }

    onSubmit({
      postingText,
      candidateText,
      postingUrl: postingUrl.trim() || undefined,
      educationText: educationText.trim() || undefined,
      certificationsText: certificationsText.trim() || undefined,
      languageText: languageText.trim() || undefined,
      currentLocationText: currentLocationText.trim() || undefined,
      targetProvinces: targetProvincesText
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl text-slate-100 space-y-5"
    >
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-200">Analyze an application</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Works for any occupation. Paste the job advert and your CV - the tool
          reads the whole CV (work history, education, skills, languages,
          licences) and only reports what it can quote: every finding points
          back to the advert or to your own CV text. Anything it cannot
          determine is labeled <em>Not determined</em>, never guessed.
        </p>
      </div>

      {validationError && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Posting */}
      <div className="space-y-2">
        <label className={labelClass}>
          1. Job advert text <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={10}
          value={postingText}
          onChange={(e) => setPostingText(e.target.value)}
          placeholder="Paste the full job advert here - duties, requirements, hours, location, everything. The analysis quotes it word for word."
          className={textAreaClass}
        />
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>{postingText.length.toLocaleString()} / 20,000 characters</span>
        </div>
        <div>
          <label className={labelClass}>Posting URL (optional)</label>
          <input
            type="url"
            value={postingUrl}
            onChange={(e) => setPostingUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Candidate evidence: the CV */}
      <div className="space-y-2">
        <label className={labelClass}>
          2. Your CV or resume content <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={12}
          value={candidateText}
          onChange={(e) => setCandidateText(e.target.value)}
          placeholder={'Paste your full CV content here - work history with dates, duties, education, skills, certifications, languages. Plain text from any format is fine. The analysis quotes it word for word as evidence.'}
          className={textAreaClass}
        />
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>{candidateText.length.toLocaleString()} / 20,000 characters</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          The whole CV counts as evidence, not just work experience - education,
          certifications, languages, and location are all read from it. The
          optional fields below are only for corrections or anything your CV
          does not already cover.
        </p>
      </div>

      {/* Optional structured context */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Optional details (all optional - skip anything your CV already covers)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              <GraduationCap className="w-3 h-3 inline text-purple-400 mr-1" />
              Education
            </label>
            <input
              type="text"
              value={educationText}
              onChange={(e) => setEducationText(e.target.value)}
              placeholder="e.g. Diploma in Practical Nursing (2019)"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              <Search className="w-3 h-3 inline text-amber-400 mr-1" />
              Licences &amp; certifications
            </label>
            <input
              type="text"
              value={certificationsText}
              onChange={(e) => setCertificationsText(e.target.value)}
              placeholder="e.g. CPA designation, Class 1 driver's licence"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              <Languages className="w-3 h-3 inline text-emerald-400 mr-1" />
              Languages
            </label>
            <input
              type="text"
              value={languageText}
              onChange={(e) => setLanguageText(e.target.value)}
              placeholder="e.g. English (fluent), French (intermediate)"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>
              <MapPin className="w-3 h-3 inline text-sky-400 mr-1" />
              Where you currently live &amp; are authorized to work
            </label>
            <input
              type="text"
              value={currentLocationText}
              onChange={(e) => setCurrentLocationText(e.target.value)}
              placeholder="e.g. Dublin, Ireland (no Canadian work authorization yet)"
              className={inputClass}
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>
              <Globe className="w-3 h-3 inline text-emerald-400 mr-1" />
              Provinces you would consider (comma-separated, optional)
            </label>
            <input
              type="text"
              value={targetProvincesText}
              onChange={(e) => setTargetProvincesText(e.target.value)}
              placeholder="e.g. Ontario, British Columbia"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-6 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-sm tracking-wide shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing - quoting the advert against your input...</span>
          </>
        ) : (
          <>
            <Target className="w-4 h-4" />
            <span>Compare my CV against this advert</span>
          </>
        )}
      </button>
    </form>
  );
};
