import Link from "next/link";
import { CheckCircle2, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { Badge } from "@/components/Badge";
import { formatDate, formatZar } from "@/lib/format";
import { setListingStatus } from "../agent-actions";

export const metadata = { title: "My listings" };

export default async function AgentListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string }>;
}) {
  const session = await requireRole("AGENT");
  const { created, updated } = await searchParams;

  const listings = await prisma.listing.findMany({
    where: { agentId: session.userId },
    include: { resort: true, _count: { select: { enquiries: true } } },
    orderBy: [{ status: "asc" }, { checkIn: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-slate-900">My listings</h1>
        <Link
          href="/agent/listings/new"
          className="rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors"
        >
          Load a week
        </Link>
      </div>

      {(created || updated) && (
        <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          Listing {created ? "created - it is live and searchable now" : "updated"}.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-semibold">Resort / week</th>
              <th className="px-4 py-3 font-semibold">Unit</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Views</th>
              <th className="px-4 py-3 font-semibold">Enq.</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{l.resort.name}</p>
                  <p className="text-xs text-slate-500">{formatDate(l.checkIn)} - {l.nights} nights</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{l.unitType} - sleeps {l.sleeps}</td>
                <td className="px-4 py-3 font-semibold text-slate-900 tabular-nums">{formatZar(l.priceZar)}</td>
                <td className="px-4 py-3 text-slate-600 tabular-nums">{l.views}</td>
                <td className="px-4 py-3 text-slate-600 tabular-nums">{l._count.enquiries}</td>
                <td className="px-4 py-3"><Badge value={l.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/agent/listings/${l.id}/edit`}
                      aria-label={`Edit ${l.resort.name} listing`}
                      className="rounded-lg border border-slate-300 p-2 text-slate-500 hover:border-brand-400 hover:text-brand-700"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                    {l.status === "LIVE" && (
                      <form action={setListingStatus}>
                        <input type="hidden" name="id" value={l.id} />
                        <input type="hidden" name="status" value="SOLD" />
                        <button className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-400 hover:text-emerald-700 cursor-pointer">
                          Mark sold
                        </button>
                      </form>
                    )}
                    {l.status !== "LIVE" && l.status !== "REMOVED" && (
                      <form action={setListingStatus}>
                        <input type="hidden" name="id" value={l.id} />
                        <input type="hidden" name="status" value="LIVE" />
                        <button className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700 cursor-pointer">
                          Relist
                        </button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {listings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  No listings yet. Load your first week and it will be searchable immediately.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
