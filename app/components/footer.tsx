"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTranslations, type Dictionary } from "../i18n/context";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./social-icons";
import { FooterMark } from "./footer-mark";
import { RidesWordmark } from "./rides-logo";

/* ────────────────────────────────────────────────────────────────────────────
   Site footer.

   Rendered once, from app/(pages)/layout.tsx. Note it is NOT rendered on
   /contact, which has its own layout carrying only Navbar + Chatbot.

   Layout: brand and the extruded mark on the left, three link columns on the
   right. The mark is shown whole rather than cropped — a letterform stops
   reading as a letter the moment you cut it, so unlike the abstract marks this
   pattern is usually built around, it cannot bleed off the edge. Below lg it is
   dropped entirely; at that width it would take the whole viewport.

   Everything visible comes from ROUTES, COLUMNS and SOCIAL_LINKS.
──────────────────────────────────────────────────────────────────────────── */

/** Single source for destinations referenced from more than one place. */
const ROUTES = {
  privacy: "/privacy",
  terms: "/terms",
} as const;

type NavKey = keyof Dictionary["nav"];
type FooterKey = keyof Dictionary["footer"];

/* Labels come from two dictionaries: the shared `nav` namespace (so footer and
   navbar can't drift apart) and `footer` for legal wording. The discriminated
   union keeps both sides type-checked against en.json — a typo or a key missing
   from fr/rw fails the build rather than rendering blank. */
type FooterLink =
  | { ns: "nav"; labelKey: NavKey; href: string }
  | { ns: "footer"; labelKey: FooterKey; href: string }
  | { ns: "raw"; label: string; href: string; external: true; icon: ReactNode };

type FooterColumnSpec = {
  headingKey: FooterKey;
  links: readonly FooterLink[];
};

/* TODO: the social hrefs are still placeholders — swap for the real profile
   URLs. Kept here so it is a three-line edit when the accounts exist. */
const ICON = "h-[1.15em] w-[1.15em] shrink-0";

const SOCIAL_LINKS: readonly FooterLink[] = [
  { ns: "raw", label: "Facebook", href: "#", external: true, icon: <FacebookIcon className={ICON} /> },
  { ns: "raw", label: "Instagram", href: "#", external: true, icon: <InstagramIcon className={ICON} /> },
  { ns: "raw", label: "TikTok", href: "#", external: true, icon: <TikTokIcon className={ICON} /> },
];

const COLUMNS: readonly FooterColumnSpec[] = [
  {
    headingKey: "product",
    links: [
      { ns: "nav", labelKey: "features", href: "/#features" },
      { ns: "nav", labelKey: "howItWorks", href: "/how-it-works" },
      { ns: "nav", labelKey: "drivers", href: "/drivers" },
      { ns: "nav", labelKey: "download", href: "/#download" },
    ],
  },
  {
    headingKey: "company",
    links: [
      { ns: "nav", labelKey: "about", href: "/about" },
      { ns: "nav", labelKey: "contact", href: "/contact" },
      { ns: "footer", labelKey: "privacyPolicy", href: ROUTES.privacy },
      { ns: "footer", labelKey: "termsOfService", href: ROUTES.terms },
    ],
  },
  { headingKey: "follow", links: SOCIAL_LINKS },
];

/* The footer runs on exactly two type styles, and nothing in between.

   MICRO — uppercase letterspaced 12px. The tagline, column headings and the
   copyright line all share it. Colour is --muted-foreground (5.10:1 on the
   white footer) rather than the lighter grey the reference uses, which would
   land near 3.5:1 and fail AA at this size.

   LINK — one step up, at --text-body (16px), and it does NOT grow with the
   viewport. It used to run text-base → sm:text-lg → lg:text-xl, i.e. 20px on
   desktop: larger than any body copy on the site, and 1.67x the column heading
   directly above it, so the label outranked its own heading. Weight and case
   carry the hierarchy now instead of size — medium against the headings'
   uppercase, which is what keeps the block reading as one scale. */
const MICRO = "text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground";
const LINK =
  "inline-flex items-center gap-2.5 text-base font-medium leading-snug text-footer-link transition-colors hover:text-footer-link-hover";

// ── Pieces ───────────────────────────────────────────────────────────────────

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: readonly { label: string; href: string; external?: boolean; icon?: ReactNode }[];
}) {
  return (
    <div>
      <p className={MICRO}>{heading}</p>
      {/* Gaps were sized to keep 20px links from colliding; at body size that
          same rhythm leaves a sparse ladder, so it comes down with the type. */}
      <ul className="mt-4 space-y-3">
        {links.map((link) => {
          const body = (
            <>
              {link.icon}
              {link.label}
            </>
          );
          return (
            <li key={link.label}>
              {link.external ? (
                <a href={link.href} target="_blank" rel="noreferrer" className={LINK}>
                  {body}
                </a>
              ) : (
                <Link href={link.href} className={LINK}>
                  {body}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear();
  const t = useTranslations("nav");
  const tf = useTranslations("footer");

  const resolve = (link: FooterLink) => {
    if (link.ns === "raw")
      return { label: link.label, href: link.href, external: true, icon: link.icon };
    const label = link.ns === "nav" ? t(link.labelKey) : tf(link.labelKey);
    return { label, href: link.href };
  };

  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-border bg-card">
      <div className="relative mx-auto max-w-7xl px-6 pt-14 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {/* ── Left: brand, tagline, and the mark that bleeds ── */}
          <div className="relative">
            <Link href="/" className="inline-flex items-center">
              <RidesWordmark className="text-3xl" />
            </Link>
            <p className={`mt-4 max-w-sm ${MICRO}`}>{tf("quote")}</p>

            {/* Sizing and crop both come from --mark-height / --mark-reveal
                in globals.css — see .footer-mark. */}
            <FooterMark className="footer-mark pointer-events-none mt-10 hidden lg:block" />
          </div>

          {/* ── Right: columns, rule, copyright ── */}
          <div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
              {COLUMNS.map((column) => (
                <FooterColumn
                  key={column.headingKey}
                  heading={tf(column.headingKey)}
                  links={column.links.map(resolve)}
                />
              ))}
            </div>

            {/* Rule and copyright stay inside the right half, aligned to the
                columns — not a full-width bar. */}
            <div className="mt-12 lg:mt-14">
              <div className="rule-dotted" />
              <p className={`mt-6 ${MICRO}`}>
                © {year} Rides. {tf("rightsReserved")}
              </p>
            </div>
          </div>
        </div>

        {/* Breathing room under the mark — without it the letter sits flush
            on the footer edge and reads as though it were cut. */}
        <div className="h-14 lg:h-16" />
      </div>
    </footer>
  );
}
