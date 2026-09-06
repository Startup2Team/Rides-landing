"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "./landing/reveal";
import { useSection, useTranslations } from "../i18n/context";

/* ────────────────────────────────────────────────────────────────────────────
   "How it works" — five steps, told in words.

   This section used to render five full phone mockups: device frame, iOS status
   bar, and a working simulation of each screen, the fare-agreement one included
   with worked figures. Removed at the client's direction — it published the
   product's core mechanic, its price points and its screen designs to anyone
   who opened the page.

   The `howItWorks.ui` strings that fed those screens are gone from the locale
   files too. Leaving them would have kept every label readable in the shipped
   JS bundle, which would have defeated the point: copy is bundled whether or
   not it is rendered. For the same reason this comment describes what was
   removed rather than quoting it.

   If the screens ever come back, they belong behind something that isn't
   public: a demo build, or a video on a page that requires a sign-in.
──────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { id: "step-1", num: "01" },
  { id: "step-2", num: "02" },
  { id: "step-3", num: "03" },
  { id: "step-4", num: "04" },
  { id: "step-5", num: "05" },
] as const;

const ICON = "h-7 w-7";
const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: ICON,
  "aria-hidden": true,
} as const;

/* One mark per step: request, match, fare, journey, rating. Deliberately
   generic — they illustrate the stage, they do not depict the interface. */
const STEP_ICONS = [
  <svg key="1" {...ICON_PROPS}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>,
  <svg key="2" {...ICON_PROPS}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </svg>,
  <svg key="3" {...ICON_PROPS}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>,
  <svg key="4" {...ICON_PROPS}>
    <path d="m3 11 18-8-8 18-2-8-8-2z" />
  </svg>,
  <svg key="5" {...ICON_PROPS}>
    <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6.1L12 16.8 6.6 19.7l1.2-6.1L3.3 9.4l6.1-.8L12 3z" />
  </svg>,
];

export default function HowItWorks() {
  const h = useSection("howItWorks");
  const tc = useTranslations("common");
  const tw = useTranslations("waitlist");
  const th = useTranslations("hero");
  const [activeStep, setActiveStep] = useState(0);

  // Track which step is closest to the viewport top while scrolling.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-step"));
            if (!Number.isNaN(idx)) setActiveStep(idx);
          }
        });
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );

    const els = document.querySelectorAll<HTMLElement>("[data-step]");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* ── Left: the pitch, held in place while the steps scroll past ── */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              {/* Leading rule only — the trailing one reads as a stray dash
                  once the eyebrow is left-aligned. Matches the FAQ intro. */}
              <div className="inline-flex items-center gap-2.5 type-eyebrow">
                <span className="h-px w-8 bg-foreground/30" />
                {h.eyebrow}
              </div>
              <h1 className="mt-5 type-section-title">{h.heading}</h1>
              <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground lg:text-[1.0625rem]">
                {h.intro}
              </p>

              {/* Sticky on phones, where it is the only way to skip ahead;
                  static on desktop because the whole column already is. */}
              <div className="sticky top-20 z-30 mt-8 flex lg:static">
                <nav
                  aria-label="Steps"
                  className="flex gap-1 rounded-full border border-border bg-card/85 p-1.5 shadow-lg backdrop-blur-xl"
                >
                  {STEPS.map((s, i) => {
                    const isActive = activeStep === i;
                    return (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        aria-label={`Jump to step ${i + 1}`}
                        aria-current={isActive ? "step" : undefined}
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold tabular-nums transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:bg-surface hover:text-foreground"
                        }`}
                      >
                        {s.num}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* The page carried no imagery at all once the app mockups came
                  out, which is most of why it read flat. This is the one photo
                  in the library that shows the product being used without
                  showing the product's interface. Portrait on desktop where the
                  column is narrow, letterboxed above it where it is full width. */}
              <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-3xl ring-1 ring-border sm:aspect-[2/1] lg:aspect-[4/5]">
                <Image
                  src="/images/about-hero.webp"
                  alt={tc("rideHeroAlt")}
                  width={1200}
                  height={1200}
                  sizes="(min-width: 1024px) 24rem, 100vw"
                  className="h-full w-full object-cover"
                />
                {/* Grounds the photo against the page rather than letting it
                    float as a bright rectangle. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent"
                />
              </div>
            </div>
          </div>

          {/* ── Right: the steps, strung on a rail ── */}
          <div className="relative lg:col-span-8">
            {/* The rail runs through the centre of the 3.5rem markers, fading
                out at the bottom so it reads as a path rather than a border. */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-10 left-7 top-10 w-px bg-border"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-7 top-10 w-px bg-primary transition-[height] duration-500 ease-out motion-reduce:transition-none"
              style={{
                height: `calc((100% - 5rem) * ${(activeStep + 1) / STEPS.length})`,
              }}
            />

            <div className="space-y-5">
              {h.steps.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <div key={STEPS[i].id} id={STEPS[i].id} data-step={i} className="scroll-mt-32">
                    <Reveal
                      delay={i * 60}
                      className="relative flex items-start gap-4 sm:gap-6"
                    >
                    <div
                      className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition-all motion-reduce:transition-none ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "border-border bg-card text-primary shadow-sm"
                      }`}
                    >
                      {STEP_ICONS[i]}
                    </div>

                    <div className="group relative flex-1 overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7">
                      {/* Ghost numeral. Purely texture — the real label is the
                          eyebrow below, which screen readers actually get. */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -top-3 right-1 text-7xl font-bold tabular-nums leading-none text-foreground/[0.045] sm:text-8xl"
                      >
                        {STEPS[i].num}
                      </span>
                      <p className="type-eyebrow text-primary-text">
                        {h.stepLabel} {STEPS[i].num}
                      </p>
                      <h2 className="mt-3 type-card-title">{step.title}</h2>
                      {/* Capped measure: the card gives the text ~643px, which
                          at 16px runs to roughly 80 characters a line — past the
                          60–75 range that reads comfortably. */}
                      <p className="mt-3 max-w-[62ch] text-pretty text-base leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                      </div>
                    </Reveal>
                  </div>
                );
              })}
            </div>

            {/* Closing CTA. Both strings already exist and are translated, so
                this adds no new copy to maintain. */}
            <div className="ml-[4.5rem] mt-8 rounded-3xl border border-primary/30 bg-primary/[0.04] p-6 sm:ml-20 sm:p-7">
              <p className="text-pretty text-base leading-relaxed text-foreground">
                {tw("subheading")}
              </p>
              <Link
                href="/waitlist"
                className="mt-5 inline-flex h-12 items-center rounded-full bg-primary-strong px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:bg-foreground active:scale-[0.98]"
              >
                {th("waitlistCta")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
