import Link from "next/link";
import { Waves, UserCircle2, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { getSession, destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function logout() {
  "use server";
  await destroySession();
  redirect("/");
}

export async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2" aria-label="WeekAway home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Waves className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-slate-900">
            Week<span className="text-brand-600">Away</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600" aria-label="Main">
          <Link href="/search" className="hover:text-brand-700 py-2">Find a week</Link>
          <Link href="/resorts" className="hover:text-brand-700 py-2">Resorts</Link>
          <Link href="/how-it-works" className="hover:text-brand-700 py-2">How it works</Link>
          <Link href="/for-agents" className="hover:text-brand-700 py-2">For agents</Link>
        </nav>

        <div className="flex items-center gap-2">
          {!session && (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-700 rounded-lg"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
          {session && (
            <>
              {session.role === "AGENT" && (
                <Link
                  href="/agent"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 rounded-lg"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                  Agent portal
                </Link>
              )}
              {session.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 rounded-lg"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                  Admin
                </Link>
              )}
              <span className="hidden sm:flex items-center gap-1.5 px-2 text-sm text-slate-600">
                <UserCircle2 className="h-4 w-4" aria-hidden />
                {session.name.split(" ")[0]}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  Log out
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
