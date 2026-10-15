import Link from "next/link";
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

// ---------------------------------------------------------------------------
// Step visuals — small, static UI vignettes (decorative)
// ---------------------------------------------------------------------------

function UploadVisual() {
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
            4.2 MB · ready to upload
          </span>
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-13">
        <div className="flex flex-col gap-1.5">
          <span className="text-text-secondary">Title</span>
          <span className="rounded-sm border border-border bg-bg-elevated px-3 py-2.5">
            The Prince
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-text-secondary">Language</span>
          <span className="rounded-sm border border-border bg-bg-elevated px-3 py-2.5">
            English
          </span>
        </div>
      </div>
      <StatusBadge status="PENDING" className="self-start" />
    </div>
  );
}

function ReadingVisual() {
  const passages = [
    { page: 42, part: "1 of 2" },
    { page: 42, part: "2 of 2" },
    { page: 43, part: "1 of 1" },
  ];
  return (
    <div className={cn(card, "flex flex-col gap-3 p-6")}>
      <div className="flex items-center justify-between">
        <span className="text-13 text-text-secondary">
          Splitting into passages
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
            p. {p.page} · {p.part}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between pt-1">
        <span className="text-13 text-text-secondary">Indexed by meaning</span>
        <StatusBadge status="READY" />
      </div>
    </div>
  );
}

