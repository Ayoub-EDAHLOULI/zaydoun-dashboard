import Link from "next/link";
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
import HeroVisual from "./HeroVisual";
import FaqList from "./FaqList";
import CitationArt from "./CitationArt";
import ScaleLine from "./ScaleLine";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { RiseIn } from "@/components/motion/RiseIn";
import { cn } from "@/lib/cn";

const surfaceBand = "border-y border-border bg-bg-surface";
const sectionY = "py-20 md:py-30";

// ---------------------------------------------------------------------------
// 1 · Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
    <Container className="flex flex-wrap items-center gap-16 py-16 md:py-24">
      <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-7">
        <RiseIn delay={0.1}>
          <Eyebrow>A reading companion with opinions</Eyebrow>
        </RiseIn>
        <RiseIn delay={0.2}>
          <SectionTitle as="h1" size="xl">
            Talk to your <em>books.</em>
          </SectionTitle>
        </RiseIn>
        <RiseIn delay={0.3}>
          <p className="max-w-125 text-19 leading-relaxed text-text-secondary">
            Upload a PDF and Zaydoun reads it page by page. Then ask, argue, or
            get lost in a chapter together. Answers point you to the page they
            came from.
          </p>
        </RiseIn>
        <RiseIn delay={0.4} className="mt-1 flex flex-wrap gap-3">
          <Link href="/register" className={buttonClasses({ size: "lg" })}>
            Start free <ArrowRight size={18} aria-hidden />
          </Link>
          <a
            href="#ask"
            className={buttonClasses({ size: "lg", variant: "secondary" })}
          >
            See what it can do
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
  { icon: Bookmark, text: "Answers cite the page" },
  { icon: Languages, text: "5 languages, Arabic RTL" },
  { icon: Mic, text: "Hands-free voice on mobile" },
  { icon: Lock, text: "Your books stay yours" },
];

