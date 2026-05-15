import HeroSection from "./components/HeroSection";
import ScrollAnimation from "./components/ScrollAnimation";

export default function Home() {
  return (
    <main style={{ background: "#0a0a0a" }} className="flex flex-col flex-1">
      <ScrollAnimation />
    </main>
  );
}
