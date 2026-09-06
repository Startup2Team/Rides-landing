"use client";

import Image from "next/image";
import Link from "next/link";
import { useSection, useTranslations } from "../../i18n/context";
import { StoreBadges } from "../../components/store-badges";


/* ───────────────────────────────────────────────────────────────────────── */
/* HERO ILLUSTRATION                                                          */
/* ───────────────────────────────────────────────────────────────────────── */

function DriversHeroArt() {
  const common = useSection("common");
  return (
    <div className="relative w-full max-w-[520px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 55%, rgb(16 185 129 / 0.16), transparent 70%)",
        }}
      />
      <Image
        src="/images/drivers-fleet-africa.png"
        alt={common.driversHeroAlt}
        width={1040}
        height={1040}
        priority
        sizes="(max-width: 1024px) 100vw, 520px"
        className="h-auto w-full object-contain"
      />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────── */
/* PAGE                                                                       */
/* ───────────────────────────────────────────────────────────────────────── */

export default function DriversPage() {
  const t = useTranslations("drivers");
  const th = useTranslations("hero");
  const drivers = useSection("drivers");
  const howToApply = drivers.steps.map((s, i) => ({ ...s, n: i + 1 }));

  return (
    <main className="flex-1">
      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100svh-4.25rem)] items-center overflow-hidden py-16 sm:min-h-[calc(100svh-5rem)] lg:py-20">
        {/* Soft tinted background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 30% 50%, rgb(16 185 129 / 0.08), transparent 65%), radial-gradient(ellipse 50% 40% at 75% 50%, rgb(0 122 255 / 0.06), transparent 70%)",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* ── Left: stylized illustration ── */}
          <div className="order-2 flex items-center justify-center lg:order-1">
            <DriversHeroArt />
          </div>

          {/* ── Right: copy + downloads ── */}
          <div className="order-1 text-center lg:order-2 lg:text-left">
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-heading sm:text-5xl lg:text-[3.75rem]">
              {t("heroHeadline")}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground lg:mx-0 lg:text-[1.0625rem]">
              {t("heroSub")}
            </p>

          {/* App Store + Play Store buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <StoreBadges
              appStoreEyebrow={th("appStoreEyebrow")}
              appStoreLabel={th("appStoreLabel")}
              googlePlayEyebrow={th("googlePlayEyebrow")}
              googlePlayLabel={th("googlePlayLabel")}
              href="/waitlist"
              variant="inverse"
            />
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground lg:text-left">
            {t("heroNote")}
          </p>
          </div>
        </div>
      </section>

      {/* ── 2. WHY DRIVE WITH RIDES + HOW TO APPLY ───────────────────────── */}
      <section id="requirements" className="relative py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-px w-8 bg-border" />
              {t("whyEyebrow")}
              <span className="h-px w-8 bg-border" />
            </div>
            <h2 className="mt-5 type-section-title">
              {t("whyHeading")}
            </h2>
          </div>

          {/* Benefits card — single unified white card, 2x2 grid */}
          <div className="mt-14 overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:mt-20">
            <div className="grid sm:grid-cols-2">
              {drivers.benefits.map((b, i) => (
                <div
                  key={b.title}
                  className={`p-7 sm:p-8 lg:p-10 ${
                    /* horizontal divider on small screens, vertical on sm+ */
                    i > 0 ? "border-t border-border sm:border-t-0" : ""
                  } ${i >= 2 ? "sm:border-t sm:border-border" : ""} ${
                    i % 2 === 1 ? "sm:border-l sm:border-border" : ""
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden>
                      <path d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" />
                    </svg>
                  </span>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-heading sm:text-xl">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {b.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How to apply — 3-step strip */}
          <div className="mt-16 lg:mt-20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <span className="h-px w-8 bg-border" />
                {t("howEyebrow")}
                <span className="h-px w-8 bg-border" />
              </div>
              <h3 className="mt-5 text-balance text-2xl font-bold leading-tight tracking-[-0.02em] text-heading sm:text-3xl">
                {t("howHeading")}
              </h3>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
              {howToApply.map((s) => (
                <div key={s.n} className="rounded-2xl border border-border bg-card p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
                    {s.n}
                  </span>
                  <h4 className="mt-4 text-base font-bold text-heading">
                    {s.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Eligibility one-liner */}
            <p className="mx-auto mt-10 max-w-xl text-balance text-center text-sm leading-relaxed text-muted-foreground">
              {t("eligibility")}
            </p>

            {/* Final CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <StoreBadges
              appStoreEyebrow={th("appStoreEyebrow")}
              appStoreLabel={th("appStoreLabel")}
              googlePlayEyebrow={th("googlePlayEyebrow")}
              googlePlayLabel={th("googlePlayLabel")}
              href="/waitlist"
              variant="inverse"
            />
            </div>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              {t("questionsPrefix")}{" "}
              <Link
                href="/contact?topic=driver"
                className="font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                {t("talkToTeam")}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
