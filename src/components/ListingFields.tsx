import { SLEEPS_OPTIONS } from "@/lib/format";

const input =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none";

export function ListingFields({
  resorts,
  defaults,
}: {
  resorts: { id: string; name: string; town: string }[];
  defaults?: {
    resortId?: string;
    checkIn?: string;
    nights?: number;
    unitType?: string;
    sleeps?: number;
    priceZar?: number;
    notes?: string | null;
  };
}) {
  return (
    <>
      <div>
        <label htmlFor="resortId" className="block text-sm font-medium text-slate-700">Resort <span className="text-red-500">*</span></label>
        <select id="resortId" name="resortId" required defaultValue={defaults?.resortId ?? ""} className={input} disabled={!!defaults?.resortId}>
          <option value="" disabled>Select a resort...</option>
          {resorts.map((r) => (
            <option key={r.id} value={r.id}>{r.name} ({r.town})</option>
          ))}
        </select>
        {defaults?.resortId && <input type="hidden" name="resortId" value={defaults.resortId} />}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="checkIn" className="block text-sm font-medium text-slate-700">Check-in date <span className="text-red-500">*</span></label>
          <input id="checkIn" name="checkIn" type="date" required defaultValue={defaults?.checkIn} className={input} />
        </div>
        <div>
          <label htmlFor="nights" className="block text-sm font-medium text-slate-700">Nights</label>
          <input id="nights" name="nights" type="number" min={1} max={21} defaultValue={defaults?.nights ?? 7} className={input} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="unitType" className="block text-sm font-medium text-slate-700">Unit type <span className="text-red-500">*</span></label>
          <select id="unitType" name="unitType" required defaultValue={defaults?.unitType ?? "2 Bedroom"} className={input}>
            {["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "4 Bedroom"].map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sleeps" className="block text-sm font-medium text-slate-700">Sleeps <span className="text-red-500">*</span></label>
          <select id="sleeps" name="sleeps" required defaultValue={defaults?.sleeps ?? 6} className={input}>
            {SLEEPS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="priceZar" className="block text-sm font-medium text-slate-700">Price for the full week (ZAR) <span className="text-red-500">*</span></label>
        <input
          id="priceZar" name="priceZar" type="number" min={500} step={100} required
          defaultValue={defaults?.priceZar} placeholder="e.g. 12500" className={input}
        />
        <p className="mt-1 text-xs text-slate-500">Buyers see this price upfront. Listings with round, honest prices get more enquiries.</p>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes for buyers</label>
        <textarea
          id="notes" name="notes" rows={2} defaultValue={defaults?.notes ?? ""}
          placeholder="e.g. Sea-facing unit, levies included, name change fee for buyer's account"
          className={input}
        />
      </div>
    </>
  );
}
