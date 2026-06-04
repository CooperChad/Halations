"use client";

import { ReactNode } from "react";

// Each torn edge is a unique SVG path — top and bottom of the "paper"
const TOP_TEAR =
  "M0,32 C40,8 80,48 120,28 C160,8 200,44 240,24 C280,4 320,40 360,20 C400,0 440,36 480,18 C520,0 560,38 600,22 C640,6 680,42 720,26 C760,10 800,40 840,24 C880,8 920,44 960,28 C1000,12 1040,46 1080,30 C1120,14 1160,48 1200,32 L1200,0 L0,0 Z";

const BOTTOM_TEAR =
  "M0,8 C50,32 100,4 150,22 C200,40 250,6 300,28 C350,50 400,12 450,30 C500,48 550,10 600,26 C650,42 700,8 750,24 C800,40 850,6 900,20 C950,34 1000,2 1050,18 C1100,34 1150,8 1200,24 L1200,56 L0,56 Z";

interface Props {
  children: ReactNode;
  rotate?: number;
  background?: string;
  style?: React.CSSProperties;
}

export default function TornSection({ children, rotate = 0, background = "#f0ebe2", style }: Props) {
  return (
    <div
      style={{
        position: "relative",
        transform: `rotate(${rotate}deg)`,
        zIndex: 2,
        margin: "0 auto",
        ...style,
      }}
    >
      {/* Grain texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px",
          pointerEvents: "none",
          zIndex: 1,
          mixBlendMode: "multiply",
        }}
      />

      {/* Top torn edge */}
      <svg
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: 32, position: "relative", zIndex: 2 }}
      >
        <path d={TOP_TEAR} fill={background} />
      </svg>

      {/* Content */}
      <div style={{ background, position: "relative", zIndex: 2, padding: "0 40px" }}>
        {children}
      </div>

      {/* Bottom torn edge */}
      <svg
        viewBox="0 0 1200 56"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: 56, position: "relative", zIndex: 2 }}
      >
        <path d={BOTTOM_TEAR} fill={background} />
      </svg>

      {/* Drop shadow layer */}
      <div
        style={{
          position: "absolute",
          inset: "8px -4px -8px",
          background: "rgba(80,60,40,0.10)",
          filter: "blur(10px)",
          zIndex: -1,
          borderRadius: "2px",
        }}
      />
    </div>
  );
}
