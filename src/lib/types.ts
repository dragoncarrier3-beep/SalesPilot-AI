export type DealStage =
  | "Discovery"
  | "Qualification"
  | "Demo"
  | "Proposal"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  dealSize: number;
  stage: DealStage;
  contactId: string;
  contactName: string;
  painPoints: string[];
  competitors: string[];
  notes: string;
  riskScore: number;
  winProbability: number;
  lastMeeting: string;
  aiSummary: string;
  nextFollowUp: string;
}

export interface Meeting {
  id: string;
  company: string;
  contact: string;
  time: string;
  type: string;
  stage: DealStage;
}

export interface ProspectReport {
  id: string;
  companyId: string;
  company: string;
  contact: string;
  industry: string;
  dealSize: number;
  stage: DealStage;
  createdAt: string;
  executiveSummary: string;
  challenges: string[];
  stakeholders: string[];
  objections: string[];
  discoveryQuestions: string[];
  competitiveRisks: string[];
  positioning: string[];
  valueProposition: string;
  upsell: string[];
  winProbability: number;
  riskLevel: "Low" | "Medium" | "High";
}

export interface TranscriptAnalysis {
  id: string;
  company: string;
  contact: string;
  date: string;
  duration: string;
  objections: string[];
  buyingSignals: string[];
  positiveSentiment: string[];
  negativeSentiment: string[];
  decisionMakerConfidence: number;
  missedOpportunities: string[];
  recommendedFollowUp: string[];
  recommendedEmail: string;
  nextMeetingAgenda: string[];
  confidenceScore: number;
  talkRatio: { rep: number; customer: number };
  sentiment: number;
  nextActions: {
    high: string[];
    medium: string[];
    low: string[];
  };
}

export interface FollowUpAsset {
  id: string;
  company: string;
  type: "email" | "linkedin" | "crm" | "recap";
  subject: string;
  body: string;
  createdAt: string;
}

export interface DiscoverySession {
  id: string;
  company: string;
  contact: string;
  date: string;
  questionsAsked: number;
  coverage: number;
  outcome: string;
}

export interface ProspectInput {
  companyName: string;
  contactName: string;
  industry: string;
  dealSize: string;
  stage: string;
  opportunityNotes: string;
  painPoints: string;
  competitors: string;
  additionalNotes: string;
}
