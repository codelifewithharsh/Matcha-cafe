import ScrollAnimation from "./components/ScrollAnimation";
import DrinkShowcase from "./components/DrinkShowcase";
import FullMenu from "./components/FullMenu";
import Story from "./components/Story";
import Closing from "./components/Closing";

export default function Home() {
  return (
    <main
      style={{
        background: "#0a0a0a",
        scrollSnapType: "y proximity",
        scrollBehavior: "smooth",
      }}
    >
      <ScrollAnimation />
      <DrinkShowcase />
      <FullMenu />
      <Story />
      <Closing />
    </main>
  );
}
