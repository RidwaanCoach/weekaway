"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";

export function ResetDemoButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (
          window.confirm(
            "Reset all demo data? This wipes every change made since the last reset (new accounts, approvals, listings, enquiries) and restores the original demo dataset, including the pending SunSeeker application."
          )
        ) {
          startTransition(() => action());
        }
      }}
      className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-brand-400 hover:text-brand-700 transition-colors cursor-pointer disabled:opacity-50"
    >
      <RotateCcw className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} aria-hidden />
      {pending ? "Resetting..." : "Reset demo data"}
    </button>
  );
}
