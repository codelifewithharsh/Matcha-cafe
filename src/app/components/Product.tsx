"use client";

import { useEffect, useRef } from "react";

const CREAM  = "#FAF6F0";
const DARK   = "#2B2B2B";
const GREEN  = "#5C7A45";
const PINK   = "#E8909F";
const MUTED  = "#8A8078";
const SERIF  = "var(--font-cormorant), serif";
const MONO   = "var(--font-space-mono), monospace";

// Signature drinks to spotlight
const DRINKS = [
  {
    name:    "OG Matcha Latte",
    tag:     "The Signature",
    desc:    "Ceremonial grade matcha sourced directly from Japan, whisked into silky steamed milk. Served in a handmade pottery mug crafted by our founder — no two mugs are alike.",
    detail:  "Ceremonial grade · Single-origin · Japan",
  },
  {
    name:    "Strawberry Matcha Latte",
    tag:     "Top Seller",
    desc:    "The drink that converted an entire city. Smooth strawberry meets the gentle umami of premium matcha. Not sweet, not grassy — perfectly balanced.",
    detail:  "Iced & Hot · Fan favourite",
  },
  {
    name:    "Kyoto-Style Slow Coffee",
    tag:     "For the Ocha Curious",
    desc:    "Pour-over and French press methods, infused with Japanese-inspired flavors. Slow brewed, meant to be savoured — the way mornings should feel.",
    detail:  "Pour-over · French press · House infusions",
  },
];

const USPS = [
  { label: "Japan-Sourced",     body: "Matcha imported directly from Japan. Ceremonial grade, first-flush leaves only." },
  { label: "Pottery by Founder", body: "Every mug is hand-thrown by one of our founders. No two are the same." },
  { label: "Women-Founded",     body: "A scientist and a finance executive left corporate life to build something they believed in." },
  { label: "Community-First",   body: "Slow Sundays Matcha Club, sold-out merch, and regulars who feel like family." },
];

export default function Product() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headRef     = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const uspRef      = useRef<HTMLDivElement>(null);
  const imgRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [headRef.current, ...cardRefs.current, uspRef.current, imgRef.current]
      .filter(Boolean) as HTMLElement[];
    els.forEach((el) => {
      el.style.opacity    = "0";
      el.style.transform  = "translateY(28px)";
      el.style.transition = "opacity 0.75s ease, transform 0.75s ease";
    });

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      els.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity   = "1";
          el.style.transform = "translateY(0)";
        }, i * 100);
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ width: "100%", background: CREAM, padding: "100px 8vw 80px" }}
    >
      {/* Header */}
      <div ref={headRef} style={{ marginBottom: "72px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px",
        }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: GREEN }} />
          <span style={{
            fontFamily: MONO, fontSize: "10px", textTransform: "uppercase",
            letterSpacing: "0.4em", color: MUTED,
          }}>
            Why Sakura
          </span>
        </div>
        <h2 style={{
          fontFamily: SERIF, fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 300,
          color: DARK, margin: 0, lineHeight: 1.05,
        }}>
          Not a trend.<br />A ritual.
        </h2>
      </div>

      {/* Signature drinks — horizontal scroll on mobile */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "32px",
        marginBottom: "80px",
      }}>
        {DRINKS.map((drink, i) => (
          <div
            key={drink.name}
            ref={(el) => { cardRefs.current[i] = el; }}
            style={{
              background: "#fff",
              border: `1px solid ${DARK}08`,
              padding: "40px 32px",
              position: "relative",
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform  = "translateY(-6px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow  = "0 12px 40px rgba(92,122,69,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform  = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow  = "none";
            }}
          >
            {/* Image placeholder */}
            <div style={{
              width: "100%",
              aspectRatio: "4/3",
              background: `${GREEN}08`,
              border: `1px dashed ${GREEN}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "28px",
            }}>
              <span style={{
                fontFamily: MONO, fontSize: "10px",
                color: `${GREEN}60`, letterSpacing: "0.1em",
              }}>
                [ Drink Photo ]
              </span>
            </div>

            <div style={{
              fontFamily: MONO, fontSize: "9px", color: PINK,
              textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: "12px",
            }}>
              {drink.tag}
            </div>
            <h3 style={{
              fontFamily: SERIF, fontSize: "26px", fontWeight: 400,
              color: DARK, margin: 0, marginBottom: "14px", lineHeight: 1.1,
            }}>
              {drink.name}
            </h3>
            <p style={{
              fontFamily: SERIF, fontSize: "15px", fontWeight: 300,
              color: MUTED, lineHeight: 1.8, margin: 0, marginBottom: "20px",
            }}>
              {drink.desc}
            </p>
            <div style={{
              fontFamily: MONO, fontSize: "9px", color: GREEN,
              textTransform: "uppercase", letterSpacing: "0.2em",
            }}>
              {drink.detail}
            </div>
          </div>
        ))}
      </div>

      {/* USP grid */}
      <div ref={uspRef}>
        <div style={{
          display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px",
        }}>
          <span style={{ width: "32px", height: "1px", background: PINK, display: "inline-block" }} />
          <span style={{
            fontFamily: MONO, fontSize: "10px", textTransform: "uppercase",
            letterSpacing: "0.35em", color: MUTED,
          }}>
            What makes us different
          </span>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0",
        }}>
          {USPS.map((usp, i) => (
            <div
              key={usp.label}
              style={{
                padding: "32px 28px",
                borderTop: `1px solid ${DARK}08`,
                borderLeft: i % 2 === 1 ? `1px solid ${DARK}08` : "none",
              }}
            >
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: i % 2 === 0 ? GREEN : PINK,
                marginBottom: "16px",
              }} />
              <h4 style={{
                fontFamily: SERIF, fontSize: "20px", fontWeight: 400,
                color: DARK, margin: 0, marginBottom: "10px",
              }}>
                {usp.label}
              </h4>
              <p style={{
                fontFamily: SERIF, fontSize: "14px", fontWeight: 300,
                color: MUTED, lineHeight: 1.7, margin: 0,
              }}>
                {usp.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial pull-quote */}
      <div ref={imgRef} style={{
        marginTop: "80px",
        padding: "48px",
        background: `${GREEN}08`,
        borderLeft: `3px solid ${GREEN}`,
        position: "relative",
      }}>
        <div style={{
          fontFamily: SERIF, fontSize: "60px", color: GREEN, opacity: 0.15,
          lineHeight: 1, position: "absolute", top: "20px", left: "32px",
          userSelect: "none",
        }}>
          &ldquo;
        </div>
        <blockquote style={{
          fontFamily: SERIF,
          fontSize: "clamp(18px, 2.5vw, 26px)",
          fontWeight: 300,
          color: DARK,
          lineHeight: 1.6,
          margin: 0,
          marginBottom: "20px",
          maxWidth: "680px",
          position: "relative",
          zIndex: 1,
        }}>
          Wonderful Matcha Bar, serving some top notch premium single origin matcha,
          directly imported from Japan. A must-do if you find yourself in the city.
        </blockquote>
        <cite style={{
          fontFamily: MONO, fontSize: "10px", color: MUTED,
          textTransform: "uppercase", letterSpacing: "0.25em",
          fontStyle: "normal",
        }}>
          — Wanderlog reviewer
        </cite>
      </div>
    </section>
  );
}
