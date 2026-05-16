"use client";

import { useRef, useState } from "react";
import {
  motion, useInView, AnimatePresence,
} from "framer-motion";

const GREEN = "#7B8C3E";
const SERIF = "var(--font-cormorant), serif";
const MONO  = "var(--font-space-mono), monospace";
const EASE  = [0.25, 0.1, 0.25, 1] as const;
const CINEMATIC: [number, number, number, number] = [0.76, 0, 0.24, 1];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ── Slow Sundays ──────────────────────────────────────────────────────────────
function SlowSundays() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <div
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", textAlign: "center",
        padding: "100px 8vw", position: "relative", overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ y: 0 }}
        animate={inView ? { y: "-100%" } : {}}
        transition={{ duration: 1, ease: CINEMATIC }}
        style={{
          position: "absolute", inset: 0, background: "#0a0a0a",
          zIndex: 10, pointerEvents: "none",
        }}
      />

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, rgba(123,140,62,0.08) 0%, transparent 60%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(circle at 30% 70%, rgba(123,140,62,0.04) 0%, transparent 40%)",
      }} />

      <div style={{ maxWidth: 700, width: "100%", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 40 }}
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, opacity: 0.4, display: "inline-block" }}
          />
          <span style={{
            fontFamily: MONO, fontSize: 11, textTransform: "uppercase",
            letterSpacing: "0.5em", color: "rgba(255,255,255,0.35)",
          }}>
            Every Sunday
          </span>
        </motion.div>

        <div style={{ overflow: "hidden" }}>
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
            style={{
              fontFamily: SERIF, fontSize: "clamp(48px, 7vw, 96px)",
              fontWeight: 300, color: "#fff", lineHeight: 1.05, opacity: 1,
            }}
          >
            Slow Sundays
          </motion.div>
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.45, ease: EASE }}
            style={{
              fontFamily: SERIF, fontSize: "clamp(48px, 7vw, 96px)",
              fontWeight: 300, color: "#fff", lineHeight: 1.05, opacity: 1,
            }}
          >
            Matcha Club
          </motion.div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={inView ? { width: 60, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
            style={{ height: 1, background: "rgba(255,255,255,0.1)" }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
          style={{
            fontFamily: SERIF, fontSize: 18, fontWeight: 300,
            color: "rgba(255,255,255,0.45)", lineHeight: 1.9,
            maxWidth: 480, margin: "32px auto 0", textAlign: "center",
          }}
        >
          A weekly gathering for the community — no agenda, just good matcha and good people.
          Pull up a chair, meet a stranger, leave as friends.
        </motion.p>

        <motion.a
          href="https://www.instagram.com/sakuramatchabar/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 1.1 }}
          whileHover={{ backgroundColor: "rgba(123,140,62,0.1)", borderColor: "rgba(123,140,62,0.3)", opacity: 1 }}
          style={{
            display: "inline-block", marginTop: 48,
            padding: "18px 44px",
            border: "1px solid rgba(255,255,255,0.12)",
            fontFamily: MONO, fontSize: 11, textTransform: "uppercase",
            letterSpacing: "0.25em", color: "#fff", opacity: 0.6,
            textDecoration: "none", borderRadius: 0,
            transition: "background 0.5s ease, border-color 0.5s ease, opacity 0.5s ease",
          }}
        >
          Follow @sakuramatchabar
        </motion.a>
      </div>
    </div>
  );
}

// ── Find Us ───────────────────────────────────────────────────────────────────
function FindUs() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const LOCATIONS = [
    {
      name:    "Victoria Layout",
      address: "33/12, 1st Cross Road,\nVictoria Layout, Bengaluru 560047",
      time:    "11 AM — 8 PM · Daily",
      maps:    "https://maps.google.com/?q=Sakura+Matcha+Bar+Victoria+Layout+Bengaluru",
    },
    {
      name:    "JP Nagar",
      address: "JP Nagar,\nBengaluru",
      time:    "10 AM — 10 PM · Daily",
      maps:    "https://maps.google.com/?q=Sakura+Matcha+Bar+JP+Nagar+Bengaluru",
    },
  ] as const;

  return (
    <div ref={ref} style={{ padding: "140px 8vw" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 32,
        alignItems: "start",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: GREEN, fontSize: 11 }}>●</span>
            <span style={{
              fontFamily: MONO, fontSize: 11, textTransform: "uppercase",
              letterSpacing: "0.4em", color: "rgba(255,255,255,0.3)",
            }}>
              Find Us
            </span>
          </div>
          <h3 style={{
            fontFamily: SERIF, fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 300,
            color: "#fff", margin: "16px 0 0", lineHeight: 1.15, opacity: 1,
          }}>
            Two homes<br />in Bengaluru.
          </h3>
        </motion.div>

        {LOCATIONS.map((loc, i) => (
          <motion.div
            key={loc.name}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.2, ease: EASE }}
            whileHover={{ y: -4, borderColor: "rgba(123,140,62,0.25)", backgroundColor: "rgba(255,255,255,0.035)" }}
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 2, padding: 48,
              minHeight: 220,
              display: "flex", flexDirection: "column",
              transition: "background 0.5s ease, border-color 0.5s ease",
            }}
          >
            <div style={{
              fontFamily: MONO, fontSize: 12, textTransform: "uppercase",
              letterSpacing: "0.25em", color: GREEN, opacity: 1, fontWeight: 500,
            }}>
              {loc.name}
            </div>
            <div style={{
              fontFamily: SERIF, fontSize: 20, fontWeight: 300,
              color: "#fff", opacity: 0.75, marginTop: 20, lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}>
              {loc.address}
            </div>
            <div style={{
              fontFamily: MONO, fontSize: 13,
              color: "rgba(255,255,255,0.45)", marginTop: 24, flex: 1,
            }}>
              {loc.time}
            </div>
            <motion.a
              href={loc.maps}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ opacity: 0.8, x: 3 }}
              style={{
                marginTop: 24, fontFamily: MONO, fontSize: 12,
                color: "#fff", opacity: 0.4, textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6,
                transition: "opacity 0.3s ease",
              }}
            >
              Open in Maps
              <motion.span
                whileHover={{ x: 2, y: -2 }}
                style={{ display: "inline-block" }}
              >
                ↗
              </motion.span>
            </motion.a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function FooterSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [eggOpen, setEggOpen] = useState(false);

  const NAV = [
    { label: "Our Story",    id: "story"  },
    { label: "Menu",         id: "matcha" },
    { label: "Slow Sundays", id: "slow-sundays" },
    { label: "Visit Us",     id: "find-us" },
  ];

  const SOCIAL = [
    { label: "Instagram", href: "https://www.instagram.com/sakuramatchabar/" },
    { label: "Google Maps", href: "https://maps.google.com/?q=Sakura+Matcha+Bar+Bengaluru" },
  ];

  const KANJI = ["桜", "抹", "茶"];

  return (
    <div ref={ref}>
      <div style={{ padding: "0 8vw" }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: EASE }}
          style={{
            height: 1, background: "rgba(255,255,255,0.04)",
            transformOrigin: "left",
          }}
        />
      </div>

      <div style={{
        padding: "100px 8vw 50px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: 80,
        alignItems: "start",
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div style={{ display: "flex" }}>
            {KANJI.map((k, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 0.85 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15, ease: EASE }}
                style={{
                  fontFamily: SERIF, fontSize: "clamp(56px, 8vw, 80px)",
                  color: "#fff", lineHeight: 1, fontWeight: 300,
                }}
              >
                {k}
              </motion.span>
            ))}
          </div>
          <div style={{
            fontFamily: MONO, fontSize: 11, textTransform: "uppercase",
            letterSpacing: "0.4em", color: "rgba(255,255,255,0.4)", marginTop: 12,
          }}>
            Sakura Matcha Bar
          </div>
          <div style={{
            fontFamily: SERIF, fontSize: 15, fontWeight: 300,
            color: "rgba(255,255,255,0.35)", lineHeight: 1.8, marginTop: 24,
          }}>
            Bengaluru&apos;s first matcha bar.<br />
            Ceremonial grade, community first.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {NAV.map((link) => (
            <motion.button
              key={link.label}
              onClick={() => scrollTo(link.id)}
              whileHover={{ x: 4, opacity: 0.9 }}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: MONO, fontSize: 12, textTransform: "uppercase",
                letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)",
                textAlign: "left", padding: "6px 0",
                transition: "opacity 0.3s ease",
              }}
            >
              {link.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {SOCIAL.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4, opacity: 0.9 }}
              style={{
                fontFamily: MONO, fontSize: 12, textTransform: "uppercase",
                letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 0",
                transition: "opacity 0.3s ease",
              }}
            >
              {link.label}
              <motion.span
                whileHover={{ x: 2, y: -2 }}
                style={{ display: "inline-block" }}
              >
                ↗
              </motion.span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      <div style={{ padding: "0 8vw 40px" }}>
        <div style={{ height: 1, background: "rgba(255,255,255,0.03)", marginBottom: 32 }} />
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 20,
        }}>
          <span style={{
            fontFamily: MONO, fontSize: 11,
            color: "rgba(255,255,255,0.2)",
          }}>
            © 2025 Sakura Matcha Bar. All rights reserved.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{
              fontFamily: MONO, fontSize: 10,
              color: "rgba(255,255,255,0.25)",
            }}>
              Designed & Developed by
            </span>
            <motion.a
              href="https://www.instagram.com/codelifewithharsh/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ opacity: 1 }}
              style={{
                fontFamily: SERIF, fontSize: 18, fontWeight: 400,
                color: "rgba(255,255,255,0.5)", textDecoration: "none",
                transition: "opacity 0.3s ease",
              }}
            >
              Harsh
            </motion.a>
            <span style={{
              fontFamily: MONO, fontSize: 11,
              color: "rgba(255,255,255,0.2)",
            }}>
              ·
            </span>
            <motion.a
              href="https://www.instagram.com/codelifewithharsh/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ opacity: 0.6 }}
              style={{
                fontFamily: MONO, fontSize: 11,
                color: "rgba(255,255,255,0.3)", textDecoration: "none",
                transition: "opacity 0.3s ease",
              }}
            >
              @codelifewithharsh
            </motion.a>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          <motion.div
            onHoverStart={() => setEggOpen(true)}
            onHoverEnd={() => setEggOpen(false)}
            style={{ display: "flex", alignItems: "center", cursor: "default", overflow: "hidden" }}
          >
            <div style={{
              width: 4, height: 4, borderRadius: "50%",
              background: GREEN, flexShrink: 0,
            }} />
            <AnimatePresence>
              {eggOpen && (
                <motion.span
                  key="egg"
                  initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                  animate={{ width: "auto", opacity: 1, marginLeft: 8 }}
                  exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                  style={{
                    fontFamily: MONO, fontSize: 10,
                    color: "rgba(255,255,255,0.25)",
                    whiteSpace: "nowrap", overflow: "hidden",
                    display: "inline-block",
                  }}
                >
                  made with 🍵 at 2am
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Closing() {
  return (
    <div
      style={{
        width: "100%",
        background: "#0a0a0a",
        scrollSnapAlign: "start",
        scrollSnapStop: "normal",
      }}
    >
      <div id="slow-sundays">
        <SlowSundays />
      </div>
      <div id="find-us">
        <FindUs />
      </div>
      <FooterSection />
    </div>
  );
}
