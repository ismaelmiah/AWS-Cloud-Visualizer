import type { Metadata } from "next";
import { ArchitectureLabClient } from "@/components/architecture-lab/architecture-lab-client";

export const metadata: Metadata = {
  title: "Architecture lab — AWS Visualizer",
  description: "Practice AWS service diagrams, export, and share",
};

export default function ArchitectLabPage() {
  return <ArchitectureLabClient />;
}
