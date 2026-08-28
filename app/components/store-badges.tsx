"use client";

import Link from "next/link";
import { useId } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   App Store / Google Play download badges.

   Previously inlined three times (hero, and twice on /drivers) with hand-copied
   SVGs. Two of those copies hard-coded the same gradient element IDs, so
   rendering both on one page would have made the second badge reference the
   first one's gradients.  useId() gives every instance its own namespace.

   The Google Play mark's colours are deliberately NOT design tokens: it is a
   third-party brand asset and must not shift when the Rides palette does.
   Centralising them here is the point — one place, clearly labelled.
──────────────────────────────────────────────────────────────────────────── */

const GOOGLE_PLAY_BRAND = {
  topFrom: "#00d4ff",
  topTo: "#0066ff",
  bottomFrom: "#ff3b30",
  bottomTo: "#ffcc00",
  green: "#00f078",
  yellow: "#ffce00",
} as const;

function AppStoreGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 fill-current">
      <path d="M17.05 12.5c-.03-2.94 2.4-4.36 2.51-4.43-1.37-2-3.5-2.27-4.25-2.3-1.81-.18-3.53 1.07-4.45 1.07-.93 0-2.34-1.04-3.85-1.01-1.98.03-3.81 1.15-4.83 2.92-2.06 3.58-.53 8.86 1.48 11.76 1 1.42 2.18 3.01 3.74 2.95 1.5-.06 2.07-.97 3.89-.97s2.34.97 3.93.94c1.62-.03 2.65-1.45 3.65-2.88 1.15-1.65 1.62-3.25 1.65-3.33-.04-.02-3.16-1.21-3.19-4.72z M14.45 4.07c.83-1 1.39-2.4 1.23-3.78-1.19.05-2.63.79-3.48 1.79-.77.89-1.44 2.31-1.26 3.67 1.32.1 2.68-.67 3.51-1.68z" />
    </svg>
  );
}

function GooglePlayGlyph() {
  // Scoped so two badges on the same page cannot collide.
  const uid = useId().replace(/:/g, "");
  const topId = `${uid}-gp-top`;
  const bottomId = `${uid}-gp-bottom`;
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6">
      <defs>
        <linearGradient id={topId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={GOOGLE_PLAY_BRAND.topFrom} />
          <stop offset="1" stopColor={GOOGLE_PLAY_BRAND.topTo} />
        </linearGradient>
        <linearGradient id={bottomId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={GOOGLE_PLAY_BRAND.bottomFrom} />
          <stop offset="1" stopColor={GOOGLE_PLAY_BRAND.bottomTo} />
        </linearGradient>
      </defs>
      <path d="M3.6 1.8 14 12 3.6 22.2c-.4-.3-.6-.8-.6-1.4V3.2c0-.6.2-1.1.6-1.4z" fill={`url(#${topId})`} />
      <path d="M14 12 3.6 1.8c.3-.2.7-.3 1.1-.2L17.1 8 14 12z" fill={GOOGLE_PLAY_BRAND.green} />
      <path d="M14 12l3.1 4L4.7 22.4c-.4.1-.8 0-1.1-.2L14 12z" fill={`url(#${bottomId})`} />
      <path d="m17.1 8 4 2.3c.9.5.9 1.9 0 2.4L17.1 16 14 12l3.1-4z" fill={GOOGLE_PLAY_BRAND.yellow} />
    </svg>
  );
}

/** `primary` = blue fill on light sections. `inverse` = ink fill, used where the
 *  section already carries the blue. */
type Variant = "primary" | "inverse";

const VARIANT: Record<Variant, { shell: string; eyebrow: string }> = {
  primary: {
    shell:
      "bg-primary-strong text-primary-foreground shadow-lg shadow-primary/25 hover:bg-foreground hover:text-background",
    eyebrow: "opacity-90",
  },
  inverse: {
    shell:
      "bg-foreground text-background hover:bg-primary-strong hover:text-primary-foreground",
    eyebrow: "opacity-70",
  },
};

const SHELL =
  "inline-flex h-[3.25rem] items-center gap-2.5 rounded-2xl px-5 transition-all hover:scale-[1.02] active:scale-[0.98]";

function Badge({
  href,
  eyebrow,
  label,
  variant,
  children,
}: {
  href: string;
  eyebrow: string;
  label: string;
  variant: Variant;
  children: React.ReactNode;
}) {
  const v = VARIANT[variant];
  return (
    <Link href={href} aria-label={`${eyebrow} ${label}`} className={`${SHELL} ${v.shell}`}>
      {children}
      <span className="flex flex-col leading-none">
        <span className={`text-[9.5px] tracking-[0.04em] ${v.eyebrow}`}>{eyebrow}</span>
        <span className="mt-0.5 text-[15px] font-semibold tracking-[-0.01em]">{label}</span>
      </span>
    </Link>
  );
}

export type StoreBadgesProps = {
  appStoreEyebrow: string;
  appStoreLabel: string;
  googlePlayEyebrow: string;
  googlePlayLabel: string;
  href?: string;
  variant?: Variant;
  className?: string;
};

export function StoreBadges({
  appStoreEyebrow,
  appStoreLabel,
  googlePlayEyebrow,
  googlePlayLabel,
  href = "#download",
  variant = "primary",
  className = "",
}: StoreBadgesProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Badge href={href} eyebrow={appStoreEyebrow} label={appStoreLabel} variant={variant}>
        <AppStoreGlyph />
      </Badge>
      <Badge href={href} eyebrow={googlePlayEyebrow} label={googlePlayLabel} variant={variant}>
        <GooglePlayGlyph />
      </Badge>
    </div>
  );
}
