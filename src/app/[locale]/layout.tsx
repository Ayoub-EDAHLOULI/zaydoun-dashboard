import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Newsreader, Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import AuthProvider from "@/contexts/AuthContext";
import ToastProvider from "@/contexts/ToastContext";
import { isRtl, LOCALE_TAGS, routing } from "@/i18n/routing";
import { alternatesFor, APP_URL, localeOf, type LocaleParams } from "@/i18n/metadata";

// Font variables are consumed by styles/tokens.css (font-sans / font-serif / font-arabic)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

// Arabic UI text (Inter has no Arabic glyphs). Only downloaded when used.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: LocaleParams): Promise<Metadata> {
  const locale = await localeOf(props);
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("site.title");

  return {
    metadataBase: new URL(APP_URL),
    title: { default: title, template: "%s | Zaydoun" },
    description: t("site.description"),
    keywords: [
      "AI voice assistant for reading",
      "chat with PDF using voice",
      "AI book companion app",
      "hands-free PDF reader AI",
      "RAG PDF question answering",
      "voice AI reading app",
      "multilingual AI assistant",
      "AI study companion",
      "Arabic AI reading assistant RTL",
      "upload PDF and chat with it using voice",
      "AI assistant that cites page numbers",
      "talk to your books app",
    ],
    authors: [{ name: "Zaydoun", url: APP_URL }],
    creator: "Zaydoun",
    publisher: "Zaydoun",
    category: "Technology",
    applicationName: "Zaydoun",
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      type: "website",
      locale: LOCALE_TAGS[locale],
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => LOCALE_TAGS[l]),
      url: alternatesFor(locale, "/").canonical,
      siteName: "Zaydoun",
      title,
      description: t("site.ogDescription"),
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: t("site.ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@zaydounai",
      creator: "@zaydounai",
      title,
      description: t("site.ogDescription"),
      images: ["/opengraph-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "meta" });
  const home = alternatesFor(locale, "/").canonical;

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zaydoun",
    url: home,
    inLanguage: locale,
    description: t("site.ogDescription"),
  };

  const jsonLdSoftwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Zaydoun",
    url: home,
    inLanguage: locale,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: "AI Voice Assistant",
    operatingSystem: "iOS, Android, Web",
    description: t("site.description"),
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        name: t("site.offerName"),
        description: t("site.offerDescription"),
      },
    ],
    creator: { "@type": "Organization", name: "Zaydoun", url: APP_URL },
    featureList: t.raw("site.featureList") as string[],
    screenshot: `${APP_URL}/opengraph-image.png`,
  };

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      // Smooth anchor scrolling stays, but Next jumps instantly on route changes
      data-scroll-behavior="smooth"
      className={`h-full ${inter.variable} ${newsreader.variable} ${amiri.variable} ${plexArabic.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSoftwareApp),
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col antialiased"
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
