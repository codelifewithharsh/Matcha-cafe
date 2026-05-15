"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Customise overlays here ────────────────────────────────────────────────
const OVERLAYS = [
  {
    at: 0.08,
    heading: "Sourced from the hills of Uji",
    subtitle: "Single-origin ceremonial grade",
  },
  {
    at: 0.35,
    heading: "Whisked to perfection",
    subtitle: "Every pour, a meditation",
  },
  {
    at: 0.65,
    heading: "The moment of impact",
    subtitle: "Feel the cinematic splash",
  },
  {
    at: 0.88,
    heading: "Pure. Ritual. Matcha.",
    subtitle: "Handcrafted with intention",
  },
] as const;

const OVERLAY_DURATION = 0.18;
const TOTAL_FRAMES = 230;
const SCROLL_PX = TOTAL_FRAMES * 8;

// Lower = dreamier lag; higher = snappier. 0.07 is silky cinematic.
const LERP_FACTOR = 0.07;

function frameSrc(n: number) {
  return `/frames/ezgif-frame-${String(n).padStart(3, "0")}.png`;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function overlayForProgress(progress: number) {
  for (const ov of OVERLAYS) {
    const end = ov.at + OVERLAY_DURATION;
    if (progress >= ov.at && progress <= end) {
      const phase = (progress - ov.at) / OVERLAY_DURATION;
      let opacity: number;
      if (phase < 0.25) opacity = phase / 0.25;
      else if (phase > 0.75) opacity = (1 - phase) / 0.25;
      else opacity = 1;
      return {
        heading: ov.heading,
        subtitle: ov.subtitle,
        opacity,
        translateY: phase < 0.25 ? 16 * (1 - opacity) : 0,
      };
    }
  }
  return null;
}

export default function ScrollAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);

  // Direct DOM refs for overlays — no React state in the hot path
  const overlayWrapRef = useRef<HTMLDivElement>(null);
  const overlayHeadingRef = useRef<HTMLHeadingElement>(null);
  const overlaySubtitleRef = useRef<HTMLParagraphElement>(null);
  const devLabelRef = useRef<HTMLDivElement>(null);

  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const lastFrameIndexRef = useRef(-1);
  const lastOverlayKeyRef = useRef<string | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // ── Draw (cover crop) — only redraws when frame index actually changes ──────
  const drawFrame = useCallback((index: number) => {
    if (index === lastFrameIndexRef.current) return;
    lastFrameIndexRef.current = index;
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }, []);

  // ── Update overlay DOM directly — zero React re-renders ────────────────────
  const updateOverlayDOM = useCallback((progress: number) => {
    const wrap = overlayWrapRef.current;
    if (!wrap) return;
    const ov = overlayForProgress(progress);

    if (!ov) {
      if (lastOverlayKeyRef.current !== null) {
        wrap.style.opacity = "0";
        lastOverlayKeyRef.current = null;
      }
      return;
    }

    // Update text only when the overlay slot changes
    if (lastOverlayKeyRef.current !== ov.heading) {
      lastOverlayKeyRef.current = ov.heading;
      if (overlayHeadingRef.current) overlayHeadingRef.current.textContent = ov.heading;
      if (overlaySubtitleRef.current) overlaySubtitleRef.current.textContent = ov.subtitle;
    }

    wrap.style.opacity = String(ov.opacity);
    wrap.style.transform = `translateY(${ov.translateY}px)`;
  }, []);

  // ── Persistent rAF loop ─────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const tick = () => {
      const target = targetProgressRef.current;
      const next = lerp(smoothProgressRef.current, target, LERP_FACTOR);
      const settled = Math.abs(next - target) < 0.00005;
      smoothProgressRef.current = settled ? target : next;

      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(smoothProgressRef.current * TOTAL_FRAMES)
      );
      drawFrame(frameIndex);
      updateOverlayDOM(smoothProgressRef.current);

      if (process.env.NODE_ENV === "development" && devLabelRef.current) {
        devLabelRef.current.textContent = `frame ${frameIndex + 1} / ${TOTAL_FRAMES}`;
      }

      if (settled) {
        isRunningRef.current = false;
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [drawFrame, updateOverlayDOM]);

  // ── Canvas size ─────────────────────────────────────────────────────────────
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    lastFrameIndexRef.current = -1; // force redraw after resize
    drawFrame(Math.min(TOTAL_FRAMES - 1, Math.floor(smoothProgressRef.current * TOTAL_FRAMES)));
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
        if (done === TOTAL_FRAMES) {
          framesRef.current = images;
          setLoaded(true);
        }
      };
      images.push(img);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    syncCanvasSize();
    window.addEventListener("resize", syncCanvasSize);
    return () => window.removeEventListener("resize", syncCanvasSize);
  }, [loaded, syncCanvasSize]);

  // ── Scroll → update target only ─────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const total = container.offsetHeight - window.innerHeight;
      targetProgressRef.current = Math.max(0, Math.min(1, -rect.top / total));
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
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: "200px",
            height: "1px",
            background: "rgba(255,255,255,0.12)",
            borderRadius: "1px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${loadProgress}%`,
              background: "rgba(255,255,255,0.85)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {loadProgress}%
        </span>
      </div>
    );
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      style={{ height: `${SCROLL_PX}px`, background: "#0a0a0a" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          background: "#0a0a0a",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "100%" }}
        />

        {/* Vignette */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.72) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Film grain */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            mixBlendMode: "overlay",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* Text overlay — driven by direct DOM mutation, never re-renders */}
        <div
          ref={overlayWrapRef}
          style={{
            position: "absolute",
            bottom: "10vh",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            opacity: 0,
            pointerEvents: "none",
            padding: "0 24px",
          }}
        >
          <h2
            ref={overlayHeadingRef}
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(28px, 5vw, 56px)",
              fontWeight: 400,
              color: "#fff",
              letterSpacing: "0.05em",
              margin: 0,
              textAlign: "center",
              textShadow: "0 2px 24px rgba(0,0,0,0.6)",
            }}
          />
          <p
            ref={overlaySubtitleRef}
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "clamp(11px, 1.4vw, 14px)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: 0,
              textAlign: "center",
            }}
          />
        </div>

        {/* Dev frame counter */}
        {process.env.NODE_ENV === "development" && (
          <div
            ref={devLabelRef}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              pointerEvents: "none",
            }}
          >
            frame 0 / {TOTAL_FRAMES}
          </div>
        )}
      </div>
    </div>
  );
}
