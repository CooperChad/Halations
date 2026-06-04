"use client";

import { useEffect, useState, useRef } from "react";

type Phase = "idle" | "pulling" | "dark" | "developing" | "done";

export default function Darkroom() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [pullPct, setPullPct] = useState(0);
  const phaseRef = useRef<Phase>("idle");
  const touchStartY = useRef(0);
  const pulling = useRef(false);
  const wheelAccum = useRef(0);

  function setPhaseSync(p: Phase) {
    phaseRef.current = p;
    setPhase(p);
  }

  function trigger() {
    if (phaseRef.current !== "idle" && phaseRef.current !== "pulling") return;
    setPullPct(0);

    // 1. Lights out
    setPhaseSync("dark");
    document.documentElement.classList.add("darkroom-dark");

    // 2. Start developing after a beat in the dark
    setTimeout(() => {
      setPhaseSync("developing");
      document.documentElement.classList.remove("darkroom-dark");
      document.documentElement.classList.add("darkroom-developing");
    }, 1200);

    // 3. Fully developed
    setTimeout(() => {
      setPhaseSync("done");
      document.documentElement.classList.remove("darkroom-developing");
    }, 4000);

    setTimeout(() => setPhaseSync("idle"), 4200);
  }

  // Touch pull-down
  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      if (window.scrollY > 10) return;
      touchStartY.current = e.touches[0].clientY;
      pulling.current = true;
    }
    function onTouchMove(e: TouchEvent) {
      if (!pulling.current) return;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (dy < 0) { pulling.current = false; setPullPct(0); return; }
      const pct = Math.min(dy / 120, 1);
      setPullPct(pct);
      if (pct > 0 && phaseRef.current === "idle") setPhaseSync("pulling");
    }
    function onTouchEnd() {
      if (!pulling.current) return;
      pulling.current = false;
      if (pullPct >= 0.85) trigger();
      else { setPhaseSync("idle"); setPullPct(0); }
    }
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pullPct]);

  // Desktop overscroll wheel
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (window.scrollY > 10 || e.deltaY >= 0) { wheelAccum.current = 0; return; }
      wheelAccum.current += Math.abs(e.deltaY);
      const pct = Math.min(wheelAccum.current / 300, 1);
      setPullPct(pct);
      if (phaseRef.current === "idle" && pct > 0) setPhaseSync("pulling");
      if (pct >= 1) { wheelAccum.current = 0; trigger(); }
    }
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Red safelight overlay — only during dark phase */}
      {(phase === "dark" || phase === "pulling") && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9985,
          background: phase === "dark"
            ? "rgba(6, 0, 0, 0.97)"
            : `rgba(6,0,0,${pullPct * 0.95})`,
          pointerEvents: "none",
          transition: phase === "dark" ? "opacity 0.4s ease-in" : "none",
        }}>
          {/* Safelight glow */}
          {phase === "dark" && (
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 50% 30%, rgba(160,10,0,0.25) 0%, transparent 60%)",
              animation: "safelightPulse 1.2s ease-in-out infinite alternate",
            }} />
          )}
        </div>
      )}

      {/* Pull indicator */}
      {phase === "pulling" && pullPct > 0.2 && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          zIndex: 9986, color: `rgba(200,80,0,${(pullPct - 0.2) * 1.25})`,
          fontSize: "0.65rem", letterSpacing: "0.2em", fontFamily: "monospace",
          pointerEvents: "none",
        }}>
          ▼ ENTER DARKROOM
        </div>
      )}

      <style>{`
        /* Lights out — page goes black instantly */
        html.darkroom-dark main {
          filter: brightness(0);
          transition: filter 0.3s ease-in;
        }

        /* Developing — emerges from black through sepia amber to full color */
        html.darkroom-developing main {
          animation: develop 2.8s ease-out forwards;
        }

        @keyframes develop {
          0%   { filter: brightness(0); }
          15%  { filter: brightness(0.08) sepia(1) saturate(0.5) contrast(1.4) hue-rotate(10deg); }
          35%  { filter: brightness(0.25) sepia(1) saturate(0.8) contrast(1.3) hue-rotate(5deg); }
          55%  { filter: brightness(0.55) sepia(0.9) saturate(1.0) contrast(1.2); }
          75%  { filter: brightness(0.78) sepia(0.5) saturate(1.1) contrast(1.1); }
          90%  { filter: brightness(0.92) sepia(0.15) saturate(1.05); }
          100% { filter: brightness(1) sepia(0) saturate(1) contrast(1); }
        }

        @keyframes safelightPulse {
          from { opacity: 0.7; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}
