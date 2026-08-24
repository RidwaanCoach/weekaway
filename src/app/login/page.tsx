import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { login } from "@/app/auth-actions";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-slate-900">Welcome back</h1>
      <p className="mt-2 text-slate-600">Log in to manage your listings or enquiries.</p>

      {error && (
        <div role="alert" className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
          <span>Email or password is incorrect. Please try again.</span>
        </div>
      )}

      <form action={login} className="mt-8 space-y-5">
        {next && <input type="hidden" name="next" value={next} />}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
          <input
            id="email" name="email" type="email" required autoComplete="email"
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
          <input
            id="password" name="password" type="password" required autoComplete="current-password"
            className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors cursor-pointer"
        >
          Log in
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        No account yet?{" "}
        <Link href="/register" className="font-semibold text-brand-700 hover:underline">Sign up</Link>
        {" "}or{" "}
        <Link href="/register?type=agent" className="font-semibold text-brand-700 hover:underline">apply as an agent</Link>.
      </p>

      <div className="mt-10 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500 leading-relaxed">
        <p className="font-semibold text-slate-600 mb-1">Demo accounts</p>
        <p>Admin: admin@weekaway.co.za / admin123</p>
        <p>Agent: sharon@coastalweeks.co.za / agent123</p>
        <p>Pending agent: thabo@sunseeker.co.za / agent123</p>
      </div>
    </div>
  );
}
