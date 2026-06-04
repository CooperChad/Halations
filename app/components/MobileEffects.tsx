"use client";

import { useEffect, useState, useRef } from "react";

export default function MobileEffects() {
  const [isTouch, setIsTouch] = useState(false);
  const [flash, setFlash] = useState(false);
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const [showGyroPrompt, setShowGyroPrompt] = useState(false);
  const lastTap = useRef(0);
  const tilt = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
    if (!touch) return;

    // iOS requires permission for DeviceOrientationEvent
    if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === "function") {
      setShowGyroPrompt(true);
    } else {
      // Android — just start listening
      enableGyro();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function enableGyro() {
    setGyroEnabled(true);
    setShowGyroPrompt(false);

    function onOrientation(e: DeviceOrientationEvent) {
      // gamma = left/right (-90 to 90), beta = front/back (-180 to 180)
      const x = (e.gamma ?? 0) / 30; // normalise to roughly -1..1
      const y = ((e.beta ?? 0) - 45) / 40;
      tilt.current = { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
    }
    window.addEventListener("deviceorientation", onOrientation);

    function tick() {
      const { x, y } = tilt.current;
      const dx = x * 10;
      const dy = y * 6;

      // Apply parallax to hero photo and about heading
      const hero = document.querySelector(".hero-photo") as HTMLElement;
      const heading = document.querySelector(".about-heading") as HTMLElement;
      if (hero) hero.style.transform = `translate(${dx}px, ${dy}px)`;
      if (heading) heading.style.transform = `translate(${dx * 0.5}px, ${dy * 0.5}px)`;

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      cancelAnimationFrame(rafRef.current);
    };
  }

  async function requestGyro() {
    try {
      const perm = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
      if (perm === "granted") enableGyro();
      else setShowGyroPrompt(false);
    } catch {
      setShowGyroPrompt(false);
    }
  }

  // Double-tap flash
  useEffect(() => {
    if (!isTouch) return;
    function onTouch() {
      const now = Date.now();
      if (now - lastTap.current < 320) {
        // Double tap!
        setFlash(true);
        setTimeout(() => setFlash(false), 400);
      }
      lastTap.current = now;
    }
    window.addEventListener("touchend", onTouch);
    return () => window.removeEventListener("touchend", onTouch);
  }, [isTouch]);

  if (!isTouch) return null;

  return (
    <>
      {/* Camera flash */}
      {flash && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9990,
          background: "white",
          pointerEvents: "none",
          animation: "mobileFlash 0.4s ease-out forwards",
        }} />
      )}

      {/* Gyro permission prompt — iOS only */}
      {showGyroPrompt && (
        <div style={{
          position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
          zIndex: 9980, background: "rgba(46,38,22,0.88)",
          backdropFilter: "blur(8px)",
          color: "#f5ead8", padding: "14px 20px",
          borderRadius: 4, display: "flex", alignItems: "center",
          gap: 14, fontSize: "0.8rem", letterSpacing: "0.03em",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          maxWidth: "calc(100vw - 48px)",
          animation: "slideUp 0.4s ease-out",
        }}>
          <span>Tilt your phone to look around</span>
          <button onClick={requestGyro} style={{
            background: "#f5ead8", color: "#2e2616",
            border: "none", borderRadius: 999,
            padding: "6px 16px", fontSize: "0.78rem",
            fontWeight: 400, letterSpacing: "0.02em", whiteSpace: "nowrap",
          }}>
            Enable
          </button>
          <button onClick={() => setShowGyroPrompt(false)} style={{
            background: "none", border: "none", color: "rgba(245,234,216,0.5)",
            fontSize: "1rem", padding: 0,
          }}>×</button>
        </div>
      )}

      <style>{`
        @keyframes mobileFlash {
          0%   { opacity: 0.9; }
          30%  { opacity: 0.9; }
          100% { opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}
