"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, Card, StatCard } from "@/components/ui";
import { useApp } from "@/lib/store";
import { ADMIN_STATS, DISCOVERY_SESSIONS } from "@/lib/sample-data";
import { formatPercent } from "@/lib/utils";

export default function AdminPage() {
  const { user, analyses, reports, companies } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "manager") router.replace("/dashboard");
  }, [user, router]);

  if (!user || user.role !== "manager") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Manager access required…
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Team-level usage, objection trends, industry mix, and AI quality metrics."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={String(ADMIN_STATS.users)} hint="Active seats in demo org" />
        <StatCard
          label="Analyses Generated"
          value={String(Math.max(ADMIN_STATS.analysesGenerated, analyses.length + reports.length))}
          hint="Prospect + transcript analyses"
        />
        <StatCard
          label="Transcripts Uploaded"
          value={String(Math.max(ADMIN_STATS.transcriptsUploaded, analyses.length))}
          hint="Including historical sample set"
        />
        <StatCard
          label="Average AI Score"
          value={String(ADMIN_STATS.averageAiScore)}
          hint={`Avg win probability ${formatPercent(ADMIN_STATS.averageWinProbability)}`}
          accent="text-brand-600"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Top Industries">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_STATS.topIndustries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Common Objections">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_STATS.commonObjections} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                <Bar dataKey="value" fill="#818cf8" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card title="Average Win Probability">
          <p className="font-display text-5xl font-bold text-emerald-600">
            {formatPercent(
              Math.round(
                companies.reduce((s, c) => s + c.winProbability, 0) / Math.max(companies.length, 1)
              )
            )}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Across {companies.length} active companies in the CRM sample + live updates.
          </p>
        </Card>

        <Card title="Discovery Sessions" className="xl:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="pb-2 font-medium">Company</th>
                  <th className="pb-2 font-medium">Contact</th>
                  <th className="pb-2 font-medium">Questions</th>
                  <th className="pb-2 font-medium">Coverage</th>
                  <th className="pb-2 font-medium">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {DISCOVERY_SESSIONS.slice(0, 8).map((d) => (
                  <tr key={d.id} className="border-t border-slate-100">
                    <td className="py-2.5 font-medium text-navy-900">{d.company}</td>
                    <td className="py-2.5 text-slate-600">{d.contact}</td>
                    <td className="py-2.5">{d.questionsAsked}</td>
                    <td className="py-2.5">{d.coverage}%</td>
                    <td className="py-2.5 text-slate-600">{d.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
