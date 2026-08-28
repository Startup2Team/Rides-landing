import type { Metadata } from "next";
import HowItWorks from "../../components/how-it-works";

// The section component is a client component (it drives the sticky step
// navigator off an IntersectionObserver), so the metadata lives out here on the
// server page that wraps it.
export const metadata: Metadata = {
  title: "How It Works — Rides",
  description:
    "From request to rating in five steps: book a ride, agree a fair fare, travel, pay your way, and rate the trip.",
};

export default function HowItWorksPage() {
  return (
    <main className="flex-1">
      <HowItWorks />
    </main>
  );
}
