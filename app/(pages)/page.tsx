import Hero from "../components/hero";
import Features from "../components/features";
import FAQ from "../components/faq";
import FinalCTA from "../components/final-cta";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Features />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
