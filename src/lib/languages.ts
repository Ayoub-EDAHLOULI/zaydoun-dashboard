// The five languages Zaydoun supports (matches the API and the mobile app)
export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export function languageName(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.name ?? code.toUpperCase();
}

const ARABIC_CHARS = /[؀-ۿݐ-ݿࢠ-ࣿ]/;

// True when the language is Arabic, or the text itself contains Arabic script
export function isArabic(languageCode?: string | null, text?: string): boolean {
  if (languageCode === "ar") return true;
  return !!text && ARABIC_CHARS.test(text);
}

// A language's name in the UI language ("ar" → "Arabe" on the French site).
// Falls back to the English name if the runtime lacks Intl.DisplayNames data.
export function languageDisplayName(code: string, uiLocale: string): string {
  try {
    const name = new Intl.DisplayNames([uiLocale], { type: "language" }).of(code);
    if (name && name !== code)
      return name.charAt(0).toLocaleUpperCase(uiLocale) + name.slice(1);
  } catch {
    // fall through
  }
  return languageName(code);
}
