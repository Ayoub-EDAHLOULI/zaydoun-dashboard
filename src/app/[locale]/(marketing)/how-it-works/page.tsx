import { setRequestLocale } from "next-intl/server";
import { localeOf, type LocaleParams } from "@/i18n/metadata";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  AudioLines,
  BookOpenText,
  Bookmark,
  FileText,
  Mic,
  MessageSquareText,
  ScanSearch,
  Sparkles,
  Volume2,
} from "lucide-react";
import MarketingShell, {
  Container,
  Eyebrow,
  SectionTitle,
} from "@/components/Marketing/MarketingShell";
import {
  AskPipeline,
  ScrollTimeline,
  TimelineStep,
} from "@/components/Marketing/HowItWorksMotion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { RiseIn } from "@/components/motion/RiseIn";
import { ChatMessage, Orb, StatusBadge, buttonClasses } from "@/components/ui";
import { LANGUAGES } from "@/lib/languages";
import { cn } from "@/lib/cn";

const sectionY = "py-20 md:py-28";
const card = "rounded-lg border border-border bg-bg-surface";
const em = (chunks: React.ReactNode) => <em>{chunks}</em>;

// ---------------------------------------------------------------------------
// Step visuals — small, static UI vignettes (decorative)
// ---------------------------------------------------------------------------

function UploadVisual() {
  const t = useTranslations("howItWorks.visuals");
  return (
    <div className={cn(card, "flex flex-col gap-4 p-6")}>
      <div className="flex items-center gap-3 rounded-md border border-dashed border-gold bg-gold/8 p-4">
        <span className="flex size-10 items-center justify-center rounded-[10px] bg-gold-muted text-gold-light">
          <FileText size={20} />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-15 font-medium">
            the-prince-machiavelli.pdf
          </span>
          <span className="text-13 text-text-secondary">
            {t("readyToUpload", { size: "4.2 MB" })}
          </span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-13">
        <div className="flex flex-col gap-1.5">
          <span className="text-text-secondary">{t("title")}</span>
          <span className="rounded-sm border border-border bg-bg-elevated px-3 py-2.5">
            {t("bookTitle")}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-text-secondary">{t("language")}</span>
          <span className="rounded-sm border border-border bg-bg-elevated px-3 py-2.5">
            {t("english")}
          </span>
        </div>
      </div>
      <StatusBadge status="PENDING" className="self-start" />
    </div>
  );
}

