"use client";

import { useEffect, useRef } from "react";
import NextImage from "next/image";

const GREEN = "#7B8C3E";
const SERIF = "var(--font-cormorant), serif";
const MONO  = "var(--font-space-mono), monospace";

const DRINKS = [
  {
    tag:   "The Signature",
    name:  "OG Matcha Latte",
    desc:  "Ceremonial grade matcha sourced directly from Japan, whisked into silky steamed milk. Served in a handmade pottery mug crafted by our founder — no two mugs are alike.",
    tags:  "Ceremonial Grade · Single-Origin · Japan",
    src:   "/menu/green.png",
  },
  {
    tag:   "Top Seller",
    name:  "Strawberry Matcha Latte",
    desc:  "The drink that converted an entire city. Smooth strawberry meets the gentle umami of premium matcha. Not sweet, not grassy — perfectly balanced.",
    tags:  "Iced & Hot · Fan Favourite",
    src:   "/menu/strawberry.png",
  },
  {
    tag:   "For the Ocha Curious",
    name:  "Kyoto-Style Slow Coffee",
    desc:  "Pour-over and French press methods, infused with Japanese-inspired flavors. Slow brewed, meant to be savoured — the way mornings should feel.",
    tags:  "Pour-Over · French Press · House Infusions",
    src:   "/menu/japenese.png",
  },
] as const;

export default function Menu() {
  const sectionRef  = useRef<HTMLElement>(null);
  const line1Ref    = useRef<HTMLDivElement>(null);
  const line2Ref    = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const imgInnerRef = useRef<(HTMLDivElement | null)[]>([]);

  // ── Fade-in on scroll ─────────────────────────────────────────────────────
  useEffect(() => {
    const headings = [line1Ref.current, line2Ref.current].filter(Boolean) as HTMLElement[];
    const cards    = cardRefs.current.filter(Boolean) as HTMLElement[];

    headings.forEach((el) => {
      el.style.opacity   = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    });
    cards.forEach((el) => {
      el.style.opacity   = "0";
      el.style.transform = "translateY(40px)";
      el.style.transition = "opacity 0.9s cubic-bezier(0.25,0.1,0.25,1), transform 0.9s cubic-bezier(0.25,0.1,0.25,1)";
    });

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();

      headings.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity   = "1";
          el.style.transform = "translateY(0)";
        }, i * 200);
      });
      cards.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity   = "1";
          el.style.transform = "translateY(0)";
        }, headings.length * 200 + 200 + i * 150);
      });
    }, { threshold: 0.15 });

    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // ── Parallax on images ────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      imgRefs.current.forEach((wrapper, i) => {
        const inner = imgInnerRef.current[i];
        if (!wrapper || !inner) return;
        const rect   = wrapper.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - window.innerHeight / 2;
        const shift  = (center / window.innerHeight) * 20;
        inner.style.transform = `translateY(${shift}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        background: "#0a0a0a",
        padding: "120px 0",
      }}
    >
      {/* Section label */}
      <div style={{
        paddingLeft: "8vw",
        marginBottom: "32px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}>
        <span style={{ color: GREEN, fontSize: "10px" }}>●</span>
        <span style={{
          fontFamily: MONO,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.4em",
          color: "rgba(255,255,255,0.3)",
        }}>
          The Menu
        </span>
      </div>

      {/* Heading */}
      <div style={{ paddingLeft: "8vw" }}>
        <div ref={line1Ref} style={{
          fontFamily: SERIF,
          fontSize: "clamp(40px, 6vw, 80px)",
          fontWeight: 300,
          color: "#fff",
          lineHeight: 1.1,
          margin: 0,
        }}>
          Not a trend.
        </div>
        <div ref={line2Ref} style={{
          fontFamily: SERIF,
          fontSize: "clamp(40px, 6vw, 80px)",
          fontWeight: 300,
          color: "#fff",
          lineHeight: 1.1,
          margin: 0,
        }}>
          A ritual.
        </div>
      </div>

      {/* Decorative line */}
      <div style={{
        width: "60px",
        height: "1px",
        background: "rgba(255,255,255,0.08)",
        margin: "40px 0 60px 8vw",
      }} />

      {/* Cards grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "32px",
        padding: "0 8vw",
      }}>
        {DRINKS.map((drink, i) => (
          <div
            key={drink.name}
            ref={(el) => { cardRefs.current[i] = el; }}
          >
            {/* Image container */}
            <div
              ref={(el) => { imgRefs.current[i] = el; }}
              style={{
                aspectRatio: "4/5",
                width: "100%",
                overflow: "hidden",
                borderRadius: "4px",
                position: "relative",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                const inner = imgInnerRef.current[i];
                if (inner) {
                  inner.style.transform      = "scale(1.06) translateY(0px)";
                  inner.style.filter         = "brightness(1.1)";
                  inner.style.transitionProperty = "transform, filter";
                }
                const overlay = e.currentTarget.querySelector<HTMLDivElement>("[data-hover-overlay]");
                if (overlay) overlay.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                const inner = imgInnerRef.current[i];
                if (inner) {
                  inner.style.transform  = "scale(1) translateY(0px)";
                  inner.style.filter     = "brightness(1)";
                }
                const overlay = e.currentTarget.querySelector<HTMLDivElement>("[data-hover-overlay]");
                if (overlay) overlay.style.opacity = "0";
              }}
            >
              {/* Image */}
              <div
                ref={(el) => { imgInnerRef.current[i] = el; }}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
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

              {/* Hover gradient overlay */}
              <div
                data-hover-overlay
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)",
                  opacity: 0,
                  transition: "opacity 0.5s ease",
                  pointerEvents: "none",
                  borderRadius: "4px",
                }}
              />
            </div>

            {/* Text content */}
            <div style={{ marginTop: "24px" }}>
              <div style={{
                fontFamily: MONO,
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                color: GREEN,
                marginBottom: "10px",
              }}>
                {drink.tag}
              </div>
              <h3 style={{
                fontFamily: SERIF,
                fontSize: "26px",
                fontWeight: 400,
                color: "#fff",
                margin: 0,
                marginBottom: "12px",
                lineHeight: 1.15,
              }}>
                {drink.name}
              </h3>
              <p style={{
                fontFamily: SERIF,
                fontSize: "14px",
                fontWeight: 300,
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.8,
                margin: 0,
                marginBottom: "16px",
                maxWidth: "340px",
              }}>
                {drink.desc}
              </p>
              <div style={{
                fontFamily: MONO,
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.2)",
              }}>
                {drink.tags}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View full menu */}
      <div style={{ textAlign: "center", marginTop: "80px" }}>
        <span
          style={{
            fontFamily: SERIF,
            fontSize: "14px",
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.3)",
            cursor: "pointer",
            transition: "opacity 0.4s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLSpanElement).style.opacity = "0.8";
            const arrow = e.currentTarget.querySelector<HTMLSpanElement>("[data-arrow]");
            if (arrow) arrow.style.transform = "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLSpanElement).style.opacity = "1";
            const arrow = e.currentTarget.querySelector<HTMLSpanElement>("[data-arrow]");
            if (arrow) arrow.style.transform = "translateX(0)";
          }}
        >
          View Full Menu
          <span
            data-arrow
            style={{ display: "inline-block", transition: "transform 0.4s ease" }}
          >
            →
          </span>
        </span>
      </div>
    </section>
  );
}
