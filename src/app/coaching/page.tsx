"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader, Card, Button, Badge, Meter } from "@/components/ui";
import { simulateLiveCoaching } from "@/lib/ai-engine";
import { DEMO_TRANSCRIPT } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

export default function CoachingPage() {
  const lines = useMemo(
    () =>
      DEMO_TRANSCRIPT.split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    []
  );
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const frameStep = Math.min(3, Math.floor(index / Math.max(1, Math.ceil(lines.length / 4))));
  const frame = simulateLiveCoaching(playing || index > 0 ? frameStep : 0);

  useEffect(() => {
    if (!playing) return;
    if (index >= lines.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setIndex((i) => i + 1), 1100);
    return () => clearTimeout(t);
  }, [playing, index, lines.length]);

  function reset() {
    setPlaying(false);
    setIndex(0);
  }

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Live Coaching Panel"
        subtitle="Prototype coaching overlay that updates as a call transcript simulation progresses."
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (index >= lines.length - 1) setIndex(0);
                setPlaying(true);
              }}
              disabled={playing}
            >
              {playing ? "Simulating…" : "Start simulation"}
            </Button>
            <Button variant="secondary" onClick={reset}>
              Reset
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3" title="Call simulation">
          <div className="max-h-[520px] space-y-2 overflow-y-auto rounded-xl bg-slate-soft/70 p-4 scrollbar-thin">
            {lines.slice(0, index + 1).map((line, i) => {
              const isRep = line.startsWith("Sales Rep");
              const isLabel = line === "Sales Rep:" || line === "Customer:";
              if (isLabel) {
                return (
                  <p key={`${line}-${i}`} className="pt-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    {line.replace(":", "")}
                  </p>
                );
              }
              return (
                <div
                  key={`${line}-${i}`}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm leading-relaxed",
                    isRep || lines[i - 1] === "Sales Rep:"
                      ? "ml-0 mr-8 bg-brand-50 text-navy-900"
                      : "ml-8 mr-0 bg-white text-slate-700 shadow-sm"
                  )}
                >
                  {line}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4 xl:col-span-2">
          <Card title="Live Confidence Meter">
            <Meter value={frame.confidence} label="Live confidence" color="bg-brand-500" />
            <div className="mt-4 grid gap-3">
              <Meter value={frame.sentiment} label="Conversation Sentiment" color="bg-emerald-500" />
              <Meter value={frame.talkRep} label="Talk Ratio (Rep)" color="bg-sky-500" />
              <Meter value={frame.questionQuality} label="Question Quality" color="bg-violet-500" />
            </div>
          </Card>

          <Card title="Alerts">
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Objection Alert</p>
                {frame.objection ? (
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone="warning">Active</Badge>
                    <p className="text-sm text-navy-900">{frame.objection}</p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-slate-500">No active objection spike</p>
                )}
              </div>
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Buying Signal Alert</p>
                {frame.buying ? (
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone="success">Detected</Badge>
                    <p className="text-sm text-navy-900">{frame.buying}</p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-slate-500">Listening for intent signals…</p>
                )}
              </div>
            </div>
          </Card>

          <Card title="Suggested Response">
            <p className="text-sm leading-relaxed text-slate-700">{frame.suggested}</p>
          </Card>

          <Card title="Coaching Tips">
            <p className="text-sm leading-relaxed text-slate-700">{frame.tip}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
