"use client";

import { FormEvent, useState } from "react";
import { PageHeader, Card, Field, inputClass, Button, Badge, LoadingAI, SectionList, Meter } from "@/components/ui";
import { generateProspectIntelligence } from "@/lib/ai-engine";
import { useApp } from "@/lib/store";
import type { ProspectInput, ProspectReport } from "@/lib/types";
import { formatCurrency, sleep } from "@/lib/utils";

const initial: ProspectInput = {
  companyName: "Acme Manufacturing",
  contactName: "Karen Brooks",
  industry: "Industrial Automation",
  dealSize: "85000",
  stage: "Demo",
  opportunityNotes:
    "Evaluating SalesPilot for AE prep and call coaching. Interested in a Q3 pilot if ROI and implementation timeline are clear.",
  painPoints: "Implementation time, Operator adoption, Legacy vendor lock-in",
  competitors: "Siemens MindSphere, Rockwell",
  additionalNotes: "Plant manager should join next technical discussion. Current vendor contract runs to December.",
};

export default function PreparePage() {
  const { addReport, updateCompanyFromReport } = useApp();
  const [form, setForm] = useState<ProspectInput>(initial);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ProspectReport | null>(null);

  function set<K extends keyof ProspectInput>(key: K, value: ProspectInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    await sleep(1400);
    const result = generateProspectIntelligence(form);
    setReport(result);
    addReport(result);
    updateCompanyFromReport(result);
    setLoading(false);
  }

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Prospect Preparation"
        subtitle="Enter deal context and generate objections, discovery questions, positioning, and win probability."
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2" title="Deal context">
          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="Company Name">
              <input className={inputClass} value={form.companyName} onChange={(e) => set("companyName", e.target.value)} required />
            </Field>
            <Field label="Contact Name">
              <input className={inputClass} value={form.contactName} onChange={(e) => set("contactName", e.target.value)} required />
            </Field>
            <Field label="Industry">
              <input className={inputClass} value={form.industry} onChange={(e) => set("industry", e.target.value)} required />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Deal Size ($)">
                <input className={inputClass} value={form.dealSize} onChange={(e) => set("dealSize", e.target.value)} required />
              </Field>
              <Field label="Current Stage">
                <select className={inputClass} value={form.stage} onChange={(e) => set("stage", e.target.value)}>
                  {["Discovery", "Qualification", "Demo", "Proposal", "Negotiation"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Opportunity Notes">
              <textarea className={inputClass + " min-h-[88px]"} value={form.opportunityNotes} onChange={(e) => set("opportunityNotes", e.target.value)} />
            </Field>
            <Field label="Pain Points">
              <textarea className={inputClass + " min-h-[72px]"} value={form.painPoints} onChange={(e) => set("painPoints", e.target.value)} />
            </Field>
            <Field label="Competitors">
              <input className={inputClass} value={form.competitors} onChange={(e) => set("competitors", e.target.value)} />
            </Field>
            <Field label="Additional Notes">
              <textarea className={inputClass + " min-h-[72px]"} value={form.additionalNotes} onChange={(e) => set("additionalNotes", e.target.value)} />
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Generating…" : "Generate Sales Intelligence"}
            </Button>
          </form>
        </Card>

        <div className="space-y-6 xl:col-span-3">
          {loading && <LoadingAI label="Building pre-meeting intelligence…" />}

          {!loading && !report && (
            <Card>
              <div className="py-10 text-center">
                <p className="font-display text-lg font-semibold text-navy-900">Ready when you are</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Demo form is prefilled with Acme Manufacturing. Click Generate Sales Intelligence to produce a full analysis pack.
                </p>
              </div>
            </Card>
          )}

          {report && (
            <>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-navy-950">{report.company}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {report.contact} · {report.industry} · {formatCurrency(report.dealSize)} · {report.stage}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge tone={report.riskLevel === "High" ? "danger" : report.riskLevel === "Medium" ? "warning" : "success"}>
                      Risk: {report.riskLevel}
                    </Badge>
                    <Badge tone="brand">Win {report.winProbability}%</Badge>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Meter value={report.winProbability} label="Win Probability" color="bg-emerald-500" />
                  <Meter
                    value={report.riskLevel === "High" ? 78 : report.riskLevel === "Medium" ? 52 : 28}
                    label="Risk Level"
                    color={report.riskLevel === "High" ? "bg-rose-500" : report.riskLevel === "Medium" ? "bg-amber-500" : "bg-emerald-500"}
                  />
                </div>
              </Card>

              <Card title="Executive Summary">
                <p className="text-sm leading-relaxed text-slate-700">{report.executiveSummary}</p>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card title="Likely Business Challenges">
                  <SectionList items={report.challenges} />
                </Card>
                <Card title="Possible Stakeholders">
                  <SectionList items={report.stakeholders} />
                </Card>
                <Card title="Common Objections">
                  <SectionList items={report.objections} bullet="⚠" />
                </Card>
                <Card title="Recommended Discovery Questions">
                  <SectionList items={report.discoveryQuestions} bullet="?" />
                </Card>
                <Card title="Competitive Risks">
                  <SectionList items={report.competitiveRisks} />
                </Card>
                <Card title="Suggested Positioning">
                  <SectionList items={report.positioning} />
                </Card>
              </div>

              <Card title="Recommended Value Proposition">
                <p className="text-sm leading-relaxed text-slate-700">{report.valueProposition}</p>
              </Card>

              <Card title="Potential Upsell Opportunities">
                <SectionList items={report.upsell} bullet="+" />
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
