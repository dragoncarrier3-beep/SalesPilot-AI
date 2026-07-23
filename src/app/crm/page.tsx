"use client";

import { useMemo, useState } from "react";
import { PageHeader, Card, Badge, inputClass } from "@/components/ui";
import { useApp } from "@/lib/store";
import { formatCurrency, formatDate, riskLabel, winColor } from "@/lib/utils";

export default function CrmPage() {
  const { companies, reports, analyses } = useApp();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(companies[0]?.id || "");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return companies.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.stage.toLowerCase().includes(q)
    );
  }, [companies, query]);

  const selected = companies.find((c) => c.id === selectedId) || filtered[0] || companies[0];
  const relatedReports = reports.filter(
    (r) => r.company.toLowerCase() === selected?.name.toLowerCase()
  );
  const relatedAnalyses = analyses.filter(
    (a) => a.company.toLowerCase() === selected?.name.toLowerCase()
  );

  if (!selected) {
    return (
      <div className="animate-fade-up">
        <PageHeader title="CRM History" subtitle="No prospects available yet." />
      </div>
    );
  }

  const risk = riskLabel(selected.riskScore);

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="CRM History"
        subtitle="Browse prospects with risk scores, AI summaries, win probability, and linked analyses."
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2" title="Prospects">
          <input
            className={inputClass + " mb-3"}
            placeholder="Search company, contact, stage…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="max-h-[640px] space-y-2 overflow-y-auto scrollbar-thin">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                  selected.id === c.id
                    ? "border-brand-300 bg-brand-50"
                    : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-navy-900">{c.name}</p>
                  <span className={`text-sm font-semibold ${winColor(c.winProbability)}`}>
                    {c.winProbability}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {c.contactName} · {c.stage}
                </p>
              </button>
            ))}
          </div>
        </Card>

        <div className="space-y-6 xl:col-span-3">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-navy-950">{selected.name}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.contactName} · {selected.industry}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="brand">{selected.stage}</Badge>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${risk.color}`}>
                  Risk {risk.label} ({selected.riskScore})
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Meta label="Deal Size" value={formatCurrency(selected.dealSize)} />
              <Meta label="Win Probability" value={`${selected.winProbability}%`} />
              <Meta label="Last Meeting" value={formatDate(selected.lastMeeting)} />
              <Meta label="Next Follow-up" value={formatDate(selected.nextFollowUp)} />
            </div>

            <div className="mt-5 rounded-xl bg-slate-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Summary</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{selected.aiSummary}</p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-navy-900">Pain Points</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  {selected.painPoints.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-navy-900">Competitors</p>
                <ul className="space-y-1 text-sm text-slate-600">
                  {selected.competitors.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">{selected.notes}</p>
          </Card>

          <Card title={`Prospect Reports (${relatedReports.length})`}>
            {relatedReports.length === 0 ? (
              <p className="text-sm text-slate-500">No saved prospect reports for this account yet.</p>
            ) : (
              <div className="space-y-3">
                {relatedReports.slice(0, 5).map((r) => (
                  <div key={r.id} className="rounded-xl border border-slate-100 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-navy-900">{formatDate(r.createdAt)}</p>
                      <Badge tone="brand">Win {r.winProbability}%</Badge>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{r.executiveSummary.slice(0, 180)}…</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title={`Transcript Analyses (${relatedAnalyses.length})`}>
            {relatedAnalyses.length === 0 ? (
              <p className="text-sm text-slate-500">No transcript analyses linked yet.</p>
            ) : (
              <div className="space-y-3">
                {relatedAnalyses.slice(0, 5).map((a) => (
                  <div key={a.id} className="rounded-xl border border-slate-100 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-navy-900">
                        {formatDate(a.date)} · {a.duration}
                      </p>
                      <Badge>{a.confidenceScore}% conf.</Badge>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      Objections: {a.objections.join(", ")} · Signals: {a.buyingSignals.slice(0, 2).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-navy-900">{value}</p>
    </div>
  );
}
