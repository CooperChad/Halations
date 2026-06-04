"use client";

import { useEffect, useState, useRef } from "react";

type Phase = "idle" | "pulling" | "dark" | "developing";

export default function Darkroom() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [pullPct, setPullPct] = useState(0); // 0–1 while pulling
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
    setPhaseSync("dark");
    setPullPct(0);
    setTimeout(() => setPhaseSync("developing"), 800);
    setTimeout(() => setPhaseSync("idle"), 2200);
  }

  // Touch pull-down (mobile + touchscreen laptops)
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
      setPhaseSync(pct > 0 ? "pulling" : "idle");
    }
    function onTouchEnd() {
      if (!pulling.current) return;
      pulling.current = false;
      if (pullPct >= 0.85) {
        trigger();
      } else {
        setPhaseSync("idle");
        setPullPct(0);
      }
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

  // Desktop overscroll (wheel up at top of page)
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (window.scrollY > 10 || e.deltaY >= 0) {
        wheelAccum.current = 0;
        return;
      }
      wheelAccum.current += Math.abs(e.deltaY);
      const pct = Math.min(wheelAccum.current / 300, 1);
      setPullPct(pct);
      if (pct >= 1) {
        wheelAccum.current = 0;
        trigger();
      }
    }
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "idle" && pullPct === 0) return null;

  const opacity =
    phase === "pulling" ? pullPct * 0.92 :
    phase === "dark" ? 0.95 :
    phase === "developing" ? 0.0 : 0;

  const background =
    phase === "developing"
      ? "radial-gradient(ellipse at center, rgba(80,20,0,0.4) 0%, rgba(0,0,0,0) 70%)"
      : "rgba(8, 2, 0, 0.95)";

  return (
    <>
      {/* Dark overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9985,
        background,
        opacity,
        pointerEvents: phase === "idle" ? "none" : "none",
        transition: phase === "dark"
          ? "opacity 0.3s ease-in"
          : phase === "developing"
          ? "opacity 1.4s ease-out, background 0.5s ease"
          : "none",
      }} />

      {/* Red darkroom safelight — only at full dark */}
      {phase === "dark" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9986,
          background: "radial-gradient(ellipse at 50% 40%, rgba(180,20,0,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "safelight 0.8s ease-in-out",
        }} />
      )}

      {/* Pull indicator — hint at top while pulling */}
      {phase === "pulling" && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9987,
          height: 3,
          background: `linear-gradient(to right, rgba(180,20,0,${pullPct}), rgba(220,60,0,${pullPct}))`,
          pointerEvents: "none",
        }} />
      )}

      {phase === "pulling" && pullPct > 0.3 && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          zIndex: 9987, color: `rgba(220,100,0,${(pullPct - 0.3) * 1.4})`,
          fontSize: "0.7rem", letterSpacing: "0.15em", fontFamily: "monospace",
          pointerEvents: "none",
        }}>
          DARKROOM
        </div>
      )}

      <style>{`
        @keyframes safelight {
          0%   { opacity: 0 }
          50%  { opacity: 1 }
          100% { opacity: 0.6 }
        }
      `}</style>
    </>
  );
}
