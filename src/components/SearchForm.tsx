import { Search } from "lucide-react";
import { CATEGORIES, PROVINCES, SLEEPS_OPTIONS } from "@/lib/format";

const field =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none";

export function SearchForm({
  defaults = {},
  compact = false,
}: {
  defaults?: { q?: string; category?: string; province?: string; sleeps?: string; maxPrice?: string; month?: string };
  compact?: boolean;
}) {
  return (
    <form
      action="/search"
      className={`grid gap-3 ${compact ? "sm:grid-cols-6" : "sm:grid-cols-2 lg:grid-cols-6"}`}
    >
      <div className="sm:col-span-2">
        <label htmlFor="q" className="block text-xs font-semibold text-slate-600 mb-1">Resort or town</label>
        <input
          id="q" name="q" defaultValue={defaults.q}
          placeholder="e.g. Cabana Beach, Umhlanga"
          className={field}
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-xs font-semibold text-slate-600 mb-1">Holiday type</label>
        <select id="category" name="category" defaultValue={defaults.category ?? ""} className={field}>
          <option value="">Any</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="province" className="block text-xs font-semibold text-slate-600 mb-1">Province</label>
        <select id="province" name="province" defaultValue={defaults.province ?? ""} className={field}>
          <option value="">Any</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="sleeps" className="block text-xs font-semibold text-slate-600 mb-1">Sleeps</label>
        <select id="sleeps" name="sleeps" defaultValue={defaults.sleeps ?? ""} className={field}>
          <option value="">Any</option>
          {SLEEPS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}+</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="maxPrice" className="block text-xs font-semibold text-slate-600 mb-1">Max price</label>
        <div className="flex gap-2">
          <select id="maxPrice" name="maxPrice" defaultValue={defaults.maxPrice ?? ""} className={field}>
            <option value="">Any</option>
            <option value="8000">R8 000</option>
            <option value="12000">R12 000</option>
            <option value="18000">R18 000</option>
            <option value="25000">R25 000</option>
            <option value="40000">R40 000</option>
          </select>
          <button
            type="submit"
            aria-label="Search weeks"
            className="shrink-0 rounded-xl bg-sand-500 hover:bg-sand-600 px-4 text-white transition-colors cursor-pointer"
          >
            <Search className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </form>
  );
}