function AtAGlance() {
  return (
    <section aria-label="At a glance" className="border-y border-border-subtle">
      <Container>
        <Stagger
          as="ul"
          className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 py-7"
        >
          {GLANCE.map(({ icon: Icon, text }) => (
            <StaggerItem
              as="li"
              key={text}
              y={12}
              className="flex items-center gap-3 text-15"
            >
              <Icon size={20} className="shrink-0 text-gold" aria-hidden />
              {text}
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
  return (
    <section id="ask" aria-labelledby="ask-title" className="scroll-mt-24">
      <Container className={cn("flex flex-col gap-14", sectionY)}>
        <SectionHeader
          id="ask-title"
          eyebrow="More than search"
          title={
            <>
              Explain it. Argue with it. <em>Find it.</em>
            </>
          }
          lead="Zaydoun has read the whole book, so you can ask the way you'd ask a friend who has too. Pick a way in:"
        />
        <AskDemo />
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 4 · Citations
// ---------------------------------------------------------------------------

function Citations() {
  return (
    <section aria-labelledby="cite-title" className={surfaceBand}>
      <Container className={cn("flex flex-wrap items-center gap-18", sectionY)}>
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
          <Reveal className="flex flex-col gap-6">
            <Eyebrow>Page-accurate</Eyebrow>
            <SectionTitle id="cite-title">
              Don&apos;t take his word for it. <em>Check the page.</em>
            </SectionTitle>
            <p className="text-17 leading-relaxed text-text-secondary">
              Zaydoun answers from the passages he finds in your PDF and tags
              the answer with the page he leaned on. Open the book, turn to the
              page, and read it in the author&apos;s own words.
            </p>
          </Reveal>
          <Stagger as="ul" delay={0.15} className="mt-2 flex flex-col gap-3.5">
            {[
              "Answers start from the passages in your copy, not the internet's summary of it",
              "Page numbers follow your PDF, so you can jump straight there",
              "A running list of every page a conversation has touched",
            ].map((t) => (
              <StaggerItem
                as="li"
                key={t}
                y={10}
                className="flex gap-3.5 text-15 leading-normal"
              >
                <Check
                  size={20}
                  className="mt-0.5 shrink-0 text-gold"
                  aria-hidden
                />
                <span>{t}</span>
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
  return (
    <section aria-labelledby="lang-title">
      <Container className={cn("flex flex-col gap-14", sectionY)}>
        <SectionHeader
          id="lang-title"
          eyebrow="Five languages"
          title={
            <>
              Read in one language. <em>Talk in another.</em>
            </>
          }
          lead="A French novel, answers in Arabic. An Arabic classic, answers in English. Pick the reply language per conversation."
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
              <span
                dir="ltr"
                lang="en"
                className="self-end text-sm text-text-secondary"
              >
                العربية · right to left, set in Amiri
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
                  Al-Muqaddimah
                </span>
                <div className="my-10">
                  <Orb size={140} rings={2} breathing />
                </div>
                <span className="text-13 font-semibold tracking-widest text-gold-light uppercase">
                  Listening
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
                  “So what kills a dynasty, really?”
                </span>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal
          delay={0.1}
          className="flex min-w-0 flex-[1_1_440px] flex-col gap-6"
        >
          <Eyebrow>Voice-first on mobile</Eyebrow>
          <SectionTitle id="voice-title">
            Say “Zaydoun”. <em>Keep walking.</em>
          </SectionTitle>
          <p className="text-17 leading-relaxed text-text-secondary">
            On the commute, at the gym, washing up. Open the app, call his name
            and talk. He answers out loud, and the conversation is waiting on
            the web when you sit back down.
          </p>
          <p className="mt-2 inline-flex items-center gap-2.5 self-start rounded-[10px] border border-border-strong bg-bg-base px-4 py-3 text-15 text-text-secondary">
            <Smartphone size={18} className="text-gold" aria-hidden />
            The mobile app is on its way to the App Store and Google Play.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 7 · Meet Zaydoun
// ---------------------------------------------------------------------------

const TRAITS = [
  {
    title: "Pushes back",
    text: "Say something half-right and he'll find the half that isn't.",
  },
  {
    title: "Stays on the text",
    text: "Opinions about the book, evidence from the book.",
  },
  {
    title: "Remembers the thread",
    text: "Every conversation is saved. Pick it up next week.",
  },
  {
    title: "Has a sense of humour",
    text: "Serious about books, not about himself.",
  },
];

function MeetZaydoun() {
  return (
    <section aria-labelledby="meet-title">
      <Container className={cn("flex flex-wrap items-start gap-16", sectionY)}>
        <Reveal className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
          <Eyebrow>Meet Zaydoun</Eyebrow>
          <SectionTitle id="meet-title">
            Not a search box. <em>A reading partner.</em>
          </SectionTitle>
          <p className="text-17 leading-relaxed text-text-secondary">
            Sharp, warm and a little Moroccan. He&apos;ll tell you when an
            argument is weak, yours or the author&apos;s, and drop the odd word
            of Darija when the moment calls for it.
          </p>
        </Reveal>
        <Stagger
          gap={0.1}
          delay={0.1}
          className="grid min-w-0 flex-[1_1_520px] gap-4 sm:grid-cols-2"
        >
          {TRAITS.map((t) => (
            <StaggerItem
              key={t.title}
              y={20}
              scale={0.97}
              className="flex flex-col gap-2.5 rounded-md border border-border bg-bg-surface p-6 transition-colors duration-300 hover:border-border-gold"
            >
              <span className="text-base font-semibold">{t.title}</span>
              <span className="text-sm leading-relaxed text-text-secondary">
                {t.text}
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
  {
    icon: GraduationCap,
    title: "Students",
    text: "Get unstuck on a dense chapter the night before the seminar.",
  },
  {
    icon: Microscope,
    title: "Researchers",
    text: "Find where an idea lives and go straight to the page.",
  },
  {
    icon: Languages,
    title: "Language learners",
    text: "Read in the language you're learning, discuss in the one you know.",
  },
  {
    icon: Headphones,
    title: "Commuters",
    text: "Keep reading with your eyes on the road and your hands free.",
  },
];

function WhoItsFor() {
  return (
    <section
      aria-labelledby="who-title"
      className="border-t border-border-subtle"
    >
      <Container className={cn("flex flex-col gap-12", sectionY)}>
        <Reveal>
          <SectionTitle id="who-title" size="md" className="max-w-160">
            For anyone who wants more from a book than a summary.
          </SectionTitle>
        </Reveal>
        <Stagger
          gap={0.1}
          className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4"
        >
          {AUDIENCES.map(({ icon: Icon, title, text }, i) => (
            <StaggerItem
              key={title}
              className={cn(
                "flex flex-col gap-3 py-8 lg:px-7",
                i > 0 && "lg:border-l lg:border-border",
                i === 0 && "lg:pl-0",
              )}
            >
              <Icon size={24} className="text-gold" aria-hidden />
              <span className="text-lg font-semibold">{title}</span>
              <span className="text-15 leading-relaxed text-text-secondary">
                {text}
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

const STEPS = [
  {
    title: "Upload on the web",
    text: "Drop a PDF, add the title and its language. Arabic books welcome.",
  },
  {
    title: "Zaydoun reads it",
    text: "He goes through it page by page and remembers where every idea lives.",
  },
  {
    title: "Talk, hands-free",
    text: "Type here on the web, or open the app, say “Zaydoun” and just speak.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className={cn(surfaceBand, "scroll-mt-20")}
    >
      <Container className={cn("flex flex-col gap-14", sectionY)}>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Eyebrow>How it works</Eyebrow>
            <SectionTitle id="how-title" size="md">
              From PDF to conversation
              <br />
              in three steps.
            </SectionTitle>
          </div>
          <div className="flex max-w-90 flex-col items-start gap-3">
            <p className="text-base leading-relaxed text-text-secondary">
              No setup, no settings to learn. Bring the book you&apos;re already
              reading.
            </p>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 rounded-xs text-15 text-gold-light hover:text-text-primary"
            >
              See the details <ArrowRight size={16} aria-hidden />
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
            {STEPS.map((s, i) => (
              <StaggerItem
                as="li"
                key={s.title}
                className={cn(
                  "flex flex-col gap-3.5 py-8 md:px-8",
                  i === 0 && "md:pl-0",
                  i > 0 && "md:border-l md:border-border-strong",
                )}
              >
                <span className="font-serif text-56 leading-none text-gold-dark">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-19 font-semibold">{s.title}</span>
                <span className="text-15 leading-relaxed text-text-secondary">
                  {s.text}
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
  {
    icon: ShieldCheck,
    title: "Only you can see your books",
    text: "Each reader's library and conversations are kept separate.",
  },
  {
    icon: Trash2,
    title: "Delete anytime",
    text: "Remove a book, a conversation, or your whole account.",
  },
  {
    icon: Send,
    title: "Sent only to answer you",
    text: "To answer a question, the relevant passages go to OpenAI's API, and nowhere else.",
  },
];

function Privacy() {
  return (
    <section aria-labelledby="privacy-title">
      <Container className={cn("flex flex-wrap items-start gap-16", sectionY)}>
        <Reveal className="flex flex-[1_1_360px] flex-col gap-4">
          <Eyebrow>Private by design</Eyebrow>
          <SectionTitle id="privacy-title" size="md">
            Your shelf is nobody else&apos;s business.
          </SectionTitle>
        </Reveal>
        <Stagger
          as="ul"
          gap={0.12}
          className="flex min-w-0 flex-[1_1_520px] flex-col"
        >
          {PRIVACY.map(({ icon: Icon, title, text }) => (
            <StaggerItem
              as="li"
              key={title}
              y={14}
              className="flex gap-4 border-b border-border py-5 first:border-t"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-bg-surface text-gold-light">
                <Icon size={20} aria-hidden />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-base font-medium">{title}</span>
                <span className="text-sm leading-relaxed text-text-secondary">
                  {text}
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

const FAQS = [
  {
    q: "What kind of files can I upload?",
    a: "PDFs up to 50 MB. They need real text inside, so a scanned book without a text layer won't work yet. Tell Zaydoun the book's language when you upload it.",
  },
  {
    q: "How do the page citations work?",
    a: "When you ask something, Zaydoun searches your PDF for the most relevant passages and answers from them. The answer carries a tag with the page of the passage he leaned on most. Page numbers follow your PDF file, so they can differ from the printed numbers if the book has front matter.",
  },
  {
    q: "Can I use it without looking at my phone?",
    a: "Yes, in the mobile app. Turn on voice mode, say “Zaydoun”, ask your question and he answers out loud. On the web you type for now.",
  },
  {
    q: "Can I talk about an Arabic book in English?",
    a: "Yes. The book's language and the reply language are separate. Pick the reply language when you start a conversation, and change it any time from the conversation's header.",
  },
  {
    q: "Who can see my books and conversations?",
    a: "Only you. Your books and conversations are tied to your account, and every request is checked against it. To answer a question, the relevant passages and your question are sent to OpenAI's API.",
  },
  {
    q: "Is it free?",
    a: "Yes. A free account holds 2 books and 15 messages a day. The daily count resets at midnight UTC.",
  },
];

function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className={cn(surfaceBand, "scroll-mt-20")}
    >
      <Container className={cn("flex flex-wrap items-start gap-16", sectionY)}>
        <Reveal className="flex flex-[1_1_320px] flex-col gap-4">
          <Eyebrow>Questions</Eyebrow>
          <SectionTitle id="faq-title" size="md">
            Before you ask Zaydoun, ask us.
          </SectionTitle>
          <Link
            href="/contact"
            className="mt-2 rounded-xs text-15 text-gold-light hover:text-text-primary"
          >
            Something else? Write to us →
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center gap-1.5 rounded-xs text-15 text-text-secondary hover:text-text-primary"
          >
            See all questions <ArrowRight size={16} aria-hidden />
          </Link>
        </Reveal>
        <Reveal delay={0.1} className="min-w-0 flex-[2_1_560px]">
          <FaqList items={FAQS} />
        </Reveal>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 12 · Final CTA
// ---------------------------------------------------------------------------

function FinalCta() {
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
            Which book first?
          </SectionTitle>
          <p className="relative max-w-110 text-17 leading-relaxed text-text-secondary">
            Bring the one you&apos;ve been meaning to finish. Zaydoun will meet
            you on page one.
          </p>
          <Link
            href="/register"
            className={buttonClasses({ size: "lg", className: "relative" })}
          >
            Start free <ArrowRight size={18} aria-hidden />
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
