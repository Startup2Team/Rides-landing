import Hero from "../components/hero";
import Features from "../components/features";
import Explore from "../components/explore";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Features />
      <Explore />
    </main>
  );
}
