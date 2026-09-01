"use client";

import { useId } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   Social platform marks, in their official brand colours.

   Like the Google Play mark in store-badges.tsx, these are deliberately NOT
   design tokens: they are third-party brand assets and must not shift when the
   Rides palette does. Centralising them here — one place, clearly labelled — is
   the point.

   These are drawn for a light surface. The footer is always `bg-card` (white),
   so TikTok's black note layer is safe; if the footer ever gains a dark
   variant that layer inverts to white per TikTok's brand guidance, while
   Instagram keeps its gradient.
──────────────────────────────────────────────────────────────────────────── */

const BRAND = {
  /** Instagram's gradient, warm bottom-left to violet top-right. */
  instagram: [
    { offset: "0", color: "#feda75" },
    { offset: "0.25", color: "#fa7e1e" },
    { offset: "0.5", color: "#d62976" },
    { offset: "0.75", color: "#962fbf" },
    { offset: "1", color: "#4f5bd5" },
  ],
  /** TikTok's chromatic-offset mark: cyan and red layers behind a black note. */
  tiktok: { cyan: "#25f4ee", red: "#fe2c55", ink: "#000000" },
  /** Facebook blue. The "f" is knocked out of the disc, so it takes the
      colour of whatever sits behind it — white, on this footer. */
  facebook: "#1877f2",
} as const;

/** The TikTok note, drawn once and stamped three times for the offset effect. */
const TIKTOK_NOTE =
  "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.6c.27 0 .53.04.78.12V9.66a5.7 5.7 0 1 0 4.9 5.64V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.35 4.35 0 0 1-3.24-1.48z";

type IconProps = { className?: string };

export function InstagramIcon({ className = "" }: IconProps) {
  // Scoped so several instances on one page cannot collide.
  const uid = useId().replace(/:/g, "");
  const gid = `${uid}-ig`;
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden focusable="false">
      <defs>
        <radialGradient id={gid} cx="0.3" cy="1" r="1.15">
          {BRAND.instagram.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </radialGradient>
      </defs>
      <g stroke={`url(#${gid})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
      </g>
      <circle cx="17.5" cy="6.5" r="1.15" fill={`url(#${gid})`} />
    </svg>
  );
}

export function FacebookIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={BRAND.facebook} aria-hidden focusable="false">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function TikTokIcon({ className = "" }: IconProps) {
  // The mark is one note stamped three times: cyan up-left, red down-right,
  // black on top. Offsets are kept small so it still resolves at ~20px.
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden focusable="false">
      <path d={TIKTOK_NOTE} fill={BRAND.tiktok.cyan} transform="translate(-1.1 -0.9)" />
      <path d={TIKTOK_NOTE} fill={BRAND.tiktok.red} transform="translate(1.1 0.9)" />
      <path d={TIKTOK_NOTE} fill={BRAND.tiktok.ink} />
    </svg>
  );
}
