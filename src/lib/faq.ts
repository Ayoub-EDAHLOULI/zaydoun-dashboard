// The FAQ structure. The text lives in messages/<locale>/faq.json
// (categories.<key>.title, items.<key>.q / .a); one source for the /faq page
// and its FAQPage structured data.
// Every answer reflects what zaydoun-api actually does; update it when that changes.

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_STRUCTURE = [
  {
    id: "getting-started",
    key: "gettingStarted",
    items: ["what", "install", "firstBook", "howLong"],
  },
  {
    id: "books",
    key: "books",
    items: ["files", "bookLanguages", "failed", "deleteBook"],
  },
  {
    id: "answers",
    key: "answers",
    items: ["citations", "pageNumbers", "onlyBook", "memory", "otherLanguage", "several"],
  },
  {
    id: "voice",
    key: "voice",
    items: ["handsFree", "webVoice", "recordings"],
  },
  {
    id: "account",
    key: "account",
    items: ["free", "reset", "forgot", "deactivated", "deleteAccount"],
  },
  {
    id: "privacy",
    key: "privacy",
    items: ["whoSees", "sentWhere"],
  },
] as const;

type Translate = (key: string) => string;

// Builds the categories in the current language from a t() for "faq"
export function faqCategories(t: Translate): FaqCategory[] {
  return FAQ_STRUCTURE.map((c) => ({
    id: c.id,
    title: t(`categories.${c.key}`),
    items: c.items.map((k) => ({ q: t(`items.${k}.q`), a: t(`items.${k}.a`) })),
  }));
}
