"use client";

import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export async function exportArchitecturePng(element: HTMLElement): Promise<Blob> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    backgroundColor: "#09090b",
    pixelRatio: 2,
    filter: (node) => {
      if (!(node instanceof HTMLElement)) return true;
      if (node.classList?.contains("react-flow__minimap")) return false;
      if (node.classList?.contains("react-flow__controls")) return false;
      return true;
    },
  });
  const res = await fetch(dataUrl);
  return res.blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const u = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = u;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(u);
}

export async function exportArchitecturePdf(element: HTMLElement): Promise<Blob> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    backgroundColor: "#09090b",
    pixelRatio: 2,
    filter: (node) => {
      if (!(node instanceof HTMLElement)) return true;
      if (node.classList?.contains("react-flow__minimap")) return false;
      if (node.classList?.contains("react-flow__controls")) return false;
      return true;
    },
  });

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("image load failed"));
    img.src = dataUrl;
  });

  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const pad = 24;
  const pageW = w + pad * 2;
  const pageH = h + pad * 2;
  const pdf = new jsPDF({
    orientation: pageW > pageH ? "l" : "p",
    unit: "px",
    format: [pageW, pageH],
  });
  pdf.addImage(dataUrl, "PNG", pad, pad, w, h);
  return pdf.output("blob");
}
