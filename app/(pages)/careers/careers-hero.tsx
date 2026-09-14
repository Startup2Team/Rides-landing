"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "../../i18n/context";

/* ────────────────────────────────────────────────────────────────────────────
   The careers hero — the state before an applicant starts the form.

   Centred on a faint graph-paper field. This replaced a two-column intro that
   put a dark photo panel beside the copy, which printed the programme name and
   the tagline twice on the same screen — once in the panel, once as the <h1>.
   The panel still carries that context, but only from the first question on,
   where it is orientation rather than repetition.

   The headline is the invitation and the copy is why. Nothing else: the
   programme facts that used to sit here in a four-column row are gone, and the
   call to action lives in the band below (careers-resume.tsx) — one ask per
   page, at the point where the requirements are stated.

   The two emphasised phrases are `{infra}` and `{fair}` placeholders filled
   through renderTemplate rather than a sentence chopped into three literals.
   That matters for translation: French and Kinyarwanda put those clauses in a
   different order, and renderTemplate is order-independent, so a translator can
   move them without touching this file.
──────────────────────────────────────────────────────────────────────────── */

export function CareersHero() {
  const t = useTranslations("careers");
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const distance = Math.max(hero.offsetHeight * 0.8, 1);
      const progress = Math.min(Math.max(-hero.getBoundingClientRect().top / distance, 0), 1);
      hero.style.setProperty("--career-map-scale", (1 + progress * 0.08).toFixed(3));
      hero.style.setProperty("--career-copy-opacity", (1 - progress * 0.7).toFixed(3));
      hero.style.setProperty("--career-copy-y", `${progress * -2}rem`);
      hero.style.setProperty("--career-copy-scale", (1 - progress * 0.06).toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width;
    const relativeY = (event.clientY - bounds.top) / bounds.height;
    const offsetX = (relativeX - 0.5) * -10;
    const offsetY = (relativeY - 0.5) * -10;
    event.currentTarget.style.setProperty("--career-cursor-active", "1");
    event.currentTarget.style.setProperty("--career-glow-x", `${(relativeX * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--career-glow-y", `${(relativeY * 100).toFixed(2)}%`);
    event.currentTarget.style.setProperty("--career-cursor-x", `${offsetX.toFixed(2)}px`);
    event.currentTarget.style.setProperty("--career-cursor-y", `${offsetY.toFixed(2)}px`);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--career-cursor-active", "0");
    event.currentTarget.style.setProperty("--career-glow-x", "50%");
    event.currentTarget.style.setProperty("--career-glow-y", "50%");
    event.currentTarget.style.setProperty("--career-cursor-x", "0px");
    event.currentTarget.style.setProperty("--career-cursor-y", "0px");
  };

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="careers-hero sticky top-0 z-0 relative isolate min-h-[100svh] overflow-hidden"
    >
      <div aria-hidden className="careers-map-wash pointer-events-none absolute inset-0" />
      <div aria-hidden className="grid-field absolute inset-0 -z-10" />
      <div aria-hidden className="careers-cursor-glow pointer-events-none absolute inset-0" />
      <div aria-hidden className="careers-cursor-shadow pointer-events-none absolute inset-0" />

      <div className="careers-hero-content relative mx-auto flex min-h-[100svh] max-w-3xl items-center px-6 py-24 text-center">
        <h1 className="type-display">{t("heroHeading")}</h1>

        <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl">
          {t("mission")}
        </p>
      </div>
    </section>
  );
}
