"use client";

import { useEffect, useState, useRef } from "react";

type Phase = "idle" | "pulling" | "dark" | "developing" | "done";

const SECTION_SELECTORS = ["nav", "section", "footer"];

export default function Darkroom() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [pullPct, setPullPct] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
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

    // Collect all sections and hide them
    const elements: HTMLElement[] = [];
    SECTION_SELECTORS.forEach(sel => {
      document.querySelectorAll<HTMLElement>(sel).forEach(el => elements.push(el));
    });

    // Lights out
    setPhaseSync("dark");
    elements.forEach(el => {
      el.style.opacity = "0";
      el.style.transition = "none";
    });

    // Show "developing" label after a moment
    setTimeout(() => setShowLabel(true), 400);

    // Start developing each section with staggered delays
    setTimeout(() => {
      setPhaseSync("developing");
      setShowLabel(false);

      elements.forEach((el, i) => {
        const delay = i * 150;
        setTimeout(() => {
          el.style.transition = "none";
          el.style.opacity = "0";
          el.style.filter = "brightness(0.05) sepia(1) contrast(1.5)";
          el.style.transition = "opacity 0.1s, filter 1.2s ease-out";

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.style.opacity = "1";
              el.style.filter = "brightness(1) sepia(0) contrast(1)";
            });
          });
        }, delay);
      });
    }, 1200);

    // Done — clean up inline styles
    const totalTime = 1200 + elements.length * 150 + 1400;
    setTimeout(() => {
      elements.forEach(el => {
        el.style.opacity = "";
        el.style.filter = "";
        el.style.transition = "";
      });
      setPhaseSync("done");
    }, totalTime);

    setTimeout(() => setPhaseSync("idle"), totalTime + 200);
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
      const pct = Math.min(wheelAccum.current / 800, 1);
      setPullPct(pct);
      if (phaseRef.current === "idle" && pct > 0) setPhaseSync("pulling");
      if (pct >= 1) { wheelAccum.current = 0; trigger(); }
    }
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "idle" && pullPct === 0) return null;

  return (
    <>
      {/* Dark overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9985,
        background: "rgba(5, 0, 0, 0.97)",
        opacity: phase === "pulling" ? pullPct * 0.97
               : phase === "dark" ? 1
               : phase === "developing" ? 1
               : 0,
        pointerEvents: "none",
        transition: phase === "dark" ? "opacity 0.35s ease-in"
                  : phase === "done" ? "opacity 0.4s ease-out"
                  : "none",
      }}>
        {/* Red safelight */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 25%, rgba(150,8,0,0.3) 0%, transparent 65%)",
          animation: phase === "dark" ? "safelightPulse 1.4s ease-in-out infinite alternate" : "none",
        }} />
      </div>

      {/* "Your website is DEVELOPING" label */}
      {showLabel && (
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9986, pointerEvents: "none",
          textAlign: "center",
          animation: "fadeInLabel 0.5s ease-out forwards",
        }}>
          <p style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
            letterSpacing: "0.22em",
            color: "rgba(220, 180, 140, 0.7)",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}>
            Your website is
          </p>
          <p style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            letterSpacing: "0.12em",
            /* Film negative: white strip, dark text */
            background: "rgba(240, 220, 180, 0.95)",
            color: "#0a0400",
            padding: "6px 24px 8px",
            display: "inline-block",
            filter: "invert(1)",
            fontStyle: "italic",
          }}>
            Developing
          </p>
        </div>
      )}

      {/* Pull hint */}
      {phase === "pulling" && pullPct > 0.25 && (
        <div style={{
          position: "fixed", top: 18, left: "50%", transform: "translateX(-50%)",
          zIndex: 9986, color: `rgba(200,70,0,${(pullPct - 0.25) * 1.3})`,
          fontSize: "0.65rem", letterSpacing: "0.2em", fontFamily: "monospace",
          pointerEvents: "none",
        }}>
          ▼ DARKROOM
        </div>
      )}

      <style>{`
        @keyframes safelightPulse {
          from { opacity: 0.6; }
          to   { opacity: 1; }
        }
        @keyframes fadeInLabel {
          from { opacity: 0; transform: translate(-50%, -46%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}
