import { SearchX } from "lucide-react";
import { prisma } from "@/lib/db";
import { SearchForm } from "@/components/SearchForm";
import { ListingCard, type ListingWithJoins } from "@/components/ListingCard";

export const metadata = { title: "Find a week" };

type Params = {
  q?: string;
  category?: string;
  province?: string;
  sleeps?: string;
  maxPrice?: string;
  sort?: string;
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const { q, category, province, sleeps, maxPrice, sort } = params;

  const listings = await prisma.listing.findMany({
    where: {
      status: "LIVE",
      ...(sleeps ? { sleeps: { gte: parseInt(sleeps) } } : {}),
      ...(maxPrice ? { priceZar: { lte: parseInt(maxPrice) } } : {}),
      resort: {
        ...(category ? { category } : {}),
        ...(province ? { province } : {}),
        ...(q
          ? { OR: [{ name: { contains: q } }, { town: { contains: q } }] }
          : {}),
      },
    },
    include: { resort: true, agent: true },
    orderBy: sort === "price" ? { priceZar: "asc" } : { checkIn: "asc" },
  });

  const sortLink = (s: string) => {
    const sp = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    sp.set("sort", s);
    return `/search?${sp.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-slate-900">Find your week</h1>
      <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm">
        <SearchForm defaults={params} compact />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-sm text-slate-600" aria-live="polite">
          <strong>{listings.length}</strong> week{listings.length === 1 ? "" : "s"} available
        </p>
        <nav className="flex gap-1 text-sm" aria-label="Sort results">
          <a
            href={sortLink("date")}
            className={`rounded-lg px-3 py-1.5 font-medium ${sort !== "price" ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Soonest first
          </a>
          <a
            href={sortLink("price")}
            className={`rounded-lg px-3 py-1.5 font-medium ${sort === "price" ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Cheapest first
          </a>
        </nav>
      </div>

      {listings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <SearchX className="mx-auto h-10 w-10 text-slate-300" aria-hidden />
          <h2 className="mt-4 font-semibold text-slate-900">No weeks match that search</h2>
          <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
            Try widening your filters - drop the province or price cap, or search a nearby town.
            New weeks are listed daily as agents load inventory.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l as unknown as ListingWithJoins} />
          ))}
        </div>
      )}
    </div>
  );
}
