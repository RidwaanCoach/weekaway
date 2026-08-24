import Link from "next/link";
import { Users, List, Inbox, Building2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ResetDemoButton } from "@/components/ResetDemoButton";
import { resetDemoData } from "./admin-actions";

export const metadata = { title: "Admin" };

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  await requireRole("ADMIN");
  const { reset } = await searchParams;

  const [agents, pendingAgents, liveListings, enquiries, resorts] = await Promise.all([
    prisma.user.count({ where: { role: "AGENT" } }),
    prisma.user.count({ where: { role: "AGENT", agentStatus: "PENDING" } }),
    prisma.listing.count({ where: { status: "LIVE" } }),
    prisma.enquiry.count(),
    prisma.resort.count(),
  ]);

  const stats = [
    { icon: Users, label: "Agents", value: agents, href: "/admin/agents" },
    { icon: List, label: "Live listings", value: liveListings, href: "/admin/listings" },
    { icon: Inbox, label: "Total enquiries", value: enquiries },
    { icon: Building2, label: "Resorts", value: resorts, href: "/admin/resorts" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-slate-900">Marketplace overview</h1>
        <ResetDemoButton action={resetDemoData} />
      </div>

      {reset && (
        <p role="status" className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-5 w-5" aria-hidden />
          Demo data restored to its original state. The pending SunSeeker application is back in the queue.
        </p>
      )}

      {pendingAgents > 0 && (
        <Link
          href="/admin/agents"
          className="mt-5 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-slate-800 hover:border-amber-400"
        >
          <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden />
          {pendingAgents} agent application{pendingAgents === 1 ? "" : "s"} waiting for review
        </Link>
      )}

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

      <p className="mt-8 text-sm text-slate-500 max-w-lg leading-relaxed">
        The approval queue is the heart of the marketplace: verified agents are what make WeekAway
        different from a WhatsApp group. Review applications promptly and suspend anyone who breaks
        the booking-confirmation standard.
      </p>
    </div>
  );
}
