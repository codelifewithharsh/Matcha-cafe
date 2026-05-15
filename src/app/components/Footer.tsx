"use client";

import { useEffect, useRef } from "react";

const CREAM  = "#FAF6F0";
const DARK   = "#2B2B2B";
const GREEN  = "#5C7A45";
const PINK   = "#E8909F";
const MUTED  = "#8A8078";
const SERIF  = "var(--font-cormorant), serif";
const MONO   = "var(--font-space-mono), monospace";

const LOCATIONS = [
  {
    area:    "Victoria Layout",
    address: "33/12, 1st Cross Road, Victoria Layout, Bengaluru 560047",
    hours:   "11 AM – 8 PM · Daily",
  },
  {
    area:    "JP Nagar",
    address: "JP Nagar, Bengaluru",
    hours:   "10 AM – 10 PM · Daily",
  },
];

const NAV = [
  { label: "Our Story",   href: "#" },
  { label: "Menu",        href: "#" },
  { label: "Slow Sundays", href: "#" },
  { label: "Visit Us",   href: "#" },
];

const SOCIAL = [
  { label: "Instagram",  href: "https://instagram.com/sakuramatchabar" },
  { label: "Google Maps", href: "#" },
];

export default function Footer() {
  const wrapRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.opacity   = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      el.style.opacity   = "1";
      el.style.transform = "translateY(0)";
    }, { threshold: 0.1 });

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer
      ref={wrapRef}
      style={{ width: "100%", background: CREAM }}
    >
      {/* Community banner */}
      <div style={{
        background: GREEN,
        padding: "64px 8vw",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "32px",
      }}>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: "9px", textTransform: "uppercase",
            letterSpacing: "0.35em", color: "rgba(255,255,255,0.6)", marginBottom: "12px",
          }}>
            Every Sunday
          </div>
          <h3 style={{
            fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300,
            color: "#fff", margin: 0, lineHeight: 1.1,
          }}>
            Slow Sundays<br />Matcha Club
          </h3>
          <p style={{
            fontFamily: SERIF, fontSize: "16px", fontWeight: 300,
            color: "rgba(255,255,255,0.65)", margin: 0, marginTop: "14px",
            lineHeight: 1.7, maxWidth: "400px",
          }}>
            A weekly gathering for the community — no agenda, just good matcha
            and good people.
          </p>
        </div>
        <a
          href="https://instagram.com/sakuramatchabar"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: SERIF, fontSize: "14px", letterSpacing: "0.15em",
            textTransform: "uppercase", color: GREEN,
            background: "#fff", padding: "16px 36px",
            textDecoration: "none", flexShrink: 0,
            transition: "background 0.3s ease, color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = CREAM;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = "#fff";
          }}
        >
          Follow @sakuramatchabar
        </a>
      </div>

      {/* Locations */}
      <div style={{
        padding: "80px 8vw 0",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "40px",
        borderBottom: `1px solid ${DARK}08`,
        paddingBottom: "64px",
      }}>
        <div>
          <div style={{
            fontFamily: MONO, fontSize: "10px", textTransform: "uppercase",
            letterSpacing: "0.35em", color: GREEN, marginBottom: "20px",
          }}>
            Find Us
          </div>
          <h3 style={{
            fontFamily: SERIF, fontSize: "32px", fontWeight: 300,
            color: DARK, margin: 0, lineHeight: 1.1,
          }}>
            Two homes<br />in Bengaluru.
          </h3>
        </div>
        {LOCATIONS.map((loc) => (
          <div key={loc.area} style={{
            padding: "28px",
            border: `1px solid ${DARK}08`,
            background: "#fff",
          }}>
            <div style={{
              fontFamily: MONO, fontSize: "9px", textTransform: "uppercase",
              letterSpacing: "0.3em", color: PINK, marginBottom: "12px",
            }}>
              {loc.area}
            </div>
            <div style={{
              fontFamily: SERIF, fontSize: "16px", fontWeight: 300,
              color: DARK, lineHeight: 1.6, marginBottom: "12px",
            }}>
              {loc.address}
            </div>
            <div style={{
              fontFamily: MONO, fontSize: "10px", color: MUTED,
              letterSpacing: "0.1em",
            }}>
              {loc.hours}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav + copyright */}
      <div style={{
        padding: "48px 8vw",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "40px",
      }}>
        {/* Brand */}
        <div>
          <div style={{
            fontFamily: SERIF, fontSize: "28px", color: DARK,
            marginBottom: "6px", lineHeight: 1,
          }}>
            桜抹茶
          </div>
          <div style={{
            fontFamily: MONO, fontSize: "10px", color: MUTED,
            letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            Sakura Matcha Bar
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {NAV.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: MONO, fontSize: "10px", textTransform: "uppercase",
                  letterSpacing: "0.2em", color: MUTED, textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = GREEN; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = MUTED; }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {SOCIAL.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: MONO, fontSize: "10px", textTransform: "uppercase",
                  letterSpacing: "0.2em", color: MUTED, textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = GREEN; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = MUTED; }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div style={{
        padding: "20px 8vw",
        borderTop: `1px solid ${DARK}08`,
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "8px",
      }}>
        <span style={{
          fontFamily: MONO, fontSize: "9px", color: MUTED,
          letterSpacing: "0.1em",
        }}>
          © 2024 Sakura Matcha Bar. All rights reserved.
        </span>
        <span style={{
          fontFamily: MONO, fontSize: "9px", color: MUTED,
          letterSpacing: "0.1em",
        }}>
          Bengaluru's first matcha bar · Made with intention
        </span>
      </div>
    </footer>
  );
}
