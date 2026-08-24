import Link from "next/link";
import { LayoutDashboard, Users, List, Building2 } from "lucide-react";
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("ADMIN");

  const nav = [
    { href: "/admin", icon: LayoutDashboard, label: "Overview" },
    { href: "/admin/agents", icon: Users, label: "Agents" },
    { href: "/admin/listings", icon: List, label: "Listings" },
    { href: "/admin/resorts", icon: Building2, label: "Resorts" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            WeekAway Admin
          </p>
          <nav className="mt-3 flex lg:flex-col gap-1 overflow-x-auto" aria-label="Admin">
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
