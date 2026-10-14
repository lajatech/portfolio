import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { caseStudies } from "@/lib/data";
import CaseStudyView from "@/components/pages/CaseStudyView";
import PageChrome from "@/components/pages/PageChrome";

/* Both of these are unchanged from the previous version of this route: the
   four cases are statically generated at build time, and each one keeps the
   title and description it is already indexed under. */
export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return {};
  return {
    title: `${cs.title} — Làjà`,
    description: cs.tagline,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();

  // The header sits on the cream case header, so its foreground goes dark.
  return (
    <PageChrome theme="light" current="work">
      <CaseStudyView cs={cs} />
    </PageChrome>
  );
}
