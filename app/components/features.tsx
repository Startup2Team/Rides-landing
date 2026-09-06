"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useSection, useTranslations } from "../i18n/context";

// ── Shared claymorphism filter / gradient defs ────────────────────────────────
//
// Every colour here resolves to an --art-* component token in globals.css.
// `var()` is unreliable inside SVG presentation attributes, so the tokens are
// applied through `style` (a real CSS declaration block) instead.

const artFace = {
  from: { stopColor: "var(--art-face-from)" },
  mid: { stopColor: "var(--art-face-mid)" },
  to: { stopColor: "var(--art-face-to)" },
} as const;

const artHighlight = { stopColor: "var(--art-highlight)" } as const;
const artRim = {
  from: { stopColor: "var(--art-rim-from)" },
  to: { stopColor: "var(--art-rim-to)" },
} as const;

const stroke = {
  line: { stroke: "var(--art-line)" },
  soft: { stroke: "var(--art-line-soft)" },
} as const;

const fill = {
  screen: { fill: "var(--art-screen)" },
  line: { fill: "var(--art-line)" },
  chip: { fill: "var(--art-chip)" },
  glyph: { fill: "var(--art-glyph)" },
  highlight: { fill: "var(--art-highlight)" },
  faceFrom: { fill: "var(--art-face-from)" },
} as const;

function ClayDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-base`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={artFace.from} />
        <stop offset="0.55" style={artFace.mid} />
        <stop offset="1" style={artFace.to} />
      </linearGradient>
      <radialGradient id={`${id}-hi`} cx="0.35" cy="0.3" r="0.55">
        <stop offset="0" style={artHighlight} stopOpacity="0.9" />
        <stop offset="1" style={artHighlight} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={artRim.from} />
        <stop offset="1" style={artRim.to} />
      </linearGradient>
      <filter id={`${id}-soft`} x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#000" floodOpacity="0.18" />
      </filter>
    </defs>
  );
}

// ── Illustrations ────────────────────────────────────────────────────────────

function LiveTrackingArt() {
  const id = "art-lt";
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
      <ClayDefs id={id} />
      {/* Ground pulse ovals */}
      <ellipse cx="120" cy="186" rx="80" ry="14" fill="none" style={stroke.soft} strokeWidth="1" opacity="0.55" />
      <ellipse cx="120" cy="186" rx="52" ry="9" fill="none" style={stroke.line} strokeWidth="1" opacity="0.65" />
      {/* Dotted route */}
      <path d="M 22 220 Q 80 178 130 195 T 220 152" fill="none" style={stroke.line} strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" opacity="0.6" />
      {/* Pin */}
      <g filter={`url(#${id}-soft)`}>
        <path d="M120 50 C 92 50 70 72 70 100 C 70 142 120 192 120 192 C 120 192 170 142 170 100 C 170 72 148 50 120 50 Z" fill={`url(#${id}-base)`} />
        <path d="M120 50 C 92 50 70 72 70 100 C 70 142 120 192 120 192 C 120 192 170 142 170 100 C 170 72 148 50 120 50 Z" fill={`url(#${id}-hi)`} opacity="0.55" />
        <circle cx="120" cy="100" r="20" fill={`url(#${id}-rim)`} />
        <circle cx="120" cy="100" r="20" fill={`url(#${id}-hi)`} opacity="0.55" />
      </g>
    </svg>
  );
}

function NegotiateArt() {
  const id = "art-ng";
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
      <ClayDefs id={id} />
      {/* Back coin */}
      <g filter={`url(#${id}-soft)`} transform="translate(56 64) rotate(-14 60 60)">
        <ellipse cx="60" cy="60" rx="55" ry="55" fill={`url(#${id}-base)`} />
        <ellipse cx="60" cy="60" rx="55" ry="55" fill={`url(#${id}-hi)`} opacity="0.6" />
        <ellipse cx="60" cy="60" rx="38" ry="38" fill="none" style={stroke.line} strokeWidth="2" opacity="0.55" />
      </g>
      {/* Front coin */}
      <g filter={`url(#${id}-soft)`} transform="translate(104 100) rotate(10 60 60)">
        <ellipse cx="60" cy="60" rx="60" ry="60" fill={`url(#${id}-base)`} />
        <ellipse cx="60" cy="60" rx="60" ry="60" fill={`url(#${id}-hi)`} opacity="0.7" />
        <text x="60" y="72" textAnchor="middle" fontSize="34" fontWeight="800" style={fill.glyph}>₣</text>
      </g>
    </svg>
  );
}

function PayArt() {
  const id = "art-pay";
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden>
      <ClayDefs id={id} />
      <g filter={`url(#${id}-soft)`} transform="translate(80 32) rotate(-5 40 88)">
        <rect x="0" y="0" width="80" height="176" rx="16" fill={`url(#${id}-base)`} />
        <rect x="0" y="0" width="80" height="176" rx="16" fill={`url(#${id}-hi)`} opacity="0.55" />
        <rect x="6" y="14" width="68" height="148" rx="8" style={fill.screen} />
        <rect x="14" y="22" width="50" height="3" rx="1.5" style={fill.line} opacity="0.7" />
        <rect x="14" y="36" width="50" height="6" rx="3" style={fill.chip} />
        <rect x="14" y="48" width="36" height="4" rx="2" style={fill.line} />
        <circle cx="40" cy="92" r="22" style={fill.highlight} />
        <circle cx="40" cy="92" r="22" fill={`url(#${id}-hi)`} opacity="0.7" />
        <text x="40" y="100" textAnchor="middle" fontSize="20" fontWeight="800" style={fill.glyph}>$</text>
        <rect x="14" y="128" width="50" height="20" rx="10" style={fill.chip} />
        <text x="39" y="142" textAnchor="middle" fontSize="9" fontWeight="700" style={fill.faceFrom}>PAY</text>
      </g>
    </svg>
  );
}

