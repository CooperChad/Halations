"use client";

import { ReactNode } from "react";

// Top torn edge — jagged paper tear, paper is BELOW so torn edge faces down into the section
// The fill (paper) occupies the bottom portion, torn edge is at the top
const TOP_TEAR =
  "M0,48 L0,48 L18,38 L22,44 L30,30 L36,42 L44,22 L50,36 L58,18 L63,32 L70,14 L76,28 L82,8 L88,26 L95,4 L100,20 L108,10 L114,30 L120,16 L127,34 L133,12 L140,28 L146,6 L153,24 L160,14 L167,32 L174,8 L180,22 L188,2 L194,18 L202,28 L208,10 L216,36 L222,20 L230,6 L237,26 L244,14 L250,32 L257,4 L263,22 L270,16 L278,34 L284,8 L292,28 L298,12 L305,30 L312,2 L318,20 L326,14 L332,32 L340,6 L346,24 L354,16 L360,36 L368,10 L374,28 L382,4 L388,22 L396,12 L402,30 L410,8 L416,26 L424,18 L430,38 L438,14 L444,32 L452,6 L458,24 L466,10 L472,28 L480,2 L486,20 L494,14 L500,34 L508,8 L514,26 L522,16 L528,32 L536,4 L542,22 L550,12 L556,30 L564,6 L570,24 L578,14 L584,36 L592,8 L598,26 L606,2 L612,20 L620,10 L626,28 L634,16 L640,34 L648,6 L654,24 L662,12 L668,30 L676,4 L682,22 L690,14 L696,32 L704,8 L710,26 L718,2 L724,20 L732,10 L738,28 L746,16 L752,38 L760,12 L766,30 L774,6 L780,24 L788,14 L794,32 L802,4 L808,22 L816,10 L822,28 L830,2 L836,20 L844,14 L850,34 L858,8 L864,26 L872,16 L878,32 L886,6 L892,24 L900,12 L906,30 L914,4 L920,22 L928,14 L934,36 L942,8 L948,26 L956,2 L962,20 L970,10 L976,28 L984,16 L990,34 L998,6 L1004,24 L1012,12 L1018,30 L1026,4 L1032,22 L1040,14 L1046,32 L1054,8 L1060,26 L1068,2 L1074,20 L1082,10 L1088,28 L1096,16 L1102,38 L1110,12 L1116,30 L1124,6 L1130,24 L1138,14 L1144,32 L1152,4 L1158,22 L1166,10 L1172,28 L1180,2 L1186,20 L1194,12 L1200,30 L1200,48 Z";

// Bottom torn edge — paper is ABOVE so torn edge faces up from the bottom
const BOTTOM_TEAR =
  "M0,0 L0,12 L16,22 L20,14 L28,32 L34,18 L42,38 L48,24 L55,42 L62,28 L68,46 L74,30 L80,44 L87,26 L94,40 L100,20 L108,36 L114,16 L122,34 L128,10 L136,28 L142,44 L150,22 L156,38 L164,14 L170,32 L178,8 L184,26 L192,42 L198,20 L206,36 L212,16 L220,34 L226,10 L234,28 L240,44 L248,22 L254,38 L262,12 L268,30 L276,6 L282,24 L290,40 L296,18 L304,36 L310,14 L318,32 L324,8 L332,26 L338,42 L346,20 L352,38 L360,16 L366,34 L374,10 L380,28 L388,4 L394,22 L402,38 L408,18 L416,36 L422,12 L430,30 L436,6 L444,24 L450,40 L458,20 L464,38 L472,14 L478,32 L486,8 L492,26 L500,42 L506,22 L514,36 L520,16 L528,34 L534,10 L542,28 L548,44 L556,20 L562,38 L570,12 L576,30 L584,6 L590,24 L598,40 L604,18 L612,36 L618,14 L626,32 L632,8 L640,26 L646,42 L654,22 L660,38 L668,16 L674,34 L682,10 L688,28 L696,4 L702,22 L710,38 L716,18 L724,36 L730,12 L738,30 L744,6 L752,24 L758,40 L766,20 L772,38 L780,14 L786,32 L794,8 L800,26 L808,42 L814,22 L822,36 L828,16 L836,34 L842,10 L850,28 L856,44 L864,20 L870,38 L878,12 L884,30 L892,6 L898,24 L906,40 L912,18 L920,36 L926,14 L934,32 L940,8 L948,26 L954,42 L962,22 L968,38 L976,16 L982,34 L990,10 L996,28 L1004,4 L1010,22 L1018,38 L1024,18 L1032,36 L1038,12 L1046,30 L1052,6 L1060,24 L1066,40 L1074,20 L1080,38 L1088,14 L1094,32 L1102,8 L1108,26 L1116,42 L1122,22 L1130,36 L1136,16 L1144,34 L1150,10 L1158,28 L1164,44 L1172,20 L1178,38 L1186,12 L1192,30 L1200,10 L1200,0 Z";

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
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px",
          pointerEvents: "none",
          zIndex: 1,
          mixBlendMode: "multiply",
        }}
      />

      {/* Top torn edge */}
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: 48, position: "relative", zIndex: 2 }}
      >
        <path d={TOP_TEAR} fill={background} />
      </svg>

      {/* Content */}
      <div style={{ background, position: "relative", zIndex: 2, padding: "0 40px" }}>
        {children}
      </div>

      {/* Bottom torn edge */}
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: 48, position: "relative", zIndex: 2 }}
      >
        <path d={BOTTOM_TEAR} fill={background} />
      </svg>

      {/* Drop shadow */}
      <div
        style={{
          position: "absolute",
          inset: "12px -6px -10px",
          background: "rgba(80,60,40,0.12)",
          filter: "blur(12px)",
          zIndex: -1,
        }}
      />
    </div>
  );
}
