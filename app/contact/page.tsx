import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { ContactHeading } from "./contact-heading";
import { ContactMap } from "./contact-map";
import { OFFICE_CENTRE_TILE_URL, OFFICE_MAPS_URL, TILE_ORIGIN } from "./office";

export const metadata: Metadata = {
  title: "Contact Rides",
  description:
    "Get in touch with the Rides team — riders, drivers, partners, and press.",
};

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function InfoRow({
  icon,
  label,
  sub,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  /** When set, the row opens this in a new tab (used for the map link). */
  href?: string;
}) {
  const inner = (
    <>
      <span className="flex shrink-0 items-center justify-center text-foreground/80">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-base font-semibold text-foreground sm:text-lg">{label}</p>
        {sub ? <p className="text-sm text-muted-foreground">{sub}</p> : null}
      </div>
    </>
  );

  if (href) {
    // Only the maps link leaves the site. `tel:` must stay in the same tab —
    // target="_blank" there leaves an empty tab behind on desktop.
    const opensNewTab = href.startsWith("http");
    return (
      <a
        href={href}
        {...(opensNewTab ? { target: "_blank", rel: "noreferrer" } : {})}
        className="group -my-2 flex items-center gap-4 py-2 transition-opacity hover:opacity-70"
      >
        {inner}
      </a>
    );
  }

  return <div className="flex items-center gap-4">{inner}</div>;
}

export default function ContactPage() {
  return (
    <main className="relative flex-1 overflow-hidden">
      {/* React hoists these into <head>. No crossOrigin on either: Leaflet
          requests tiles with plain <img> tags, and a CORS-flavoured preconnect
          opens a connection the image loads would not reuse. */}
      <link rel="preconnect" href={TILE_ORIGIN} />
      <link rel="dns-prefetch" href={TILE_ORIGIN} />
      <link rel="preload" as="image" href={OFFICE_CENTRE_TILE_URL} />
      {/* py- is kept deliberately small against the min-h: the section only
          scrolls once its natural height beats calc(100vh-5rem), and every
          16px of padding raises the viewport height at which that happens. At
          lg:py-24 the page started scrolling below a 647px-tall window — a
          7px scrollbar on a 1024x640 laptop. lg:py-14 moves that to 567px. */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-10 sm:gap-12 sm:px-6 sm:py-12 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2 lg:items-stretch lg:gap-20 lg:py-14">
        {/* ── Left: heading, contact info, office map ── */}
        <div className="relative flex flex-col">
          <ContactHeading />

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-5">
            <InfoRow
              icon={<PhoneIcon />}
              label="+250 796 591 452"
              href="tel:+250796591452"
            />
            <InfoRow
              icon={<PinIcon />}
              label="3 KG 98 St"
              sub="Kimironko, Kigali"
              href={OFFICE_MAPS_URL}
            />
          </div>

          {/* The map takes the column's leftover height instead of a fixed one,
              so it grows on tall windows and shrinks on short ones — which is
              what keeps the page inside calc(100vh-5rem) and scroll-free. */}
          <ContactMap className="mt-8 h-52 sm:h-56 lg:mt-10 lg:h-auto lg:min-h-[8rem] lg:flex-1" />
        </div>

        {/* ── Right: minimal form ── */}
        <div className="relative flex flex-col justify-center">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
