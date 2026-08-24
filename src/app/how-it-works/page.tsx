import Link from "next/link";
import { Search, MessageSquare, CalendarCheck, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata = { title: "How it works" };

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "1. Search in one place",
      copy: "Filter by resort, province, holiday type, unit size and budget. Every live week from every verified agent shows in one set of results - no group-hopping, no waiting for replies.",
    },
    {
      icon: ShieldCheck,
      title: "2. Compare verified sellers",
      copy: "Each listing shows the agent behind it, their reviews, and - when several agents sell the same week - every price side by side. You choose who to deal with, with full information.",
    },
    {
      icon: MessageSquare,
      title: "3. Enquire directly",
      copy: "Send an enquiry from the listing. It lands in the agent's WeekAway inbox and they come back to you with booking steps. No obligation until you confirm.",
    },
    {
      icon: CalendarCheck,
      title: "4. Book and check in",
      copy: "The agent confirms the week in your name with the resort. You get resort confirmation before settling the balance - that is the standard we hold agents to.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <h1 className="font-display text-4xl font-semibold text-slate-900">How WeekAway works</h1>
      <p className="mt-3 text-lg text-slate-600 max-w-2xl">
        Thousands of resort weeks change hands in South Africa every month - mostly through scattered
        WhatsApp groups. WeekAway puts them in one searchable, comparable, verified marketplace.
      </p>

      <div className="mt-12 space-y-8">
        {steps.map((s) => (
          <div key={s.title} className="flex gap-5 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <s.icon className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-900">{s.title}</h2>
              <p className="mt-2 text-slate-600 leading-relaxed">{s.copy}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-brand-800 text-white p-8 text-center">
        <h2 className="font-display text-2xl font-semibold">Ready to find your week?</h2>
        <Link
          href="/search"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sand-500 hover:bg-sand-600 px-6 py-3 font-semibold transition-colors"
        >
          Start searching <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
