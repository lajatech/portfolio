import { Cursor, Hud, Loader, Nav, Toast } from "@/components/chrome";
import ScrollStage from "@/components/stage/ScrollStage";
import { ClayScene } from "@/components/stage/scene";
import Capabilities from "@/components/sections/Capabilities";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Process from "@/components/sections/Process";
import Recognition from "@/components/sections/Recognition";
import Work from "@/components/sections/Work";

/**
 * The single-page experience, in chapter order.
 *
 * Everything that animates lives inside <ScrollStage>, which owns the one rAF
 * loop the whole page shares. The section order here must match CHAPTERS in
 * lib/motion.ts: both the HUD counter and the theme switcher index into that
 * list, so a section added here without a matching entry there would be
 * skipped by the chapter machinery.
 *
 * Contact renders its own footer, since the footer shares that chapter's
 * sticky block and theme.
 */
export default function Home() {
  return (
    <ScrollStage>
      {/* The canvas sits behind everything at z-index 0 and reads the stage,
          so it has to live inside the provider and before <main>. */}
      <ClayScene />
      <Loader />
      <Nav />
      <Hud />
      <main id="top">
        <Hero />
        <Manifesto />
        <Capabilities />
        <Work />
        <Process />
        <Recognition />
        <Contact />
      </main>
      <Cursor />
      <Toast />
    </ScrollStage>
  );
}
