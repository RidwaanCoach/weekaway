import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays, Users, BedDouble, MapPin, ShieldCheck, Star, CheckCircle2, Moon,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ResortImage } from "@/components/ResortImage";
import { Badge } from "@/components/Badge";
import { formatZar, formatDate, checkOut, categoryLabel } from "@/lib/format";

const input =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none";

async function sendEnquiry(formData: FormData) {
  "use server";
  const listingId = String(formData.get("listingId"));
  const guestName = String(formData.get("guestName") ?? "").trim();
  const guestEmail = String(formData.get("guestEmail") ?? "").trim();
  const guestPhone = String(formData.get("guestPhone") ?? "").trim() || null;
  const message = String(formData.get("message") ?? "").trim();
  if (!guestName || !guestEmail || !message) {
    redirect(`/listings/${listingId}?error=1#enquire`);
  }
  const session = await getSession();
  await prisma.enquiry.create({
    data: {
      listingId,
      buyerId: session?.role === "BUYER" ? session.userId : null,
      guestName,
      guestEmail,
      guestPhone,
      message,
    },
  });
  redirect(`/listings/${listingId}?sent=1`);
}

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { id } = await params;
  const { sent, error } = await searchParams;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      resort: true,
      agent: { include: { reviews: true } },
    },
  });
  if (!listing) notFound();

  // Count a view (best effort, non-blocking for render correctness)
  prisma.listing.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});

  const sameWeek = await prisma.listing.findMany({
    where: {
      id: { not: listing.id },
      resortId: listing.resortId,
      checkIn: listing.checkIn,
      status: "LIVE",
    },
    include: { agent: true },
    orderBy: { priceZar: "asc" },
  });

  const reviews = listing.agent.reviews;
  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : null;
  const session = await getSession();
  const sold = listing.status !== "LIVE";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/search" className="hover:text-brand-700">Weeks</Link>
        <span className="mx-2">/</span>
        <Link href={`/resorts/${listing.resort.slug}`} className="hover:text-brand-700">{listing.resort.name}</Link>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative rounded-2xl overflow-hidden">
            <ResortImage slug={listing.resort.slug} category={listing.resort.category} className="aspect-[2/1]" />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge value={listing.resort.category} label={categoryLabel(listing.resort.category)} />
              {sold && <Badge value={listing.status} />}
            </div>
          </div>

          <h1 className="mt-6 font-display text-3xl font-semibold text-slate-900">
            {listing.unitType} at {listing.resort.name}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-slate-500">
            <MapPin className="h-4 w-4" aria-hidden />
            {listing.resort.town}, {listing.resort.province}
          </p>

          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: CalendarDays, label: "Check-in", value: formatDate(listing.checkIn) },
              { icon: Moon, label: "Nights", value: `${listing.nights} (out ${formatDate(checkOut(listing.checkIn, listing.nights))})` },
              { icon: BedDouble, label: "Unit", value: listing.unitType },
              { icon: Users, label: "Sleeps", value: `${listing.sleeps} guests` },
            ].map((f) => (
              <div key={f.label} className="rounded-xl bg-white border border-slate-200 p-4">
                <f.icon className="h-5 w-5 text-brand-600" aria-hidden />
                <dt className="mt-2 text-xs text-slate-400">{f.label}</dt>
                <dd className="text-sm font-semibold text-slate-900">{f.value}</dd>
              </div>
            ))}
          </dl>

          {listing.notes && (
            <p className="mt-5 rounded-xl bg-sand-50 border border-sand-200 p-4 text-sm text-slate-700">
              {listing.notes}
            </p>
          )}

          <h2 className="mt-10 font-display text-xl font-semibold text-slate-900">About {listing.resort.name}</h2>
          <p className="mt-2 text-slate-600 leading-relaxed">{listing.resort.description}</p>

          {sameWeek.length > 0 && (
            <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <h2 className="font-semibold text-slate-900">Same resort, same week - other sellers</h2>
              <p className="mt-1 text-sm text-slate-600">
                WeekAway shows every agent selling this week so you can compare before you enquire.
              </p>
              <ul className="mt-4 space-y-2">
                {sameWeek.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/listings/${s.id}`}
                      className="flex items-center justify-between rounded-xl bg-white border border-slate-200 px-4 py-3 hover:border-brand-400 transition-colors"
                    >
                      <span className="text-sm text-slate-700">
                        {s.unitType} - {s.agent.agencyName ?? s.agent.name}
                      </span>
                      <span className="font-bold text-slate-900 tabular-nums">{formatZar(s.priceZar)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <p className="text-sm text-slate-400">Full week price</p>
            <p className="text-3xl font-bold text-slate-900 tabular-nums">{formatZar(listing.priceZar)}</p>
            <p className="mt-1 text-xs text-slate-500">
              {formatZar(Math.round(listing.priceZar / listing.nights))} per night - self-catering
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden />
              <h2 className="font-semibold text-slate-900">Verified agent</h2>
            </div>
            <p className="mt-3 font-medium text-slate-800">{listing.agent.agencyName ?? listing.agent.name}</p>
            <p className="text-sm text-slate-500">{listing.agent.name}</p>
            {avgRating && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
                <Star className="h-4 w-4 fill-sand-400 text-sand-400" aria-hidden />
                <strong>{avgRating}</strong> ({reviews.length} review{reviews.length === 1 ? "" : "s"})
              </p>
            )}
            {listing.agent.bio && <p className="mt-3 text-sm text-slate-600 leading-relaxed">{listing.agent.bio}</p>}
            {reviews.length > 0 && (
              <blockquote className="mt-4 border-l-2 border-brand-200 pl-3 text-sm text-slate-500 italic">
                "{reviews[0].comment}"
                <footer className="mt-1 not-italic text-xs text-slate-400">- {reviews[0].authorName}</footer>
              </blockquote>
            )}
          </div>

          <div id="enquire" className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            {sold ? (
              <div>
                <h2 className="font-semibold text-slate-900">This week has been sold</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Check the resort page for other available weeks, or search similar dates.
                </p>
                <Link
                  href={`/resorts/${listing.resort.slug}`}
                  className="mt-4 inline-block rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                >
                  See other weeks here
                </Link>
              </div>
            ) : sent ? (
              <div role="status">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden />
                <h2 className="mt-3 font-semibold text-slate-900">Enquiry sent!</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {listing.agent.agencyName ?? listing.agent.name} will contact you shortly. Most agents reply within a few hours.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-semibold text-slate-900">Enquire about this week</h2>
                <p className="mt-1 text-xs text-slate-500">Goes straight to the agent. No obligation.</p>
                {error && (
                  <p role="alert" className="mt-3 rounded-lg bg-red-50 border border-red-200 p-2.5 text-xs text-red-700">
                    Please fill in your name, email and a message.
                  </p>
                )}
                <form action={sendEnquiry} className="mt-4 space-y-4">
                  <input type="hidden" name="listingId" value={listing.id} />
                  <div>
                    <label htmlFor="guestName" className="block text-xs font-semibold text-slate-600">Your name <span className="text-red-500">*</span></label>
                    <input id="guestName" name="guestName" required defaultValue={session?.name ?? ""} autoComplete="name" className={input} />
                  </div>
                  <div>
                    <label htmlFor="guestEmail" className="block text-xs font-semibold text-slate-600">Email <span className="text-red-500">*</span></label>
                    <input id="guestEmail" name="guestEmail" type="email" required autoComplete="email" className={input} />
                  </div>
                  <div>
                    <label htmlFor="guestPhone" className="block text-xs font-semibold text-slate-600">Phone / WhatsApp</label>
                    <input id="guestPhone" name="guestPhone" type="tel" autoComplete="tel" className={input} />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-slate-600">Message <span className="text-red-500">*</span></label>
                    <textarea
                      id="message" name="message" rows={3} required
                      defaultValue={`Hi, is the ${listing.unitType} week of ${formatDate(listing.checkIn)} still available?`}
                      className={input}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-sand-500 hover:bg-sand-600 px-4 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
                  >
                    Send enquiry
                  </button>
                </form>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
