import Link from "next/link";
import { LayoutDashboard, List, PlusCircle, Inbox, Hourglass, Ban } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("AGENT");
  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  if (!user) return null;

  if (user.agentStatus !== "APPROVED") {
    const suspended = user.agentStatus === "SUSPENDED";
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        {suspended ? (
          <Ban className="mx-auto h-12 w-12 text-red-400" aria-hidden />
        ) : (
          <Hourglass className="mx-auto h-12 w-12 text-sand-500" aria-hidden />
        )}
        <h1 className="mt-5 font-display text-2xl font-semibold text-slate-900">
          {suspended ? "Your account is suspended" : "Application under review"}
        </h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          {suspended
            ? "Your listings are hidden while your account is suspended. Contact the WeekAway team to resolve this."
            : `Thanks for applying, ${user.name.split(" ")[0]}. Our team is reviewing ${user.agencyName ?? "your agency"} - approval usually takes under a day. You will be able to load listings the moment you are verified.`}
        </p>
      </div>
    );
  }

  const nav = [
    { href: "/agent", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/agent/listings", icon: List, label: "My listings" },
    { href: "/agent/listings/new", icon: PlusCircle, label: "New listing" },
    { href: "/agent/enquiries", icon: Inbox, label: "Enquiries" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {user.agencyName ?? user.name}
          </p>
          <nav className="mt-3 flex lg:flex-col gap-1 overflow-x-auto" aria-label="Agent portal">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-800 whitespace-nowrap"
              >
                <n.icon className="h-4 w-4" aria-hidden />
                {n.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
