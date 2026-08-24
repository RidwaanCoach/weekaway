import { notFound } from "next/navigation";
import { MapPin, Check } from "lucide-react";
import { prisma } from "@/lib/db";
import { ResortImage } from "@/components/ResortImage";
import { Badge } from "@/components/Badge";
import { ListingCard, type ListingWithJoins } from "@/components/ListingCard";
import { amenityList, categoryLabel, formatZar } from "@/lib/format";

export default async function ResortPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resort = await prisma.resort.findUnique({
    where: { slug },
    include: {
      listings: {
        where: { status: "LIVE" },
        include: { resort: true, agent: true },
        orderBy: [{ checkIn: "asc" }, { priceZar: "asc" }],
      },
    },
  });
  if (!resort) notFound();

  // Group listings that share a check-in week so price comparison is obvious
  const byWeek = new Map<string, typeof resort.listings>();
  for (const l of resort.listings) {
    const key = l.checkIn.toISOString();
    byWeek.set(key, [...(byWeek.get(key) ?? []), l]);
  }
  const comparableWeeks = [...byWeek.values()].filter((g) => g.length > 1);

  return (
    <div>
      <div className="relative">
        <ResortImage slug={resort.slug} category={resort.category} className="h-56 sm:h-72 w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <div className="absolute bottom-0 inset-x-0">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-6 text-white">
            <Badge value={resort.category} label={categoryLabel(resort.category)} />
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">{resort.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-200">
              <MapPin className="h-4 w-4" aria-hidden />
              {resort.town}, {resort.province}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl font-semibold text-slate-900">About this resort</h2>
          <p className="mt-3 text-slate-600 leading-relaxed max-w-2xl">{resort.description}</p>

          <h2 className="mt-12 font-display text-2xl font-semibold text-slate-900">
            Available weeks ({resort.listings.length})
          </h2>
          {resort.listings.length === 0 ? (
            <p className="mt-3 text-slate-500">
              No live weeks right now. Agents load new inventory daily - check back soon.
            </p>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {resort.listings.map((l) => (
                <ListingCard key={l.id} listing={l as unknown as ListingWithJoins} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Amenities</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {amenityList(resort.amenities).map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-600 shrink-0" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {comparableWeeks.length > 0 && (
            <div className="rounded-2xl bg-sand-50 border border-sand-200 p-5">
              <h3 className="font-semibold text-slate-900">Same week, different prices</h3>
              <p className="mt-1 text-xs text-slate-500">
                Multiple agents are selling the same week here. Compare before you enquire.
              </p>
              <ul className="mt-3 space-y-3">
                {comparableWeeks.slice(0, 3).map((group) => (
                  <li key={group[0].id} className="text-sm">
                    <p className="font-medium text-slate-800">
                      Week of{" "}
                      {group[0].checkIn.toLocaleDateString("en-ZA", { day: "numeric", month: "short", timeZone: "UTC" })}{" "}
                      - {group[0].unitType}
                    </p>
                    <p className="text-slate-600 tabular-nums">
                      {group.map((g) => formatZar(g.priceZar)).join("  vs  ")}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
