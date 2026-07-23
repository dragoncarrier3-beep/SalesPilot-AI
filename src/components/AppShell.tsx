"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  FileAudio2,
  Radio,
  Users,
  Shield,
  LogOut,
  Menu,
  X,
  Mail,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prepare", label: "Prospect Prep", icon: Sparkles },
  { href: "/transcripts", label: "Transcript Analysis", icon: FileAudio2 },
  { href: "/coaching", label: "Live Coaching", icon: Radio },
  { href: "/crm", label: "CRM History", icon: Users },
  { href: "/follow-ups", label: "Follow-ups", icon: Mail },
  { href: "/admin", label: "Admin", icon: Shield, managerOnly: true },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, ready } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isPublic = pathname === "/login" || pathname === "/";

  useEffect(() => {
    if (!ready) return;
    if (!user && !isPublic) router.replace("/login");
    if (user && isPublic) router.replace("/dashboard");
  }, [ready, user, isPublic, router]);

  if (!ready) {
    return (
      <div className="gradient-mesh flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-navy-800">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <span className="font-display text-lg font-semibold">Loading SalesPilot AI…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  if (isPublic) {
    return (
      <div className="gradient-mesh flex min-h-screen items-center justify-center">
        <div className="text-sm text-slate-600">Opening dashboard…</div>
      </div>
    );
  }

  const items = NAV.filter((n) => !n.managerOnly || user.role === "manager");

  return (
    <div className="gradient-mesh min-h-screen lg:flex">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 transform bg-navy-950 text-white transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-6">
            <div>
              <div className="font-display text-xl font-bold tracking-tight">
                SalesPilot <span className="text-brand-400">AI</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Sales Copilot Platform</p>
            </div>
            <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-900/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {active && <ChevronRight className="ml-auto h-4 w-4 opacity-70" />}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-300">
                {user.avatar}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{user.name}</div>
                <div className="truncate text-xs text-slate-400">{user.title}</div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/70 bg-white/70 px-4 py-3 backdrop-blur-xl sm:px-6">
          <button
            className="rounded-lg border border-slate-200 bg-white p-2 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Workspace</p>
            <p className="font-display text-sm font-semibold text-navy-900">Enterprise Demo Environment</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:inline">
              AI Online
            </span>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
              {user.role === "manager" ? "Manager" : "Sales Rep"}
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
