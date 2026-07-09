import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Stack from "@/components/Stack";
import Workflow from "@/components/Workflow";
import Features from "@/components/Features";
import Verification from "@/components/Verification";
import Escalation from "@/components/Escalation";
import Pricing from "@/components/Pricing";
import FinalCta from "@/components/FinalCta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Stack />
        <Workflow />
        <Features />
        <Verification />
        <Escalation />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
