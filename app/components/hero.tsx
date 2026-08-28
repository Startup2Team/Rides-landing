"use client";

import Link from "next/link";
import { IphoneMockup } from "./iphone-mockup";
import { RiderScreen, DriverScreen } from "./phone-screens";
import { useTranslations } from "../i18n/context";
import { StoreBadges } from "./store-badges";

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Hero() {
  const t = useTranslations("hero");
  return (
    <section className="relative flex h-[calc(100svh-4rem)] items-center overflow-hidden sm:h-[calc(100svh-5rem)]">
      {/* Real Kigali street map background — fades out at edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/images/hero-map.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.4,
          filter: "grayscale(100%) brightness(1.06) contrast(0.95)",
          maskImage:
            "radial-gradient(ellipse 85% 85% at center, black 25%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 85% at center, black 25%, transparent 95%)",
        }}
      />

      {/* Animated trip routes — 8 staggered locations, lines only */}
      <style>{`
        @keyframes trip-draw {
          0%      { opacity: 1; stroke-dashoffset: 1; }
          12.5%   { opacity: 1; stroke-dashoffset: 0; }
          18.75%  { opacity: 1; stroke-dashoffset: 0; }
          25%     { opacity: 0; stroke-dashoffset: 0; }
          100%    { opacity: 0; stroke-dashoffset: 0; }
        }
        .trip-route {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          opacity: 0;
          animation: trip-draw 16s ease-in-out infinite;
        }
        .trip-1 { animation-delay: 0s; }
        .trip-2 { animation-delay: 2s; }
        .trip-3 { animation-delay: 4s; }
        .trip-4 { animation-delay: 6s; }
        .trip-5 { animation-delay: 8s; }
        .trip-6 { animation-delay: 10s; }
        .trip-7 { animation-delay: 12s; }
        .trip-8 { animation-delay: 14s; }
        @media (prefers-reduced-motion: reduce) {
          .trip-route {
            animation: none;
            opacity: 0.6;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
      <svg
        aria-hidden
        viewBox="0 0 1024 512"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <g
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="text-primary/60"
        >
          {/* Route 1 — unclassified, top-mid */}
          <path
            d="M 428 265 L 433 263 L 436 259 L 436 254 L 435 249 L 439 242 L 440 235 L 441 227 L 441 219 L 439 214 L 435 211 L 429 208 L 424 205 L 417 204 L 411 196 L 409 191 L 404 187 L 399 182 L 394 180 L 387 174 L 382 171 L 375 168 L 368 165 L 364 163 L 361 155 L 358 146 L 355 142 L 354 140"
            pathLength="1"
            className="trip-route trip-1"
          />
          {/* Route 2 — unclassified, mid-low */}
          <path
            d="M 472 369 L 467 373 L 462 377 L 457 381 L 451 383 L 446 384 L 440 385 L 435 386 L 429 387 L 424 389 L 419 391 L 413 396 L 409 399 L 406 404 L 399 410 L 394 413 L 389 417 L 383 420 L 378 420 L 371 417 L 366 415 L 360 413 L 354 410 L 349 408 L 343 410 L 340 415 L 335 419 L 329 424 L 327 425"
            pathLength="1"
            className="trip-route trip-2"
          />
          {/* Route 3 — unclassified, top-left diagonal */}
          <path
            d="M 198 152 L 204 159 L 211 164 L 215 168 L 220 172 L 225 176 L 229 180 L 234 185 L 247 193 L 256 197 L 260 202 L 264 207 L 267 214 L 270 219 L 274 227 L 278 236 L 280 241 L 282 246 L 288 252 L 292 255 L 299 263"
            pathLength="1"
            className="trip-route trip-3"
          />
          {/* Route 4 — secondary, bottom horizontal */}
          <path
            d="M 181 390 L 188 393 L 197 396 L 205 399 L 212 401 L 222 404 L 230 407 L 241 408 L 248 409 L 254 411 L 261 414 L 270 416 L 279 419 L 284 420 L 289 423 L 295 424 L 302 423 L 311 427 L 317 429 L 322 430"
            pathLength="1"
            className="trip-route trip-4"
          />
          {/* Route 5 — top-mid vertical */}
          <path
            d="M 437 107 L 437 99 L 437 94 L 435 88 L 430 81 L 427 77 L 419 69 L 413 65 L 407 59 L 401 55 L 394 54 L 388 54 L 383 51 L 377 48 L 372 47"
            pathLength="1"
            className="trip-route trip-5"
          />
          {/* Route 6 — top-mid winding */}
          <path
            d="M 505 182 L 500 179 L 490 170 L 481 161 L 477 155 L 473 152 L 465 144 L 459 142 L 454 139 L 452 134 L 447 132 L 441 128 L 437 123 L 438 118 L 442 113 L 438 107 L 437 107"
            pathLength="1"
            className="trip-route trip-6"
          />
          {/* Route 7 — mid-right short bend */}
          <path
            d="M 471 367 L 474 363 L 479 357 L 483 353 L 483 347 L 479 337 L 475 326 L 473 319 L 467 318 L 463 320 L 459 325 L 457 330"
            pathLength="1"
            className="trip-route trip-7"
          />
          {/* Route 8 — short mid vertical */}
          <path
            d="M 504 182 L 506 193 L 508 198 L 512 207 L 513 212 L 513 218 L 513 225 L 513 231 L 515 237 L 516 242"
            pathLength="1"
            className="trip-route trip-8"
          />
        </g>
      </svg>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-[6fr_5fr] lg:gap-12 lg:py-0">
        {/* ── Left: copy column ── */}
        <div className="max-w-2xl">
          {/* Headline — SF Pro Display proportions: Semibold (not Bold), -0.022em tracking, ~1.07 leading */}
          <h1
            className="hero-rise type-display"
            style={{ animationDelay: "80ms" }}
          >
            {t("headlineLine1")}<br />
            {t("headlineLine2")}
          </h1>

          {/* Sub — Shortened Corporate Mission Statement */}
          <p
            className="hero-rise mt-6 max-w-xl text-pretty text-[1.0625rem] font-normal leading-[1.6] text-muted-foreground lg:text-[1.125rem]"
            style={{ animationDelay: "160ms" }}
          >
            {t("subheadline")}
          </p>

          {/* CTAs — store badges (primary) + text link (secondary). Apple pairs filled CTA with a "Learn more ›" link. */}
          <div
            className="hero-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <StoreBadges
              appStoreEyebrow={t("appStoreEyebrow")}
              appStoreLabel={t("appStoreLabel")}
              googlePlayEyebrow={t("googlePlayEyebrow")}
              googlePlayLabel={t("googlePlayLabel")}
              href="/waitlist"
            />
          </div>

          {/* Waitlist CTA — not live in every area yet; the shareable pre-launch signup link. */}
          <div
            className="hero-rise mt-4"
            style={{ animationDelay: "280ms" }}
          >
            <Link
              href="/waitlist"
              className="inline-flex h-12 items-center gap-2 rounded-2xl border-2 border-foreground/15 px-5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary-text active:scale-[0.98]"
            >
              {t("waitlistCta")}
              <ArrowRightIcon />
            </Link>
          </div>

        </div>

        {/* ── Right: dual iPhone 16 Pro mockups (driver + rider) ── */}
        <div
          className="hero-rise relative hidden lg:flex lg:items-center lg:justify-center"
          style={{ animationDelay: "320ms" }}
        >
          {/* Two phones side-by-side, tilted toward each other, overlapping */}
          <div className="relative flex items-center">
            <IphoneMockup
              label="Driver"
              tiltDeg={22}
              floatDelay="0s"
              className="relative z-10"
            >
              <DriverScreen />
            </IphoneMockup>
            <IphoneMockup
              label="Rider"
              tiltDeg={-22}
              floatDelay="-2.5s"
              className="relative z-20 -ml-20"
            >
              <RiderScreen />
            </IphoneMockup>
          </div>
        </div>
      </div>
    </section>
  );
}