/* The five vehicle types the app dispatches, as photographs.

   Alt text is deliberately borrowed from the `waitlist` namespace: it already
   names every vehicle in all three locales ("Moto (motorcycle taxi)", "Rifani
   (tuk-tuk)"…), so reusing it beats duplicating the same nouns into `features`
   and letting the two drift.

   Dimensions are the real asset sizes so next/image reserves the right box and
   builds a correct srcset instead of guessing. */
const VEHICLES = [
  { src: "/images/vehicles/moto.png", w: 655, h: 653, key: "vehicleMoto" },
  { src: "/images/vehicles/rifani.png", w: 450, h: 288, key: "vehicleRifani" },
  { src: "/images/vehicles/cab.png", w: 258, h: 199, key: "vehicleCab" },
  { src: "/images/vehicles/hilux.png", w: 355, h: 166, key: "vehicleHilux" },
  { src: "/images/vehicles/fuso.png", w: 474, h: 269, key: "vehicleFuso" },
] as const;

function MultiModalArt({ size = "lg" }: { size?: "lg" | "sm" }) {
  const tv = useTranslations("waitlist");
  const gap = size === "lg" ? "gap-3 sm:gap-4" : "gap-2";
  return (
    <div className={`grid grid-cols-6 ${gap}`}>
      {VEHICLES.map((v, i) => (
        <div
          key={v.src}
          /* Six columns so both rows fill the width evenly: three across the
             top at two columns each, two along the bottom at three each. No
             tile behind them — a cut-out photograph already reads as an object,
             so a surface would only add a frame. */
          className={i < 3 ? "col-span-2" : "col-span-3"}
        >
          <Image
            src={v.src}
            alt={tv(v.key)}
            width={v.w}
            height={v.h}
            sizes="(min-width: 1024px) 200px, 160px"
            className="vehicle-art h-full w-full object-contain"
          />
        </div>
      ))}
    </div>
  );
}

// ── Reusable atoms ───────────────────────────────────────────────────────────

function Badge({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 type-badge">
      <span className="h-px w-6 bg-muted-foreground/40" />
      {children}
    </p>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Features() {
  const f = useSection("features");
  return (
    <section id="features" className="relative py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Intro */}
        <div className="max-w-2xl">
          <p className="type-eyebrow">{f.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-0.02em] text-heading sm:text-4xl lg:text-5xl">
            {f.heading}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg">
            {f.intro}
          </p>
        </div>

        {/* Bento grid */}
        <div className="features-bento mt-10">

          {/* LARGE — Multi-modal (tall left card, illustration anchored top, copy at bottom) */}
          <article
            data-area="large"
            className="group relative flex min-h-[22rem] flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 sm:p-7 lg:min-h-[24rem] lg:p-8"
          >
            {/* Illustration anchored TOP — sits in the upper portion */}
            <div className="flex items-start justify-center pb-4">
              <div className="w-full">
                <MultiModalArt size="lg" />
              </div>
            </div>
            {/* Spacer pushes copy to the bottom for that tall-breathing-room feel */}
            <div className="flex-1" />
            {/* Copy anchored BOTTOM */}
            <div>
              <Badge>{f.multiModalBadge}</Badge>
              <h3 className="mt-3 text-balance text-3xl font-bold leading-[1.05] tracking-[-0.02em] text-heading sm:text-4xl lg:text-[2.5rem]">
                {f.multiModalHeading}
              </h3>
              <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                {f.multiModalBody}
              </p>
            </div>
          </article>

          {/* WIDE — Live tracking (top right, copy left, large illustration right) */}
          <article
            data-area="wide"
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 sm:p-7"
          >
            <div className="grid h-full gap-6 sm:grid-cols-[1.1fr_1fr] sm:items-center">
              <div className="flex flex-col">
                <Badge>{f.trackingBadge}</Badge>
                <h3 className="mt-3 text-balance text-2xl font-bold leading-[1.1] tracking-[-0.02em] text-heading sm:text-3xl lg:text-[2rem]">
                  {f.trackingHeading}
                </h3>
                <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {f.trackingBody}
                </p>
              </div>
              {/* Illustration — sized to the wide-card row height */}
              <div className="relative mx-auto h-44 w-44 sm:h-48 sm:w-48 lg:h-52 lg:w-52">
                <LiveTrackingArt />
              </div>
            </div>
          </article>

          {/* SQ1 — Negotiate (small, horizontal layout matching reference) */}
          <article
            data-area="sq1"
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="grid h-full grid-cols-[1fr_auto] items-center gap-3">
              <div className="flex flex-col">
                <Badge>{f.pricingBadge}</Badge>
                <h3 className="mt-3 text-balance text-xl font-bold leading-[1.1] tracking-[-0.02em] text-heading sm:text-2xl">
                  {f.pricingHeading}
                </h3>
                <p className="mt-2 text-pretty text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {f.pricingBody}
                </p>
              </div>
              <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                <NegotiateArt />
              </div>
            </div>
          </article>

          {/* SQ2 — Pay (small, horizontal layout matching reference) */}
          <article
            data-area="sq2"
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="grid h-full grid-cols-[1fr_auto] items-center gap-3">
              <div className="flex flex-col">
                <Badge>{f.payBadge}</Badge>
                <h3 className="mt-3 text-balance text-xl font-bold leading-[1.1] tracking-[-0.02em] text-heading sm:text-2xl">
                  {f.payHeading}
                </h3>
                <p className="mt-2 text-pretty text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {f.payBody}
                </p>
              </div>
              <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                <PayArt />
              </div>
            </div>
          </article>
        </div>

      </div>
    </section>
  );
}
