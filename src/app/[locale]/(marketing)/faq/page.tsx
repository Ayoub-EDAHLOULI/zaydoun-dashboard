import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import MarketingShell, {
  Container,
  Eyebrow,
  SectionTitle,
} from "@/components/Marketing/MarketingShell";
import FaqView from "@/components/Marketing/FaqView";
import { Reveal } from "@/components/motion";
import { RiseIn } from "@/components/motion/RiseIn";
import { buttonClasses } from "@/components/ui";
import { faqCategories } from "@/lib/faq";

const em = (chunks: React.ReactNode) => <em>{chunks}</em>;

export default function FaqPage() {
  const t = useTranslations("faq");

  // FAQPage structured data, built from the same content the page shows
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCategories((k) => t(k as never))
      .flatMap((c) => c.items)
      .map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Container>
        <div className="flex flex-col gap-6 pt-20 pb-14 md:pt-28 md:pb-20">
          <RiseIn delay={0.1}>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </RiseIn>
          <RiseIn delay={0.2}>
            <SectionTitle as="h1" size="page" className="max-w-220">
              {t.rich("title", { em })}
            </SectionTitle>
          </RiseIn>
          <RiseIn delay={0.3}>
            <p className="max-w-150 text-lg leading-relaxed text-text-secondary">
              {t("lead")}
            </p>
          </RiseIn>
        </div>
      </Container>

      <section aria-label={t("questions")} className="border-t border-border-subtle">
        <Container className="py-16 md:py-24">
          <FaqView />
        </Container>
      </section>

      <Container>
        <Reveal className="flex flex-wrap items-center justify-between gap-8 border-t border-border-subtle py-20 md:py-24">
          <div className="flex flex-col gap-3">
            <SectionTitle size="md">{t("cta.title")}</SectionTitle>
            <p className="text-base text-text-secondary">{t("cta.body")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className={buttonClasses({ size: "lg", variant: "secondary" })}
            >
              {t("cta.contact")}
            </Link>
            <Link href="/register" className={buttonClasses({ size: "lg" })}>
              {t("cta.start")} <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </Container>
    </MarketingShell>
  );
}
