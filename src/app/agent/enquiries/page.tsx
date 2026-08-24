import { Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { Badge } from "@/components/Badge";
import { formatDate } from "@/lib/format";
import { replyToEnquiry, closeEnquiry } from "../agent-actions";

export const metadata = { title: "Enquiries" };

export default async function AgentEnquiriesPage() {
  const session = await requireRole("AGENT");
  const enquiries = await prisma.enquiry.findMany({
    where: { listing: { agentId: session.userId } },
    include: { listing: { include: { resort: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">Enquiries</h1>
      <p className="mt-1 text-sm text-slate-500">
        Every buyer enquiry, with its listing attached. Reply here to keep a record.
      </p>

      <div className="mt-6 space-y-4">
        {enquiries.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            No enquiries yet. They will land here the moment a buyer hits "Send enquiry" on one of your listings.
          </div>
        )}
        {enquiries.map((e) => (
          <div key={e.id} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-slate-900">{e.guestName}</h2>
                  <Badge value={e.status} />
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatDate(e.createdAt)} - re: {e.listing.resort.name}, {e.listing.unitType},{" "}
                  {formatDate(e.listing.checkIn)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" aria-hidden />{e.guestEmail}</span>
                {e.guestPhone && (
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" aria-hidden />{e.guestPhone}</span>
                )}
              </div>
            </div>

            <p className="mt-3 rounded-xl bg-slate-50 p-3.5 text-sm text-slate-700">{e.message}</p>

            {e.reply ? (
              <p className="mt-3 rounded-xl bg-brand-50 border border-brand-100 p-3.5 text-sm text-slate-700">
                <span className="block text-xs font-semibold text-brand-700 mb-1">Your reply</span>
                {e.reply}
              </p>
            ) : (
              <form action={replyToEnquiry} className="mt-3 flex gap-2">
                <input type="hidden" name="id" value={e.id} />
                <label htmlFor={`reply-${e.id}`} className="sr-only">Reply to {e.guestName}</label>
                <input
                  id={`reply-${e.id}`} name="reply" required placeholder="Type your reply..."
                  className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
                />
                <button className="rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer">
                  Reply
                </button>
              </form>
            )}

            {e.status !== "CLOSED" && (
              <form action={closeEnquiry} className="mt-3 text-right">
                <input type="hidden" name="id" value={e.id} />
                <button className="text-xs font-medium text-slate-400 hover:text-slate-600 cursor-pointer">
                  Mark as closed
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
