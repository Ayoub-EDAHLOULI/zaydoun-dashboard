import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRight,
  Bookmark,
  GraduationCap,
  Headphones,
  Languages,
  Lock,
  Microscope,
  Mic,
  ShieldCheck,
  Smartphone,
  Trash2,
  Send,
  Check,
} from "lucide-react";
import { Orb, PageTag, buttonClasses } from "@/components/ui";
import { Container, Eyebrow, SectionTitle } from "./MarketingShell";
import AskDemo from "./AskDemo";
import HeroVisual, { HeroOrb } from "./HeroVisual";
import FaqList from "./FaqList";
import CitationArt from "./CitationArt";
import ScaleLine from "./ScaleLine";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { RiseIn } from "@/components/motion/RiseIn";
import { cn } from "@/lib/cn";

const surfaceBand = "border-y border-border bg-bg-surface";
const em = (chunks: React.ReactNode) => <em>{chunks}</em>;
const sectionY = "py-20 md:py-30";

// ---------------------------------------------------------------------------
// 1 · Hero
// ---------------------------------------------------------------------------

function Hero() {
  const t = useTranslations("home.hero");
  return (
    <Container className="flex flex-wrap items-center gap-16 py-16 md:py-24">
      <div className="relative flex min-w-0 flex-[1_1_520px] flex-col gap-7">
        {/* The orb glows behind the headline */}
        <div className="absolute -top-28 start-10 z-0 sm:start-40 md:-top-20">
          <HeroOrb />
        </div>
        <RiseIn delay={0.1} className="relative z-10">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
        </RiseIn>
        <RiseIn delay={0.2} className="relative z-10">
          <SectionTitle as="h1" size="xl">
            {t.rich("title", { em })}
          </SectionTitle>
        </RiseIn>
        <RiseIn delay={0.3} className="relative z-10">
          <p className="max-w-125 text-19 leading-relaxed text-text-secondary">
            {t("lead")}
          </p>
        </RiseIn>
        <RiseIn delay={0.4} className="relative z-10 mt-1 flex flex-wrap gap-3">
          <Link href="/register" className={buttonClasses({ size: "lg" })}>
            {t("start")} <ArrowRight size={18} aria-hidden />
          </Link>
          <a
            href="#ask"
            className={buttonClasses({ size: "lg", variant: "secondary" })}
          >
            {t("see")}
          </a>
        </RiseIn>
      </div>

      <HeroVisual />
    </Container>
  );
}

// ---------------------------------------------------------------------------
// 2 · At a glance
// ---------------------------------------------------------------------------

const GLANCE = [
  { icon: Bookmark, key: "page" },
  { icon: Languages, key: "languages" },
  { icon: Mic, key: "voice" },
  { icon: Lock, key: "private" },
] as const;

