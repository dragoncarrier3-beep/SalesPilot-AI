export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(typeof value === "string" ? new Date(value) : value);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function riskLabel(score: number) {
  if (score >= 70) return { label: "High", color: "text-rose-600 bg-rose-50" };
  if (score >= 40) return { label: "Medium", color: "text-amber-700 bg-amber-50" };
  return { label: "Low", color: "text-emerald-700 bg-emerald-50" };
}

export function winColor(score: number) {
  if (score >= 70) return "text-emerald-600";
  if (score >= 45) return "text-amber-600";
  return "text-rose-600";
}
