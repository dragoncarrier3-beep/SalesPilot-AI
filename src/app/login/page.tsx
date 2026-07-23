"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, BarChart3, Mic2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { Button, Field, inputClass } from "@/components/ui";

export default function LoginPage() {
  const { login, user, ready } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("alex@salespilot.ai");
  const [password, setPassword] = useState("Demo123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (ready && user) {
    router.replace("/dashboard");
    return null;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 450));
    const result = login(email, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || "Login failed");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="gradient-mesh relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-sky-300/20 blur-3xl" />

      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <div className="animate-fade-up space-y-8">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
              SalesPilot AI
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-navy-950 sm:text-5xl">
              Win more deals with an AI sales copilot.
            </h1>
            <p className="mt-4 max-w-lg text-base text-slate-600 sm:text-lg">
              Prepare for meetings, analyze call transcripts, detect objections and buying signals,
              and get next-best actions — built for modern revenue teams.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Sparkles, title: "Prospect intelligence", desc: "Objections, discovery, positioning" },
              { icon: Mic2, title: "Transcript analysis", desc: "Signals, risks, follow-ups" },
              { icon: BarChart3, title: "Pipeline coaching", desc: "Win probability & CRM history" },
              { icon: ShieldCheck, title: "Manager visibility", desc: "Team insights & admin metrics" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
                <f.icon className="mb-2 h-5 w-5 text-brand-600" />
                <div className="text-sm font-semibold text-navy-900">{f.title}</div>
                <div className="text-xs text-slate-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up">
          <form
            onSubmit={onSubmit}
            className="card-shadow rounded-3xl border border-white/80 bg-white/90 p-6 backdrop-blur sm:p-8"
          >
            <h2 className="font-display text-2xl font-bold text-navy-950">Sign in to demo</h2>
            <p className="mt-1 text-sm text-slate-500">Use the investor/enterprise demo accounts below.</p>

            <div className="mt-6 space-y-4">
              <Field label="Email">
                <input
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="username"
                  required
                />
              </Field>
              <Field label="Password">
                <input
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in…" : "Enter SalesPilot AI"}
              </Button>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-slate-soft p-4 text-sm">
              <p className="font-semibold text-navy-900">Demo credentials</p>
              <div className="space-y-2 text-slate-600">
                <button
                  type="button"
                  className="block w-full rounded-xl bg-white px-3 py-2 text-left transition hover:ring-2 hover:ring-brand-200"
                  onClick={() => {
                    setEmail("alex@salespilot.ai");
                    setPassword("Demo123!");
                  }}
                >
                  <span className="font-medium text-navy-900">Sales Rep</span>
                  <br />
                  alex@salespilot.ai · Demo123!
                </button>
                <button
                  type="button"
                  className="block w-full rounded-xl bg-white px-3 py-2 text-left transition hover:ring-2 hover:ring-brand-200"
                  onClick={() => {
                    setEmail("manager@salespilot.ai");
                    setPassword("Demo123!");
                  }}
                >
                  <span className="font-medium text-navy-900">Sales Manager</span>
                  <br />
                  manager@salespilot.ai · Demo123!
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
