"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_LOCALE, STORAGE_KEY, isLocale, type Locale } from "./config";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import rw from "./locales/rw.json";

/* English is the source of truth for both STRUCTURE and fallback text.
   fr/rw carry only translated copy — anything they omit falls through to en.

   This matters because these files also hold structural values the app depends
   on: section ids used as anchors, `kind` discriminants, chatbot flow ids and
   hrefs. Those live in en.json only, so a translator editing fr/rw physically
   cannot break routing or rendering, and a missing translation degrades to
   English instead of a blank. */
function mergeOverEn<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    const ov = Array.isArray(override) ? override : [];
    return base.map((item, i) => mergeOverEn(item, ov[i])) as unknown as T;
  }
  if (base !== null && typeof base === "object") {
    const ov = (override ?? {}) as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(base as Record<string, unknown>)) {
      out[k] = mergeOverEn(v, ov[k]);
    }
    return out as T;
  }
  return (typeof override === "string" && override !== "" ? override : base) as T;
}

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  fr: mergeOverEn(en, fr),
  rw: mergeOverEn(en, rw),
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dictionary: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Restore previously-selected language on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isLocale(saved)) setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, dictionary: dictionaries[locale] }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}

export function useLocale() {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale };
}

export function useTranslations<Section extends keyof Dictionary>(
  section: Section,
) {
  const { dictionary } = useI18n();
  return useCallback(
    (key: keyof Dictionary[Section]) => dictionary[section][key] as string,
    [dictionary, section],
  );
}

// For sections with structured content (arrays/objects) rather than flat strings.
export function useSection<Section extends keyof Dictionary>(
  section: Section,
): Dictionary[Section] {
  const { dictionary } = useI18n();
  return dictionary[section];
}
