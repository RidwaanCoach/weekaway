const styles: Record<string, string> = {
  BEACH: "bg-sky-100 text-sky-800",
  BUSH: "bg-lime-100 text-lime-800",
  MOUNTAIN: "bg-indigo-100 text-indigo-800",
  LIVE: "bg-emerald-100 text-emerald-800",
  SOLD: "bg-slate-200 text-slate-600",
  EXPIRED: "bg-amber-100 text-amber-800",
  REMOVED: "bg-red-100 text-red-700",
  NEW: "bg-brand-100 text-brand-800",
  REPLIED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-slate-200 text-slate-600",
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  SUSPENDED: "bg-red-100 text-red-700",
  default: "bg-slate-100 text-slate-700",
};

export function Badge({ value, label }: { value: string; label?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[value] ?? styles.default}`}
    >
      {label ?? value.charAt(0) + value.slice(1).toLowerCase()}
    </span>
  );
}
