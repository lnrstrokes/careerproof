import React, { useState, useMemo } from 'react';
import { CandidateInput, PresetScenario, WorkExperience } from '../types';
import { PRESET_SCENARIOS } from '../data/presets';
import { Sparkles, Play, Calendar, MapPin, Briefcase, GraduationCap, ShieldCheck, AlertCircle, Plus, Trash2, Zap } from 'lucide-react';

interface AssessmentFormProps {
  onSubmit: (input: CandidateInput) => void;
  isLoading: boolean;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, isLoading }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_SCENARIOS[0].id);
  
  // Form States initialized with Preset 0
  const preset0 = PRESET_SCENARIOS[0];
  const [targetRole, setTargetRole] = useState(preset0.targetRole);
  const [targetCity, setTargetCity] = useState(preset0.targetCity);
  const [deadlineDays, setDeadlineDays] = useState<number>(preset0.deadlineDays);
  const [deadlineDate, setDeadlineDate] = useState<string>(preset0.deadlineDate);
  const [resumeText, setResumeText] = useState(preset0.resumeText);
  const [jobDescriptionText, setJobDescriptionText] = useState(preset0.jobDescriptionText);
  const [educationDegree, setEducationDegree] = useState(preset0.educationDegree);
  const [hasWesEca, setHasWesEca] = useState(preset0.hasWesEca);
  const [experiences, setExperiences] = useState<WorkExperience[]>(preset0.experiences);

  // Analyze pasted CV for Nigerian context and ATS compliance issues
  const cvWarnings = useMemo(() => {
    const text = resumeText || '';
    const isNigerian = /lagos|abuja|nigeria|nigerian|nysc|national youth service|unilag|covenant|yaba|futa|oau|ikeja|victoria island|port harcourt|naira|ngn|enugu|ibadan/i.test(text);
    
    const hasPersonalDetails = /state of origin|local government|lga|marital status|religion|date of birth|dob|gender|nationality/i.test(text);
    const hasUnframedNysc = /nysc corper|\bcorper\b|nysc intern/i.test(text);
    const lacksQuantifiedMetrics = !/\d+%|\$\d+|\d+\+|\d+ms|\d+gb/i.test(text);

    const isATSNonCompliant = hasPersonalDetails || hasUnframedNysc || lacksQuantifiedMetrics;

    return {
      isNigerian,
      isATSNonCompliant,
      hasPersonalDetails,
      hasUnframedNysc,
      lacksQuantifiedMetrics,
    };
  }, [resumeText]);

  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    setTargetRole(preset.targetRole);
    setTargetCity(preset.targetCity);
    setDeadlineDays(preset.deadlineDays);
    setDeadlineDate(preset.deadlineDate);
    setResumeText(preset.resumeText);
    setJobDescriptionText(preset.jobDescriptionText);
    setEducationDegree(preset.educationDegree);
    setHasWesEca(preset.hasWesEca);
    setExperiences(preset.experiences);
  };

  const handleDeadlineDaysChange = (days: number) => {
    setDeadlineDays(days);
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDeadlineDate(d.toISOString().split('T')[0]);
  };

  const handleToggleReferenceLetter = (id: string) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id === id) {
        const nextRef = !exp.hasReferenceLetter;
        return { ...exp, hasReferenceLetter: nextRef, isVerified: nextRef && exp.hasPayslips };
      }
      return exp;
    }));
  };

  const handleTogglePayslips = (id: string) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id === id) {
        const nextPay = !exp.hasPayslips;
        return { ...exp, hasPayslips: nextPay, isVerified: exp.hasReferenceLetter && nextPay };
      }
      return exp;
    }));
  };

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: 'Company from CV',
      role: 'Software Developer',
      startDate: '2020-01',
      endDate: '2022-12',
      bullets: ['Developed software systems from CV'],
      hasReferenceLetter: false,
      hasPayslips: true,
      isVerified: false
    };
    setExperiences(prev => [...prev, newExp]);
  };

  const handleAutoExtractRolesFromCv = () => {
    if (!resumeText.trim()) {
      alert("Please paste your CV text first to extract work experience roles.");
      return;
    }

    const lines = resumeText.split('\n');
    const extracted: WorkExperience[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 8 && (trimmed.includes('|') || trimmed.includes('–') || trimmed.includes(' at ') || trimmed.includes('- Present') || trimmed.includes('Developer') || trimmed.includes('Engineer'))) {
        const parts = trimmed.split(/\||–|at|-/).map(p => p.trim());
        if (parts.length >= 2) {
          extracted.push({
            id: `exp-auto-${Date.now()}-${extracted.length}`,
            company: parts[1] || 'Company from CV',
            role: parts[0] || 'Software Engineer',
            startDate: '2021-01',
            endDate: 'Present',
            bullets: [trimmed],
            hasReferenceLetter: false,
            hasPayslips: true,
            isVerified: false
          });
        }
      }
    }

    if (extracted.length > 0) {
      setExperiences(extracted.slice(0, 4));
    } else {
      handleAddExperience();
    }
  };

  const handleRemoveExperience = (id: string) => {
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      alert("Please provide both Resume and Job Description text.");
      return;
    }
    onSubmit({
      resumeText,
      jobDescriptionText,
      jobTitle: targetRole,
      companyName: '',
      targetCity,
      deadlineDays,
      deadlineDate,
      educationDegree: educationDegree || 'Degree Extracted from CV',
      hasWesEca,
      experiences,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl text-slate-100 space-y-6">
      {/* Fast Preset Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Candidate Scenario Preset</span>
          </label>
          <span className="text-[11px] text-slate-400">Instant load for test scenarios</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {PRESET_SCENARIOS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3 rounded-xl border transition text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-red-950/40 border-red-500/60 text-red-100 ring-1 ring-red-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-bold mb-1 text-slate-100">{preset.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-tight">{preset.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-5">
        {/* Basic Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center space-x-1">
              <Briefcase className="w-3 h-3 text-sky-400" />
              <span>Target Role</span>
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              placeholder="e.g. Senior Software Engineer"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Target City</span>
            </label>
            <input
              type="text"
              value={targetCity}
              onChange={(e) => setTargetCity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-red-500"
              placeholder="e.g. Toronto, ON or Vancouver, BC"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1 flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>Deadline Days</span>
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={1}
                max={90}
                value={deadlineDays}
                onChange={(e) => handleDeadlineDaysChange(parseInt(e.target.value) || 1)}
                className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 text-center font-bold"
              />
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                deadlineDays <= 14 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-800 text-slate-300'
              }`}>
                {deadlineDays <= 14 ? '⚡ Urgent (Phase 1 only)' : '📅 Standard'}
              </span>
            </div>
          </div>
        </div>

        {/* Education & WES ECA Information Section */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Education &amp; WES ECA</span>
            </label>
            <span className="text-[10px] text-purple-300 font-mono bg-purple-950/70 px-2 py-0.5 rounded border border-purple-800/50">
              Captured from CV
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <div className="font-medium text-slate-200">
              🎓 <strong>Degree Extracted from CV:</strong> <span className="text-sky-300">B.Sc. Computer Science (University of Lagos) or Degree as parsed from CV</span>
            </div>
            <p className="text-[11px] text-slate-400">
              <strong className="text-amber-300">Why WES ECA is Critical for IRCC:</strong> Non-Canadian degrees require an Educational Credential Assessment (ECA) issued by World Education Services (WES) or ICAS to claim Express Entry CRS education points (up to 150 points). Submitting a PR profile without a completed WES ECA results in 0 education points under Express Entry and provincial draws.
            </p>
          </div>

          <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold text-slate-200 pt-1 select-none">
            <input
              type="checkbox"
              checked={hasWesEca}
              onChange={(e) => setHasWesEca(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-red-600 focus:ring-0 cursor-pointer"
            />
            <span className={hasWesEca ? 'text-emerald-300 font-bold' : 'text-slate-300'}>
              WES Educational Credential Assessment (ECA) Completed &amp; Verified
            </span>
          </label>
        </div>

        {/* Resumes & Job Descriptions Text Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Resume Box with Nigerian & ATS Warnings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                <span>1. Candidate Resume</span>
                <span className="text-red-400">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">{resumeText.length} chars</span>
            </div>

            {/* Nigerian CV & ATS Warning Banner */}
            {(cvWarnings.isNigerian || cvWarnings.isATSNonCompliant) && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 space-y-2 text-xs shadow-md">
                <div className="flex items-center space-x-2 font-bold text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>⚠️ Nigerian &amp; International CV ATS Compliance Warning</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-200/90 leading-relaxed">
                  {cvWarnings.isNigerian && (
                    <li>
                      <strong>Nigerian Context Detected:</strong> Credentials/roles (e.g. UNILAG, NYSC, Lagos) require specific Canadian ATS keyword framing.
                    </li>
                  )}
                  {cvWarnings.hasPersonalDetails && (
                    <li className="text-red-300 font-medium">
                      <strong>Remove Personal Details:</strong> Canadian ATS screeners reject resumes listing State of Origin, LGA, Marital Status, Religion, or Date of Birth. Remove these.
                    </li>
                  )}
                  {cvWarnings.hasUnframedNysc && (
                    <li className="text-amber-200">
                      <strong>Reframe NYSC Roles:</strong> "NYSC Corper" must be reframed as "Software Developer (NYSC Contract Delivery)" to align with ESDC NOC duty definitions.
                    </li>
                  )}
                  {cvWarnings.lacksQuantifiedMetrics && (
                    <li>
                      <strong>Add Quantified Achievement Metrics:</strong> Include specific numbers (e.g. "improved throughput by 40%", "scaled to 50k users") for ATS scoring.
                    </li>
                  )}
                </ul>
              </div>
            )}

            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste candidate resume text..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-red-500 leading-relaxed"
            />
          </div>

          {/* Job Description Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                <span>2. Target Job Description</span>
                <span className="text-red-400">*</span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">{jobDescriptionText.length} chars</span>
            </div>
            <textarea
              rows={12}
              value={jobDescriptionText}
              onChange={(e) => setJobDescriptionText(e.target.value)}
              placeholder="Paste target Canadian job description..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-red-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Structured Work Experience Verification Checklist */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>3. IRCC Work Experience Verification Tracker</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Mark roles where you have reference letters on company letterhead &amp; payslips. Roles without letterheads will be flagged as <span className="text-amber-400 font-semibold">"Claimed - Requires Evidence"</span>.
              </p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handleAutoExtractRolesFromCv}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg text-xs font-medium flex items-center space-x-1 transition border border-slate-700"
                title="Auto-Sync roles from pasted CV text"
              >
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>Auto-Extract from CV</span>
              </button>
              <button
                type="button"
                onClick={handleAddExperience}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1 transition border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Role</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {experiences.map((exp) => (
              <div key={exp.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex-1">
                  <div className="font-semibold text-slate-100">{exp.role} at <span className="text-sky-400">{exp.company}</span></div>
                  <div className="text-[11px] text-slate-400">{exp.startDate} to {exp.endDate}</div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={exp.hasReferenceLetter}
                      onChange={() => handleToggleReferenceLetter(exp.id)}
                      className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                    />
                    <span className={exp.hasReferenceLetter ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                      Official Letterhead
                    </span>
                  </label>

                  <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={exp.hasPayslips}
                      onChange={() => handleTogglePayslips(exp.id)}
                      className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                    />
                    <span className={exp.hasPayslips ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                      Payslips/Tax
                    </span>
                  </label>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    exp.hasReferenceLetter
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {exp.hasReferenceLetter ? '✅ Verified' : '⚠️ Claimed'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="p-1 text-slate-500 hover:text-red-400 transition"
                    title="Remove Role"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-950/50 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Resume &amp; Job Description with Gemini...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>GENERATE AUTOMATIC JOB MATCH &amp; NOC ALIGNMENT ASSESSMENT</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