function AtAGlance() {
  const t = useTranslations("home.glance");
  return (
    <section aria-label={t("label")} className="border-y border-border-subtle">
      <Container>
        <Stagger
          as="ul"
          className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 py-7"
        >
          {GLANCE.map(({ icon: Icon, key }) => (
            <StaggerItem
              as="li"
              key={key}
              y={12}
              className="flex items-center gap-3 text-15"
            >
              <Icon size={20} className="shrink-0 text-gold" aria-hidden />
              {t(key)}
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Shared section header: eyebrow + title on the left, a short line on the right
// ---------------------------------------------------------------------------

function SectionHeader({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <Reveal className="flex max-w-160 flex-col gap-4">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <SectionTitle id={id}>{title}</SectionTitle>
      </Reveal>
      {lead && (
        <Reveal
          as="p"
          delay={0.12}
          className="max-w-95 text-base leading-relaxed text-text-secondary"
        >
          {lead}
        </Reveal>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3 · Ask anything (interactive)
// ---------------------------------------------------------------------------

function AskAnything() {
  const t = useTranslations("home.ask");
  return (
    <section id="ask" aria-labelledby="ask-title" className="scroll-mt-24">
      <Container className={cn("flex flex-col gap-14", sectionY)}>
        <SectionHeader
          id="ask-title"
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em })}
          lead={t("lead")}
        />
        <AskDemo />
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4 · Citations
// ---------------------------------------------------------------------------

const CITE_POINTS = ["p1", "p2", "p3"] as const;

function Citations() {
  const t = useTranslations("home.cite");
  return (
    <section aria-labelledby="cite-title" className={surfaceBand}>
      <Container className={cn("flex flex-wrap items-center gap-18", sectionY)}>
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
          <Reveal className="flex flex-col gap-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle id="cite-title">{t.rich("title", { em })}</SectionTitle>
            <p className="text-17 leading-relaxed text-text-secondary">
              {t("body")}
            </p>
          </Reveal>
          <Stagger as="ul" delay={0.15} className="mt-2 flex flex-col gap-3.5">
            {CITE_POINTS.map((key) => (
              <StaggerItem
                as="li"
                key={key}
                y={10}
                className="flex gap-3.5 text-15 leading-normal"
              >
                <Check
                  size={20}
                  className="mt-0.5 shrink-0 text-gold"
                  aria-hidden
                />
                <span>{t(key)}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* Illustration: a page with the cited passage highlighted */}
        <CitationArt />
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 5 · Five languages
// ---------------------------------------------------------------------------

const SAMPLES = [
  {
    label: "Français",
    lang: "fr",
    text: "La ʿasabiyya n'est pas qu'un tribalisme : la parenté la fait naître, l'épreuve partagée la renforce.",
  },
  {
    label: "Español",
    lang: "es",
    text: "La ʿasabiyya no es solo tribalismo: nace del parentesco, pero también de las penurias compartidas.",
  },
  {
    label: "中文",
    lang: "zh",
    text: "“群体意识”不只是部落主义：它始于血缘，也可以在共同的苦难中形成。",
  },
  {
    label: "English",
    lang: "en",
    text: "ʿAsabiyya isn't just tribalism: kinship starts it, shared hardship builds it.",
  },
];

function FiveLanguages() {
  const t = useTranslations("home.langs");
  const locale = useLocale();
  return (
    <section aria-labelledby="lang-title">
      <Container className={cn("flex flex-col gap-14", sectionY)}>
        <SectionHeader
          id="lang-title"
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em })}
          lead={t("lead")}
        />
        <Stagger
          gap={0.1}
          className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5"
        >
          <StaggerItem className="md:row-span-2">
            <div
              dir="rtl"
              lang="ar"
              className="flex h-full flex-col gap-5 rounded-lg border border-border-gold bg-bg-surface p-7 md:p-9"
            >
              {/* The note is in the page language; the card stays Arabic */}
              <span
                dir="auto"
                lang={locale}
                className="self-end text-sm text-text-secondary"
              >
                العربية · {t("arabicNote")}
              </span>
              <p className="font-arabic text-28 leading-[1.9]">
                العصبية ليست مجرد قبلية. القرابة هي البداية، لكن الشدائد
                المشتركة تصنعها أيضاً.
              </p>
              <PageTag page={118} arabic className="self-start" />
            </div>
          </StaggerItem>
          {SAMPLES.map((s) => (
            <StaggerItem
              key={s.lang}
              className="flex flex-col gap-3 rounded-lg border border-border bg-bg-surface p-7 transition-colors hover:border-border-strong"
            >
              <span className="text-13 text-text-secondary">{s.label}</span>
              <p lang={s.lang} className="font-serif text-19 leading-relaxed">
                {s.text}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 6 · Voice on mobile
// ---------------------------------------------------------------------------

const BARS = [10, 22, 32, 18, 28, 14, 24, 8];

function VoiceOnMobile() {
  const t = useTranslations("home.voice");
  const tb = useTranslations("home.book");
  return (
    <section aria-labelledby="voice-title" className={surfaceBand}>
      <Container className={cn("flex flex-wrap items-center gap-20", sectionY)}>
        <Reveal
          y={48}
          duration={0.9}
          className="flex flex-[0_1_320px] justify-center max-sm:hidden"
        >
          <div aria-hidden>
            <div className="h-152.5 w-75 rounded-[48px] border border-border-strong bg-[#070707] p-3.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
              <div className="flex h-full flex-col items-center rounded-[36px] bg-bg-base px-5 pt-12 pb-10">
                <span className="text-xs text-text-secondary">
                  {tb("title")}
                </span>
                <div className="my-10">
                  <Orb size={140} rings={2} breathing />
                </div>
                <span className="text-13 font-semibold tracking-widest text-gold-light uppercase">
                  {t("listening")}
                </span>
                <div className="mt-3 flex h-9 items-center gap-1">
                  {BARS.map((h, i) => (
                    <span
                      key={i}
                      className={cn(
                        "w-1 rounded-[2px]",
                        h > 25
                          ? "bg-gold-light"
                          : h > 12
                            ? "bg-gold"
                            : "bg-gold-dark",
                      )}
                      style={{
                        height: h,
                        animation: `wave ${0.9 + (i % 3) * 0.25}s ease-in-out ${i * 0.08}s infinite`,
                      }}
                    />
                  ))}
                </div>
                <span className="mt-auto text-center font-serif text-base text-text-secondary italic">
                  {t("quote")}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal
          delay={0.1}
          className="flex min-w-0 flex-[1_1_440px] flex-col gap-6"
        >
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionTitle id="voice-title">{t.rich("title", { em })}</SectionTitle>
          <p className="text-17 leading-relaxed text-text-secondary">
            {t("body")}
          </p>
          <p className="mt-2 inline-flex items-center gap-2.5 self-start rounded-[10px] border border-border-strong bg-bg-base px-4 py-3 text-15 text-text-secondary">
            <Smartphone size={18} className="text-gold" aria-hidden />
            {t("soon")}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 7 · Meet Zaydoun
// ---------------------------------------------------------------------------

const TRAITS = ["t1", "t2", "t3", "t4"] as const;

function MeetZaydoun() {
  const t = useTranslations("home.meet");
  return (
    <section aria-labelledby="meet-title">
      <Container className={cn("flex flex-wrap items-start gap-16", sectionY)}>
        <Reveal className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionTitle id="meet-title">{t.rich("title", { em })}</SectionTitle>
          <p className="text-17 leading-relaxed text-text-secondary">
            {t("body")}
          </p>
        </Reveal>
        <Stagger
          gap={0.1}
          delay={0.1}
          className="grid min-w-0 flex-[1_1_520px] gap-4 sm:grid-cols-2"
        >
          {TRAITS.map((key) => (
            <StaggerItem
              key={key}
              y={20}
              scale={0.97}
              className="flex flex-col gap-2.5 rounded-md border border-border bg-bg-surface p-6 transition-colors duration-300 hover:border-border-gold"
            >
              <span className="text-base font-semibold">
                {t(`${key}.title`)}
              </span>
              <span className="text-sm leading-relaxed text-text-secondary">
                {t(`${key}.text`)}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 8 · Who it's for
// ---------------------------------------------------------------------------

const AUDIENCES = [
  { icon: GraduationCap, key: "a1" },
  { icon: Microscope, key: "a2" },
  { icon: Languages, key: "a3" },
  { icon: Headphones, key: "a4" },
] as const;

function WhoItsFor() {
  const t = useTranslations("home.who");
  return (
    <section
      aria-labelledby="who-title"
      className="border-t border-border-subtle"
    >
      <Container className={cn("flex flex-col gap-12", sectionY)}>
        <Reveal>
          <SectionTitle id="who-title" size="md" className="max-w-160">
            {t("title")}
          </SectionTitle>
        </Reveal>
        <Stagger
          gap={0.1}
          className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4"
        >
          {AUDIENCES.map(({ icon: Icon, key }, i) => (
            <StaggerItem
              key={key}
              className={cn(
                "flex flex-col gap-3 py-8 lg:px-7",
                i > 0 && "lg:border-s lg:border-border",
                i === 0 && "lg:ps-0",
              )}
            >
              <Icon size={24} className="text-gold" aria-hidden />
              <span className="text-lg font-semibold">{t(`${key}.title`)}</span>
              <span className="text-15 leading-relaxed text-text-secondary">
                {t(`${key}.text`)}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 9 · How it works
// ---------------------------------------------------------------------------

const STEPS = ["s1", "s2", "s3"] as const;

function HowItWorks() {
  const t = useTranslations("home.how");
  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className={cn(surfaceBand, "scroll-mt-20")}
    >
      <Container className={cn("flex flex-col gap-14", sectionY)}>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <SectionTitle id="how-title" size="md">
              {t("title1")}
              <br />
              {t("title2")}
            </SectionTitle>
          </div>
          <div className="flex max-w-90 flex-col items-start gap-3">
            <p className="text-base leading-relaxed text-text-secondary">
              {t("lead")}
            </p>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 rounded-xs text-15 text-gold-light hover:text-text-primary"
            >
              {t("details")} <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </Reveal>
        <div className="relative">
          <ScaleLine className="absolute inset-x-0 top-0 bg-border-strong" />
          <Stagger
            as="ol"
            gap={0.15}
            delay={0.3}
            className="grid md:grid-cols-3"
          >
            {STEPS.map((key, i) => (
              <StaggerItem
                as="li"
                key={key}
                className={cn(
                  "flex flex-col gap-3.5 py-8 md:px-8",
                  i === 0 && "md:ps-0",
                  i > 0 && "md:border-s md:border-border-strong",
                )}
              >
                <span className="font-serif text-56 leading-none text-gold-dark">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-19 font-semibold">{t(`${key}.title`)}</span>
                <span className="text-15 leading-relaxed text-text-secondary">
                  {t(`${key}.text`)}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 10 · Privacy
// ---------------------------------------------------------------------------

const PRIVACY = [
  { icon: ShieldCheck, key: "p1" },
  { icon: Trash2, key: "p2" },
  { icon: Send, key: "p3" },
] as const;

function Privacy() {
  const t = useTranslations("home.privacy");
  return (
    <section aria-labelledby="privacy-title">
      <Container className={cn("flex flex-wrap items-start gap-16", sectionY)}>
        <Reveal className="flex flex-[1_1_360px] flex-col gap-4">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionTitle id="privacy-title" size="md">
            {t("title")}
          </SectionTitle>
        </Reveal>
        <Stagger
          as="ul"
          gap={0.12}
          className="flex min-w-0 flex-[1_1_520px] flex-col"
        >
          {PRIVACY.map(({ icon: Icon, key }) => (
            <StaggerItem
              as="li"
              key={key}
              y={14}
              className="flex gap-4 border-b border-border py-5 first:border-t"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-bg-surface text-gold-light">
                <Icon size={20} aria-hidden />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-base font-medium">{t(`${key}.title`)}</span>
                <span className="text-sm leading-relaxed text-text-secondary">
                  {t(`${key}.text`)}
                </span>
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 11 · FAQ
// ---------------------------------------------------------------------------

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;


function Faq() {
  const t = useTranslations("home.faq");
  const items = FAQ_KEYS.map((k) => ({ q: t(`${k}.q`), a: t(`${k}.a`) }));
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className={cn(surfaceBand, "scroll-mt-20")}
    >
      <Container className={cn("flex flex-wrap items-start gap-16", sectionY)}>
        <Reveal className="flex flex-[1_1_320px] flex-col gap-4">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <SectionTitle id="faq-title" size="md">
            {t("title")}
          </SectionTitle>
          <Link
            href="/contact"
            className="mt-2 rounded-xs text-15 text-gold-light hover:text-text-primary"
          >
            {t("write")}
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 rounded-xs text-15 text-text-secondary hover:text-text-primary"
          >
            {t("all")} <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>
        <Reveal delay={0.1} className="min-w-0 flex-[2_1_560px]">
          <FaqList items={items} />
        </Reveal>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 12 · Final CTA
// ---------------------------------------------------------------------------

function FinalCta() {
  const t = useTranslations("home.cta");
  return (
    <section aria-labelledby="cta-title">
      <Container className="py-20 md:py-28">
        <Reveal
          y={32}
          scale={0.97}
          duration={0.8}
          className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-border-gold bg-bg-surface px-6 py-20 text-center"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 size-130 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.16)_0%,transparent_65%)]"
          />
          <Orb size={56} rings={1} />
          <SectionTitle id="cta-title" className="relative">
            {t("title")}
          </SectionTitle>
          <p className="relative max-w-110 text-17 leading-relaxed text-text-secondary">
            {t("body")}
          </p>
          <Link
            href="/register"
            className={buttonClasses({ size: "lg", className: "relative" })}
          >
            {t("start")} <ArrowRight size={18} aria-hidden />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

export default function HomeSections() {
  return (
    <>
      <Hero />
      <AtAGlance />
      <AskAnything />
      <Citations />
      <FiveLanguages />
      <VoiceOnMobile />
      <MeetZaydoun />
      <WhoItsFor />
      <HowItWorks />
      <Privacy />
      <Faq />
      <FinalCta />
    </>
  );
}
