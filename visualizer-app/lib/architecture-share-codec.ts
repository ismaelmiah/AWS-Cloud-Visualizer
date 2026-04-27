import LZString from "lz-string";
import type { ArchitectureFlowDocumentV1 } from "./architecture-flow-document";
import { parseArchitectureFlowDocument } from "./architecture-flow-document";

const PREFIX = "a1:";

/**
 * Encodes a flow document to a small string for URL query (compressed).
 * Can throw if the payload is not serializable.
 */
export function encodeFlowForShareUrl(doc: ArchitectureFlowDocumentV1): string {
  const json = JSON.stringify(doc);
  const compressed = LZString.compressToBase64(json);
  return PREFIX + compressed;
}

export function decodeFlowFromShareParam(z: string | null | undefined): ArchitectureFlowDocumentV1 {
  if (!z || typeof z !== "string") {
    return parseArchitectureFlowDocument(null);
  }
  const trimmed = z.trim();
  if (!trimmed.startsWith(PREFIX)) {
    return parseArchitectureFlowDocument(null);
  }
  const body = trimmed.slice(PREFIX.length);
  try {
    const json = LZString.decompressFromBase64(body);
    if (!json) {
      return parseArchitectureFlowDocument(null);
    }
    return parseArchitectureFlowDocument(JSON.parse(json) as unknown);
  } catch {
    return parseArchitectureFlowDocument(null);
  }
}
