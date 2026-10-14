import { notFound } from "next/navigation";
import type { Metadata } from "next";
import UiShowcase from "./UiShowcase";

export const metadata: Metadata = {
  title: "UI components",
  robots: { index: false, follow: false },
};

// Dev-only preview of the design-system components. 404 in production.
export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <UiShowcase />;
}
