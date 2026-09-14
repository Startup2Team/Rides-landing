"use client";

import { useSection, useTranslations } from "../../i18n/context";

/* ────────────────────────────────────────────────────────────────────────────
   How to apply: by email, with a checklist of what to send.

   This replaced the fourteen-question wizard as the way in. That wizard posts
   to `POST /careers`, which lib/api.ts documents as not implemented — staging
   answers 404, so every submission failed and the applicant saw a "not open
   yet" message. A mailto that actually reaches someone beats a form that
   cannot deliver. The wizard is still in careers-form.tsx, unimported, for
   when the endpoint ships.

   The address is carried by the button alone. Note the trade-off: a mailto:
   does nothing on a device with no mail client configured, and there is now no
   visible address to copy. Restoring the fallback line is a <p> here plus the
   `resumeFallback` key in the three locale files.
──────────────────────────────────────────────────────────────────────────── */

const APPLY_EMAIL = "startupfounders8@gmail.com";

export function CareersResume() {
  const t = useTranslations("careers");
  const c = useSection("careers");

  /* encodeURIComponent, not a hand-built string: the subject carries an em dash
     and the programme name, and every locale's subject differs. */
  const mailto = `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(t("resumeSubject"))}`;

  return (
    <section className="relative z-10 bg-background pb-20 lg:pb-28">
      <div className="careers-apply-poster overflow-hidden">
        <div className="careers-apply-top grid items-center gap-8 px-6 py-9 sm:px-10 sm:py-11 lg:px-16 lg:py-12">
          <div>
            <h2 className="careers-apply-title">{t("resumeHeading")}</h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg">
              {t("resumeBody")}
            </p>
          </div>
        </div>

        <div className="careers-apply-bottom px-6 pb-7 pt-2 sm:px-10 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-faint-foreground">
                {t("resumeIncludeTitle")}
              </p>
                <ul className="careers-include-list mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {c.resumeItems.map((item: string) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/75" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={mailto}
              className="careers-apply-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              {t("resumeCta")}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden
              >
                <path d="M4 6h16v12H4z" />
                <path d="m4 7 8 6 8-6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
