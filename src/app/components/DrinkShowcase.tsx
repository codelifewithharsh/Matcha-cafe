"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import NextImage from "next/image";

const GREEN = "#7B8C3E";
const SERIF = "var(--font-cormorant), serif";
const MONO  = "var(--font-space-mono), monospace";
const EASE  = [0.25, 0.1, 0.25, 1] as const;

const DRINKS = [
  {
    tag:  "The Signature",
    name: "OG Matcha Latte",
    desc: "Ceremonial grade matcha sourced directly from Japan, whisked into silky steamed milk. Served in a handmade pottery mug — no two alike.",
    tags: "Ceremonial Grade · Single-Origin · Japan",
    src:  "/menu/green.png",
  },
  {
    tag:  "Top Seller",
    name: "Strawberry Matcha Latte",
    desc: "The drink that converted an entire city. Smooth strawberry meets the gentle umami of premium matcha. Not sweet, not grassy — perfectly balanced.",
    tags: "Iced & Hot · Fan Favourite",
    src:  "/menu/strawberry.png",
  },
  {
    tag:  "For the Ocha Curious",
    name: "Kyoto-Style Slow Coffee",
    desc: "Pour-over and French press methods, infused with Japanese-inspired flavors. Slow brewed, meant to be savoured — the way mornings should feel.",
    tags: "Pour-Over · French Press · House Infusions",
    src:  "/menu/japenese.png",
  },
] as const;

export default function DrinkShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        background: "#0a0a0a",
        padding: "100px 8vw",
        scrollSnapAlign: "start",
        scrollSnapStop: "normal",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
        style={{ marginBottom: 64 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span style={{ color: GREEN, fontSize: 10 }}>●</span>
          <span style={{
            fontFamily: MONO, fontSize: 10, textTransform: "uppercase",
            letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)",
          }}>
            Featured Drinks
          </span>
        </div>
        <h2 style={{
          fontFamily: SERIF, fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300,
          color: "#fff", margin: 0, lineHeight: 1.05,
        }}>
          Not a trend.<br />A ritual.
        </h2>
      </motion.div>

      {/* Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 32,
      }}>
        {DRINKS.map((drink, i) => (
            <motion.div
              key={drink.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: i * 0.15, ease: EASE }}
            >
              {/* Image */}
              <div
                style={{
                  aspectRatio: "4/5", width: "100%",
                  overflow: "hidden", borderRadius: 4,
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector<HTMLDivElement>("[data-img]");
                  const ov  = e.currentTarget.querySelector<HTMLDivElement>("[data-overlay]");
                  if (img) { img.style.transform = "scale(1.06)"; img.style.filter = "brightness(1.1)"; }
                  if (ov)  ov.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector<HTMLDivElement>("[data-img]");
                  const ov  = e.currentTarget.querySelector<HTMLDivElement>("[data-overlay]");
                  if (img) { img.style.transform = "scale(1)"; img.style.filter = "brightness(1)"; }
                  if (ov)  ov.style.opacity = "0";
                }}
              >
                <div
                  data-img
                  style={{
                    width: "100%", height: "100%", position: "relative",
                    transition: "transform 0.8s cubic-bezier(0.25,0.1,0.25,1), filter 0.8s cubic-bezier(0.25,0.1,0.25,1)",
                    willChange: "transform",
                  }}
                >
                  <NextImage
                    src={drink.src}
                    alt={drink.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div
                  data-overlay
                  style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)",
                    opacity: 0, transition: "opacity 0.5s ease",
                    pointerEvents: "none", borderRadius: 4,
                  }}
                />
              </div>

              {/* Text */}
              <div style={{ marginTop: 24 }}>
                <div style={{
                  fontFamily: MONO, fontSize: 9, textTransform: "uppercase",
                  letterSpacing: "0.3em", color: GREEN, marginBottom: 10,
                }}>
                  {drink.tag}
                </div>
                <h3 style={{
                  fontFamily: SERIF, fontSize: 26, fontWeight: 400,
                  color: "#fff", margin: 0, marginBottom: 12, lineHeight: 1.15,
                }}>
                  {drink.name}
                </h3>
                <p style={{
                  fontFamily: SERIF, fontSize: 14, fontWeight: 300,
                  color: "rgba(255,255,255,0.4)", lineHeight: 1.8,
                  margin: 0, marginBottom: 16, maxWidth: 340,
                }}>
                  {drink.desc}
                </p>
                <div style={{
                  fontFamily: MONO, fontSize: 9, textTransform: "uppercase",
                  letterSpacing: "0.15em", color: "rgba(255,255,255,0.18)",
                }}>
                  {drink.tags}
                </div>
              </div>
            </motion.div>
        ))}
      </div>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
        style={{
          height: 1, background: "rgba(255,255,255,0.05)",
          marginTop: 80, transformOrigin: "left",
        }}
      />
    </section>
  );
}
