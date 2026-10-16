"use client";

import { useRef, useState, type FormEvent } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useLocale, useTranslations } from "next-intl";
import { CircleCheck, Lightbulb, LifeBuoy, Send } from "lucide-react";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT, Reveal } from "@/components/motion";
import { RiseIn } from "@/components/motion/RiseIn";
import MarketingShell, {
  Container,
  Eyebrow,
  SectionTitle,
} from "@/components/Marketing/MarketingShell";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { contactService } from "@/lib/api/services/contact.service";
import { useToast } from "@/contexts/ToastContext";

// The value sent to the API stays English (it lands in the team's inbox);
// the label is translated (contact.json → topics.<key>)
const TOPICS = [
  { key: "general", value: "General question" },
  { key: "book", value: "Problem with a book" },
  { key: "account", value: "Account" },
  { key: "idea", value: "Feature idea" },
  { key: "other", value: "Other" },
] as const;

// Mirrors the API's contact validation. Messages are keys: common.json →
// "validation" (shared) or contact.json → "errors"
const contactSchema = z.object({
  name: z.string().trim().min(2, "nameMin").max(100),
  email: z.email("emailInvalid"),
  topic: z.string().min(1),
  message: z.string().trim().min(10, "messageMin").max(5000),
});

type Form = z.infer<typeof contactSchema>;
type Errors = Partial<Record<keyof Form | "captcha", string>>;

const ADDRESSES = [
  { icon: LifeBuoy, email: "support@zaydoun.ai", note: "support" },
  { icon: Lightbulb, email: "feedback@zaydoun.ai", note: "feedback" },
] as const;

const em = (chunks: React.ReactNode) => <em>{chunks}</em>;

export default function ContactPage() {
  const t = useTranslations("contact");
  const tv = useTranslations("common.validation");
  const locale = useLocale();
  const { notify } = useToast();
  const captchaRef = useRef<ReCAPTCHA>(null);
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    topic: TOPICS[0].value,
    message: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (field: keyof Form) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse({
      ...form,
      email: form.email.trim(),
    });
    const next: Errors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues)
        next[issue.path[0] as keyof Form] ??=
          issue.message === "messageMin"
            ? t("errors.messageMin")
            : tv(issue.message as "required");
    }
    if (!captchaToken) next.captcha = t("errors.captcha");
    setErrors(next);
    if (!parsed.success || !captchaToken) return;

    setBusy(true);
    try {
      await contactService.submit({ ...parsed.data, captchaToken });
      setSent(true);
      setForm({ name: "", email: "", topic: TOPICS[0].value, message: "" });
    } catch (err) {
      notify(
        err instanceof Error ? err.message : t("errors.failed"),
        "error",
      );
    } finally {
      // A reCAPTCHA token works once — ask for a fresh one either way
      captchaRef.current?.reset();
      setCaptchaToken(null);
      setBusy(false);
    }
  };

  return (
    <MarketingShell>
      <Container className="flex flex-wrap gap-16 py-20 md:py-28">
        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-7">
          <RiseIn delay={0.1}>
            <Eyebrow>{t("eyebrow")}</Eyebrow>
          </RiseIn>
          <RiseIn delay={0.2}>
            <SectionTitle as="h1" size="lg">
              {t.rich("title", { em })}
            </SectionTitle>
          </RiseIn>
          <RiseIn delay={0.3}>
            <p className="text-17 leading-relaxed text-text-secondary">
              {t("lead")}
            </p>
          </RiseIn>
          <RiseIn
            delay={0.4}
            className="mt-3 flex flex-col border-t border-border"
          >
            {ADDRESSES.map(({ icon: Icon, email, note }) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="group flex items-center gap-4 border-b border-border py-5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-bg-surface text-gold-light">
                  <Icon size={20} aria-hidden />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-base font-medium text-text-primary group-hover:text-gold-light">
                    {email}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {t(`addresses.${note}`)}
                  </span>
                </span>
              </a>
            ))}
          </RiseIn>
        </div>

        <Reveal delay={0.35} y={32} className="flex min-w-0 flex-[1_1_520px]">
          <form
            onSubmit={submit}
            noValidate
            aria-labelledby="contact-form-title"
            className="flex w-full min-w-0 flex-col gap-5 rounded-lg border border-border bg-bg-surface p-6 md:p-9"
          >
            <h2
              id="contact-form-title"
              className="mb-1 font-serif text-26 leading-tight font-medium"
            >
              {t("formTitle")}
            </h2>

            <AnimatePresence>
              {sent && (
                <motion.div
                  role="status"
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 rounded-[10px] border border-success/35 bg-success/8 px-4 py-3.5">
                    <CircleCheck
                      size={20}
                      className="shrink-0 text-success"
                      aria-hidden
                    />
                    <span className="text-sm">
                      <span className="font-semibold">{t("sent")}</span>{" "}
                      <span className="text-text-secondary">
                        {t("sentBody")}
                      </span>
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t("name")}
                placeholder={t("namePlaceholder")}
                autoComplete="name"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                error={errors.name}
                disabled={busy}
              />
              <Input
                label={t("email")}
                type="email"
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                error={errors.email}
                disabled={busy}
              />
            </div>
            <Select
              label={t("subject")}
              value={form.topic}
              onChange={(e) => set("topic")(e.target.value)}
              disabled={busy}
            >
              {TOPICS.map((topic) => (
                <option key={topic.key} value={topic.value}>
                  {t(`topics.${topic.key}`)}
                </option>
              ))}
            </Select>
            <Textarea
              label={t("message")}
              rows={6}
              placeholder={t("messagePlaceholder")}
              value={form.message}
              onChange={(e) => set("message")(e.target.value)}
              error={errors.message}
              disabled={busy}
            />

            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <ReCAPTCHA
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
                  theme="dark"
                  hl={locale === "zh" ? "zh-CN" : locale}
                  // Remount so the widget reloads in the new language
                  key={locale}
                  onChange={(token) => {
                    setCaptchaToken(token);
                    setErrors((e) => ({ ...e, captcha: undefined }));
                  }}
                  onExpired={() => setCaptchaToken(null)}
                />
                {errors.captcha && (
                  <span role="alert" className="text-xs text-error">
                    {errors.captcha}
                  </span>
                )}
              </div>
              <Button type="submit" size="lg" loading={busy}>
                {!busy && <Send size={18} aria-hidden />}
                {t("submit")}
              </Button>
            </div>
          </form>
        </Reveal>
      </Container>
    </MarketingShell>
  );
}
