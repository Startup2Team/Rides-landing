"use client";

import Link from "next/link";
import { useSection, useTranslations } from "../i18n/context";

/* ────────────────────────────────────────────────────────────────────────────
   A directory of destinations the footer cannot reach.

   The footer already covers every top-level page — /how-it-works, /drivers,
   /about, /contact, /privacy, /terms, and /waitlist through its store badges.
   Repeating those here would be two components competing to do one job, so
   this block deliberately links only *inside* those pages:

     · the five #step-N anchors on /how-it-works
     · #requirements on /drivers
     · #features on the home page

   That makes it task-level navigation ("Confirm your fare") against the
   footer's page-level navigation ("How It Works") — which is also how the
   large transport sites split the two.

   Step titles come straight from howItWorks.steps[], so this list cannot drift
   from the steps it points at, and it is already translated in all three
   locales.
──────────────────────────────────────────────────────────────────────────── */

/** Indices into howItWorks.steps[] — the anchors are #step-1 … #step-5. */
const BOOKING_STEPS = [0, 1, 2] as const;
const TRIP_STEPS = [3, 4] as const;

/* Every destination here is held back until its page is signed off. Same
   convention as the footer: a disabled entry renders as a <span> — nothing to
   click, no tab stop, no link announced to screen readers — and drops the
   underline so it does not promise a destination it will not deliver. Flip a
   single entry's `disabled` to re-enable it; the pages themselves are live. */
/* py-1.5 is a touch target, not decoration: a 16px label is ~20px tall, under
   the 24px WCAG 2.5.8 minimum. The list's space-y drops by the same amount so
   the rhythm on screen is unchanged — the hit areas simply meet. */
const LINK_BASE = "inline-block py-1.5 text-base leading-snug sm:text-lg lg:text-xl";
const LINK_LIVE = `${LINK_BASE} text-footer-link underline decoration-1 underline-offset-[6px] transition-colors hover:text-footer-link-hover`;
const LINK_DISABLED = `${LINK_BASE} cursor-default text-muted-foreground`;

export default function Explore() {
  const tx = useTranslations("explore");
  const tn = useTranslations("nav");
  const how = useSection("howItWorks");

  const step = (i: number) => ({
    label: how.steps[i].title,
    href: `/how-it-works#step-${i + 1}`,
    disabled: true,
  });

  const groups = [
    { heading: tx("ridersHeading"), links: BOOKING_STEPS.map(step) },
    { heading: tx("tripHeading"), links: TRIP_STEPS.map(step) },
    {
      heading: tx("offerHeading"),
      links: [{ label: tn("features"), href: "/#features", disabled: true }],
    },
    {
      heading: tx("driversHeading"),
      links: [{ label: tx("requirements"), href: "/drivers#requirements", disabled: true }],
    },
  ];

  return (
    <section className="py-12 sm:py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-14 lg:gap-y-20">
          {groups.map((group) => (
            <div key={group.heading}>
              <h2 className="text-xl font-bold tracking-[-0.02em] text-heading sm:text-2xl lg:text-[1.75rem]">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.disabled ? (
                      <span className={LINK_DISABLED}>{link.label}</span>
                    ) : (
                      <Link href={link.href} className={LINK_LIVE}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
