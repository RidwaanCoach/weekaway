import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { Badge } from "@/components/Badge";
import { formatDate, formatZar } from "@/lib/format";
import { moderateListing } from "../admin-actions";

export const metadata = { title: "Listings" };

export default async function AdminListingsPage() {
  await requireRole("ADMIN");
  const listings = await prisma.listing.findMany({
    include: { resort: true, agent: true, _count: { select: { enquiries: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Listings</h1>
      <p className="mt-1 text-sm text-slate-500">Latest 100. Remove anything that breaks marketplace rules.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-semibold">Resort / week</th>
              <th className="px-4 py-3 font-semibold">Agent</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Enq.</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Moderate</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/listings/${l.id}`} className="font-medium text-slate-900 hover:text-brand-700">
                    {l.resort.name}
                  </Link>
                  <p className="text-xs text-slate-500">{l.unitType} - {formatDate(l.checkIn)}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{l.agent.agencyName ?? l.agent.name}</td>
                <td className="px-4 py-3 font-semibold text-slate-900 tabular-nums">{formatZar(l.priceZar)}</td>
                <td className="px-4 py-3 text-slate-600 tabular-nums">{l._count.enquiries}</td>
                <td className="px-4 py-3"><Badge value={l.status} /></td>
                <td className="px-4 py-3 text-right">
                  {l.status === "LIVE" ? (
                    <form action={moderateListing} className="inline">
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="status" value="REMOVED" />
                      <button className="rounded-lg border border-red-300 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer">
                        Remove
                      </button>
                    </form>
                  ) : l.status === "REMOVED" ? (
                    <form action={moderateListing} className="inline">
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="status" value="LIVE" />
                      <button className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-400 cursor-pointer">
                        Restore
                      </button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
