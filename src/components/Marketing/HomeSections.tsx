import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  ChevronDown,
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
        <Eyebrow>A reading companion with opinions</Eyebrow>
        <SectionTitle as="h1" size="xl">
          Talk to your <em>books.</em>
        </SectionTitle>
        <p className="max-w-[500px] text-19 leading-relaxed text-text-secondary">
          Upload a PDF and Zaydoun reads it page by page. Then ask, argue, or get lost in a chapter
          together. Answers point you to the page they came from.
        </p>
        <div className="mt-1 flex flex-wrap gap-3">
          <Link href="/register" className={buttonClasses({ size: "lg" })}>
            Start free <ArrowRight size={18} aria-hidden />
          </Link>
          <a href="#ask" className={buttonClasses({ size: "lg", variant: "secondary" })}>
            See what it can do
          </a>
        </div>
      </div>

      <div className="flex min-w-0 flex-[1_1_460px] flex-col items-center">
        <div className="mt-8 mb-14 hidden sm:block">
          <Orb size={220} rings={2} halo>
            <BookOpen size={64} strokeWidth={1.2} className="text-text-primary/90" />
          </Orb>
        </div>
        <figure aria-label="Sample conversation" className="flex w-full max-w-[460px] flex-col gap-3.5">
          <div className="max-w-[78%] self-end rounded-[16px_16px_4px_16px] border border-border bg-bg-elevated px-4 py-3 text-15 leading-[1.55]">
            Is ʿasabiyya just a fancy word for tribalism?
          </div>
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-bg-surface px-5.5 py-5 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2.5">
              <Orb size={22} />
              <span className="text-13 font-semibold text-gold-light">Zaydoun</span>
              <span className="ml-auto text-xs text-text-secondary">Al-Muqaddimah</span>
            </div>
            <p className="font-serif text-lg leading-relaxed">
              Not quite, and that&apos;s the trap most summaries fall into. Kinship is where it
              starts, but shared hardship can build it too. Think social glue, not “my tribe
              first”.
            </p>
            <PageTag page={118} className="self-start" />
          </div>
        </figure>
      </div>
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
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 py-7">
          {GLANCE.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-15">
              <Icon size={20} className="shrink-0 text-gold" aria-hidden />
              {text}
            </li>
          ))}
        </ul>
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
      <div className="flex max-w-[640px] flex-col gap-4">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <SectionTitle id={id}>{title}</SectionTitle>
      </div>
      {lead && <p className="max-w-[380px] text-base leading-relaxed text-text-secondary">{lead}</p>}
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

const PAGE_LINES = [92, 100, 86, 95, 60];
const AFTER_LINES = [97, 89, 100, 45];

