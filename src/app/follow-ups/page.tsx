"use client";

import { useMemo, useState } from "react";
import { PageHeader, Card, Badge, Button } from "@/components/ui";
import { useApp } from "@/lib/store";
import { formatDate } from "@/lib/utils";

const TABS = ["all", "email", "linkedin", "crm", "recap"] as const;

export default function FollowUpsPage() {
  const { followUps } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [selectedId, setSelectedId] = useState(followUps[0]?.id || "");

  const filtered = useMemo(
    () => followUps.filter((f) => tab === "all" || f.type === tab),
    [followUps, tab]
  );

  const selected = followUps.find((f) => f.id === selectedId) || filtered[0];

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Follow-up Generator"
        subtitle="Saved emails, LinkedIn messages, CRM notes, and meeting recaps generated from analyses."
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button
            key={t}
            variant={tab === t ? "primary" : "secondary"}
            onClick={() => setTab(t)}
            className="capitalize"
          >
            {t === "all" ? "All" : t}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2" title={`${filtered.length} assets`}>
          <div className="max-h-[620px] space-y-2 overflow-y-auto scrollbar-thin">
            {filtered.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedId(f.id)}
                className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                  selected?.id === f.id
                    ? "border-brand-300 bg-brand-50"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-navy-900">{f.company}</p>
                  <Badge tone="brand" >{f.type}</Badge>
                </div>
                <p className="mt-1 truncate text-xs text-slate-500">{f.subject}</p>
                <p className="mt-1 text-[11px] text-slate-400">{formatDate(f.createdAt)}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3" title="Preview">
          {!selected ? (
            <p className="text-sm text-slate-500">No follow-up selected.</p>
          ) : (
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold text-navy-950">{selected.subject}</h2>
                <Badge>{selected.type}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {selected.company} · {formatDate(selected.createdAt)}
              </p>
              <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-slate-soft p-5 text-sm leading-relaxed text-slate-700">
                {selected.body}
              </pre>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigator.clipboard?.writeText(selected.body)}
                >
                  Copy content
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
