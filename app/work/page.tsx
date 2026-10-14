import type { Metadata } from "next";
import PageChrome from "@/components/pages/PageChrome";
import WorkView from "@/components/pages/WorkView";

/* The title string is carried over verbatim from the previous page: it is
   already indexed, and the separator is the site's existing convention. */
export const metadata: Metadata = {
  title: "Work — Làjà",
  description:
    "Case studies and projects by Abdulmuiz Adelaja (Làjà): NeoCash, Estility, ProFootball, Workergen, and more.",
};

export default function WorkPage() {
  // The first section paints cream, so the header foreground goes dark.
  return (
    <PageChrome theme="light" current="work">
      <WorkView />
    </PageChrome>
  );
}
