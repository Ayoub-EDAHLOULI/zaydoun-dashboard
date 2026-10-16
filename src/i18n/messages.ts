import type { Locale } from "./routing";

// Messages are split per namespace: messages/<locale>/<namespace>.json
export const NAMESPACES = [
  "common",
  "meta",
  "nav",
  "auth",
  "marketing",
  "home",
  "features",
  "howItWorks",
  "faq",
  "contact",
  "app",
  "library",
  "conversations",
  "profile",
  "admin",
] as const;

export async function loadMessages(locale: Locale) {
  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => [
      ns,
      (await import(`../../messages/${locale}/${ns}.json`)).default,
    ]),
  );
  return Object.fromEntries(entries);
}
