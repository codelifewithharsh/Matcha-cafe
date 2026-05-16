"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import NextImage from "next/image";

// ─── Tune these ──────────────────────────────────────────────────────────────
const PIXELS_PER_FRAME = 8;   // px of scroll per frame — controls overall speed
const LERP_FACTOR      = 0.12; // smoothing: 0 = frozen, 1 = instant
const TOTAL_FRAMES     = 230;
const OVERLAY_DURATION = 0.35;

// ─── Overlays ────────────────────────────────────────────────────────────────
const OVERLAYS = [
  { at: 0.05, side: "left",  heading: "From Uji",        subtitle: "Single-origin · Kyoto, Japan" },
  { at: 0.30, side: "right", heading: "Stone-ground",    subtitle: "Ceremonial grade · First flush" },
  { at: 0.58, side: "left",  heading: "The Pour",        subtitle: "Handcrafted pottery · Every time" },
  { at: 0.80, side: "right", heading: "Sakura Matcha",   subtitle: "Bengaluru's first matcha bar" },
] as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function frameSrc(n: number) {
  return `/frames/ezgif-frame-${String(n).padStart(3, "0")}.png`;
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function activeOverlay(progress: number): { index: number; phase: number } | null {
  for (let i = 0; i < OVERLAYS.length; i++) {
    const ov = OVERLAYS[i];
    if (progress >= ov.at && progress <= ov.at + OVERLAY_DURATION) {
      return { index: i, phase: (progress - ov.at) / OVERLAY_DURATION };
    }
  }
  return null;
}

function phaseToOpacity(phase: number) {
  if (phase < 0.15) return phase / 0.15;
  if (phase > 0.85) return (1 - phase) / 0.15;
  return 1;
}

const FONT        = "var(--font-cormorant), serif";
const TEXT_SHADOW         = "0 4px 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)";
const SUBTITLE_TEXT_SHADOW = "0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.6)";

export default function ScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const framesRef    = useRef<HTMLImageElement[]>([]);


  const logoRef      = useRef<HTMLDivElement>(null);
  const slotRefs     = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const lineRefs     = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const headingRefs  = useRef<(HTMLHeadingElement | null)[]>([null, null, null, null]);
  const subtitleRefs = useRef<(HTMLParagraphElement | null)[]>([null, null, null, null]);

  // Position-based: target progress (0–1), display progress lerps toward it
  const targetProgressRef  = useRef(0);
  const displayProgressRef = useRef(0);
  const rafRef             = useRef<number | null>(null);
  const isRunningRef       = useRef(false);
  const lastDrawnIdxRef    = useRef(-1);
  const lastActiveSlot     = useRef(-1);

  const [loaded, setLoaded]             = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // ── Container height: vh + scrollable distance ──────────────────────────────
  // scrollable distance = TOTAL_FRAMES * PIXELS_PER_FRAME
  // so at max scroll, progress = 1.0 exactly → last frame exactly
  const setContainerHeight = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const scrollable = TOTAL_FRAMES * PIXELS_PER_FRAME;
    el.style.height = `${window.innerHeight + scrollable}px`;
  }, []);

  // ── Draw (cover crop, skip if same frame) ──────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    if (index === lastDrawnIdxRef.current) return;
    lastDrawnIdxRef.current = index;
    const canvas = canvasRef.current;
    const img    = framesRef.current[index];
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width, ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  // ── Overlay DOM mutation ────────────────────────────────────────────────────
  const updateOverlayDOM = useCallback((progress: number) => {
    const active  = activeOverlay(progress);
    const prevIdx = lastActiveSlot.current;

    if (!active || active.index !== prevIdx) {
      if (prevIdx >= 0) {
        const s = slotRefs.current[prevIdx];
        if (s) s.style.opacity = "0";
      }
      lastActiveSlot.current = active ? active.index : -1;
    }
    if (!active) return;

    const { index, phase } = active;
    const slot   = slotRefs.current[index];
    const lineEl = lineRefs.current[index];
    const headEl = headingRefs.current[index];
    const subEl  = subtitleRefs.current[index];
    if (!slot) return;

    const opacity = phaseToOpacity(phase);
    const isLeft  = OVERLAYS[index].side === "left";

    let tx = 0;
    if (phase < 0.15) {
      const t = 1 - opacity;
      tx = isLeft ? -48 * t : 48 * t;
    }
    let headTy = 0;
    if (phase < 0.15) headTy = 32 * (1 - opacity);
    let subTy = 0;
    if (phase < 0.20) subTy = 20 * (1 - phaseToOpacity(Math.max(0, phase - 0.03) / 0.15));
    const lineScale = phase < 0.15 ? opacity : 1;

    slot.style.opacity   = String(opacity);
    slot.style.transform = `translateX(${tx}px)`;
    if (headEl) headEl.style.transform = `translateY(${headTy}px)`;
    if (subEl)  subEl.style.transform  = `translateY(${subTy}px)`;
    if (lineEl) lineEl.style.transform = `scaleX(${lineScale})`;
  }, []);

  // ── rAF loop: lerp displayProgress → targetProgress ────────────────────────
  const startLoop = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const tick = () => {
      const target  = targetProgressRef.current;
      const next    = lerp(displayProgressRef.current, target, LERP_FACTOR);
      const settled = Math.abs(next - target) < 0.0001;
      displayProgressRef.current = settled ? target : next;

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(displayProgressRef.current * (TOTAL_FRAMES - 1))
      );
      drawFrame(frameIdx);
      updateOverlayDOM(displayProgressRef.current);

      if (logoRef.current) {
        const p = displayProgressRef.current;
        logoRef.current.style.opacity = String(p < 0.6 ? 1 : Math.max(0, 1 - (p - 0.6) / 0.2));
      }

      if (settled) { isRunningRef.current = false; rafRef.current = null; return; }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [drawFrame, updateOverlayDOM]);

  // ── Canvas size ─────────────────────────────────────────────────────────────
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    lastDrawnIdxRef.current = -1;
    drawFrame(Math.floor(displayProgressRef.current * (TOTAL_FRAMES - 1)));
  }, [drawFrame]);

  // ── Preload ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    let done = 0;
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameSrc(i + 1);
      img.onload = img.onerror = () => {
        done++;
        setLoadProgress(Math.round((done / TOTAL_FRAMES) * 100));
        if (done === TOTAL_FRAMES) { framesRef.current = images; setLoaded(true); }
      };
      images.push(img);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setContainerHeight();
    syncCanvasSize();
    const onResize = () => { setContainerHeight(); syncCanvasSize(); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [loaded, setContainerHeight, syncCanvasSize]);

  // ── Scroll → position-based progress, zero dead zone ───────────────────────
  useEffect(() => {
    if (!loaded) return;

    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      // scrollable distance = container height - viewport height
      // = TOTAL_FRAMES * PIXELS_PER_FRAME (exactly)
      const scrollable = container.offsetHeight - window.innerHeight;
      const scrolled   = -container.getBoundingClientRect().top;
      // Clamp to [0, 1]: 0 = first frame, 1 = last frame, no overshoot
      targetProgressRef.current = Math.max(0, Math.min(1, scrolled / scrollable));
      startLoop();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded, startLoop]);

  // ── Loading screen ──────────────────────────────────────────────────────────
  if (!loaded) {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#0a0a0a",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "24px", zIndex: 50,
      }}>
        <div style={{
          width: "200px", height: "1px",
          background: "rgba(255,255,255,0.12)", borderRadius: "1px", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${loadProgress}%`,
            background: "rgba(255,255,255,0.85)", transition: "width 0.1s linear",
          }} />
        </div>
        <span style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: "11px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)",
        }}>
          {loadProgress}%
        </span>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    // Height set dynamically by setContainerHeight() — starts at 0 to avoid flash
    <div ref={containerRef} style={{ background: "#0a0a0a" }}>
      <div style={{
        position: "sticky", top: 0, width: "100%", height: "100vh",
        overflow: "hidden", background: "#0a0a0a",
      }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

        {/* Brand logo */}
        <div
          ref={logoRef}
          style={{
            position: "absolute",
            top: "8vh",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <div style={{
            width: "108px",
            height: "108px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <NextImage
              src="/logo.jpg"
              alt="Sakura Matcha Bar"
              width={108}
              height={108}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              priority
            />
          </div>
          <span style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)",
          }}>
            Sakura Matcha Bar
          </span>
        </div>

        {/* Vignette */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
        }} />

        {/* Film grain */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, opacity: 0.04, mixBlendMode: "overlay", pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }} />

        {/* Gradient backdrop for text readability */}
        <div aria-hidden style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        {/* Overlay slots */}
        {OVERLAYS.map((ov, i) => {
          const isLeft = ov.side === "left";
          return (
            <div
              key={ov.heading}
              ref={(el) => { slotRefs.current[i] = el; }}
              style={{
                position: "absolute",
                top: "50%",
                marginTop: "-50vh",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                ...(isLeft
                  ? { left: 0, paddingLeft: "8vw", paddingRight: "45vw", alignItems: "flex-start" }
                  : { right: 0, paddingRight: "8vw", paddingLeft: "45vw", alignItems: "flex-end" }),
                opacity: 0,
                pointerEvents: "none",
              }}
            >
              <div
                ref={(el) => { lineRefs.current[i] = el; }}
                style={{
                  width: "48px", height: "1px",
                  background: "rgba(255,255,255,0.35)", marginBottom: "20px",
                  transformOrigin: isLeft ? "left center" : "right center",
                }}
              />
              <h2
                ref={(el) => { headingRefs.current[i] = el; }}
                style={{
                  fontFamily: FONT, fontSize: "clamp(40px, 6.5vw, 88px)", fontWeight: 600,
                  color: "#fff", letterSpacing: "0.04em", margin: 0, marginBottom: "14px",
                  textAlign: isLeft ? "left" : "right", textShadow: TEXT_SHADOW,
                  lineHeight: 1.0, willChange: "transform",
                }}
              >
                {ov.heading}
              </h2>
              <p
                ref={(el) => { subtitleRefs.current[i] = el; }}
                style={{
                  fontFamily: FONT, fontSize: "clamp(11px, 1.2vw, 14px)", fontWeight: 400,
                  color: "rgba(255,255,255,0.55)", letterSpacing: "0.28em",
                  textTransform: "uppercase", margin: 0,
                  textAlign: isLeft ? "left" : "right", textShadow: SUBTITLE_TEXT_SHADOW,
                  willChange: "transform",
                }}
              >
                {ov.subtitle}
              </p>
            </div>
          );
        })}

      </div>
    </div>
  );
}
