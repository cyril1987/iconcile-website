import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import Platform from "@/components/Platform";
import WhyIConcile from "@/components/WhyIConcile";
import GroundHandling from "@/components/GroundHandling";
import Clients from "@/components/Clients";
import About from "@/components/About";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Solutions />
        <Platform />
        <WhyIConcile />
        <GroundHandling />
        <Clients />
        <About />
        <CTA />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
