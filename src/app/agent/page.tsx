import Link from "next/link";
import { Eye, Inbox, List, AlertTriangle, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatDate, formatZar } from "@/lib/format";

export const metadata = { title: "Agent dashboard" };

export default async function AgentDashboard() {
  const session = await requireRole("AGENT");

  const [live, sold, newEnquiries, listings] = await Promise.all([
    prisma.listing.count({ where: { agentId: session.userId, status: "LIVE" } }),
    prisma.listing.count({ where: { agentId: session.userId, status: "SOLD" } }),
    prisma.enquiry.count({ where: { status: "NEW", listing: { agentId: session.userId } } }),
    prisma.listing.findMany({
      where: { agentId: session.userId },
      include: { resort: true, _count: { select: { enquiries: true } } },
      orderBy: { checkIn: "asc" },
    }),
  ]);

  const totalViews = listings.reduce((s, l) => s + l.views, 0);
  const soon = new Date();
  soon.setDate(soon.getDate() + 21);
  const expiring = listings.filter((l) => l.status === "LIVE" && l.checkIn <= soon);

  const stats = [
    { icon: List, label: "Live listings", value: live },
    { icon: TrendingUp, label: "Sold", value: sold },
    { icon: Eye, label: "Total views", value: totalViews },
    { icon: Inbox, label: "New enquiries", value: newEnquiries, href: "/agent/enquiries" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-slate-900">
        Welcome back, {session.name.split(" ")[0]}
      </h1>

      <dl className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const card = (
            <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm h-full">
              <s.icon className="h-5 w-5 text-brand-600" aria-hidden />
              <dd className="mt-3 text-2xl font-bold text-slate-900 tabular-nums">{s.value}</dd>
              <dt className="text-sm text-slate-500">{s.label}</dt>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="block hover:opacity-90">{card}</Link>
          ) : (
            <div key={s.label}>{card}</div>
          );
        })}
      </dl>

      {expiring.length > 0 && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden />
            Weeks checking in within 21 days - still unsold
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            These expire worthless if they do not sell. Consider dropping the price.
          </p>
          <ul className="mt-4 space-y-2">
            {expiring.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/agent/listings/${l.id}/edit`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white border border-amber-200 px-4 py-3 text-sm hover:border-amber-400"
                >
                  <span className="font-medium text-slate-800">
                    {l.resort.name} - {l.unitType}, {formatDate(l.checkIn)}
                  </span>
                  <span className="text-slate-600 tabular-nums">
                    {formatZar(l.priceZar)} - {l.views} views - {l._count.enquiries} enquiries
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/agent/listings/new"
          className="rounded-xl bg-brand-600 hover:bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          Load a new week
        </Link>
        <Link
          href="/agent/listings"
          className="rounded-xl bg-white border border-slate-300 hover:border-brand-400 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors"
        >
          Manage listings
        </Link>
      </div>
    </div>
  );
}
