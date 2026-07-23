import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Card({
  children,
  className,
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("card-shadow rounded-2xl border border-white/80 bg-white p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-display text-base font-semibold text-navy-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="card-shadow rounded-2xl border border-white/80 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className={cn("mt-2 font-display text-3xl font-bold text-navy-950", accent)}>{value}</p>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
}) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-800",
    danger: "bg-rose-50 text-rose-700",
    brand: "bg-brand-50 text-brand-700",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary:
      "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-600/25 disabled:bg-brand-300",
    secondary: "bg-white text-navy-900 border border-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-navy-800">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";

export function EmptyHint({ children }: { children: ReactNode }) {
  return <p className="text-sm text-slate-500">{children}</p>;
}

export function SectionList({ items, bullet = "•" }: { items: string[]; bullet?: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-sm text-slate-700">
          <span className="mt-0.5 text-brand-500">{bullet}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Meter({
  value,
  label,
  color = "bg-brand-500",
}: {
  value: number;
  label: string;
  color?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-medium text-slate-600">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={cn("h-full rounded-full animate-meter", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function LoadingAI({ label = "Generating intelligence…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <p className="animate-pulse-soft font-display text-sm font-semibold text-brand-700">{label}</p>
      <p className="text-xs text-slate-500">Analyzing context · scoring risks · drafting recommendations</p>
    </div>
  );
}