function Citations() {
  return (
    <section aria-labelledby="cite-title" className={surfaceBand}>
      <Container className={cn("flex flex-wrap items-center gap-18", sectionY)}>
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
          <Eyebrow>Page-accurate</Eyebrow>
          <SectionTitle id="cite-title">
            Don&apos;t take his word for it. <em>Check the page.</em>
          </SectionTitle>
          <p className="text-17 leading-relaxed text-text-secondary">
            Zaydoun answers from the passages he finds in your PDF and tags the answer with the
            page he leaned on. Open the book, turn to the page, and read it in the author&apos;s
            own words.
          </p>
          <ul className="mt-2 flex flex-col gap-3.5">
            {[
              "Answers start from the passages in your copy, not the internet's summary of it",
              "Page numbers follow your PDF, so you can jump straight there",
              "A running list of every page a conversation has touched",
            ].map((t) => (
              <li key={t} className="flex gap-3.5 text-15 leading-normal">
                <Check size={20} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Illustration: a page with the cited passage highlighted */}
        <div aria-hidden className="relative h-[520px] min-w-0 flex-[1_1_480px] max-sm:hidden">
          <div className="absolute top-0 left-10 flex h-[470px] w-[340px] flex-col gap-3 rounded-[4px_10px_10px_4px] border border-border-strong bg-bg-elevated px-9 py-10">
            {PAGE_LINES.map((w, i) => (
              <div key={i} className="h-2 rounded-[2px] bg-border-strong" style={{ width: `${w}%` }} />
            ))}
            <div className="-mx-3 my-2.5 flex flex-col gap-3 rounded-[6px] border-l-[3px] border-gold bg-gold-muted p-3">
              {[100, 94, 98, 72].map((w, i) => (
                <div key={i} className="h-2 rounded-[2px] bg-gold-dark" style={{ width: `${w}%` }} />
              ))}
            </div>
            {AFTER_LINES.map((w, i) => (
              <div key={i} className="h-2 rounded-[2px] bg-border-strong" style={{ width: `${w}%` }} />
            ))}
            <span className="mt-auto self-center font-serif text-sm text-text-secondary italic">118</span>
          </div>
          <div className="absolute right-0 bottom-0 flex w-[330px] flex-col gap-3 rounded-lg border border-border-strong bg-bg-overlay p-5 shadow-overlay">
            <div className="flex items-center gap-2">
              <Orb size={20} />
              <span className="text-13 font-semibold text-gold-light">Zaydoun</span>
            </div>
            <p className="font-serif text-base leading-normal">
              Kinship is where it starts, but shared hardship can build it too.
            </p>
            <span className="inline-flex h-7 items-center gap-1.5 self-start rounded-full bg-gold px-3 text-xs font-semibold text-bg-base">
              <Bookmark size={12} aria-hidden /> Page 118
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 5 · Five languages
// ---------------------------------------------------------------------------

const SAMPLES = [
  { label: "Français", lang: "fr", text: "La ʿasabiyya n'est pas qu'un tribalisme : la parenté la fait naître, l'épreuve partagée la renforce." },
  { label: "Español", lang: "es", text: "La ʿasabiyya no es solo tribalismo: nace del parentesco, pero también de las penurias compartidas." },
  { label: "中文", lang: "zh", text: "“群体意识”不只是部落主义：它始于血缘，也可以在共同的苦难中形成。" },
  { label: "English", lang: "en", text: "ʿAsabiyya isn't just tribalism: kinship starts it, shared hardship builds it." },
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
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-5">
          <div
            dir="rtl"
            lang="ar"
            className="flex flex-col gap-5 rounded-lg border border-border-gold bg-bg-surface p-7 md:row-span-2 md:p-9"
          >
            <span dir="ltr" lang="en" className="self-end text-sm text-text-secondary">
              العربية · right to left, set in Amiri
            </span>
            <p className="font-arabic text-28 leading-[1.9]">
              العصبية ليست مجرد قبلية. القرابة هي البداية، لكن الشدائد المشتركة تصنعها أيضاً.
            </p>
            <PageTag page={118} arabic className="self-start" />
          </div>
          {SAMPLES.map((s) => (
            <div key={s.lang} className="flex flex-col gap-3 rounded-lg border border-border bg-bg-surface p-7">
              <span className="text-13 text-text-secondary">{s.label}</span>
              <p lang={s.lang} className="font-serif text-19 leading-relaxed">
                {s.text}
              </p>
            </div>
          ))}
        </div>
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
        <div aria-hidden className="flex flex-[0_1_320px] justify-center max-sm:hidden">
          <div className="h-[610px] w-[300px] rounded-[48px] border border-border-strong bg-[#070707] p-3.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex h-full flex-col items-center rounded-[36px] bg-bg-base px-5 pt-12 pb-10">
              <span className="text-xs text-text-secondary">Al-Muqaddimah</span>
              <div className="my-10">
                <Orb size={140} rings={2} breathing />
              </div>
              <span className="text-13 font-semibold tracking-[0.1em] text-gold-light uppercase">
                Listening
              </span>
              <div className="mt-3 flex h-9 items-center gap-1">
                {BARS.map((h, i) => (
                  <span
                    key={i}
                    className={cn("w-1 rounded-[2px]", h > 25 ? "bg-gold-light" : h > 12 ? "bg-gold" : "bg-gold-dark")}
                    style={{ height: h }}
                  />
                ))}
              </div>
              <span className="mt-auto text-center font-serif text-base text-text-secondary italic">
                “So what kills a dynasty, really?”
              </span>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
          <Eyebrow>Voice-first on mobile</Eyebrow>
          <SectionTitle id="voice-title">
            Say “Zaydoun”. <em>Keep walking.</em>
          </SectionTitle>
          <p className="text-17 leading-relaxed text-text-secondary">
            On the commute, at the gym, washing up. Open the app, call his name and talk. He
            answers out loud, and the conversation is waiting on the web when you sit back down.
          </p>
          <p className="mt-2 inline-flex items-center gap-2.5 self-start rounded-[10px] border border-border-strong bg-bg-base px-4 py-3 text-15 text-text-secondary">
            <Smartphone size={18} className="text-gold" aria-hidden />
            The mobile app is on its way to the App Store and Google Play.
          </p>
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 7 · Meet Zaydoun
// ---------------------------------------------------------------------------

const TRAITS = [
  { title: "Pushes back", text: "Say something half-right and he'll find the half that isn't." },
  { title: "Stays on the text", text: "Opinions about the book, evidence from the book." },
  { title: "Remembers the thread", text: "Every conversation is saved. Pick it up next week." },
  { title: "Has a sense of humour", text: "Serious about books, not about himself." },
];

function MeetZaydoun() {
  return (
    <section aria-labelledby="meet-title">
      <Container className={cn("flex flex-wrap items-start gap-16", sectionY)}>
        <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
          <Eyebrow>Meet Zaydoun</Eyebrow>
          <SectionTitle id="meet-title">
            Not a search box. <em>A reading partner.</em>
          </SectionTitle>
          <p className="text-17 leading-relaxed text-text-secondary">
            Sharp, warm and a little Moroccan. He&apos;ll tell you when an argument is weak, yours or
            the author&apos;s, and drop the odd word of Darija when the moment calls for it.
          </p>
        </div>
        <div className="grid min-w-0 flex-[1_1_520px] gap-4 sm:grid-cols-2">
          {TRAITS.map((t) => (
            <div key={t.title} className="flex flex-col gap-2.5 rounded-md border border-border bg-bg-surface p-6">
              <span className="text-base font-semibold">{t.title}</span>
              <span className="text-sm leading-relaxed text-text-secondary">{t.text}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 8 · Who it's for
// ---------------------------------------------------------------------------

const AUDIENCES = [
  { icon: GraduationCap, title: "Students", text: "Get unstuck on a dense chapter the night before the seminar." },
  { icon: Microscope, title: "Researchers", text: "Find where an idea lives and go straight to the page." },
  { icon: Languages, title: "Language learners", text: "Read in the language you're learning, discuss in the one you know." },
  { icon: Headphones, title: "Commuters", text: "Keep reading with your eyes on the road and your hands free." },
];

function WhoItsFor() {
  return (
    <section aria-labelledby="who-title" className="border-t border-border-subtle">
      <Container className={cn("flex flex-col gap-12", sectionY)}>
        <SectionTitle id="who-title" size="md" className="max-w-[640px]">
          For anyone who wants more from a book than a summary.
        </SectionTitle>
        <div className="grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className={cn(
                "flex flex-col gap-3 py-8 lg:px-7",
                i > 0 && "lg:border-l lg:border-border",
                i === 0 && "lg:pl-0",
              )}
            >
              <Icon size={24} className="text-gold" aria-hidden />
              <span className="text-lg font-semibold">{title}</span>
              <span className="text-15 leading-relaxed text-text-secondary">{text}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 9 · How it works
// ---------------------------------------------------------------------------

const STEPS = [
  { title: "Upload on the web", text: "Drop a PDF, add the title and its language. Arabic books welcome." },
  { title: "Zaydoun reads it", text: "He goes through it page by page and remembers where every idea lives." },
  { title: "Talk, hands-free", text: "Type here on the web, or open the app, say “Zaydoun” and just speak." },
];

function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className={cn(surfaceBand, "scroll-mt-20")}>
      <Container className={cn("flex flex-col gap-14", sectionY)}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Eyebrow>How it works</Eyebrow>
            <SectionTitle id="how-title" size="md">
              From PDF to conversation
              <br />
              in three steps.
            </SectionTitle>
          </div>
          <p className="max-w-[360px] text-base leading-relaxed text-text-secondary">
            No setup, no settings to learn. Bring the book you&apos;re already reading.
          </p>
        </div>
        <ol className="grid border-t border-border-strong md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
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
              <span className="text-15 leading-relaxed text-text-secondary">{s.text}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 10 · Privacy
// ---------------------------------------------------------------------------

const PRIVACY = [
  { icon: ShieldCheck, title: "Only you can see your books", text: "Each reader's library and conversations are kept separate." },
  { icon: Trash2, title: "Delete anytime", text: "Remove a book, a conversation, or your whole account." },
  { icon: Send, title: "Sent only to answer you", text: "To answer a question, the relevant passages go to OpenAI's API, and nowhere else." },
];

function Privacy() {
  return (
    <section aria-labelledby="privacy-title">
      <Container className={cn("flex flex-wrap items-start gap-16", sectionY)}>
        <div className="flex flex-[1_1_360px] flex-col gap-4">
          <Eyebrow>Private by design</Eyebrow>
          <SectionTitle id="privacy-title" size="md">
            Your shelf is nobody else&apos;s business.
          </SectionTitle>
        </div>
        <ul className="flex min-w-0 flex-[1_1_520px] flex-col">
          {PRIVACY.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 border-b border-border py-5 first:border-t">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-bg-surface text-gold-light">
                <Icon size={20} aria-hidden />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-base font-medium">{title}</span>
                <span className="text-sm leading-relaxed text-text-secondary">{text}</span>
              </span>
            </li>
          ))}
        </ul>
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
    <section id="faq" aria-labelledby="faq-title" className={cn(surfaceBand, "scroll-mt-20")}>
      <Container className={cn("flex flex-wrap items-start gap-16", sectionY)}>
        <div className="flex flex-[1_1_320px] flex-col gap-4">
          <Eyebrow>Questions</Eyebrow>
          <SectionTitle id="faq-title" size="md">
            Before you ask Zaydoun, ask us.
          </SectionTitle>
          <Link href="/contact" className="mt-2 rounded-xs text-15 text-gold-light hover:text-text-primary">
            Something else? Write to us →
          </Link>
        </div>
        <div className="min-w-0 flex-[2_1_560px] border-t border-border">
          {FAQS.map((f, i) => (
            <details key={f.q} open={i === 0} className="group border-b border-border">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 text-17 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown
                  size={20}
                  className="shrink-0 text-text-secondary transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="pb-6 text-15 leading-relaxed text-text-secondary">{f.a}</p>
            </details>
          ))}
        </div>
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
        <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl border border-border-gold bg-bg-surface px-6 py-20 text-center">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.16)_0%,transparent_65%)]"
          />
          <Orb size={56} rings={1} />
          <SectionTitle id="cta-title" className="relative">
            Which book first?
          </SectionTitle>
          <p className="relative max-w-[440px] text-17 leading-relaxed text-text-secondary">
            Bring the one you&apos;ve been meaning to finish. Zaydoun will meet you on page one.
          </p>
          <Link href="/register" className={buttonClasses({ size: "lg", className: "relative" })}>
            Start free <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
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

