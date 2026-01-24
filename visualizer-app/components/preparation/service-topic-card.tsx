import Image from "next/image";
import Link from "next/link";
import type { KnowledgeTier } from "@/lib/exams-curriculum";
import { tierSummary } from "@/lib/exams-curriculum";

const ICON = 40;

export type ServiceTopicCardProps = {
  href: string;
  label: string;
  hint: string;
  iconFile: string;
  /** When set, shows What / How / Why / Niche chip (preparation hub) */
  knowledgeTier?: KnowledgeTier;
  /** 0–100 */
  progressPercent: number;
  /** While checkpoint data is loading */
  progressLoading?: boolean;
  /** When true (e.g. unsigned user), show muted copy instead of a real score */
  trackProgressUnavailable?: boolean;
};

export function ServiceTopicCard({
  href,
  label,
  hint,
  iconFile,
  progressPercent,
  progressLoading,
  trackProgressUnavailable,
  knowledgeTier,
}: ServiceTopicCardProps) {
  const src = `/aws-icons/${iconFile}`;
  const displayPct = trackProgressUnavailable || progressLoading ? 0 : progressPercent;
  const tierChip = knowledgeTier ? tierSummary[knowledgeTier] : null;

  return (
    <Link
      href={href}
      title={tierChip ? `${label} — ${tierChip.blurb}` : label}
      className="group flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-900/70 p-4 text-left backdrop-blur-sm transition hover:border-orange-500/40 hover:bg-zinc-800/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500/80"
    >
      <div className="flex items-start justify-between gap-2">
        <Image
          src={src}
          alt=""
          width={ICON}
          height={ICON}
          className="h-10 w-10 shrink-0 object-contain"
          aria-hidden
        />
        {tierChip ? (
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tierChip.className}`}
          >
            {tierChip.short}
          </span>
        ) : null}
      </div>
      <div className="mt-3 min-w-0">
        <p className="font-mono text-sm font-semibold tracking-wide text-orange-200/95 group-hover:text-orange-100">
          {label}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-zinc-500">{hint}</p>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2 text-[11px] font-medium text-zinc-500">
          <span>Explored</span>
          {trackProgressUnavailable ? (
            <span className="text-zinc-600">Sign in to track</span>
          ) : progressLoading ? (
            <span className="text-zinc-600">—</span>
          ) : (
            <span className="tabular-nums text-zinc-400">{displayPct}%</span>
          )}
        </div>
        <div
          className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-800"
          role="progressbar"
          aria-valuenow={trackProgressUnavailable || progressLoading ? 0 : displayPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Exploration progress for ${label}`}
        >
          <div
            className={`h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-[width] duration-300 ${
              trackProgressUnavailable || progressLoading ? "opacity-25" : ""
            }`}
            style={{ width: `${trackProgressUnavailable || progressLoading ? 0 : displayPct}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
