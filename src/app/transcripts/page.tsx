"use client";

import { FormEvent, useRef, useState } from "react";
import {
  PageHeader,
  Card,
  Field,
  inputClass,
  Button,
  Badge,
  LoadingAI,
  SectionList,
  Meter,
} from "@/components/ui";
import { analyzeTranscript, generateFollowUpPack } from "@/lib/ai-engine";
import { DEMO_TRANSCRIPT } from "@/lib/sample-data";
import { useApp } from "@/lib/store";
import type { TranscriptAnalysis } from "@/lib/types";
import { sleep } from "@/lib/utils";

export default function TranscriptsPage() {
  const { addAnalysis, addFollowUp } = useApp();
  const [company, setCompany] = useState("Acme Manufacturing");
  const [contact, setContact] = useState("Karen Brooks");
  const [transcript, setTranscript] = useState(DEMO_TRANSCRIPT);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<TranscriptAnalysis | null>(null);
  const [followUp, setFollowUp] = useState<ReturnType<typeof generateFollowUpPack> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onAnalyze(e?: FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setAnalysis(null);
    setFollowUp(null);
    await sleep(1600);
    const result = analyzeTranscript(transcript, company, contact);
    const pack = generateFollowUpPack(result);
    setAnalysis(result);
    setFollowUp(pack);
    addAnalysis(result);
    addFollowUp({
      id: `f-live-${Date.now()}`,
      company,
      type: "email",
      subject: pack.email.subject,
      body: pack.email.body,
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setLoading(false);
  }

  async function onFile(file: File | null) {
    if (!file) return;
    const text = await file.text();
    setTranscript(text || DEMO_TRANSCRIPT);
  }

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Transcript Analysis"
        subtitle="Upload or paste a sales call transcript to detect objections, buying signals, missed opportunities, and next actions."
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2" title="Call transcript">
          <form onSubmit={onAnalyze} className="space-y-3">
            <Field label="Company">
              <input className={inputClass} value={company} onChange={(e) => setCompany(e.target.value)} />
            </Field>
            <Field label="Contact">
              <input className={inputClass} value={contact} onChange={(e) => setContact(e.target.value)} />
            </Field>
            <Field label="Upload transcript (.txt)">
              <input
                ref={fileRef}
                type="file"
                accept=".txt,text/plain"
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700"
                onChange={(e) => onFile(e.target.files?.[0] || null)}
              />
            </Field>
            <Field label="Paste transcript">
              <textarea
                className={inputClass + " min-h-[320px] font-mono text-xs leading-relaxed"}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                required
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Analyzing…" : "Analyze Transcript"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setTranscript(DEMO_TRANSCRIPT);
                  setCompany("Acme Manufacturing");
                  setContact("Karen Brooks");
                }}
              >
                Load demo transcript
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6 xl:col-span-3">
          {loading && <LoadingAI label="Analyzing conversation signals…" />}

          {!loading && !analysis && (
            <Card>
              <div className="py-10 text-center">
                <p className="font-display text-lg font-semibold text-navy-900">Demo transcript loaded</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                  Run analysis to surface objections, buying signals, missed opportunities, follow-up email, and prioritized next actions.
                </p>
              </div>
            </Card>
          )}

          {analysis && (
            <>
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-bold text-navy-950">{analysis.company}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {analysis.contact} · {analysis.date} · {analysis.duration}
                    </p>
                  </div>
                  <Badge tone="brand">Confidence {analysis.confidenceScore}%</Badge>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Meter value={analysis.confidenceScore} label="Confidence Score" />
                  <Meter value={analysis.decisionMakerConfidence} label="Decision Maker Confidence" color="bg-sky-500" />
                  <Meter value={analysis.sentiment} label="Conversation Sentiment" color="bg-emerald-500" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-soft px-3 py-2 text-sm">
                    Talk ratio · Rep <strong>{analysis.talkRatio.rep}%</strong> / Customer{" "}
                    <strong>{analysis.talkRatio.customer}%</strong>
                  </div>
                  <div className="rounded-xl bg-slate-soft px-3 py-2 text-sm">
                    Signals detected · <strong>{analysis.buyingSignals.length}</strong> buying ·{" "}
                    <strong>{analysis.objections.length}</strong> objections
                  </div>
                </div>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card title="Detected Objections">
                  <div className="flex flex-wrap gap-2">
                    {analysis.objections.map((o) => (
                      <Badge key={o} tone="warning">{o}</Badge>
                    ))}
                  </div>
                </Card>
                <Card title="Buying Signals">
                  <SectionList items={analysis.buyingSignals.map((s) => `✔ ${s}`)} bullet="" />
                </Card>
                <Card title="Positive Sentiment">
                  <SectionList items={analysis.positiveSentiment} bullet="+" />
                </Card>
                <Card title="Negative Sentiment">
                  <SectionList items={analysis.negativeSentiment} bullet="-" />
                </Card>
                <Card title="Missed Opportunities">
                  <SectionList items={analysis.missedOpportunities} bullet="!" />
                </Card>
                <Card title="Recommended Follow-up">
                  <SectionList items={analysis.recommendedFollowUp} />
                </Card>
              </div>

              <Card title="Suggested Next Meeting Agenda">
                <SectionList items={analysis.nextMeetingAgenda} />
              </Card>

              <Card title="Next Best Actions">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-rose-600">High Priority</p>
                    <SectionList items={analysis.nextActions.high} />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">Medium Priority</p>
                    <SectionList items={analysis.nextActions.medium} />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Low Priority</p>
                    <SectionList items={analysis.nextActions.low} />
                  </div>
                </div>
              </Card>

              {followUp && (
                <>
                  <Card title="Recommended Email">
                    <p className="mb-2 text-sm font-semibold text-navy-900">Subject: {followUp.email.subject}</p>
                    <pre className="whitespace-pre-wrap rounded-xl bg-slate-soft p-4 text-sm leading-relaxed text-slate-700">
                      {followUp.email.body}
                    </pre>
                  </Card>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card title="LinkedIn Message">
                      <p className="text-sm leading-relaxed text-slate-700">{followUp.linkedin.body}</p>
                    </Card>
                    <Card title="Executive Summary">
                      <p className="text-sm leading-relaxed text-slate-700">{followUp.executiveSummary}</p>
                    </Card>
                    <Card title="CRM Notes">
                      <pre className="whitespace-pre-wrap text-sm text-slate-700">{followUp.crmNotes}</pre>
                    </Card>
                    <Card title="Meeting Recap">
                      <p className="text-sm leading-relaxed text-slate-700">{followUp.meetingRecap}</p>
                    </Card>
                  </div>
                  <Card title="Action Items">
                    <SectionList items={followUp.actionItems} />
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
