import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import MarketingShell, {
  Container,
  Eyebrow,
  SectionTitle,
} from "@/components/Marketing/MarketingShell";
import { Orb, PageTag, StatusBadge, buttonClasses } from "@/components/ui";
import { LANGUAGES } from "@/lib/languages";
import { cn } from "@/lib/cn";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { RiseIn } from "@/components/motion/RiseIn";

const sectionY = "py-20 md:py-24";

function Num({ n }: { n: number }) {
  return (
    <span className="font-serif text-40 leading-none text-gold-dark">
      {String(n).padStart(2, "0")}
    </span>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-15 leading-normal">
          <Check size={20} className="mt-0.5 shrink-0 text-gold" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}

const UNDER_THE_HOOD = [
  ["Retrieval", "Semantic search over page-level chunks (pgvector)"],
  ["Answers", "GPT-4o mini, given the passages it found in your book"],
  ["Voice in", "Whisper speech-to-text"],
  ["Voice out", "Text-to-speech in your reply language"],
  ["Accounts", "JWT with httpOnly refresh tokens, bcrypt-hashed passwords"],
  ["Isolation", "Every query scoped to the signed-in reader"],
];

export default function FeaturesPage() {
  return (
    <MarketingShell>
      {/* Intro */}
      <Container>
        <div className="flex flex-col gap-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <RiseIn delay={0.1}>
            <Eyebrow>Features</Eyebrow>
          </RiseIn>
          <RiseIn delay={0.2}>
            <SectionTitle as="h1" size="page" className="max-w-220">
              Everything Zaydoun can do <em>with a book.</em>
            </SectionTitle>
          </RiseIn>
          <RiseIn delay={0.3}>
            <p className="max-w-140 text-lg leading-relaxed text-text-secondary">
              One reading partner, on the web and in your pocket. Here&apos;s
              what&apos;s in the box.
            </p>
          </RiseIn>
        </div>
      </Container>

      {/* 01 */}
      <section aria-labelledby="f1" className="border-t border-border-subtle">
        <Container
          className={cn("flex flex-wrap items-center gap-16", sectionY)}
        >
          <Reveal className="flex min-w-0 flex-[1_1_440px] flex-col gap-5">
            <Num n={1} />
            <SectionTitle id="f1" size="md">
              Answers you can check
            </SectionTitle>
            <p className="text-base leading-relaxed text-text-secondary">
              Zaydoun finds the passages that matter in your PDF, answers from
              them, and tags the page he leaned on, so you can go and read it
              yourself.
            </p>
            <Bullets
              items={[
                "Searches by meaning, not just matching words",
                "A “Page N” tag on answers that come from a passage",
                "Cited pages collected per conversation",
              ]}
            />
          </Reveal>
          <Reveal
            x={40}
            y={0}
            delay={0.15}
            aria-hidden
            className="flex min-w-0 flex-[1_1_460px] flex-col gap-3 rounded-lg border border-border bg-bg-surface p-7"
          >
            <div className="flex items-center gap-2">
              <Orb size={22} />
              <span className="text-13 font-semibold text-gold-light">
                Zaydoun
              </span>
            </div>
            <p className="font-serif text-19 leading-[1.65]">
              He lays it out as a pattern first, then comes back to what it does
              to trade.
            </p>
            <PageTag page={279} className="self-start" />
          </Reveal>
        </Container>
      </section>

      {/* 02 */}
      <section
        aria-labelledby="f2"
        className="border-y border-border bg-bg-surface"
      >
        <Container
          className={cn("flex flex-wrap-reverse items-center gap-16", sectionY)}
        >
          <Reveal
            x={-40}
            y={0}
            delay={0.15}
            aria-hidden
            className="flex h-80 min-w-0 flex-[1_1_460px] flex-col items-center justify-center gap-10 rounded-lg border border-border bg-bg-base"
          >
            <Orb size={110} rings={1} />
            <span className="px-6 text-center font-serif text-lg text-text-secondary italic">
              “Zaydoun, what&apos;s his strongest argument in chapter 3?”
            </span>
          </Reveal>
          <Reveal className="flex min-w-0 flex-[1_1_440px] flex-col gap-5">
            <Num n={2} />
            <SectionTitle id="f2" size="md">
              Voice-first, hands-free
            </SectionTitle>
            <p className="text-base leading-relaxed text-text-secondary">
              In the mobile app, say his name and talk. Your voice is
              transcribed, the answer is read back to you, and the whole
              exchange is saved to your account.
            </p>
            <Bullets
              items={[
                "Wake word: “Zaydoun”",
                "Spoken answers in your reply language",
                "Voice on the web is on the way",
              ]}
            />
          </Reveal>
        </Container>
      </section>

      {/* 03–06 */}
      <Container>
        <Stagger
          gap={0.1}
          className={cn("grid gap-5 md:grid-cols-2", sectionY)}
        >
          <StaggerItem
            as="article"
            aria-labelledby="f3"
            className="flex flex-col gap-4.5 rounded-lg border border-border bg-bg-surface p-8 md:p-10 transition-colors duration-300 hover:border-border-strong"
          >
            <Num n={3} />
            <h2
              id="f3"
              className="font-serif text-28 leading-[1.1] font-normal md:text-32"
            >
              Five languages, Arabic done right
            </h2>
            <p className="text-base leading-relaxed text-text-secondary">
              Upload in English, Arabic, French, Spanish or Chinese, and choose
              the reply language for each conversation. Arabic reads right to
              left in a proper Arabic typeface.
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              {LANGUAGES.map((l) => (
                <span
                  key={l.code}
                  lang={l.code}
                  className={cn(
                    "inline-flex h-8.5 items-center rounded-full border border-border-strong px-3.5",
                    l.code === "ar" ? "font-arabic text-base" : "text-sm",
                  )}
                >
                  {l.nativeName}
                </span>
              ))}
            </div>
          </StaggerItem>
          <StaggerItem
            as="article"
            aria-labelledby="f4"
            className="flex flex-col gap-4.5 rounded-lg border border-border bg-bg-surface p-8 md:p-10 transition-colors duration-300 hover:border-border-strong"
          >
            <Num n={4} />
            <h2
              id="f4"
              className="font-serif text-28 leading-[1.1] font-normal md:text-32"
            >
              PDF in, conversation out
            </h2>
            <p className="text-base leading-relaxed text-text-secondary">
              Drop in a PDF up to 50 MB. Zaydoun splits it page by page and
              builds an index of what&apos;s where. You&apos;ll see each step as
              it happens.
            </p>
            <Stagger
              gap={0.35}
              delay={0.3}
              aria-label="Pending, then processing, then ready"
              className="mt-auto flex flex-wrap items-center gap-2.5 pt-2 text-text-muted"
            >
              <StaggerItem y={0} scale={0.85}>
                <StatusBadge status="PENDING" />
              </StaggerItem>
              <StaggerItem y={0}>
                <ArrowRight size={16} aria-hidden />
              </StaggerItem>
              <StaggerItem y={0} scale={0.85}>
                <StatusBadge status="PROCESSING" />
              </StaggerItem>
              <StaggerItem y={0}>
                <ArrowRight size={16} aria-hidden />
              </StaggerItem>
              <StaggerItem y={0} scale={0.85}>
                <StatusBadge status="READY" />
              </StaggerItem>
            </Stagger>
          </StaggerItem>
          <StaggerItem
            as="article"
            aria-labelledby="f5"
            className="flex flex-col gap-4.5 rounded-lg border border-border bg-bg-surface p-8 md:p-10 transition-colors duration-300 hover:border-border-strong"
          >
            <Num n={5} />
            <h2
              id="f5"
              className="font-serif text-28 leading-[1.1] font-normal md:text-32"
            >
              A library that remembers
            </h2>
            <p className="text-base leading-relaxed text-text-secondary">
              Your books on one shelf, every conversation saved and filterable
              by book. Reopen a thread from last month and pick up mid-argument.
            </p>
          </StaggerItem>
          <StaggerItem
            as="article"
            aria-labelledby="f6"
            className="flex flex-col gap-4.5 rounded-lg border border-border bg-bg-surface p-8 md:p-10 transition-colors duration-300 hover:border-border-strong"
          >
            <Num n={6} />
            <h2
              id="f6"
              className="font-serif text-28 leading-[1.1] font-normal md:text-32"
            >
              An admin console for teams
            </h2>
            <p className="text-base leading-relaxed text-text-secondary">
              Admins manage readers, roles and access, and see usage and cost by
              day and by conversation. Readers just see their books.
            </p>
          </StaggerItem>
        </Stagger>
      </Container>

      {/* 07 */}
      <section
        aria-labelledby="f7"
        className="border-y border-border bg-bg-surface"
      >
        <Container
          className={cn("flex flex-wrap items-start gap-16", sectionY)}
        >
          <Reveal className="flex flex-[1_1_400px] flex-col gap-5">
            <Num n={7} />
            <SectionTitle id="f7" size="md">
              Private by design
            </SectionTitle>
            <p className="text-base leading-relaxed text-text-secondary">
              Your books and conversations belong to your account alone, and you
              can delete any of it. To answer you, the relevant passages are
              sent to OpenAI&apos;s API.
            </p>
          </Reveal>
          <Reveal
            delay={0.15}
            className="flex min-w-0 flex-[1_1_520px] flex-col gap-4"
          >
            <span className="text-xs font-medium tracking-[0.12em] text-text-secondary uppercase">
              Under the hood, for the curious
            </span>
            <dl className="grid grid-cols-[minmax(0,140px)_1fr] border-t border-border text-15 md:grid-cols-[180px_1fr]">
              {UNDER_THE_HOOD.map(([term, desc]) => (
                <div key={term} className="contents">
                  <dt className="border-b border-border py-4 pr-4 text-text-secondary">
                    {term}
                  </dt>
                  <dd className="border-b border-border py-4">{desc}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* CTA */}
      <Container>
        <Reveal className="flex flex-wrap items-center justify-between gap-8 py-24 md:py-28">
          <SectionTitle>Ready when your book is.</SectionTitle>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className={buttonClasses({ size: "lg", variant: "secondary" })}
            >
              Ask us something
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
