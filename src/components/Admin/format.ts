import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

// Number formatting for the admin usage screens, in the UI language

/** $4.82 · $0.0057 · <$0.001 — small amounts keep enough precision to be useful.
 *  Always a leading "$" (Intl's USD symbol varies by language and reorders in
 *  Arabic text); the digits follow the UI language. */
export function formatUsd(n: number, locale: string, axis = false): string {
  const usd = (value: number, digits: number) =>
    `$${new Intl.NumberFormat(locale, {
      minimumFractionDigits: digits === 2 ? 2 : 0,
      maximumFractionDigits: digits,
    }).format(value)}`;
  if (n === 0) return "$0";
  if (n >= 0.01) return usd(n, 2);
  if (n >= 0.001) return usd(n, 4);
  // Axis ticks are exact; values this small just read as "<$0.001"
  return axis ? usd(Number(n.toPrecision(2)), 6) : "<$0.001";
}

/** 1,284 · 12.9K · 2.1M */
export function formatCompact(n: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    notation: n >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Formatters bound to the current UI language */
export function useAdminFormat() {
  const locale = useLocale();
  const t = useTranslations("admin.units");
  return useMemo(
    () => ({
      usd: (n: number, axis = false) => formatUsd(n, locale, axis),
      compact: (n: number) => formatCompact(n, locale),
      /** 3h 12m · 14m · 45s · 0s */
      duration: (seconds: number) => {
        const s = Math.round(seconds);
        if (s < 60) return t("s", { n: s });
        const m = Math.round(s / 60);
        if (m < 60) return t("m", { n: m });
        return t("hm", { h: Math.floor(m / 60), m: m % 60 });
      },
      number: (n: number) => n.toLocaleString(locale),
    }),
    [locale, t],
  );
}
