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

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  targetRole: string;
  targetCity: string;
  deadlineDays: number;
  deadlineDate: string;
  resumeText: string;
  jobDescriptionText: string;
  educationDegree: string;
  hasWesEca: boolean;
  experiences: WorkExperience[];
}

export interface AnalysisResponse {
  markdownAnalysis: string;
  matchScore?: number;
  targetRole?: string;
  recommendedNoc?: string;
  criticalDealbreakersCount?: number;
}
