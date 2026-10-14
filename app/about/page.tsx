import type { Metadata } from "next";
import AboutView from "@/components/pages/AboutView";
import PageChrome from "@/components/pages/PageChrome";

/* The title string is carried over verbatim from the previous page: it is
   already indexed, and the separator is the site's existing convention. */
export const metadata: Metadata = {
  title: "About — Làjà",
  description:
    "Abdulmuiz Adelaja (Làjà), Senior Product Designer. Statistics degree, 6+ years, outcomes-driven design from Lagos to the world.",
};

export default function AboutPage() {
  // The first section paints cream, so the header foreground goes dark.
  return (
    <PageChrome theme="light" current="about">
      <AboutView />
    </PageChrome>
  );
}
