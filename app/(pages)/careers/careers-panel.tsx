"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useTranslations } from "../../i18n/context";

/* The branded half of the application flow.

   The page used to be one narrow column on an empty grey field, which is most
   of why it read as unfinished: nothing held the canvas and there was no
   picture of the company anywhere. This panel carries the identity, the three
   facts an applicant needs, and — once they start — the progress, so the
   question column on the right can stay stripped back and focused.

   Sticky on desktop so the context stays with you through all fourteen
   questions; a short banner above the questions on smaller screens. */
export function CareersPanel({
  started,
  shownStep,
  total,
  pct,
  label,
  customHeading,
  customSubheading,
}: {
  started: boolean;
  shownStep: number;
  total: number;
  pct: number;
  label: ReactNode;
  customHeading?: string;
  customSubheading?: string;
}) {
  const t = useTranslations("careers");
  const tc = useTranslations("common");

  const headingText = customHeading || t("heading");
  const taglineText = customSubheading || t("tagline");

  const facts = [
    { label: t("startsLabel"), value: t("startsValue") },
    { label: t("locationLabel"), value: t("locationValue") },
    { label: t("deadlineLabel"), value: t("deadlineValue") },
  ];

  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-foreground text-background lg:sticky lg:top-24 lg:min-h-[34rem]">
      <Image
        src="/images/about-fleet.jpg"
        alt={tc("fleetAlt")}
        width={928}
        height={1152}
        sizes="(min-width: 1024px) 30rem, 100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        priority
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground via-foreground/85 to-foreground/40"
      />

      <div className="flex h-full flex-col justify-between gap-10 p-7 lg:min-h-[34rem] lg:p-9">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-background/70">
            {t("eyebrow")}
          </p>
          <p className="mt-4 text-balance text-2xl font-bold leading-[1.1] tracking-[-0.02em] lg:text-3xl">
            {headingText}
          </p>
          <p className="mt-3 text-sm font-semibold text-background/80">{taglineText}</p>
        </div>

        <div>
          {started ? (
            <div className="mb-8">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/70">
                  {label}
                </p>
                <p className="text-[11px] font-semibold tabular-nums text-background/60">
                  {Math.round(pct)}%
                </p>
              </div>
              <div
                className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background/25"
                role="progressbar"
                aria-valuenow={shownStep}
                aria-valuemin={1}
                aria-valuemax={total + 1}
              >
                <div
                  className="h-full rounded-full bg-background transition-[width] duration-300 ease-out motion-reduce:transition-none"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ) : null}

          <dl className="grid gap-x-6 gap-y-4 border-t border-background/20 pt-6 sm:grid-cols-3 lg:grid-cols-1">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-background/60">
                  {f.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

/** The opening copy, shown beside the panel until the applicant starts. */
export function CareersIntroCopy({
  customHeading,
  customSubheading,
}: {
  customHeading?: string;
  customSubheading?: string;
} = {}) {
  const t = useTranslations("careers");
  const headingText = customHeading || t("heading");
  const taglineText = customSubheading || t("tagline");

  return (
    <div>
      <h1 className="type-section-title text-balance">{headingText}</h1>
      <p className="mt-4 text-lg font-semibold text-primary-text">{taglineText}</p>
      <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground">
        {t("intro")}
      </p>
      <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
        {t("introBody")}
      </p>
    </div>
  );
}
