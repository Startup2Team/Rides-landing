"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTranslations, type Dictionary } from "../i18n/context";
import { FacebookIcon, InstagramIcon } from "./social-icons";
import { RidesWordmark } from "./rides-logo";
import { StoreBadges } from "./store-badges";

/* ────────────────────────────────────────────────────────────────────────────
   Site footer.

   Rendered once, from app/(pages)/layout.tsx. Note it is NOT rendered on
   /contact, which has its own layout carrying only Navbar + Chatbot.

   Layout: five tracks on desktop — brand, Product, Company, Legal, Follow —
   every one sized to its own content (`auto`) with the leftover width shared
   evenly between them (`justify-between`). Two earlier tries missed: equal
   quarter-widths left each list swimming in ~160px of dead space, and giving
   the brand `1fr` closed those gaps but pooled all the slack into one 420px
   void between the brand and the links. Even distribution has no pool to form
   in. Below lg the brand block spans the whole row and the link columns sit
   beneath it, four-up at md and two-by-two on phones.

   Everything visible comes from ROUTES, COLUMNS and SOCIAL_LINKS.
──────────────────────────────────────────────────────────────────────────── */

/** Single source for destinations referenced from more than one place. */
const ROUTES = {
  privacy: "/privacy",
  terms: "/terms",
  /** Pre-launch: the store badges collect signups rather than deep-link. */
  app: "/waitlist",
} as const;

type NavKey = keyof Dictionary["nav"];
type FooterKey = keyof Dictionary["footer"];

/* Labels come from two dictionaries: the shared `nav` namespace (so footer and
   navbar can't drift apart) and `footer` for legal wording. The discriminated
   union keeps both sides type-checked against en.json — a typo or a key missing
   from fr/rw fails the build rather than rendering blank. */
type FooterLink =
  | { ns: "nav"; labelKey: NavKey; href: string; disabled?: true }
  | { ns: "footer"; labelKey: FooterKey; href: string; disabled?: true }
  | { ns: "raw"; label: string; href: string; external: true; icon: ReactNode };

type FooterColumnSpec = {
  headingKey: FooterKey;
  links: readonly FooterLink[];
};

const ICON = "h-[1.15em] w-[1.15em] shrink-0";

/* Live profiles. TikTok is held back until that account exists — TikTokIcon is
   still exported from ./social-icons, so restoring it is one line here. */
const SOCIAL_LINKS: readonly FooterLink[] = [
  {
    ns: "raw",
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61594098683269",
    external: true,
    icon: <FacebookIcon className={ICON} />,
  },
  {
    ns: "raw",
    label: "Instagram",
    href: "https://www.instagram.com/rides.rw/",
    external: true,
    icon: <InstagramIcon className={ICON} />,
  },
];

const COLUMNS: readonly FooterColumnSpec[] = [
  {
    headingKey: "product",
    links: [
      { ns: "nav", labelKey: "howItWorks", href: "/how-it-works", disabled: true },
      { ns: "nav", labelKey: "drivers", href: "/drivers", disabled: true },
    ],
  },
  {
    headingKey: "company",
    links: [
      { ns: "nav", labelKey: "about", href: "/about", disabled: true },
      { ns: "nav", labelKey: "careers", href: "/careers" },
      { ns: "nav", labelKey: "contact", href: "/contact" },
    ],
  },
  /* Legal has its own column rather than trailing Company. `footer.legal` was
     already written and translated in all three locales but never rendered —
     this is the column it was for. */
  {
    headingKey: "legal",
    links: [
      { ns: "footer", labelKey: "privacyPolicy", href: ROUTES.privacy, disabled: true },
      { ns: "footer", labelKey: "termsOfService", href: ROUTES.terms, disabled: true },
    ],
  },
  { headingKey: "follow", links: SOCIAL_LINKS },
];

/* Uppercase letterspaced micro-type — the tagline and the copyright line share
   it. Colour is --muted-foreground (5.10:1 on the white footer) rather than a
   lighter grey, which would land near 3.5:1 and fail AA at this size. */
const MICRO = "text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground";

