/** Official SAA-C03 domain weights (exam guide). */

export type SaaC03DomainId = "secure" | "resilient" | "high-performing" | "cost-optimized";

export const saaC03DomainOrder: SaaC03DomainId[] = [
  "secure",
  "resilient",
  "high-performing",
  "cost-optimized",
];

export const saaC03DomainMeta: Record<
  SaaC03DomainId,
  { label: string; percent: number; oneLiner: string; chipClass: string; letter: string }
> = {
  secure: {
    label: "Design secure architectures",
    percent: 30,
    oneLiner: "Identity, encryption, network boundaries, least privilege.",
    chipClass: "border-rose-500/40 bg-rose-500/12 text-rose-100",
    letter: "S",
  },
  resilient: {
    label: "Design resilient architectures",
    percent: 26,
    oneLiner: "Multi-AZ, failover, queues, health-aware routing.",
    chipClass: "border-sky-500/40 bg-sky-500/12 text-sky-100",
    letter: "R",
  },
  "high-performing": {
    label: "Design high-performing architectures",
    percent: 24,
    oneLiner: "Latency, throughput, caching, right data stores.",
    chipClass: "border-violet-500/40 bg-violet-500/12 text-violet-100",
    letter: "H",
  },
  "cost-optimized": {
    label: "Design cost-optimized architectures",
    percent: 20,
    oneLiner: "Purchase models, storage tiers, right-sizing.",
    chipClass: "border-emerald-500/40 bg-emerald-500/12 text-emerald-100",
    letter: "C",
  },
};
