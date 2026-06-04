"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SUBJECTS = [
  { id: "logo",      label: "The studio name",         selector: "[data-subject='logo']" },
  { id: "video",     label: "The welcome video",        selector: "[data-subject='video']" },
  { id: "about",     label: "Cooper himself",           selector: "[data-subject='about']" },
  { id: "carousel",  label: "A moment in the gallery",  selector: "[data-subject='carousel']" },
  { id: "map",       label: "The next location",        selector: "[data-subject='map']" },
  { id: "contact",   label: "The booking form",         selector: "[data-subject='contact']" },
  { id: "instagram", label: "The Instagram link",       selector: "[data-subject='instagram']" },
];

const W = 400;
const H = 225; // 16:9

export default function CameraGame() {
  const [active, setActive] = useState(false);
  const [captured, setCaptured] = useState<string[]>([]);
  const [shutter, setShutter] = useState(false);
  const [lastCapture, setLastCapture] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);

  const pos = useRef({ x: typeof window !== "undefined" ? window.innerWidth / 2 : 600, y: typeof window !== "undefined" ? window.innerHeight / 2 : 400 });
  // Animated viewfinder rect (lerped)
  const vf = useRef({ x: 0, y: 0, w: W, h: H });
  const holeRef = useRef<SVGRectElement>(null);
  const frameRef = useRef<SVGRectElement>(null);
  const frameGroupRef = useRef<SVGGElement>(null);
  const lockedRef = useRef<string | null>(null);
  const capturedRef = useRef<string[]>([]);
  const rafRef = useRef<number>(0);
  const done = captured.length === SUBJECTS.length;

  // Don't show on touch devices — check after mount
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    // Only hide on pure touch devices (phones/tablets), not touchscreen laptops
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const noMouse = !window.matchMedia("(pointer: fine)").matches;
    setIsTouch(coarse && noMouse);
  }, []);

  const activate = useCallback(() => {
    setActive(true);
    document.body.classList.add("game-active");
  }, []);

  const deactivate = useCallback(() => {
    setActive(false);
    setCaptured([]);
    setLocked(null);
    setLastCapture(null);
    document.body.classList.remove("game-active");
  }, []);

  // Escape key exits
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape" && active) deactivate(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, deactivate]);

  // Keep refs in sync with state
  useEffect(() => { lockedRef.current = locked; }, [locked]);
  useEffect(() => { capturedRef.current = captured; }, [captured]);

  // Animate viewfinder with lerp + dynamic expand on subject
  useEffect(() => {
    if (!active) return;
    function onMove(e: MouseEvent) { pos.current = { x: e.clientX, y: e.clientY }; }
    window.addEventListener("mousemove", onMove);

    function tick() {
      // Determine target rect
      let tx: number, ty: number, tw: number, th: number;
      const id = lockedRef.current;
      if (id) {
        const subj = SUBJECTS.find(s => s.id === id);
        const el = subj ? document.querySelector(subj.selector) : null;
        if (el) {
          const r = el.getBoundingClientRect();
          const pad = 24;
          tx = r.left - pad;
          ty = r.top - pad;
          tw = r.width + pad * 2;
          th = r.height + pad * 2;
        } else {
          tx = pos.current.x - W / 2; ty = pos.current.y - H / 2; tw = W; th = H;
        }
      } else {
        tx = pos.current.x - W / 2; ty = pos.current.y - H / 2; tw = W; th = H;
      }

      // Lerp
      const t = 0.09;
      vf.current.x += (tx - vf.current.x) * t;
      vf.current.y += (ty - vf.current.y) * t;
      vf.current.w += (tw - vf.current.w) * t;
      vf.current.h += (th - vf.current.h) * t;

      const { x, y, w, h } = vf.current;

      if (holeRef.current) {
        holeRef.current.setAttribute("x", String(x));
        holeRef.current.setAttribute("y", String(y));
        holeRef.current.setAttribute("width", String(w));
        holeRef.current.setAttribute("height", String(h));
      }
      if (frameRef.current) {
        frameRef.current.setAttribute("x", String(x));
        frameRef.current.setAttribute("y", String(y));
        frameRef.current.setAttribute("width", String(w));
        frameRef.current.setAttribute("height", String(h));
      }
      if (frameGroupRef.current) {
        frameGroupRef.current.setAttribute("transform", `translate(${x}, ${y})`);
        // Scale corner brackets with viewfinder size
        const scaleX = w / W;
        const scaleY = h / H;
        frameGroupRef.current.setAttribute("transform", `translate(${x}, ${y}) scale(${scaleX}, ${scaleY})`);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafRef.current); };
  }, [active]);

  // Check if cursor is near a subject
  const checkProximity = useCallback(() => {
    if (!active) return;
    const { x, y } = pos.current;
    let found: string | null = null;
    for (const s of SUBJECTS) {
      if (capturedRef.current.includes(s.id)) continue;
      const el = document.querySelector(s.selector);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(x - cx, y - cy);
      const threshold = Math.min(rect.width, rect.height) * 0.25;
      if (dist < threshold) {
        found = s.id; break;
      }
    }
    setLocked(found);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(checkProximity, 80);
    return () => clearInterval(interval);
  }, [active, checkProximity]);

  function shoot() {
    if (!active || shutter) return;
    setShutter(true);
    if (locked && !captured.includes(locked)) {
      const label = SUBJECTS.find(s => s.id === locked)?.label ?? "";
      setTimeout(() => {
        setCaptured(prev => [...prev, locked]);
        setShutter(false);
        setLastCapture(label);
        setTimeout(() => setLastCapture(null), 2200);
      }, 250);
    } else {
      setTimeout(() => setShutter(false), 180);
    }
  }

  const remaining = SUBJECTS.length - captured.length;

  if (isTouch) return null;

  return (
    <>
      {/* Camera silhouette toggle — no button styling */}
      <div
        onClick={active ? deactivate : activate}
        title={active ? "Exit (or press Esc)" : "Pick up the camera"}
        className={active ? "" : "camera-wiggle"}
        style={{
          position: "fixed", top: 22, right: 22, zIndex: 9999,
          width: 40, height: 32,
          cursor: "pointer",
          opacity: active ? 0.5 : 1,
          transition: "opacity 0.2s",
        }}
      >
        <svg viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 4H26L29 9H37C38.1 9 39 9.9 39 11V27C39 28.1 38.1 29 37 29H3C1.9 29 1 28.1 1 27V11C1 9.9 1.9 9 3 9H11L14 4Z"
            fill="#2e2616"/>
          <circle cx="20" cy="19" r="6" fill="#f5ead8"/>
          <circle cx="20" cy="19" r="4" fill="#2e2616"/>
          <circle cx="33" cy="13" r="1.5" fill="#f5ead8"/>
        </svg>
      </div>

      {active && (
        <>
          {/* Click target */}
          <div onClick={shoot} style={{ position: "fixed", inset: 0, zIndex: 9992, cursor: "none" }} />

          {/* Shutter flash — only inside the viewfinder */}
          {shutter && (
            <div style={{
              position: "fixed",
              left: vf.current.x,
              top: vf.current.y,
              width: vf.current.w, height: vf.current.h,
              background: "white",
              zIndex: 9996, pointerEvents: "none",
              animation: "shutterFlash 0.25s ease-out forwards",
            }} />
          )}

          {/* Capture label */}
          {lastCapture && (
            <div style={{
              position: "fixed", bottom: 40, left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(46,38,22,0.9)", color: "#f5ead8",
              fontFamily: "var(--font-playfair), serif",
              fontSize: "0.9rem", padding: "10px 22px", borderRadius: 2,
              zIndex: 9997, pointerEvents: "none", letterSpacing: "0.04em",
              animation: "fadeUp 0.3s ease-out",
            }}>
              📷 {lastCapture}
            </div>
          )}

          {/* Film counter HUD */}
          <div style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 9997,
            background: "rgba(46,38,22,0.85)", color: "#f5ead8",
            fontFamily: "monospace", fontSize: "0.7rem",
            padding: "8px 14px", borderRadius: 2, letterSpacing: "0.1em",
            lineHeight: 1.9, pointerEvents: "none",
          }}>
            <div style={{ color: "#c8b898" }}>◉ HALATION</div>
            {done
              ? <div style={{ color: "#b8d898" }}>✓ ROLL COMPLETE</div>
              : <div>{String(remaining).padStart(2,"0")} LEFT  ·  {locked ? <span style={{color:"#e8c84a"}}>IN FRAME</span> : "SEARCHING"}</div>
            }
          </div>

          {/* Top hint banner */}
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 9997,
            display: "flex", justifyContent: "center", alignItems: "center",
            padding: "12px 24px",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            color: "rgba(245,234,216,0.75)",
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.78rem", letterSpacing: "0.08em",
            pointerEvents: "none",
            animation: "fadeInDown 0.6s ease-out forwards",
            gap: "32px",
          }}>
            <span>🎞 Find all {SUBJECTS.length} subjects across the page</span>
            <span style={{ color: "rgba(245,234,216,0.4)" }}>·</span>
            <span>Click the camera or press <kbd style={{
              background: "rgba(245,234,216,0.12)", border: "1px solid rgba(245,234,216,0.2)",
              borderRadius: 3, padding: "1px 6px", fontSize: "0.72rem",
            }}>ESC</kbd> to exit</span>
          </div>

          {/* Roll complete modal */}
          {done && (
            <div style={{
              position: "fixed", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#f5ead8", border: "1px solid #c8b898",
              padding: "36px 44px", borderRadius: 2, zIndex: 9998,
              textAlign: "center", boxShadow: "0 8px 40px rgba(46,38,22,0.25)",
            }}>
              <p style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.5rem", color: "#2e2616", marginBottom: 8 }}>
                Roll developed.
              </p>
              <p style={{ color: "#8a7a62", fontSize: "0.85rem", marginBottom: 24 }}>
                You found all {SUBJECTS.length} subjects.
              </p>
              <button onClick={deactivate} style={{
                background: "#2e2616", color: "#f5ead8", border: "none",
                borderRadius: 999, padding: "9px 26px", fontSize: "0.85rem", letterSpacing: "0.02em",
              }}>
                Put the camera away
              </button>
            </div>
          )}

          {/* SVG overlay — black surround with viewfinder hole */}
          <svg
            style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 9993, pointerEvents: "none" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id="vf-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect ref={holeRef} x="0" y="0" width={W} height={H} fill="black" />
              </mask>
            </defs>

            {/* Dark surround */}
            <rect width="100%" height="100%" fill="rgba(0,0,0,0.90)" mask="url(#vf-mask)" />

            {/* Viewfinder frame border */}
            <rect ref={frameRef} x="0" y="0" width={W} height={H}
              fill="none"
              stroke={locked ? "rgba(232,200,74,0.9)" : "rgba(46,38,22,0.5)"}
              strokeWidth="1.5" />

            {/* Corner brackets + crosshair — dark so visible on light content */}
            <g ref={frameGroupRef} transform="translate(0,0)">
              {/* TL */}
              <path d={`M 12 28 L 12 12 L 28 12`} stroke={locked ? "#e8c84a" : "rgba(46,38,22,0.75)"} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              {/* TR */}
              <path d={`M ${W-28} 12 L ${W-12} 12 L ${W-12} 28`} stroke={locked ? "#e8c84a" : "rgba(46,38,22,0.75)"} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              {/* BL */}
              <path d={`M 12 ${H-28} L 12 ${H-12} L 28 ${H-12}`} stroke={locked ? "#e8c84a" : "rgba(46,38,22,0.75)"} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              {/* BR */}
              <path d={`M ${W-28} ${H-12} L ${W-12} ${H-12} L ${W-12} ${H-28}`} stroke={locked ? "#e8c84a" : "rgba(46,38,22,0.75)"} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              {/* Center crosshair */}
              <line x1={W/2} y1={H/2 - 12} x2={W/2} y2={H/2 - 4} stroke={locked ? "#e8c84a" : "rgba(46,38,22,0.6)"} strokeWidth="1.5"/>
              <line x1={W/2} y1={H/2 + 4} x2={W/2} y2={H/2 + 12} stroke={locked ? "#e8c84a" : "rgba(46,38,22,0.6)"} strokeWidth="1.5"/>
              <line x1={W/2 - 12} y1={H/2} x2={W/2 - 4} y2={H/2} stroke={locked ? "#e8c84a" : "rgba(46,38,22,0.6)"} strokeWidth="1.5"/>
              <line x1={W/2 + 4} y1={H/2} x2={W/2 + 12} y2={H/2} stroke={locked ? "#e8c84a" : "rgba(46,38,22,0.6)"} strokeWidth="1.5"/>
              {/* Center dot */}
              <circle cx={W/2} cy={H/2} r="2" fill={locked ? "#e8c84a" : "rgba(46,38,22,0.6)"}/>
            </g>
          </svg>
        </>
      )}

      <style>{`
        @keyframes shutterFlash {
          0% { opacity: 0.9 }
          100% { opacity: 0 }
        }
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateX(-50%) translateY(8px) }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) }
        }
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(0deg) scale(1); }
          15% { transform: rotate(-15deg) scale(1.12); }
          30% { transform: rotate(13deg) scale(1.08); }
          45% { transform: rotate(-8deg) scale(1.04); }
          60% { transform: rotate(6deg); }
          75% { transform: rotate(-3deg); }
        }
        .camera-wiggle { animation: wiggle 1.6s ease-in-out 1.5s infinite; }
        .camera-wiggle:hover { animation: none; transform: scale(1.12); }
        .game-active * { cursor: none !important; }
      `}</style>
    </>
  );
}
