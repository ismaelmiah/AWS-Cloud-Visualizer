import type { ArchitectureFlowDocumentV1 } from "./architecture-flow-document";
import { parseArchitectureFlowDocument } from "./architecture-flow-document";
import { ensureDocument } from "./architecture-flow-adapter";

const PREFIX = "viz:architect-flow-v1:";

export function storageKeyForDesign(designId: string) {
  return `${PREFIX}${designId}`;
}

const DRAFT = `${PREFIX}draft`;

export function loadDraftFromBrowser(): ArchitectureFlowDocumentV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT);
    if (!raw) return null;
    return ensureDocument(parseArchitectureFlowDocument(JSON.parse(raw) as unknown));
  } catch {
    return null;
  }
}

export function saveDraftToBrowser(doc: ArchitectureFlowDocumentV1) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DRAFT, JSON.stringify(doc));
}

export function clearDraftFromBrowser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRAFT);
}

export function loadDesignFromBrowser(designId: string): ArchitectureFlowDocumentV1 | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKeyForDesign(designId));
    if (!raw) return null;
    return ensureDocument(parseArchitectureFlowDocument(JSON.parse(raw) as unknown));
  } catch {
    return null;
  }
}

export function saveDesignToBrowser(designId: string, doc: ArchitectureFlowDocumentV1) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKeyForDesign(designId), JSON.stringify(doc));
}

export function removeDesignFromBrowser(designId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKeyForDesign(designId));
}
