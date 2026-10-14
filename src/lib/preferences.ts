import { LANGUAGES, type LanguageCode } from "./languages";

// The reader's preferred reply language — set on the Profile page
export const REPLY_LANG_KEY = "zaydoun_reply_language";

export function getReplyLanguagePref(): LanguageCode {
  try {
    const saved = localStorage.getItem(REPLY_LANG_KEY);
    const match = LANGUAGES.find((l) => l.code === saved);
    if (match) return match.code;
  } catch {
    // Storage unavailable (private mode, SSR) — fall through
  }
  return "en";
}
