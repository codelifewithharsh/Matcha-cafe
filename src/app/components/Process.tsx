"use client";

import { useEffect, useRef } from "react";

const CREAM  = "#FAF6F0";
const DARK   = "#2B2B2B";
const GREEN  = "#5C7A45";
const PINK   = "#E8909F";
const MUTED  = "#8A8078";
const SERIF  = "var(--font-cormorant), serif";
const MONO   = "var(--font-space-mono), monospace";

// Full menu structured as categories
const MENU = [
  {
    category: "Matcha",
    icon: "🍵",
    items: [
      { name: "OG Matcha Latte",        note: "Signature — served in handmade pottery mugs" },
      { name: "Strawberry Matcha Latte", note: "Our top seller. Smooth, not grassy" },
      { name: "Blueberry Matcha Latte",  note: "" },
      { name: "Lavender Matcha Latte",   note: "" },
      { name: "Coco Loco Matcha Latte",  note: "Coconut-based" },
      { name: "Dirty Matcha Latte",      note: "With a shot of espresso" },
      { name: "Soft Girl Latte",         note: "Iced strawberry cafe latte" },
    ],
  },
  {
    category: "Coffee & Ocha",
    icon: "☕",
    items: [
      { name: "Kyoto-Style Slow Coffee", note: "Pour-over & French press with infused flavors" },
      { name: "Americano",               note: "" },
      { name: "Cappuccino",              note: "" },
      { name: "Flat White",              note: "" },
      { name: "Hojicha Latte",           note: "Hot & iced. Japanese roasted green tea" },
    ],
  },
  {
    category: "Food & Soft Serve",
    icon: "🍦",
    items: [
      { name: "Matcha Soft Serve",       note: "Slow-churned" },
      { name: "Hojicha Soft Serve",      note: "" },
      { name: "Croissant",               note: "" },
      { name: "Nori Wraps",              note: "Highly recommended" },
    ],
  },
];

export default function Process() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headRef     = useRef<HTMLDivElement>(null);
  const catRefs     = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const els = [headRef.current, ...catRefs.current].filter(Boolean) as HTMLElement[];
    els.forEach((el) => {
      el.style.opacity   = "0";
      el.style.transform = "translateY(32px)";
      el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    });

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      els.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity   = "1";
          el.style.transform = "translateY(0)";
        }, i * 120);
      });
    }, { threshold: 0.15 });

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
        padding: "100px 8vw 80px",
      }}
    >
      {/* Section header */}
      <div ref={headRef} style={{ marginBottom: "72px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: PINK }} />
          <span style={{
            fontFamily: MONO, fontSize: "10px", textTransform: "uppercase",
            letterSpacing: "0.4em", color: MUTED,
          }}>
            The Menu
          </span>
        </div>
        <h2 style={{
          fontFamily: SERIF, fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300,
          color: DARK, margin: 0, lineHeight: 1.05, letterSpacing: "0.02em",
        }}>
          Every cup,<br />made with care.
        </h2>
        <p style={{
          fontFamily: SERIF, fontSize: "16px", fontWeight: 300,
          color: MUTED, marginTop: "20px", lineHeight: 1.8, maxWidth: "480px",
        }}>
          Starting from ₹300. Our staff will guide you through every sip —
          no matcha experience required.
        </p>
      </div>

      {/* Menu grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "48px 64px",
      }}>
        {MENU.map((cat, ci) => (
          <div
            key={cat.category}
            ref={(el) => { catRefs.current[ci] = el; }}
          >
            {/* Category label */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "28px", paddingBottom: "16px",
              borderBottom: `1px solid ${GREEN}20`,
            }}>
              <span style={{ fontSize: "16px" }}>{cat.icon}</span>
              <span style={{
                fontFamily: MONO, fontSize: "10px", textTransform: "uppercase",
                letterSpacing: "0.3em", color: GREEN,
              }}>
                {cat.category}
              </span>
            </div>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  style={{
                    padding: "14px 0",
                    borderBottom: `1px solid ${DARK}08`,
                  }}
                >
                  <div style={{
                    fontFamily: SERIF, fontSize: "18px", fontWeight: 400,
                    color: DARK, marginBottom: item.note ? "4px" : 0,
                  }}>
                    {item.name}
                  </div>
                  {item.note && (
                    <div style={{
                      fontFamily: SERIF, fontSize: "13px", fontWeight: 300,
                      color: MUTED, lineHeight: 1.5,
                    }}>
                      {item.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Iced / Hot note */}
      <div style={{
        marginTop: "56px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}>
        <div style={{ width: "32px", height: "1px", background: PINK }} />
        <span style={{
          fontFamily: MONO, fontSize: "10px", color: MUTED,
          textTransform: "uppercase", letterSpacing: "0.25em",
        }}>
          All matcha drinks available hot or iced
        </span>
      </div>
    </section>
  );
}
