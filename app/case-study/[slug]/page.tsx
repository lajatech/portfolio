import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { caseStudies } from "@/lib/data";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import ProblemStatement from "@/components/case-study/ProblemStatement";
import ProcessSection from "@/components/case-study/ProcessSection";
import ScreensGallery from "@/components/case-study/ScreensGallery";
import ResultsSection from "@/components/case-study/ResultsSection";
import TestimonialBlock from "@/components/case-study/TestimonialBlock";
import NextProject from "@/components/case-study/NextProject";

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

  return (
    <>
      <Nav />
      <main>
        <CaseStudyHeader cs={cs} />
        <ProblemStatement cs={cs} />
        <ProcessSection cs={cs} />
        <ScreensGallery cs={cs} />
        <ResultsSection cs={cs} />
        <TestimonialBlock cs={cs} />
        <NextProject cs={cs} />
      </main>
      <Footer />
    </>
  );
}
