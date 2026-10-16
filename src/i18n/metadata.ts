import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "./navigation";
import { LOCALE_TAGS, routing, type Locale } from "./routing";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://zaydoun.ai";

// Absolute URL of a page in a given language ("/features" → ".../fr/features")
export const localeUrl = (locale: Locale, path: string) =>
  `${APP_URL}${getPathname({ locale, href: path })}`;

// canonical + hreflang links for every language
export function alternatesFor(locale: Locale, path: string) {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, localeUrl(l, path)]),
      ),
      "x-default": localeUrl(routing.defaultLocale, path),
    },
  };
}

type PageKey =
  | "features"
  | "howItWorks"
  | "faq"
  | "contact"
  | "login"
  | "register"
  | "forgotPassword"
  | "resetPassword";

// Metadata for a public page, read from messages/<locale>/meta.json
export async function pageMetadata(
  locale: Locale,
  key: PageKey,
  path: string,
  { index = true }: { index?: boolean } = {},
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);

  if (!index) {
    return { title, description, robots: { index: false, follow: false } };
  }

  const url = localeUrl(locale, path);
  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title,
      description,
      url,
      locale: LOCALE_TAGS[locale],
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Just a translated <title> (app / dashboard pages)
export async function titleMetadata(
  locale: Locale,
  key: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t(`titles.${key}` as "titles.library") };
}

export type LocaleParams = { params: Promise<{ locale: string }> };

export async function localeOf({ params }: LocaleParams): Promise<Locale> {
  const { locale } = await params;
  return (routing.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : routing.defaultLocale;
}
