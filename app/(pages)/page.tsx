import Hero from "../components/hero";
import Features from "../components/features";
import HowItWorks from "../components/how-it-works";
import FAQ from "../components/faq";
import FinalCTA from "../components/final-cta";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Features />
      <HowItWorks />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
