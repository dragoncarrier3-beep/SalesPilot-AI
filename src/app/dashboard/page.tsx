"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, Calendar, TrendingUp } from "lucide-react";
import { PageHeader, Card, StatCard, Badge, Button } from "@/components/ui";
import { useApp } from "@/lib/store";
import { AI_INSIGHTS, TODAY_MEETINGS } from "@/lib/sample-data";
import { formatCurrency, formatDate, formatPercent, winColor } from "@/lib/utils";

const trend = [
  { day: "Mon", win: 54 },
  { day: "Tue", win: 57 },
  { day: "Wed", win: 55 },
  { day: "Thu", win: 61 },
  { day: "Fri", win: 63 },
  { day: "Sat", win: 62 },
  { day: "Sun", win: 66 },
];

export default function DashboardPage() {
  const { companies, analyses, reports, user } = useApp();
  const avgWin = Math.round(
    companies.reduce((s, c) => s + c.winProbability, 0) / Math.max(companies.length, 1)
  );
  const pipeline = companies.reduce((s, c) => s + c.dealSize, 0);
  const upcoming = [...companies]
    .sort((a, b) => a.nextFollowUp.localeCompare(b.nextFollowUp))
    .slice(0, 5);
  const recentProspects = companies.slice(0, 6);
  const recentAnalyses = analyses.slice(0, 5);

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0]}`}
        subtitle="Your AI sales workspace for today’s meetings, pipeline risk, and coaching insights."
        actions={
          <div className="flex gap-2">
            <Link href="/prepare">
              <Button>Prepare prospect</Button>
            </Link>
            <Link href="/transcripts">
              <Button variant="secondary">Analyze transcript</Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today's Meetings" value={String(TODAY_MEETINGS.length)} hint="Across discovery & late-stage" />
        <StatCard label="Recent Analyses" value={String(analyses.length)} hint="+3 generated this week" />
        <StatCard label="Win Probability" value={formatPercent(avgWin)} hint="Team average across open deals" accent={winColor(avgWin)} />
        <StatCard label="Pipeline Summary" value={formatCurrency(pipeline)} hint={`${companies.length} active prospects`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Today's Meetings" className="xl:col-span-2">
          <div className="space-y-3">
            {TODAY_MEETINGS.map((m) => (
              <div
                key={m.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-soft/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="font-semibold text-navy-900">{m.company}</div>
                  <div className="text-sm text-slate-500">
                    {m.contact} · {m.type}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="brand">{m.stage}</Badge>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-600">
                    <Calendar className="h-3.5 w-3.5" />
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="AI Insights">
          <div className="space-y-3">
            {AI_INSIGHTS.map((insight) => (
              <div key={insight.title} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-navy-900">{insight.title}</p>
                  <Badge tone={insight.tone === "positive" ? "success" : "warning"}>
                    {insight.tone === "positive" ? "Positive" : "Watch"}
                  </Badge>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{insight.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card
          title="Win Probability Trend"
          className="xl:col-span-2"
          action={
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" /> +12 pts
            </span>
          }
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="winFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <YAxis hide domain={[40, 80]} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                  formatter={(v) => [`${v}%`, "Win prob"]}
                />
                <Area type="monotone" dataKey="win" stroke="#4f46e5" fill="url(#winFill)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Upcoming Follow-Ups">
          <div className="space-y-3">
            {upcoming.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-navy-900">{c.name}</p>
                  <p className="text-xs text-slate-500">{formatDate(c.nextFollowUp)}</p>
                </div>
                <span className={`text-sm font-semibold ${winColor(c.winProbability)}`}>
                  {c.winProbability}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card
          title="Recent Prospects"
          action={
            <Link href="/crm" className="text-xs font-semibold text-brand-600 hover:text-brand-500">
              View CRM
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="pb-2 font-medium">Company</th>
                  <th className="pb-2 font-medium">Stage</th>
                  <th className="pb-2 font-medium">Deal</th>
                  <th className="pb-2 font-medium">Win %</th>
                </tr>
              </thead>
              <tbody>
                {recentProspects.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100">
                    <td className="py-3 font-medium text-navy-900">{c.name}</td>
                    <td className="py-3"><Badge>{c.stage}</Badge></td>
                    <td className="py-3 text-slate-600">{formatCurrency(c.dealSize)}</td>
                    <td className={`py-3 font-semibold ${winColor(c.winProbability)}`}>{c.winProbability}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Recent Analyses"
          action={
            <Link href="/transcripts" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
              Open <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="space-y-3">
            {recentAnalyses.map((a) => (
              <div key={a.id} className="rounded-xl border border-slate-100 px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-navy-900">{a.company}</p>
                  <Badge tone="brand">{a.confidenceScore}% conf.</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {a.contact} · {formatDate(a.date)} · {a.objections.slice(0, 2).join(", ")}
                </p>
              </div>
            ))}
            <p className="text-xs text-slate-500">{reports.length} prospect reports available in CRM history.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