function ReadingVisual() {
  const t = useTranslations("howItWorks.visuals");
  const passages = [
    { page: 42, part: 1, of: 2 },
    { page: 42, part: 2, of: 2 },
    { page: 43, part: 1, of: 1 },
  ];
  return (
    <div className={cn(card, "flex flex-col gap-3 p-6")}>
      <div className="flex items-center justify-between">
        <span className="text-13 text-text-secondary">
          {t("splitting")}
        </span>
        <StatusBadge status="PROCESSING" />
      </div>
      {passages.map((p, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-md border border-border bg-bg-elevated px-4 py-3"
        >
          <span className="flex flex-1 flex-col gap-1.5">
            <span className="h-1.5 w-[88%] rounded-[2px] bg-border-strong" />
            <span className="h-1.5 w-[64%] rounded-[2px] bg-border-strong" />
          </span>
          <span className="shrink-0 text-xs text-text-secondary tabular-nums">
            {t("passage", { page: p.page, part: p.part, of: p.of })}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between pt-1">
        <span className="text-13 text-text-secondary">{t("indexed")}</span>
        <StatusBadge status="READY" />
      </div>
    </div>
  );
}

function ConversationVisual() {
  const t = useTranslations("howItWorks.visuals");
  return (
    <div className={cn(card, "flex flex-col gap-5 p-6")}>
      <div className="flex items-center gap-3 rounded-md border border-gold bg-gold/12 p-3.5">
        <span className="h-12 w-9 shrink-0 rounded-[5px] rounded-s-[2px] border-s-[3px] border-gold-dark bg-bg-elevated" />
        <span className="flex flex-col gap-0.5">
          <span className="font-serif text-17 font-medium">{t("bookTitle")}</span>
          <span className="text-13 text-text-secondary">
            {t("bookMeta")}
          </span>
        </span>
        <StatusBadge status="READY" className="ms-auto max-sm:hidden" />
      </div>
      <div className="flex flex-col gap-2.5">
        <span className="text-13 text-text-secondary">{t("repliesIn")}</span>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <span
              key={l.code}
              lang={l.code}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-3.5",
                l.code === "fr"
                  ? "border-gold bg-gold-muted font-medium text-gold-light"
                  : "border-border-strong",
                l.code === "ar" ? "font-arabic text-base" : "text-sm",
              )}
            >
              {l.nativeName}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnswerVisual() {
  const t = useTranslations("howItWorks.visuals");
  return (
    <div className={cn(card, "flex flex-col gap-6 p-6")}>
      <ChatMessage role="user" content={t("question")} />
      <ChatMessage role="assistant" content={t("answer")} pages={[71]} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

// Text: messages/<locale>/howItWorks.json → pipeline / voice / know
const PIPELINE = [
  { key: "question", icon: <MessageSquareText size={20} /> },
  { key: "passages", icon: <ScanSearch size={20} /> },
  { key: "answer", icon: <Sparkles size={20} /> },
  { key: "page", icon: <Bookmark size={20} /> },
] as const;

const VOICE = [
  { key: "say", icon: <Mic size={18} /> },
  { key: "ask", icon: <AudioLines size={18} /> },
  { key: "same", icon: <BookOpenText size={18} /> },
  { key: "answers", icon: <Volume2 size={18} /> },
] as const;

const GOOD_TO_KNOW = ["pdfs", "pages", "silent", "languages", "free", "lost"] as const;

export default async function HowItWorksPage(props: LocaleParams) {
  // Lets this page prerender per language
  setRequestLocale(await localeOf(props));
  return <HowItWorksPageContent />;
}

function HowItWorksPageContent() {
  const t = useTranslations("howItWorks");
  return (
    <MarketingShell>
      {/* Intro — CSS entrance so it shows at first paint */}
      <Container>
        <div className="flex flex-col gap-6 pt-20 pb-16 md:pt-28 md:pb-24">
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

      {/* The four steps, with a rail that fills as you read */}
      <section
        aria-labelledby="steps-title"
        className="border-t border-border-subtle"
      >
        <Container className={sectionY}>
          <h2 id="steps-title" className="sr-only">
            {t("stepsTitle")}
          </h2>
          <ScrollTimeline>
            <TimelineStep n={1} title={t("s1.title")} visual={<UploadVisual />}>
              <p className="text-base leading-relaxed text-text-secondary">
                {t("s1.body")}
              </p>
            </TimelineStep>
            <TimelineStep n={2} title={t("s2.title")} visual={<ReadingVisual />}>
              <p className="text-base leading-relaxed text-text-secondary">
                {t("s2.body")}
              </p>
            </TimelineStep>
            <TimelineStep
              n={3}
              title={t("s3.title")}
              visual={<ConversationVisual />}
            >
              <p className="text-base leading-relaxed text-text-secondary">
                {t("s3.body")}
              </p>
            </TimelineStep>
            <TimelineStep n={4} title={t("s4.title")} visual={<AnswerVisual />}>
              <p className="text-base leading-relaxed text-text-secondary">
                {t("s4.body")}
              </p>
            </TimelineStep>
          </ScrollTimeline>
        </Container>
      </section>

      {/* What happens when you ask */}
      <section
        aria-labelledby="ask-title"
        className="border-y border-border bg-bg-surface"
      >
        <Container className={cn("flex flex-col gap-12", sectionY)}>
          <Reveal className="flex max-w-170 flex-col gap-4">
            <Eyebrow>{t("ask.eyebrow")}</Eyebrow>
            <SectionTitle id="ask-title" size="md">
              {t.rich("ask.title", { em })}
            </SectionTitle>
            <p className="text-base leading-relaxed text-text-secondary">
              {t("ask.lead")}
            </p>
          </Reveal>
          <AskPipeline
            nodes={PIPELINE.map((p) => ({
              icon: p.icon,
              label: t(`pipeline.${p.key}.label`),
              detail: t(`pipeline.${p.key}.detail`),
            }))}
          />
        </Container>
      </section>

      {/* Voice on mobile */}
      <section aria-labelledby="voice-title">
        <Container
          className={cn("flex flex-wrap items-center gap-16", sectionY)}
        >
          <Reveal className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
            <Eyebrow>{t("voiceSection.eyebrow")}</Eyebrow>
            <SectionTitle id="voice-title" size="md">
              {t.rich("voiceSection.title", { em })}
            </SectionTitle>
            <p className="text-base leading-relaxed text-text-secondary">
              {t("voiceSection.lead")}
            </p>
            <div className="mt-2 hidden sm:block">
              <Orb size={72} rings={2} breathing />
            </div>
          </Reveal>
          <Stagger
            as="ol"
            gap={0.12}
            className="grid min-w-0 flex-[1_1_520px] gap-3 sm:grid-cols-2"
          >
            {VOICE.map((v, i) => (
              <StaggerItem
                as="li"
                key={v.key}
                className={cn(card, "flex flex-col gap-3 p-5")}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="flex size-9 items-center justify-center rounded-[10px] bg-gold-muted text-gold-light"
                    aria-hidden
                  >
                    {v.icon}
                  </span>
                  <span className="text-xs font-medium tracking-[0.1em] text-text-secondary uppercase">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <span className="text-base font-semibold">
                  {t(`voice.${v.key}.title`)}
                </span>
                <span className="text-sm leading-relaxed text-text-secondary">
                  {t(`voice.${v.key}.text`)}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Good to know */}
      <section
        aria-labelledby="know-title"
        className="border-t border-border-subtle"
      >
        <Container className={cn("flex flex-col gap-12", sectionY)}>
          <Reveal>
            <SectionTitle id="know-title" size="md">
              {t("knowTitle")}
            </SectionTitle>
          </Reveal>
          <Stagger
            gap={0.08}
            className="grid gap-x-10 gap-y-2 md:grid-cols-2 lg:grid-cols-3"
          >
            {GOOD_TO_KNOW.map((key) => (
              <StaggerItem
                key={key}
                y={16}
                className="flex flex-col gap-2 border-t border-border py-6"
              >
                <span className="text-base font-semibold">
                  {t(`know.${key}.title`)}
                </span>
                <span className="text-sm leading-relaxed text-text-secondary">
                  {t(`know.${key}.text`)}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* CTA */}
      <Container>
        <Reveal className="flex flex-wrap items-center justify-between gap-8 border-t border-border-subtle py-24 md:py-28">
          <SectionTitle>{t("cta.title")}</SectionTitle>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/features"
              className={buttonClasses({ size: "lg", variant: "secondary" })}
            >
              {t("cta.features")}
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