function ConversationVisual() {
  return (
    <div className={cn(card, "flex flex-col gap-5 p-6")}>
      <div className="flex items-center gap-3 rounded-md border border-gold bg-gold/12 p-3.5">
        <span className="h-12 w-9 shrink-0 rounded-[2px_5px_5px_2px] border-l-[3px] border-gold-dark bg-bg-elevated" />
        <span className="flex flex-col gap-0.5">
          <span className="font-serif text-17 font-medium">The Prince</span>
          <span className="text-13 text-text-secondary">
            Machiavelli · English · 140 pages
          </span>
        </span>
        <StatusBadge status="READY" className="ml-auto max-sm:hidden" />
      </div>
      <div className="flex flex-col gap-2.5">
        <span className="text-13 text-text-secondary">Zaydoun replies in</span>
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
  return (
    <div className={cn(card, "flex flex-col gap-6 p-6")}>
      <ChatMessage role="user" content="Is it better to be feared or loved?" />
      <ChatMessage
        role="assistant"
        content="Both, if you can manage it. But since that's rare, he says fear is safer: love is a bond people break when it suits them, fear holds because they dread the punishment."
        pages={[71]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const PIPELINE = [
  {
    label: "Your question",
    detail:
      "Typed on the web, or spoken in the app and transcribed by Whisper.",
    icon: <MessageSquareText size={20} />,
  },
  {
    label: "The right passages",
    detail:
      "Zaydoun searches your book by meaning and pulls the 5 closest passages. Only your book, never anyone else's.",
    icon: <ScanSearch size={20} />,
  },
  {
    label: "An answer",
    detail:
      "GPT-4o mini answers from those passages, with your last 10 messages for context.",
    icon: <Sparkles size={20} />,
  },
  {
    label: "The page",
    detail:
      "The answer is tagged with the page of the passage it leaned on most.",
    icon: <Bookmark size={20} />,
  },
];

const VOICE = [
  {
    icon: <Mic size={18} />,
    title: "Say “Zaydoun”",
    text: "Voice mode listens for his name while the app is open.",
  },
  {
    icon: <AudioLines size={18} />,
    title: "Ask out loud",
    text: "Your recording is transcribed, then deleted from the server straight away.",
  },
  {
    icon: <BookOpenText size={18} />,
    title: "Same reading",
    text: "Your words go through the same search and answer as typed questions.",
  },
  {
    icon: <Volume2 size={18} />,
    title: "He answers out loud",
    text: "The reply is spoken back to you, and its text is saved in the conversation.",
  },
];

const GOOD_TO_KNOW = [
  {
    title: "PDFs with real text",
    text: "Up to 50 MB. A scanned book without a text layer can't be read yet.",
  },
  {
    title: "Page numbers follow your PDF",
    text: "They're the PDF's own pages, so they can differ from the printed numbers when a book has front matter.",
  },
  {
    title: "When the book is silent",
    text: "If no passage fits your question, Zaydoun answers from general knowledge and there's no page tag.",
  },
  {
    title: "Two languages per conversation",
    text: "The book's language and the reply language are separate. Change the reply language any time.",
  },
  {
    title: "Free to use",
    text: "A free account holds 2 books and 15 messages a day. The count resets at midnight UTC.",
  },
  {
    title: "Nothing is lost",
    text: "Every conversation is saved with the pages it cited. Pick up where you left off, on the web or the app.",
  },
];

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      {/* Intro — CSS entrance so it shows at first paint */}
      <Container>
        <div className="flex flex-col gap-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <RiseIn delay={0.1}>
            <Eyebrow>How it works</Eyebrow>
          </RiseIn>
          <RiseIn delay={0.2}>
            <SectionTitle as="h1" size="page" className="max-w-220">
              From a PDF to a conversation. <em>Step by step.</em>
            </SectionTitle>
          </RiseIn>
          <RiseIn delay={0.3}>
            <p className="max-w-150 text-lg leading-relaxed text-text-secondary">
              No setup and nothing to learn. Here&apos;s exactly what happens
              between dropping in a book and hearing Zaydoun quote it back to
              you.
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
            The four steps
          </h2>
          <ScrollTimeline>
            <TimelineStep n={1} title="Upload a PDF" visual={<UploadVisual />}>
              <p className="text-base leading-relaxed text-text-secondary">
                On the web, drop in a PDF up to 50 MB, give it a title and say
                which language it&apos;s written in. It goes on your shelf
                straight away.
              </p>
            </TimelineStep>
            <TimelineStep
              n={2}
              title="Zaydoun reads it"
              visual={<ReadingVisual />}
            >
              <p className="text-base leading-relaxed text-text-secondary">
                Click &ldquo;Let Zaydoun read it&rdquo;. He takes the text page
                by page, cuts long pages into passages of about 400 words, and
                indexes each one by its meaning, keeping its page number. The
                book shows Processing, then Ready.
              </p>
            </TimelineStep>
            <TimelineStep
              n={3}
              title="Start a conversation"
              visual={<ConversationVisual />}
            >
              <p className="text-base leading-relaxed text-text-secondary">
                Pick a book that&apos;s Ready and the language Zaydoun should
                answer in: English, Arabic, French, Spanish or Chinese. A French
                reply about an English book is fine.
              </p>
            </TimelineStep>
            <TimelineStep
              n={4}
              title="Ask, and check the page"
              visual={<AnswerVisual />}
            >
              <p className="text-base leading-relaxed text-text-secondary">
                Ask anything: explain a passage, argue with the author, find
                where an idea lives. Zaydoun answers from the book and tags the
                page, so you can read it in the author&apos;s own words.
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
            <Eyebrow>Under the surface</Eyebrow>
            <SectionTitle id="ask-title" size="md">
              What happens when you <em>ask.</em>
            </SectionTitle>
            <p className="text-base leading-relaxed text-text-secondary">
              It takes a few seconds. This is what fills them.
            </p>
          </Reveal>
          <AskPipeline nodes={PIPELINE} />
        </Container>
      </section>

      {/* Voice on mobile */}
      <section aria-labelledby="voice-title">
        <Container
          className={cn("flex flex-wrap items-center gap-16", sectionY)}
        >
          <Reveal className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
            <Eyebrow>On mobile</Eyebrow>
            <SectionTitle id="voice-title" size="md">
              Or just say <em>“Zaydoun”.</em>
            </SectionTitle>
            <p className="text-base leading-relaxed text-text-secondary">
              In the mobile app, voice mode turns the whole thing hands-free.
              Same books, same conversations, no screen needed.
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
                key={v.title}
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
                <span className="text-base font-semibold">{v.title}</span>
                <span className="text-sm leading-relaxed text-text-secondary">
                  {v.text}
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
              Good to know.
            </SectionTitle>
          </Reveal>
          <Stagger
            gap={0.08}
            className="grid gap-x-10 gap-y-2 md:grid-cols-2 lg:grid-cols-3"
          >
            {GOOD_TO_KNOW.map((g) => (
              <StaggerItem
                key={g.title}
                y={16}
                className="flex flex-col gap-2 border-t border-border py-6"
              >
                <span className="text-base font-semibold">{g.title}</span>
                <span className="text-sm leading-relaxed text-text-secondary">
                  {g.text}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* CTA */}
      <Container>
        <Reveal className="flex flex-wrap items-center justify-between gap-8 border-t border-border-subtle py-24 md:py-28">
          <SectionTitle>Your first book takes a minute.</SectionTitle>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/features"
              className={buttonClasses({ size: "lg", variant: "secondary" })}
            >
              See all features
            </Link>
            <Link href="/register" className={buttonClasses({ size: "lg" })}>
              Start free <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </Reveal>
      </Container>
    </MarketingShell>
  );
}
