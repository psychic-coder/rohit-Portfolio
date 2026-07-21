import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="section-rule" />
      <About />
      <div className="section-rule" />
      <Experience />
      <div className="section-rule" />
      <Projects />
      <div className="section-rule" />
      <Skills />
      <div className="section-rule" />
      <Certifications />
      <div className="section-rule" />
      <Contact />
    </>
  );
}
