import { setRequestLocale } from "next-intl/server";
import { localeOf, type LocaleParams } from "@/i18n/metadata";
import MarketingShell from "@/components/Marketing/MarketingShell";
import HomeSections from "@/components/Marketing/HomeSections";

export default async function HomePage(props: LocaleParams) {
  // Lets this page prerender per language
  setRequestLocale(await localeOf(props));
  return <HomePageContent />;
}

function HomePageContent() {
  return (
    <MarketingShell>
      <HomeSections />
    </MarketingShell>
  );
}
