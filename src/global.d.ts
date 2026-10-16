import type { Locale } from "@/i18n/routing";
import type common from "../messages/en/common.json";
import type meta from "../messages/en/meta.json";
import type nav from "../messages/en/nav.json";
import type auth from "../messages/en/auth.json";
import type marketing from "../messages/en/marketing.json";
import type home from "../messages/en/home.json";
import type features from "../messages/en/features.json";
import type howItWorks from "../messages/en/howItWorks.json";
import type faq from "../messages/en/faq.json";
import type contact from "../messages/en/contact.json";
import type app from "../messages/en/app.json";
import type library from "../messages/en/library.json";
import type conversations from "../messages/en/conversations.json";
import type profile from "../messages/en/profile.json";
import type admin from "../messages/en/admin.json";

// English is the reference: t("…") keys are type-checked against messages/en
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: {
      common: typeof common;
      meta: typeof meta;
      nav: typeof nav;
      auth: typeof auth;
      marketing: typeof marketing;
      home: typeof home;
      features: typeof features;
      howItWorks: typeof howItWorks;
      faq: typeof faq;
      contact: typeof contact;
      app: typeof app;
      library: typeof library;
      conversations: typeof conversations;
      profile: typeof profile;
      admin: typeof admin;
    };
  }
}
