/**
 * Architecture lab: named designs stored in Supabase.
 */

import type { ArchitectureFlowDocumentV1 } from "./architecture-flow-document";

export const MAX_SAVED_DESIGNS = 24;
export const MAX_TITLE_LENGTH = 100;

const DESIGN_ID_RE = /^[A-Za-z0-9_-]{8,32}$/;

export type ArchitectureDesignIndexRow = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
};

/** As returned from GET /api/architecture-saves (includes full diagram for sync). */
export type ArchitectureDesignWithFlow = ArchitectureDesignIndexRow & {
  flow: ArchitectureFlowDocumentV1;
};

export function validateTitle(title: string): string | null {
  const t = title.trim();
  if (!t) return "title is required";
  if (t.length > MAX_TITLE_LENGTH) return `title at most ${MAX_TITLE_LENGTH} characters`;
  return null;
}

export function validateDesignId(id: string): string | null {
  if (!DESIGN_ID_RE.test(id)) return "Invalid design id";
  return null;
}

export function toDesignsSorted<T extends { updatedAt: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
