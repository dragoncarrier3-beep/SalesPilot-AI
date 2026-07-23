"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authenticate, type DemoUser } from "./auth";
import {
  COMPANIES,
  FOLLOW_UPS,
  PROSPECT_REPORTS,
  TRANSCRIPT_ANALYSES,
} from "./sample-data";
import type { Company, FollowUpAsset, ProspectReport, TranscriptAnalysis } from "./types";

interface AppState {
  user: DemoUser | null;
  ready: boolean;
  companies: Company[];
  reports: ProspectReport[];
  analyses: TranscriptAnalysis[];
  followUps: FollowUpAsset[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  addReport: (report: ProspectReport) => void;
  addAnalysis: (analysis: TranscriptAnalysis) => void;
  addFollowUp: (item: FollowUpAsset) => void;
  updateCompanyFromReport: (report: ProspectReport) => void;
}

const AuthContext = createContext<AppState | null>(null);
const STORAGE_KEY = "salespilot_session_v1";
const DATA_KEY = "salespilot_data_v1";

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(COMPANIES);
  const [reports, setReports] = useState<ProspectReport[]>(PROSPECT_REPORTS);
  const [analyses, setAnalyses] = useState<TranscriptAnalysis[]>(TRANSCRIPT_ANALYSES);
  const [followUps, setFollowUps] = useState<FollowUpAsset[]>(FOLLOW_UPS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DemoUser;
        setUser(parsed);
      }
      const dataRaw = localStorage.getItem(DATA_KEY);
      if (dataRaw) {
        const data = JSON.parse(dataRaw) as {
          companies?: Company[];
          reports?: ProspectReport[];
          analyses?: TranscriptAnalysis[];
          followUps?: FollowUpAsset[];
        };
        if (data.companies?.length) setCompanies(data.companies);
        if (data.reports?.length) setReports(data.reports);
        if (data.analyses?.length) setAnalyses(data.analyses);
        if (data.followUps?.length) setFollowUps(data.followUps);
      }
    } catch {
      // ignore corrupted storage
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      DATA_KEY,
      JSON.stringify({ companies, reports, analyses, followUps })
    );
  }, [ready, companies, reports, analyses, followUps]);

  const login = useCallback((email: string, password: string) => {
    const found = authenticate(email.trim(), password);
    if (!found) return { ok: false, error: "Invalid email or password. Use the demo credentials." };
    setUser(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const addReport = useCallback((report: ProspectReport) => {
    setReports((prev) => [report, ...prev]);
  }, []);

  const addAnalysis = useCallback((analysis: TranscriptAnalysis) => {
    setAnalyses((prev) => [analysis, ...prev]);
  }, []);

  const addFollowUp = useCallback((item: FollowUpAsset) => {
    setFollowUps((prev) => [item, ...prev]);
  }, []);

  const updateCompanyFromReport = useCallback((report: ProspectReport) => {
    setCompanies((prev) => {
      const idx = prev.findIndex(
        (c) => c.name.toLowerCase() === report.company.toLowerCase()
      );
      if (idx === -1) {
        const created: Company = {
          id: `c-live-${Date.now()}`,
          name: report.company,
          industry: report.industry,
          dealSize: report.dealSize,
          stage: report.stage,
          contactId: `ct-live-${Date.now()}`,
          contactName: report.contact,
          painPoints: report.challenges,
          competitors: report.competitiveRisks.map((r) => r.split(":")[0]),
          notes: report.executiveSummary.slice(0, 180),
          riskScore:
            report.riskLevel === "High" ? 68 : report.riskLevel === "Medium" ? 48 : 32,
          winProbability: report.winProbability,
          lastMeeting: report.createdAt,
          aiSummary: report.executiveSummary.slice(0, 140),
          nextFollowUp: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
        };
        return [created, ...prev];
      }
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        winProbability: report.winProbability,
        riskScore:
          report.riskLevel === "High" ? 68 : report.riskLevel === "Medium" ? 48 : 32,
        aiSummary: report.executiveSummary.slice(0, 140),
        lastMeeting: report.createdAt,
        stage: report.stage,
        dealSize: report.dealSize,
      };
      return copy;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      companies,
      reports,
      analyses,
      followUps,
      login,
      logout,
      addReport,
      addAnalysis,
      addFollowUp,
      updateCompanyFromReport,
    }),
    [
      user,
      ready,
      companies,
      reports,
      analyses,
      followUps,
      login,
      logout,
      addReport,
      addAnalysis,
      addFollowUp,
      updateCompanyFromReport,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
