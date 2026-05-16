"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const GREEN = "#7B8C3E";
const SERIF = "var(--font-cormorant), serif";
const MONO  = "var(--font-space-mono), monospace";

const QUOTE_WORDS = "Two women left the boardroom to follow the tea ceremony.".split(" ");

const STATS = [
  { number: "2",    label: "Founders"     },
  { number: "2024", label: "Established"  },
  { number: "Uji",  label: "Sourced From" },
  { number: "2",    label: "Locations"    },
] as const;

const TAGS = [
  "Japan-Sourced Matcha",
  "Ceremonial Grade",
  "Handcrafted Pottery Mugs",
  "Women-Founded",
  "Community-First",
] as const;

const ease = [0.25, 0.1, 0.25, 1] as const;

function useCounter(target: number, inView: boolean, duration = 1.6) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return count;
}

function CounterNumber({ target, inView }: { target: number; inView: boolean }) {
  const count = useCounter(target, inView);
  return <>{count}</>;
}

export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef   = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const tagsRef    = useRef<HTMLDivElement>(null);

  const quoteInView = useInView(quoteRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.2 });
  const tagsInView  = useInView(tagsRef,  { once: true, amount: 0.2 });

  const wordsDelay    = QUOTE_WORDS.length * 0.04 + 0.2;
  const subtitleDelay = wordsDelay + 0.4;

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        background: "#0a0a0a",
        overflow: "hidden",
        padding: "100px 8vw 80px",
        scrollSnapAlign: "start",
        scrollSnapStop: "normal",
      }}
    >
      {/* Pulsing decorative dot */}
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", width: 6, height: 6, borderRadius: "50%",
          background: GREEN, opacity: 0.06, pointerEvents: "none",
          marginLeft: "3vw", marginTop: "2vh",
        }}
      />

      {/* ── Section label ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease }}
        style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 48 }}
      >
        <span style={{ color: GREEN, fontSize: 9 }}>●</span>
        <span style={{
          fontFamily: MONO, fontSize: 9, textTransform: "uppercase",
          letterSpacing: "0.4em", color: "rgba(255,255,255,0.25)",
        }}>
          Our Story
        </span>
      </motion.div>

      {/* ── Quote ─────────────────────────────────────────────────────────── */}
      <div ref={quoteRef} style={{ maxWidth: 900, position: "relative", marginBottom: 56 }}>
        {/* Giant decorative " */}
        <div aria-hidden style={{
          position: "absolute", top: -40, left: -32,
          fontFamily: SERIF, fontSize: 160, lineHeight: 1,
          color: GREEN, opacity: 0.04, userSelect: "none", pointerEvents: "none",
        }}>
          &ldquo;
        </div>

        <motion.p
          initial="hidden"
          animate={quoteInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
          style={{
            fontFamily: SERIF, fontSize: "clamp(32px, 4.5vw, 60px)", fontWeight: 300,
            color: "#fff", lineHeight: 1.2, margin: 0,
            display: "flex", flexWrap: "wrap", gap: "0.28em",
          }}
        >
          {QUOTE_WORDS.map((word, i) => (
            <motion.span
              key={i}
              variants={{
                hidden:  { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
              }}
              style={{ display: "inline-block" }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

        {/* Animated divider line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={quoteInView ? { width: 60, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: wordsDelay, ease }}
          style={{ height: 1, background: "rgba(255,255,255,0.12)", marginTop: 36 }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={quoteInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: subtitleDelay, ease }}
          style={{
            fontFamily: SERIF, fontSize: 17, fontWeight: 300,
            color: "rgba(255,255,255,0.38)", lineHeight: 1.9,
            maxWidth: 540, margin: "28px 0 0",
          }}
        >
          A scientist and a finance executive walked away from stable careers.
          Sunday pop-ups became a permanent home for Bengaluru&apos;s matcha community.
        </motion.p>
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <motion.div
        ref={statsRef}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: "32px", maxWidth: 800, marginBottom: 64,
        }}
      >
        {STATS.map((stat) => (
          <motion.div
            key={stat.label}
            variants={{
              hidden:  { opacity: 0, y: 32 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
            }}
          >
            <div style={{
              fontFamily: SERIF, fontSize: "clamp(36px, 4vw, 56px)",
              fontWeight: 300, color: "#fff", lineHeight: 1,
            }}>
              {isNaN(Number(stat.number))
                ? stat.number
                : <CounterNumber target={Number(stat.number)} inView={statsInView} />}
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={statsInView ? { width: 30 } : {}}
              transition={{ duration: 0.5, delay: 0.3, ease }}
              style={{ height: 1, background: GREEN, margin: "12px 0" }}
            />
            <div style={{
              fontFamily: MONO, fontSize: 9, textTransform: "uppercase",
              letterSpacing: "0.3em", color: "rgba(255,255,255,0.28)",
            }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Tags ──────────────────────────────────────────────────────────── */}
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={tagsInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}
        >
          <span style={{ color: GREEN, fontSize: 9 }}>●</span>
          <span style={{
            fontFamily: MONO, fontSize: 9, textTransform: "uppercase",
            letterSpacing: "0.4em", color: "rgba(255,255,255,0.25)",
          }}>
            What We Stand For
          </span>
        </motion.div>

        <motion.div
          ref={tagsRef}
          initial="hidden"
          animate={tagsInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
        >
          {TAGS.map((tag) => (
            <motion.span
              key={tag}
              variants={{
                hidden:  { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease } },
              }}
              whileHover={{ borderColor: "rgba(255,255,255,0.25)", opacity: 0.7 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: MONO, fontSize: 10, textTransform: "uppercase",
                letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "12px 24px", borderRadius: 0, cursor: "default",
              }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* ── Location tease ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={tagsInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.5, ease }}
        style={{ marginTop: 64, display: "flex", alignItems: "center", gap: 20 }}
      >
        <div style={{ width: 1, height: 40, background: "rgba(255,255,255,0.06)" }} />
        <div>
          <div style={{
            fontFamily: MONO, fontSize: 9, letterSpacing: "0.4em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.15)",
          }}>
            Est. Bengaluru
          </div>
          <div style={{
            fontFamily: SERIF, fontSize: 15, fontWeight: 300,
            color: "rgba(255,255,255,0.28)", marginTop: 6,
          }}>
            Victoria Layout · JP Nagar
          </div>
        </div>
      </motion.div>
    </section>
  );
}
