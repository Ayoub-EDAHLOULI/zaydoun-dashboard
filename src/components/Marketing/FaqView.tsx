"use client";

import { Link } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui";
import { DURATION, EASE_OUT, Reveal } from "@/components/motion";
import { faqCategories } from "@/lib/faq";
import FaqList from "./FaqList";

export default function FaqView() {
  const t = useTranslations("faq");
  const categories = useMemo(() => faqCategories((k) => t(k as never)), [t]);
  const [query, setQuery] = useState("");
  const q = query.trim().toLocaleLowerCase();

  // While searching, show every matching question in one list
  const matches = useMemo(
    () =>
      q
        ? categories.flatMap((c) =>
            c.items.filter((i) =>
              `${i.q} ${i.a}`.toLocaleLowerCase().includes(q),
            ),
          )
        : [],
    [q, categories],
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
      {/* Topics — sticky on desktop */}
      <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
        <Input
          label={t("search")}
          hideLabel
          icon={Search}
          type="search"
          placeholder={t("search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          surface
        />
        <nav
          aria-label={t("topics")}
          className="flex flex-wrap gap-2 lg:flex-col lg:gap-0.5"
        >
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              onClick={() => setQuery("")}
              className="rounded-full border border-border px-3.5 py-2 text-sm text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary lg:rounded-sm lg:border-transparent lg:px-3 lg:py-2.5 lg:hover:bg-bg-surface"
            >
              {c.title}
            </a>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          {q ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              className="flex flex-col gap-5"
            >
              <p role="status" className="text-sm text-text-secondary">
                {matches.length === 0
                  ? t("noMatch", { query: query.trim() })
                  : t("matches", { count: matches.length, query: query.trim() })}
              </p>
              {matches.length > 0 ? (
                // Re-mount per query so the first result opens
                <FaqList key={q} items={matches} defaultOpen={0} />
              ) : (
                <p className="text-15 text-text-secondary">
                  {t.rich("tryAnother", {
                    link: (chunks) => (
                      <Link
                        href="/contact"
                        className="text-gold-light hover:text-text-primary"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="topics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.fast }}
              className="flex flex-col gap-16"
            >
              {categories.map((c) => (
                <Reveal
                  key={c.id}
                  as="section"
                  id={c.id}
                  aria-labelledby={`${c.id}-title`}
                  className="flex scroll-mt-28 flex-col gap-5"
                >
                  <h2
                    id={`${c.id}-title`}
                    className="font-serif text-28 leading-tight font-normal md:text-32"
                  >
                    {c.title}
                  </h2>
                  <FaqList items={c.items} defaultOpen={null} />
                </Reveal>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
