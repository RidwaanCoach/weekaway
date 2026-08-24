import { prisma } from "@/lib/db";
import { ResortCard } from "@/components/ResortCard";
import { CATEGORIES, categoryLabel } from "@/lib/format";
import Link from "next/link";

export const metadata = { title: "All resorts" };

export default async function ResortsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const resorts = await prisma.resort.findMany({
    where: category ? { category } : {},
    include: { listings: { where: { status: "LIVE" }, select: { priceZar: true } } },
    orderBy: [{ province: "asc" }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-slate-900">Resorts on WeekAway</h1>
      <p className="mt-2 text-slate-600 max-w-2xl">
        Every resort our verified agents currently trade. Pick a resort to see its available weeks
        and compare prices across agents.
      </p>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Filter by category">
        <Link
          href="/resorts"
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${!category ? "bg-brand-600 text-white" : "bg-white border border-slate-300 text-slate-600 hover:border-brand-400"}`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={`/resorts?category=${c.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${category === c.value ? "bg-brand-600 text-white" : "bg-white border border-slate-300 text-slate-600 hover:border-brand-400"}`}
          >
            {categoryLabel(c.value)}
          </Link>
        ))}
      </nav>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {resorts.map((r) => (
          <ResortCard
            key={r.id}
            resort={r}
            liveCount={r.listings.length}
            fromPrice={r.listings.length ? Math.min(...r.listings.map((l) => l.priceZar)) : null}
          />
        ))}
      </div>
    </div>
  );
}
