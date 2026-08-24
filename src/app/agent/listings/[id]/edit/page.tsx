import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ListingFields } from "@/components/ListingFields";
import { updateListing } from "../../../agent-actions";
import { Badge } from "@/components/Badge";

export const metadata = { title: "Edit listing" };

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole("AGENT");
  const { id } = await params;

  const listing = await prisma.listing.findUnique({ where: { id }, include: { resort: true } });
  if (!listing || listing.agentId !== session.userId) notFound();
  const resorts = await prisma.resort.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl font-semibold text-slate-900">Edit listing</h1>
        <Badge value={listing.status} />
      </div>
      <p className="mt-1 text-sm text-slate-500">{listing.resort.name}</p>

      <form action={updateListing} className="mt-6 space-y-5 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <input type="hidden" name="id" value={listing.id} />
        <ListingFields
          resorts={resorts}
          defaults={{
            resortId: listing.resortId,
            checkIn: listing.checkIn.toISOString().slice(0, 10),
            nights: listing.nights,
            unitType: listing.unitType,
            sleeps: listing.sleeps,
            priceZar: listing.priceZar,
            notes: listing.notes,
          }}
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
