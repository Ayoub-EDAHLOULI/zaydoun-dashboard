import { LANGUAGES, type LanguageCode } from "./languages";

// The reader's preferred reply language — set on the Profile page
export const REPLY_LANG_KEY = "zaydoun_reply_language";

// Without a saved choice: the UI language when Zaydoun can reply in it
// (German can't be a reply language), otherwise English
export function getReplyLanguagePref(uiLocale?: string): LanguageCode {
  try {
    const saved = localStorage.getItem(REPLY_LANG_KEY);
    const match = LANGUAGES.find((l) => l.code === saved);
    if (match) return match.code;
  } catch {
    // Storage unavailable (private mode, SSR) — fall through
  }
  return LANGUAGES.find((l) => l.code === uiLocale)?.code ?? "en";
}