/* Column headings outrank their own links, the way Uber's footer does it:
   sentence case, semibold, full-contrast ink, a step larger than the list under
   it. The headings used to be MICRO — smaller and lighter than the links they
   introduced — which inverted the hierarchy and read as loose stacks of text
   rather than titled columns. Links drop to a flat 16px for the same reason:
   at the old lg:text-xl they competed with the heading. */
const COLUMN_HEADING = "text-xl font-semibold tracking-[-0.01em] text-foreground";

/* A disabled entry renders as a <span>, not a dead <a>: nothing to click, no tab
   stop, and screen readers don't announce a link that goes nowhere. It keeps
   --muted-foreground (5.10:1) rather than fading further — it still has to be
   readable, it just must not look actionable. */
/* py-2 is a touch target, not decoration: the labels are 20px tall on their
   own, under the 24px WCAG 2.5.8 minimum and nowhere near the 44px Apple /
   48px Android guidance. The list's space-y drops by the same amount so the
   rhythm on screen is unchanged — the hit areas simply meet. */
const LINK_BASE = "inline-flex items-center gap-2.5 py-2 text-base leading-tight";
const LINK_LIVE = `${LINK_BASE} text-footer-link transition-colors hover:text-footer-link-hover`;
const LINK_DISABLED = `${LINK_BASE} cursor-default text-muted-foreground`;

// ── Pieces ───────────────────────────────────────────────────────────────────

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: readonly {
    label: string;
    href: string;
    external?: boolean;
    icon?: ReactNode;
    disabled?: boolean;
  }[];
}) {
  return (
    <div>
      <p className={COLUMN_HEADING}>{heading}</p>
      <ul className="mt-6 space-y-1">
        {links.map((link) => {
          const body = (
            <>
              {link.icon}
              {link.label}
            </>
          );
          return (
            <li key={link.label}>
              {link.disabled ? (
                <span className={LINK_DISABLED}>{body}</span>
              ) : link.external ? (
                <a href={link.href} target="_blank" rel="noreferrer" className={LINK_LIVE}>
                  {body}
                </a>
              ) : (
                <Link href={link.href} className={LINK_LIVE}>
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
  const th = useTranslations("hero");

  const resolve = (link: FooterLink) => {
    if (link.ns === "raw")
      return { label: link.label, href: link.href, external: true, icon: link.icon };
    const label = link.ns === "nav" ? t(link.labelKey) : tf(link.labelKey);
    return { label, href: link.href, disabled: link.disabled };
  };

  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-border bg-card">
      <div className="relative mx-auto max-w-7xl px-6 pt-14 lg:pt-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:grid-cols-[repeat(5,auto)] lg:justify-between lg:gap-y-8">
          {/* ── Brand ── */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <RidesWordmark className="text-3xl" />
            </Link>
            <p className={`mt-4 max-w-xs ${MICRO}`}>{tf("quote")}</p>

            {/* Replaces the old "Download App" text link — the badges are the
                clearer call to action and carry the platform marks. Brand blue, matching the hero. */}
            <StoreBadges
              className="mt-6"
              href={ROUTES.app}
              appStoreEyebrow={th("appStoreEyebrow")}
              appStoreLabel={th("appStoreLabel")}
              googlePlayEyebrow={th("googlePlayEyebrow")}
              googlePlayLabel={th("googlePlayLabel")}
            />
          </div>

          {/* ── Link columns ── */}
          {COLUMNS.map((column) => (
            <FooterColumn
              key={column.headingKey}
              heading={tf(column.headingKey)}
              links={column.links.map(resolve)}
            />
          ))}
        </div>

        {/* Centred base line. No rule above it — the whitespace under the
            columns does the separating on its own. */}
        <p className={`mt-14 text-center lg:mt-16 ${MICRO}`}>
          © {year} Rides. {tf("rightsReserved")}
        </p>

        {/* Clears the fixed chat button (bottom-6 + h-16 = an 88px zone) so the
            copyright is never sitting underneath it at the bottom of a phone
            screen. Desktop has room to spare and keeps the smaller gap. */}
        <div className="h-24 lg:h-14" />
      </div>
    </footer>
  );
}
