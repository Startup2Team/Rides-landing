import type { Metadata } from "next";
import { CareersHero } from "./careers-hero";
import { CareersResume } from "./careers-resume";

export const metadata: Metadata = {
  title: "Developer Internship Program 2026 — Rides",
  description:
    "Apply for the Travelis Rwanda Developer Internship Program 2026. Build, learn, innovate, grow.",
};

export default function CareersPage() {
  return (
    <main className="relative flex-1">
      <section className="careers-page-section">
        <CareersHero />
        <CareersResume />
      </section>
    </main>
  );
}
