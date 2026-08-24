import Link from "next/link";
import { Megaphone, Inbox, BarChart3, BadgeCheck, ArrowRight } from "lucide-react";

export const metadata = { title: "For agents" };

export default function ForAgentsPage() {
  const points = [
    {
      icon: Megaphone,
      title: "List once, reach everyone",
      copy: "Stop reposting the same week into twenty WhatsApp groups every morning. Load it once and it is instantly searchable by buyers across the country.",
    },
    {
      icon: Inbox,
      title: "Enquiries in one inbox",
      copy: "Every buyer enquiry lands in your WeekAway portal with the listing attached - no more scrolling chat history to figure out which week someone means.",
    },
    {
      icon: BarChart3,
      title: "Know what is working",
      copy: "See views and enquiries per listing, spot which weeks are about to expire unsold, and price against the market instead of guessing.",
    },
    {
      icon: BadgeCheck,
      title: "The verified badge sells for you",
      copy: "Buyers hesitate because they cannot tell who is legitimate. Verification and public reviews turn your track record into your biggest asset.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">For timeshare agents</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-slate-900">
        Your inventory, in front of every buyer. Free while we grow.
      </h1>
      <p className="mt-3 text-lg text-slate-600 max-w-2xl">
        WeekAway is built with agents, not against them. You keep your client relationships and your
        margins - we bring you the buyers and the tools.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {points.map((p) => (
          <div key={p.title} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <p.icon className="h-5 w-5" aria-hidden />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-slate-900">{p.title}</h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.copy}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-slate-900 text-white p-8">
        <h2 className="font-display text-2xl font-semibold">Apply to sell on WeekAway</h2>
        <p className="mt-2 text-slate-300 max-w-xl">
          We review every application by hand - that is what keeps the marketplace trusted, and what
          makes your verified badge worth something. Approval usually takes under a day.
        </p>
        <Link
          href="/register?type=agent"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sand-500 hover:bg-sand-600 px-6 py-3 font-semibold transition-colors"
        >
          Start your application <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
