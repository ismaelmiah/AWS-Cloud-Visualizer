import { saaC03DomainMeta, saaC03DomainOrder, type SaaC03DomainId } from "@/lib/saa-c03-domains";

export function SaaDomainStrip() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {saaC03DomainOrder.map((id: SaaC03DomainId) => {
        const m = saaC03DomainMeta[id];
        return (
          <div key={id} className={`rounded-xl border px-3 py-3 ${m.chipClass}`}>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{m.letter}</span>
              <span className="font-mono text-xs tabular-nums text-zinc-400">{m.percent}%</span>
            </div>
            <p className="mt-1 font-sans text-xs font-semibold leading-snug text-white">{m.label}</p>
            <p className="mt-1 text-[11px] leading-snug text-zinc-500">{m.oneLiner}</p>
          </div>
        );
      })}
    </div>
  );
}
