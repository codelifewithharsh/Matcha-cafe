import ScrollAnimation from "./components/ScrollAnimation";
import Philosophy from "./components/Philosophy";
import Process from "./components/Process";
import Menu from "./components/Menu";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main style={{ background: "#0a0a0a" }}>
      <ScrollAnimation />
      <Menu />
      <Philosophy />
      <Process />
      <Footer />
    </main>
  );
}
