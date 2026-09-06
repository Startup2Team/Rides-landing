import type { Metadata } from "next";
import { CareersForm } from "./careers-form";

export const metadata: Metadata = {
  title: "Developer Internship Program 2026 — Rides",
  description:
    "Apply for the Travelis Rwanda Developer Internship Program 2026. Build, learn, innovate, grow.",
};

export default function CareersPage() {
  return (
    <main className="relative flex-1">
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12 lg:py-16">
        <CareersForm />
      </section>
    </main>
  );
}
