"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { ArchitectureCanvas } from "@/components/architecture-lab/architecture-canvas";
import { emptyFlowDocument } from "@/lib/architecture-flow-document";
import { decodeFlowFromShareParam } from "@/lib/architecture-share-codec";

function ShareViewInner() {
  const search = useSearchParams();
  const z = search.get("z");
  const document = useMemo(() => {
    if (!z) return emptyFlowDocument();
    return decodeFlowFromShareParam(z);
  }, [z]);
  const hasContent = (document.nodes?.length ?? 0) > 0;

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-zinc-950 px-4 py-8 text-zinc-100 sm:px-6">
      <h1 className="font-sans text-xl font-semibold text-white sm:text-2xl">Shared architecture</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Read-only view. Pan and zoom. Open the app and sign in to create your own lab.
      </p>
      {!z ? (
        <p className="mt-6 text-amber-400/90">Missing link payload (z query).</p>
      ) : !hasContent ? (
        <p className="mt-6 text-amber-400/90">Could not decode this design. The link may be truncated.</p>
      ) : null}
      <div className="mt-6">
        <ArchitectureCanvas key={z ?? "empty"} readOnly initialDocument={document} />
      </div>
    </div>
  );
}

export default function ShareArchitectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-400">Loading…</div>
      }
    >
      <ShareViewInner />
    </Suspense>
  );
}
