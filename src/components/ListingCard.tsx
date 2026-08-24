import Link from "next/link";
import { CalendarDays, Users, BedDouble, ShieldCheck } from "lucide-react";
import { ResortImage } from "./ResortImage";
import { Badge } from "./Badge";
import { formatZar, formatDate, categoryLabel } from "@/lib/format";

export type ListingWithJoins = {
  id: string;
  checkIn: Date;
  nights: number;
  unitType: string;
  sleeps: number;
  priceZar: number;
  status: string;
  resort: { name: string; slug: string; town: string; province: string; category: string };
  agent: { name: string; agencyName: string | null };
};

export function ListingCard({ listing }: { listing: ListingWithJoins }) {
  const sold = listing.status !== "LIVE";
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-300 transition-all"
    >
      <div className="relative">
        <ResortImage slug={listing.resort.slug} category={listing.resort.category} className="aspect-[5/3]" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge value={listing.resort.category} label={categoryLabel(listing.resort.category)} />
          {sold && <Badge value={listing.status} />}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-brand-700">
          {listing.resort.name}
        </h3>
        <p className="text-sm text-slate-500">
          {listing.resort.town}, {listing.resort.province}
        </p>
        <dl className="mt-3 space-y-1.5 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-brand-500" aria-hidden />
            <span>
              {formatDate(listing.checkIn)} - {listing.nights} nights
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-brand-500" aria-hidden />
            <span>{listing.unitType}</span>
            <span className="text-slate-300">|</span>
            <Users className="h-4 w-4 text-brand-500" aria-hidden />
            <span>Sleeps {listing.sleeps}</span>
          </div>
        </dl>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">Full week</p>
            <p className="text-xl font-bold text-slate-900 tabular-nums">{formatZar(listing.priceZar)}</p>
          </div>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
            {listing.agent.agencyName ?? listing.agent.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
