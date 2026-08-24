import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { register } from "@/app/auth-actions";

export const metadata = { title: "Sign up" };

const input =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; error?: string }>;
}) {
  const { type, error } = await searchParams;
  const isAgent = type === "agent";

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-slate-900">
        {isAgent ? "Apply to sell on WeekAway" : "Create your account"}
      </h1>
      <p className="mt-2 text-slate-600">
        {isAgent
          ? "Tell us about your agency. Our team reviews every application before listings go live - that is what keeps WeekAway trusted."
          : "Save searches and enquire on weeks in seconds."}
      </p>

      <div className="mt-6 flex rounded-xl bg-slate-100 p-1 text-sm font-medium" role="tablist" aria-label="Account type">
        <Link
          href="/register"
          role="tab"
          aria-selected={!isAgent}
          className={`flex-1 rounded-lg px-3 py-2 text-center ${!isAgent ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
        >
          I want to book
        </Link>
        <Link
          href="/register?type=agent"
          role="tab"
          aria-selected={isAgent}
          className={`flex-1 rounded-lg px-3 py-2 text-center ${isAgent ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
        >
          I am an agent
        </Link>
      </div>

      {error && (
        <div role="alert" className="mt-6 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
          <span>
            {error === "exists"
              ? "An account with that email already exists. Try logging in instead."
              : "Please fill in all required fields. Passwords need at least 6 characters."}
          </span>
        </div>
      )}

      <form action={register} className="mt-8 space-y-5">
        <input type="hidden" name="type" value={isAgent ? "agent" : "buyer"} />
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full name <span className="text-red-500">*</span></label>
          <input id="name" name="name" required autoComplete="name" className={input} />
        </div>
        {isAgent && (
          <div>
            <label htmlFor="agencyName" className="block text-sm font-medium text-slate-700">Agency name <span className="text-red-500">*</span></label>
            <input id="agencyName" name="agencyName" required className={input} />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address <span className="text-red-500">*</span></label>
          <input id="email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone {isAgent && <span className="text-red-500">*</span>}</label>
          <input id="phone" name="phone" type="tel" required={isAgent} autoComplete="tel" className={input} />
        </div>
        {isAgent && (
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700">About your agency</label>
            <textarea id="bio" name="bio" rows={3} className={input} placeholder="Which resorts do you specialise in? How long have you been trading?" />
            <p className="mt-1 text-xs text-slate-500">Shown on your public profile once approved.</p>
          </div>
        )}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password <span className="text-red-500">*</span></label>
          <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" className={input} />
          <p className="mt-1 text-xs text-slate-500">At least 6 characters.</p>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors cursor-pointer"
        >
          {isAgent ? "Submit application" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-600">
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:underline">Log in</Link>
      </p>
    </div>
  );
}
