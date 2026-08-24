import { AlertCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ListingFields } from "@/components/ListingFields";
import { createListing } from "../../agent-actions";

export const metadata = { title: "New listing" };

export default async function NewListingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireRole("AGENT");
  const { error } = await searchParams;
  const resorts = await prisma.resort.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-slate-900">Load a new week</h1>
      <p className="mt-1 text-sm text-slate-500">
        Takes under a minute. The listing is live and searchable the moment you save it.
      </p>

      {error && (
        <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" aria-hidden />
          Please complete all required fields with a valid date and price.
        </p>
      )}

      <form action={createListing} className="mt-6 space-y-5 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
        <ListingFields resorts={resorts} />
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
        >
          Publish listing
        </button>
      </form>
    </div>
  );
}
