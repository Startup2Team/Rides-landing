"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "../i18n/context";

const DISMISS_KEY = "rides-careers-announcement-dismissed";

export function CareersAnnouncement() {
  const t = useTranslations("careers");
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  // Clear any previously persisted dismissal so refresh always brings it back
  useEffect(() => {
    try {
      sessionStorage.removeItem(DISMISS_KEY);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  // Don't show on the careers page itself or if dismissed in current view
  if (pathname === "/careers" || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <aside
      className="careers-announcement"
      aria-label={t("announcementLabel")}
    >
      <div className="careers-announcement-inner">
        <div className="careers-announcement-icon" aria-hidden="true">
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="bi bi-megaphone"
            aria-hidden="true"
          >
            <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49a68 68 0 0 1-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.141-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.2-5.2 1.8-8 1.95a5 5 0 0 0-.25 0 2 2 0 0 0-1.75 1.7V9a2 2 0 0 0 1.75 1.7c.08.005.166.01.25.015 2.8.15 5.656.75 8 1.95z" />
          </svg>
        </div>

        <p className="careers-announcement-message font-normal">
          <span className="font-normal">{t("announcementLead")}</span>
          <span className="font-normal">{t("announcementHighlight")}</span>
        </p>

        <div className="careers-announcement-divider" aria-hidden="true" />

        <Link href="/careers" className="careers-announcement-link">
          <span>{t("announcementCta")}</span>
        </Link>

        <button
          type="button"
          className="careers-announcement-close"
          onClick={handleDismiss}
          aria-label={t("announcementDismiss")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
