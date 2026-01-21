"use client";

import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { ServiceStrip } from "./ServiceStrip";
import { LandingFooter } from "./LandingFooter";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
      <Hero />
      <HowItWorks />
      <ServiceStrip />
      <LandingFooter />
    </div>
  );
}
