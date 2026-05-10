import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import FeaturedProjects from "@/components/work/FeaturedProjects";
import ProjectGrid from "@/components/work/ProjectGrid";

export const metadata: Metadata = {
  title: "Work — Làjà",
  description:
    "Case studies and projects by Abdulmuiz Adelaja (Làjà) — NeoCash, Estility, ProFootball, Workergen, and more.",
};

export default function WorkPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Page header */}
        <section
          style={{
            background: "var(--void)",
            paddingTop: "140px",
            paddingBottom: "var(--s-9)",
            borderBottom: "1px solid var(--ash)",
          }}
        >
          <div className="container-wide">
            <span
              className="t-meta"
              style={{ color: "var(--mist)", display: "block", marginBottom: "var(--s-6)" }}
            >
              Work
            </span>
            <h1
              className="t-display-lg"
              style={{ color: "var(--veil)", maxWidth: "700px" }}
            >
              80+ projects.
            </h1>
            <p
              className="t-editorial-md"
              style={{
                color: "var(--mist)",
                marginTop: "var(--s-4)",
                fontSize: "clamp(22px, 4vw, 52px)",
              }}
            >
              Every one of them measured.
            </p>
          </div>
        </section>

        <FeaturedProjects />
        <ProjectGrid />
      </main>
      <Footer />
    </>
  );
}
