import Link from "next/link";
import { ShieldCheck, Scale, CalendarCheck, ArrowRight, Umbrella, TreePine, Mountain } from "lucide-react";
import { prisma } from "@/lib/db";
import { SearchForm } from "@/components/SearchForm";
import { ResortCard } from "@/components/ResortCard";
import { ListingCard, type ListingWithJoins } from "@/components/ListingCard";
import { formatZar } from "@/lib/format";

export default async function HomePage() {
  const [featured, latest, liveCount, resortCount, agentCount] = await Promise.all([
    prisma.resort.findMany({
      where: { featured: true },
      include: { listings: { where: { status: "LIVE" }, select: { priceZar: true } } },
      take: 8,
    }),
    prisma.listing.findMany({
      where: { status: "LIVE" },
      include: { resort: true, agent: true },
      orderBy: { checkIn: "asc" },
      take: 6,
    }),
    prisma.listing.count({ where: { status: "LIVE" } }),
    prisma.resort.count(),
    prisma.user.count({ where: { role: "AGENT", agentStatus: "APPROVED" } }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-800 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(60rem 30rem at 80% -10%, #4cb3a9 0%, transparent 60%), radial-gradient(40rem 20rem at 10% 110%, #d98b2b 0%, transparent 55%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-200">
            Beach. Bush. Berg. One search.
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight max-w-3xl">
            Every resort week in South Africa, in one place.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-100">
            Stop hunting through WhatsApp groups. Search weeks at Cabana Beach, Kruger Park Lodge,
            the Drakensberg and {resortCount - 3}+ more resorts - listed by verified agents at transparent prices.
          </p>

          <div className="mt-8 rounded-2xl bg-white p-4 sm:p-5 shadow-xl">
            <SearchForm />
          </div>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
            <div><dt className="inline text-brand-200">Weeks live now </dt><dd className="inline font-bold">{liveCount}</dd></div>
            <div><dt className="inline text-brand-200">Resorts covered </dt><dd className="inline font-bold">{resortCount}</dd></div>
            <div><dt className="inline text-brand-200">Verified agents </dt><dd className="inline font-bold">{agentCount}</dd></div>
          </dl>
        </div>
      </section>

      {/* Category tiles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { href: "/search?category=BEACH", icon: Umbrella, label: "Beach", copy: "Umhlanga, the South Coast, Langebaan and the Garden Route." },
            { href: "/search?category=BUSH", icon: TreePine, label: "Bush & Safari", copy: "Kruger, Pilanesberg, Dikhololo and the Waterberg." },
            { href: "/search?category=MOUNTAIN", icon: Mountain, label: "Mountains & Country", copy: "The Drakensberg, Magaliesberg and Cape winelands." },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand-300 hover:shadow-md transition-all"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <c.icon className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="font-display text-lg font-semibold text-slate-900 group-hover:text-brand-700 flex items-center gap-1">
                  {c.label}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                </span>
                <span className="mt-1 block text-sm text-slate-500">{c.copy}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured resorts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">Popular resorts</h2>
            <p className="mt-1 text-slate-500">The ones South Africans book year after year.</p>
          </div>
          <Link href="/resorts" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
            All resorts <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((r) => (
            <ResortCard
              key={r.id}
              resort={r}
              liveCount={r.listings.length}
              fromPrice={r.listings.length ? Math.min(...r.listings.map((l) => l.priceZar)) : null}
            />
          ))}
        </div>
      </section>

      {/* Next available weeks */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">Weeks checking in soon</h2>
            {latest.length > 0 && (
              <p className="mt-1 text-slate-500">
                Late availability from {formatZar(Math.min(...latest.map((l) => l.priceZar)))} for the full week.
              </p>
            )}
          </div>
          <Link href="/search" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
            Search all weeks <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((l) => (
            <ListingCard key={l.id} listing={l as unknown as ListingWithJoins} />
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="rounded-3xl bg-brand-50 border border-brand-100 p-8 sm:p-10">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-slate-900">Why book through WeekAway?</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div>
              <ShieldCheck className="h-7 w-7 text-brand-700" aria-hidden />
              <h3 className="mt-3 font-semibold text-slate-900">Verified sellers only</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Every agent is vetted before their first listing goes live. No anonymous WhatsApp numbers, no guessing who is legitimate.
              </p>
            </div>
            <div>
              <Scale className="h-7 w-7 text-brand-700" aria-hidden />
              <h3 className="mt-3 font-semibold text-slate-900">Transparent prices</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                When more than one agent has the same resort and week, you see every price side by side and pick the best deal.
              </p>
            </div>
            <div>
              <CalendarCheck className="h-7 w-7 text-brand-700" aria-hidden />
              <h3 className="mt-3 font-semibold text-slate-900">Real availability</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Live listings with actual check-in dates, unit sizes and sleeps - not a message thread you have to scroll through.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agent CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-16">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="flex-1">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">Are you a timeshare agent?</h2>
            <p className="mt-3 text-slate-300 max-w-xl leading-relaxed">
              Stop reposting the same weeks into twenty WhatsApp groups. List once on WeekAway and reach
              buyers who are already searching for your resorts. Free while we grow.
            </p>
          </div>
          <Link
            href="/register?type=agent"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sand-500 hover:bg-sand-600 px-6 py-3.5 font-semibold text-white transition-colors"
          >
            Apply to sell <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
