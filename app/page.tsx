import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import SelectedWork from "@/components/home/SelectedWork";
import MetricBand from "@/components/home/MetricBand";
import TrustedBy from "@/components/home/TrustedBy";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SelectedWork />
        <MetricBand />
        <TrustedBy />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
