import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Method from "@/components/Method";
import Showcase from "@/components/Showcase";
import Trust from "@/components/Trust";
import Closing from "@/components/Closing";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <SmoothScroll>
        <main>
          <Hero />
          <Manifesto />
          <Method />
          <Showcase />
          <Trust />
          <Closing />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
