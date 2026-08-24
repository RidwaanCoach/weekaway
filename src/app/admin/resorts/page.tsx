import { AlertCircle, CheckCircle2, Star } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { Badge } from "@/components/Badge";
import { CATEGORIES, PROVINCES, categoryLabel } from "@/lib/format";
import { createResort, toggleFeatured } from "../admin-actions";

export const metadata = { title: "Resorts" };

const input =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none";

export default async function AdminResortsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string }>;
}) {
  await requireRole("ADMIN");
  const { error, created } = await searchParams;
  const resorts = await prisma.resort.findMany({
    include: { _count: { select: { listings: true } } },
    orderBy: [{ province: "asc" }, { name: "asc" }],
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Resorts</h1>
      <p className="mt-1 text-sm text-slate-500">
        The resort database agents list against. Keeping this curated is what makes search results clean.
      </p>

      {created && (
        <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4" aria-hidden /> Resort added.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" aria-hidden />
          {error === "exists" ? "A resort with that name already exists." : "Please complete all required fields."}
        </p>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm self-start">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-semibold">Resort</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Listings</th>
                <th className="px-4 py-3 font-semibold text-right">Featured</th>
              </tr>
            </thead>
            <tbody>
              {resorts.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.town}, {r.province}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge value={r.category} label={categoryLabel(r.category)} />
                  </td>
                  <td className="px-4 py-3 text-slate-600 tabular-nums">{r._count.listings}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={toggleFeatured} className="inline">
                      <input type="hidden" name="id" value={r.id} />
                      <button
                        aria-label={`${r.featured ? "Unfeature" : "Feature"} ${r.name}`}
                        className="cursor-pointer rounded-lg p-1.5 hover:bg-slate-100"
                      >
                        <Star
                          className={`h-4 w-4 ${r.featured ? "fill-sand-400 text-sand-400" : "text-slate-300"}`}
                          aria-hidden
                        />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form action={createResort} className="space-y-4 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm self-start">
          <h2 className="font-semibold text-slate-900">Add a resort</h2>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name <span className="text-red-500">*</span></label>
            <input id="name" name="name" required className={input} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="town" className="block text-sm font-medium text-slate-700">Town <span className="text-red-500">*</span></label>
              <input id="town" name="town" required className={input} />
            </div>
            <div>
              <label htmlFor="province" className="block text-sm font-medium text-slate-700">Province <span className="text-red-500">*</span></label>
              <select id="province" name="province" required className={input}>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category <span className="text-red-500">*</span></label>
            <select id="category" name="category" required className={input}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description <span className="text-red-500">*</span></label>
            <textarea id="description" name="description" rows={3} required className={input} />
          </div>
          <div>
            <label htmlFor="amenities" className="block text-sm font-medium text-slate-700">Amenities</label>
            <input id="amenities" name="amenities" placeholder="Comma separated, e.g. Pool,Restaurant,Beach access" className={input} />
          </div>
          <button className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition-colors cursor-pointer">
            Add resort
          </button>
        </form>
      </div>
    </div>
  );
}
