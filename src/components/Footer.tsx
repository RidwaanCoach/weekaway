import Link from "next/link";
import { Waves } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Waves className="h-4 w-4" aria-hidden />
            </span>
            <span className="font-display text-lg font-semibold text-slate-900">
              Week<span className="text-brand-600">Away</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            South Africa's marketplace for resort weeks. Beach, bush and berg - all in one search.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/search" className="hover:text-brand-700">Find a week</Link></li>
            <li><Link href="/resorts" className="hover:text-brand-700">All resorts</Link></li>
            <li><Link href="/search?category=BEACH" className="hover:text-brand-700">Beach resorts</Link></li>
            <li><Link href="/search?category=BUSH" className="hover:text-brand-700">Bush &amp; safari</Link></li>
            <li><Link href="/search?category=MOUNTAIN" className="hover:text-brand-700">Mountains &amp; country</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">For agents</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/for-agents" className="hover:text-brand-700">Why list with us</Link></li>
            <li><Link href="/register?type=agent" className="hover:text-brand-700">Apply to sell</Link></li>
            <li><Link href="/login" className="hover:text-brand-700">Agent login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Trust</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/how-it-works" className="hover:text-brand-700">How it works</Link></li>
            <li><span>Every seller is verified before listing</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
        WeekAway (demo) - built for concept validation. Prices and listings are sample data.
      </div>
    </footer>
  );
}
