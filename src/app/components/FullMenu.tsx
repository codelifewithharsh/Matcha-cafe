"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion, useInView, AnimatePresence,
} from "framer-motion";

const GREEN = "#7B8C3E";
const SERIF = "var(--font-cormorant), serif";
const MONO = "var(--font-space-mono), monospace";
const EASE = [0.25, 0.1, 0.25, 1] as const;

const TABS = [
  {
    name: "🍵 MATCHA",
    items: [
      { name: "OG Matcha Latte", tag: "SIGNATURE", desc: "Ceremonial grade, whisked into silky steamed milk" },
      { name: "Strawberry Matcha Latte", tag: "TOP SELLER", desc: "Smooth strawberry meets gentle umami" },
      { name: "Blueberry Matcha Latte", desc: "Wild blueberry layered with premium matcha" },
      { name: "Lavender Matcha Latte", tag: "SEASONAL", desc: "French lavender meets Japanese matcha" },
      { name: "Coco Loco Matcha Latte", desc: "Coconut-based, dairy-free" },
      { name: "Dirty Matcha Latte", desc: "Espresso crashes into ceremonial matcha" },
    ],
  },
  {
    name: "☕ COFFEE & OCHA",
    items: [
      { name: "Kyoto-Style Slow Coffee", tag: "HOUSE SPECIAL", desc: "Pour-over & French press, Japanese-inspired" },
      { name: "Americano", desc: "Clean, bold, no-nonsense" },
      { name: "Cappuccino", desc: "Velvety microfoam, perfectly pulled" },
      { name: "Flat White", desc: "Double ristretto, silky milk" },
      { name: "Hojicha Latte", tag: "MUST TRY", desc: "Japanese roasted green tea, smoky & sweet" },
    ],
  },
  {
    name: "🍦 FOOD & SOFT SERVE",
    items: [
      { name: "Matcha Soft Serve", tag: "FAN FAVOURITE", desc: "Slow-churned with real ceremonial matcha" },
      { name: "Hojicha Soft Serve", desc: "Roasted tea flavor in frozen form" },
      { name: "Croissant", desc: "Buttery, flaky, baked fresh daily" },
      { name: "Nori Wraps", tag: "RECOMMENDED", desc: "Savoury seaweed wraps, perfect matcha companion" },
    ],
  },
];

export default function FullMenu() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && activeTab > 0) {
        setDirection(-1);
        setActiveTab(activeTab - 1);
      } else if (e.key === "ArrowRight" && activeTab < TABS.length - 1) {
        setDirection(1);
        setActiveTab(activeTab + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  const handleTabClick = (index: number) => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };

  return (
    <div
      ref={sectionRef}
      style={{
        height: "100vh",
        background: "#0a0a0a",
        padding: "60px 8vw",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        scrollSnapAlign: "start",
        scrollSnapStop: "normal",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ flexShrink: 0, marginBottom: 48 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ color: GREEN, fontSize: 10 }}>●</span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            The Menu
          </span>
        </div>
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 300,
            color: "#fff",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Every cup, made with care.
        </h1>
        <p
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
            margin: "12px 0 0",
          }}
        >
          Starting from ₹300 · No matcha experience required
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
        style={{ display: "flex", gap: 48, marginTop: 48, flexShrink: 0 }}
      >
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => handleTabClick(i)}
            style={{
              fontFamily: MONO,
              fontSize: "clamp(11px, 1vw, 13px)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: activeTab === i ? "#fff" : "rgba(255,255,255,0.25)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 0 12px 0",
              transition: "color 0.3s ease",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== i) {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                activeTab === i ? "#fff" : "rgba(255,255,255,0.25)";
            }}
          >
            {tab.name}
            {activeTab === i && (
              <motion.div
                layoutId="tab-underline"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: GREEN,
                }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Menu Items Container */}
      <div style={{ flex: 1, marginTop: 40, overflow: "hidden", position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              x: direction > 0 ? 60 : -60,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: direction > 0 ? -60 : 60,
            }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 0,
              position: "absolute",
              inset: 0,
              overflow: "auto",
              paddingRight: "1vw",
            }}
          >
            {TABS[activeTab].items.map((item, i) => (
              <motion.div
                key={`${activeTab}-${item.name}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.04,
                  ease: "easeOut",
                }}
                style={{
                  padding: "24px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  display: "block",
                  position: "relative",
                  cursor: "pointer",
                }}
                whileHover={{
                  x: 8,
                  transition: { duration: 0.4, ease: EASE },
                }}
              >
                <motion.div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(255,255,255,0.015)",
                    borderRadius: 0,
                    scaleX: 0,
                    transformOrigin: "left",
                    zIndex: -1,
                  }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />

                {item.tag && (
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: GREEN,
                      opacity: 0.6,
                      transition: "opacity 0.4s ease",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {item.tag}
                  </span>
                )}

                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(20px, 2.5vw, 32px)",
                    fontWeight: 400,
                    color: "#fff",
                    margin: 0,
                    opacity: 0.9,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  {item.name}
                </h3>
                {item.desc && (
                  <p
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(12px, 1vw, 14px)",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.3)",
                      margin: "6px 0 0",
                      maxWidth: 280,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>


      {/* Watermark number */}
      <AnimatePresence>
        <motion.div
          key={activeTab}
          initial={{
            filter: "blur(10px)",
            opacity: 0,
          }}
          animate={{
            filter: "blur(0px)",
            opacity: 0.02,
          }}
          exit={{
            filter: "blur(10px)",
            opacity: 0,
          }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            right: "5vw",
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: SERIF,
            fontSize: "clamp(200px, 25vw, 400px)",
            fontWeight: 300,
            color: "#fff",
            pointerEvents: "none",
            lineHeight: 1,
            zIndex: 0,
          }}
        >
          {String(activeTab + 1).padStart(2, "0")}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
