import Link from "next/link";
import { MapPin } from "lucide-react";
import { ResortImage } from "./ResortImage";
import { Badge } from "./Badge";
import { categoryLabel, formatZar } from "@/lib/format";

export function ResortCard({
  resort,
  liveCount,
  fromPrice,
}: {
  resort: { slug: string; name: string; town: string; province: string; category: string };
  liveCount: number;
  fromPrice: number | null;
}) {
  return (
    <Link
      href={`/resorts/${resort.slug}`}
      className="group block rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-300 transition-all"
    >
      <div className="relative">
        <ResortImage slug={resort.slug} category={resort.category} className="aspect-[5/3]" />
        <div className="absolute top-3 left-3">
          <Badge value={resort.category} label={categoryLabel(resort.category)} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-brand-700">
          {resort.name}
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {resort.town}, {resort.province}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-600">
            {liveCount > 0 ? `${liveCount} week${liveCount === 1 ? "" : "s"} available` : "No weeks right now"}
          </span>
          {fromPrice !== null && (
            <span className="font-semibold text-brand-700 tabular-nums">from {formatZar(fromPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
