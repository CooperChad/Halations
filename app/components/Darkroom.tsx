"use client";

import { useEffect, useState, useRef } from "react";

type Phase = "idle" | "inverted" | "developing" | "done";

export default function Darkroom() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [showLabel, setShowLabel] = useState(false);
  const phaseRef = useRef<Phase>("idle");
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    mainRef.current = document.querySelector("main");
  }, []);

  function trigger() {
    if (phaseRef.current !== "idle") return;
    const main = mainRef.current;
    if (!main) return;

    // 1. Instantly invert the page
    phaseRef.current = "inverted";
    setPhase("inverted");
    main.style.transition = "none";
    main.style.filter = "invert(1) sepia(0.3)";

    // 2. Show label
    setTimeout(() => setShowLabel(true), 200);

    // 3. Slowly develop back to normal
    setTimeout(() => {
      phaseRef.current = "developing";
      setPhase("developing");
      setShowLabel(false);
      main.style.transition = "filter 3s ease-out";
      main.style.filter = "invert(0) sepia(0)";
    }, 1800);

    // 4. Clean up
    setTimeout(() => {
      main.style.transition = "";
      main.style.filter = "";
      phaseRef.current = "idle";
      setPhase("idle");
    }, 5000);
  }

  return (
    <>
      {/* Film negative button — left side */}
      <div
        onClick={trigger}
        title="Develop"
        style={{
          position: "fixed",
          left: 18,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 9990,
          cursor: "pointer",
          opacity: phase === "idle" ? 1 : 0.3,
          transition: "opacity 0.3s",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "center",
        }}
      >
        {/* Film strip icon */}
        <svg width="18" height="42" viewBox="0 0 18 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Film strip body */}
          <rect x="0" y="0" width="18" height="42" rx="1" fill="#2e2616"/>
          {/* Sprocket holes */}
          <rect x="2" y="3" width="4" height="4" rx="0.5" fill="#f5ead8"/>
          <rect x="2" y="10" width="4" height="4" rx="0.5" fill="#f5ead8"/>
          <rect x="2" y="17" width="4" height="4" rx="0.5" fill="#f5ead8"/>
          <rect x="2" y="24" width="4" height="4" rx="0.5" fill="#f5ead8"/>
          <rect x="2" y="31" width="4" height="4" rx="0.5" fill="#f5ead8"/>
          <rect x="2" y="38" width="4" height="2" rx="0.5" fill="#f5ead8"/>
          <rect x="12" y="3" width="4" height="4" rx="0.5" fill="#f5ead8"/>
          <rect x="12" y="10" width="4" height="4" rx="0.5" fill="#f5ead8"/>
          <rect x="12" y="17" width="4" height="4" rx="0.5" fill="#f5ead8"/>
          <rect x="12" y="24" width="4" height="4" rx="0.5" fill="#f5ead8"/>
          <rect x="12" y="31" width="4" height="4" rx="0.5" fill="#f5ead8"/>
          <rect x="12" y="38" width="4" height="2" rx="0.5" fill="#f5ead8"/>
          {/* Exposure window */}
          <rect x="6" y="8" width="6" height="26" rx="0.5" fill="#8a7a62" opacity="0.6"/>
        </svg>
      </div>

      {/* "Halation Studio is Developing" label */}
      {showLabel && (
        <div style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9995, pointerEvents: "none",
          textAlign: "center",
          animation: "fadeInLabel 0.4s ease-out forwards",
        }}>
          <p style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            letterSpacing: "0.06em",
            color: "rgba(245, 220, 160, 0.9)",
            fontStyle: "italic",
            marginBottom: "10px",
          }}>
            Halation Studio is
          </p>
          <p style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "clamp(1.8rem, 5vw, 3rem)",
            letterSpacing: "0.12em",
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

      <style>{`
        @keyframes fadeInLabel {
          from { opacity: 0; transform: translate(-50%, -46%); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}
