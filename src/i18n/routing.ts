import { defineRouting } from "next-intl/routing";

// UI languages. English is the default and lives at "/", the others at
// "/fr/...", "/ar/..." etc. (Reply languages for Zaydoun are separate —
// see lib/languages.ts.)
export const LOCALES = ["en", "fr", "es", "ar", "zh", "de"] as const;
export type Locale = (typeof LOCALES)[number];

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  ar: "العربية",
  zh: "中文",
  de: "Deutsch",
};

// BCP 47 tags for Open Graph / Intl
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
  ar: "ar_MA",
  zh: "zh_CN",
  de: "de_DE",
};

export const isRtl = (locale: string) => locale === "ar";
