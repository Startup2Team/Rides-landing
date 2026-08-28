import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Chatbot } from "../components/chatbot";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>
      {/* Clears the fixed bar: 3.5rem tall, 4rem at sm. The hero cancels this
          with a matching negative margin so its map can run under the bar. */}
      <div className="pt-14 sm:pt-16">
        {children}
      </div>
      <div className="print:hidden">
        <Footer />
        <Chatbot />
      </div>
    </>
  );
}
