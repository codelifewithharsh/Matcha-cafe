"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Brand colors
const CREAM  = "#FAF6F0";
const DARK   = "#2B2B2B";
const GREEN  = "#5C7A45";
const PINK   = "#E8909F";
const MUTED  = "#8A8078";
const SERIF  = "var(--font-cormorant), serif";
const MONO   = "var(--font-space-mono), monospace";

const QUOTE = "Two women left the boardroom to follow the tea ceremony.";
const WORDS = QUOTE.split(" ");

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef   = useRef<(HTMLSpanElement | null)[]>([]);
  const restRef    = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const allWords = wordsRef.current.filter(Boolean) as HTMLElement[];
    const rest     = restRef.current.filter(Boolean) as HTMLElement[];

    [...allWords, ...rest].forEach((el) => {
      el.style.opacity   = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    });

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      allWords.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity   = "1";
          el.style.transform = "translateY(0)";
        }, i * 45);
      });
      rest.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity   = "1";
          el.style.transform = "translateY(0)";
        }, allWords.length * 45 + 400 + i * 150);
      });
    }, { threshold: 0.25 });

    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        minHeight: "100vh",
        background: CREAM,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 8vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Logo placeholder — top center */}
      <div
        ref={(el) => { restRef.current[0] = el; }}
        style={{
          position: "absolute",
          top: "48px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <Image
            src="/logo.jpg"
            alt="Sakura Matcha Bar"
            width={80}
            height={80}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            priority
          />
        </div>
        <span style={{
          fontFamily: MONO,
          fontSize: "9px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: MUTED,
        }}>
          Sakura Matcha Bar
        </span>
      </div>

      {/* Decorative large quotation mark */}
      <div aria-hidden style={{
        position: "absolute",
        top: "80px",
        left: "5vw",
        fontFamily: SERIF,
        fontSize: "200px",
        lineHeight: 1,
        color: GREEN,
        opacity: 0.05,
        userSelect: "none",
        pointerEvents: "none",
      }}>
        &ldquo;
      </div>

      {/* Tagline chip */}
      <div
        ref={(el) => { restRef.current[1] = el; }}
        style={{
          fontFamily: MONO,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.35em",
          color: GREEN,
          marginBottom: "40px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span style={{ width: "24px", height: "1px", background: GREEN, display: "inline-block" }} />
        Bengaluru's First Matcha Bar
        <span style={{ width: "24px", height: "1px", background: GREEN, display: "inline-block" }} />
      </div>

      {/* Animated quote */}
      <p style={{
        fontFamily: SERIF,
        fontSize: "clamp(28px, 4.5vw, 56px)",
        fontWeight: 300,
        color: DARK,
        maxWidth: "720px",
        lineHeight: 1.4,
        textAlign: "center",
        margin: 0,
        marginBottom: "48px",
        position: "relative",
        zIndex: 1,
      }}>
        {WORDS.map((word, i) => (
          <span
            key={i}
            ref={(el) => { wordsRef.current[i] = el; }}
            style={{ display: "inline-block", marginRight: "0.28em" }}
          >
            {word}
          </span>
        ))}
      </p>

      {/* Founder note */}
      <p
        ref={(el) => { restRef.current[2] = el; }}
        style={{
          fontFamily: SERIF,
          fontSize: "16px",
          fontWeight: 300,
          color: MUTED,
          maxWidth: "520px",
          lineHeight: 1.8,
          textAlign: "center",
          margin: 0,
          marginBottom: "48px",
        }}
      >
        A scientist and a finance executive walked away from stable careers
        and Sunday pop-ups became a permanent home for Bengaluru's matcha community.
      </p>

      {/* Divider + est. */}
      <div
        ref={(el) => { restRef.current[3] = el; }}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
      >
        <div style={{ width: "1px", height: "48px", background: `${GREEN}40` }} />
        <span style={{
          fontFamily: MONO,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.3em",
          color: MUTED,
        }}>
          Est. Bengaluru · Victoria Layout & JP Nagar
        </span>
      </div>

      {/* USP pills row */}
      <div
        ref={(el) => { restRef.current[4] = el; }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "center",
          marginTop: "56px",
        }}
      >
        {[
          "Japan-sourced matcha",
          "Ceremonial grade",
          "Handcrafted pottery mugs",
          "Women-founded",
          "Community-first",
        ].map((label) => (
          <span
            key={label}
            style={{
              fontFamily: MONO,
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: GREEN,
              border: `1px solid ${GREEN}50`,
              borderRadius: "100px",
              padding: "8px 18px",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
