// The redesign's decorative layers (David's handoff, Nov 2026): diagonal
// section edges with their two lines, blueprint grids, skewed bars, glows,
// faint slabs, plus marks, dimension lines and the blueprint house. Each is
// absolutely placed BEHIND its section's content: the section is `relative
// isolate` (its own stacking context) and these sit at -z-1, ignore the
// pointer and are hidden from screen readers. Colours are the theme's
// (globals.css): third = HB Green #106B37, lime #C4E538, silver #C5CCD0,
// black = HB Black #0B0F0D.

const DECO = "pointer-events-none absolute -z-1";

// ─── Diagonal edge ──────────────────────────────────────────────────────
// Where a light section meets a dark one, the dark side cuts in on a
// diagonal across the full width: 48px tall on phones, 80px from 700px,
// 120px from 1080px. Two lines run along it inside the dark side, always
// 7px (the colour line) and 17px (the silver line) from the edge, whatever
// its height, so they never cross or run off.
//
// `at="top"`: on top of a light section that follows a dark one; the dark
// wedge hangs down on the left and the lines fade out to the right.
// `at="bottom"`: at the bottom of a light section above a dark one; the dark
// wedge rises on the right and the lines fade in from the left.
// `tone`: "green" (4px green line) or "lime" (2.5px lime line).
export const EDGE_HEIGHT = "h-[48px] 700:h-[80px] 1080:h-[120px]";

export function Edge({ at = "top", tone = "green", className = "" }) {
  // Named per variant, not with useId: those numbers came out different on
  // the server and on phones (a hydration mismatch), and every edge of a
  // variant draws the same gradient anyway.
  const id = `edge-${at}-${tone}-`;
  const top = at === "top";
  const color = tone === "lime" ? "#C4E538" : "#106B37";
  const colorWidth = tone === "lime" ? 2.5 : 4;
  // Solid where the dark side is deepest, transparent where it thins out.
  const [x1, x2] = top ? ["100%", "0"] : ["0", "100%"];
  const sign = top ? -1 : 1;

  return (
    <div
      aria-hidden="true"
      className={`${DECO} inset-x-0 ${top ? "-top-px" : "-bottom-px"} ${EDGE_HEIGHT} ${className}`}
    >
      <div
        className="absolute inset-0 bg-black"
        style={{
          clipPath: top
            ? "polygon(0 0, 100% 0, 0 100%)"
            : "polygon(100% 0, 100% 100%, 0 100%)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient
            id={`${id}c`}
            gradientUnits="userSpaceOnUse"
            x1={x1}
            y1="0"
            x2={x2}
            y2="0"
          >
            <stop offset="0" stopColor={color} stopOpacity="0" />
            <stop offset=".45" stopColor={color} />
            <stop offset="1" stopColor={color} />
          </linearGradient>
          <linearGradient
            id={`${id}s`}
            gradientUnits="userSpaceOnUse"
            x1={x1}
            y1="0"
            x2={x2}
            y2="0"
          >
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset=".45" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#C5CCD0" />
          </linearGradient>
        </defs>
        <EdgeLine
          stroke={`url(#${id}c)`}
          width={colorWidth}
          offset={sign * 7}
        />
        <EdgeLine stroke={`url(#${id}s)`} width={2.5} offset={sign * 17} />
      </svg>
    </div>
  );
}

// One line along a diagonal running from the bottom-left corner of its box
// to the top-right, moved `offset` px down (or up, negative). Moving it with
// a transform keeps the offset in px at any box height.
export function EdgeLine({ stroke, width, offset, rising = true }) {
  return (
    <line
      x1="0"
      y1={rising ? "100%" : "0"}
      x2="100%"
      y2={rising ? "0" : "100%"}
      stroke={stroke}
      strokeWidth={width}
      style={{ transform: `translateY(${offset}px)` }}
    />
  );
}

// ─── Cut dark sections ──────────────────────────────────────────────────
// A dark section can cut itself on a diagonal instead of having a light
// neighbour draw a flat black wedge over it: it pulls up (and/or down) into
// its neighbours by the diagonal's height and clips itself to the slant, so
// its own grid, glows and bars fill the slanted part too (the footer, the
// homepage's contact band). Both slants rise to the right. The neighbour it
// overlaps needs that much empty room at its edge, and a section pulled
// DOWN over the next one also needs a z-index above it.
//
// "edge" size: 48px tall on phones, 80px from 700px, 120px from 1080px.
// "band" size (the reviews band, cut but not pulled): 28px, 56px from 1080px.
export const CUT_TOP =
  "[clip-path:polygon(0_48px,100%_0,100%_100%,0_100%)] 700:[clip-path:polygon(0_80px,100%_0,100%_100%,0_100%)] 1080:[clip-path:polygon(0_120px,100%_0,100%_100%,0_100%)]";
export const CUT_BOTH =
  "[clip-path:polygon(0_48px,100%_0,100%_calc(100%-48px),0_100%)] 700:[clip-path:polygon(0_80px,100%_0,100%_calc(100%-80px),0_100%)] 1080:[clip-path:polygon(0_120px,100%_0,100%_calc(100%-120px),0_100%)]";
export const PULL_UP = "-mt-[48px] 700:-mt-[80px] 1080:-mt-[120px]";
export const PULL_DOWN = "-mb-[48px] 700:-mb-[80px] 1080:-mb-[120px]";
export const BAND_CLIP =
  "[clip-path:polygon(0_28px,100%_0,100%_calc(100%-28px),0_100%)] 1080:[clip-path:polygon(0_56px,100%_0,100%_calc(100%-56px),0_100%)]";

const CUT_SIZES = {
  // the line offsets: 7px (colour) and 17px (silver) from the cut
  edge: "h-[48px] 700:h-[80px] 1080:h-[120px] [--cut-near:7px] [--cut-far:17px]",
  band: "h-[28px] 1080:h-[56px] [--cut-near:7px] [--cut-far:15px] 1080:[--cut-near:13px] 1080:[--cut-far:22px]",
};

// The two lines just inside a cut dark section's slant, drawn over its
// background: the colour line (`tone` "green", 4px, or "lime", 2.5px) and
// the silver one. At the top they fade in from the left; at the bottom they
// fade out to the right.
export function CutLines({ at = "top", tone = "green", size = "edge" }) {
  const top = at === "top";
  const id = `cut-${at}-${tone}-`;
  const color = tone === "lime" ? "#C4E538" : "#106B37";
  const colorWidth = tone === "lime" ? 2.5 : 4;
  const [x1, x2] = top ? ["0", "100%"] : ["100%", "0"];
  const shift = (offset) =>
    top ? `translateY(var(${offset}))` : `translateY(calc(var(${offset}) * -1))`;
  return (
    <svg
      aria-hidden="true"
      className={`${DECO} inset-x-0 ${top ? "top-0" : "bottom-0"} w-full overflow-visible ${CUT_SIZES[size]}`}
    >
      <defs>
        <linearGradient id={`${id}c`} gradientUnits="userSpaceOnUse" x1={x1} y1="0" x2={x2} y2="0">
          <stop offset="0" stopColor={color} stopOpacity="0" />
          <stop offset=".45" stopColor={color} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
        <linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1={x1} y1="0" x2={x2} y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset=".45" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C5CCD0" />
        </linearGradient>
      </defs>
      <line
        x1="0" y1="100%" x2="100%" y2="0"
        stroke={`url(#${id}c)`} strokeWidth={colorWidth}
        style={{ transform: shift("--cut-near") }}
      />
      <line
        x1="0" y1="100%" x2="100%" y2="0"
        stroke={`url(#${id}s)`} strokeWidth="2.5"
        style={{ transform: shift("--cut-far") }}
      />
    </svg>
  );
}

// ─── Blueprint grid ─────────────────────────────────────────────────────
// A 24px fine grid under a 120px strong one, 1px lines, faded out by a
// radial mask (`mask`: the ellipse's size and centre, e.g. "62% 70% at 50%
// 30%"). Tones: "light" (green on white), "dark" (green on black),
// "silver" (silver on black), "card" (a touch stronger, inside light cards).
const GRID_TONES = {
  light: ["rgba(16,107,55,0.08)", "rgba(16,107,55,0.04)"],
  card: ["rgba(16,107,55,0.1)", "rgba(16,107,55,0.05)"],
  dark: ["rgba(16,107,55,0.30)", "rgba(16,107,55,0.14)"],
  silver: ["rgba(197,204,208,0.07)", "rgba(197,204,208,0.035)"],
};

export function gridStyle(tone = "light", mask) {
  const [strong, fine] = GRID_TONES[tone];
  const style = {
    backgroundImage: `linear-gradient(${strong} 1px, transparent 1px), linear-gradient(90deg, ${strong} 1px, transparent 1px), linear-gradient(${fine} 1px, transparent 1px), linear-gradient(90deg, ${fine} 1px, transparent 1px)`,
    backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
    backgroundPosition: "center top",
  };
  if (mask) {
    const image = `radial-gradient(ellipse ${mask}, #000 25%, transparent 80%)`;
    style.maskImage = image;
    style.WebkitMaskImage = image;
  }
  return style;
}

export function Grid({ tone = "light", mask, className = "inset-0" }) {
  return (
    <div
      aria-hidden="true"
      className={`${DECO} ${className}`}
      style={gridStyle(tone, mask)}
    />
  );
}

// ─── Skewed bars ────────────────────────────────────────────────────────
// A stack of three bars slanted like the logo's stroke (-38°), longest to
// shortest. `tone`: "green" (solid, thick: for white sections), "lime" or
// "silver" (thin, fading out: for dark ones). `align="end"` lines them up on
// the right (bars that bleed off the right edge), "start" on the left.
// `widths` longest-first in px; `className` places and sizes the stack
// (e.g. scale it down on phones — the outer box carries the transform, the
// inner one the skew).
const BAR_TONES = {
  green: { height: 22, gap: 10, background: () => "#106B37" },
  lime: {
    height: 8,
    gap: 10,
    background: (end) =>
      `linear-gradient(${end ? 270 : 90}deg, #D8F27A, #C4E538 45%, rgba(196,229,56,0))`,
  },
  silver: {
    height: 8,
    gap: 10,
    background: (end) =>
      `linear-gradient(${end ? 270 : 90}deg, #FFFFFF, #C5CCD0 45%, rgba(197,204,208,0))`,
  },
};

export function Bars({
  tone = "green",
  widths = [90, 180, 300],
  align = "end",
  className = "",
  height: barHeight,
  gap: barGap,
}) {
  const { background, ...size } = BAR_TONES[tone];
  const height = barHeight ?? size.height;
  const gap = barGap ?? size.gap;
  const end = align === "end";
  return (
    <div aria-hidden="true" className={`${DECO} ${className}`}>
      <div
        className={`flex flex-col ${end ? "items-end" : "items-start"}`}
        style={{ transform: "skewX(-38deg)", gap }}
      >
        {widths.map((width, index) => (
          <span
            key={index}
            className="block"
            style={{ width, height, background: background(end) }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Glow ───────────────────────────────────────────────────────────────
// A soft radial light, never a hard shape. `color`: "green", "lime" or
// "silver"; `alpha` its strength at the centre. Size and place it with
// `className`.
const GLOW_RGB = {
  green: ["16,107,55", "16,107,55"],
  lime: ["196,229,56", "196,229,56"],
  silver: ["220,226,229", "197,204,208"],
};

export function Glow({ color = "green", alpha = 0.45, className = "" }) {
  const [inner, outer] = GLOW_RGB[color];
  return (
    <div
      aria-hidden="true"
      className={`${DECO} ${className}`}
      style={{
        background: `radial-gradient(closest-side, rgba(${inner},${alpha}), rgba(${outer},${(alpha / 4).toFixed(3)}) 55%, transparent)`,
      }}
    />
  );
}

// ─── Slab ───────────────────────────────────────────────────────────────
// A large faint slanted band (same -38° skew) behind a section. `fade`
// masks it out towards the bottom (the footer's).
export function Slab({ className = "", opacity = 0.06, fade = false }) {
  const mask = fade ? "linear-gradient(#000 65%, transparent)" : undefined;
  return (
    <div
      aria-hidden="true"
      className={`${DECO} bg-third ${className}`}
      style={{
        opacity,
        transform: "skewX(-38deg)",
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}

// ─── Plus marks ─────────────────────────────────────────────────────────
// Small green crosses in a section's four corners, like the marks on a
// drawing sheet: 40px in from the corners, 12px from the sides and 30px
// from the top and bottom on phones. `inset` swaps those classes (top,
// bottom, left and right are each given as one class per corner).
function Plus({ className }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden="true"
      className={`${DECO} ${className}`}
    >
      <path d="M7 0v14M0 7h14" stroke="rgba(16,107,55,.5)" />
    </svg>
  );
}

const PLUS_INSET = {
  top: "top-[30px] 700:top-[40px]",
  bottom: "bottom-[30px] 700:bottom-[40px]",
  left: "left-[12px] 700:left-[40px]",
  right: "right-[12px] 700:right-[40px]",
};

export function PlusMarks({ inset = PLUS_INSET, className = "" }) {
  const { top, bottom, left, right } = { ...PLUS_INSET, ...inset };
  return (
    <>
      <Plus className={`${left} ${top} ${className}`} />
      <Plus className={`${right} ${top} ${className}`} />
      <Plus className={`${left} ${bottom} ${className}`} />
      <Plus className={`${right} ${bottom} ${className}`} />
    </>
  );
}

// ─── Dimension line ─────────────────────────────────────────────────────
// A drawing's dimension: a thin rule with end ticks and its length in the
// middle on a background-coloured tag. Fills its box's width.
export function DimensionLine({ label, className = "", tagFill = "#fff" }) {
  return (
    <svg
      aria-hidden="true"
      height="24"
      className={`${DECO} overflow-visible ${className}`}
    >
      <g stroke="rgba(75,84,80,.4)">
        <line x1="0" y1="12" x2="100%" y2="12" />
        <line x1=".5" y1="5" x2=".5" y2="19" />
        <line
          x1="100%"
          y1="5"
          x2="100%"
          y2="19"
          style={{ transform: "translateX(-0.5px)" }}
        />
      </g>
      <rect
        x="50%"
        y="5"
        width="60"
        height="14"
        fill={tagFill}
        style={{ transform: "translateX(-30px)" }}
      />
      <text
        x="50%"
        y="16"
        textAnchor="middle"
        fontFamily="ui-monospace, Menlo, monospace"
        fontSize="10"
        fill="rgba(75,84,80,.85)"
      >
        {label}
      </text>
    </svg>
  );
}

// ─── Blueprint house ────────────────────────────────────────────────────
// The house in elevation the estimate form draws (Contact/Estimate/
// EstimateBlueprint), as a faint static drawing: main house, dashed second
// storey, porch and a backyard unit. Size and place it with `className`;
// `opacity` keeps it in the background.
export function BlueprintHouse({
  className = "",
  opacity = 0.12,
  color = "#106B37",
}) {
  return (
    <div aria-hidden="true" className={`${DECO} ${className}`} style={{ opacity }}>
      <svg
        viewBox="0 0 640 380"
        width="100%"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="block"
      >
        <line x1="10" y1="330" x2="630" y2="330" stroke={color} />
        <g stroke={color} fill="none" strokeDasharray="5 5">
          <rect x="120" y="120" width="160" height="60" />
          <polygon points="105,120 200,82 295,120" />
          <rect x="145" y="138" width="35" height="26" />
          <rect x="220" y="138" width="35" height="26" />
        </g>
        <g stroke={color} fill="none">
          <rect x="70" y="225" width="260" height="105" />
          <polygon points="52,225 110,180 290,180 348,225" />
          <rect x="185" y="270" width="30" height="60" />
          <rect x="95" y="250" width="60" height="40" />
          <line x1="125" y1="250" x2="125" y2="290" />
          <rect x="245" y="250" width="55" height="40" />
          <line x1="245" y1="270" x2="300" y2="270" />
          <line x1="330" y1="250" x2="418" y2="250" strokeWidth="2.5" />
          <line x1="408" y1="250" x2="408" y2="322" />
          <rect x="330" y="322" width="88" height="8" />
          <rect x="455" y="255" width="140" height="75" />
          <polygon points="443,255 525,212 607,255" />
          <rect x="475" y="290" width="24" height="40" />
          <rect x="525" y="275" width="50" height="30" />
        </g>
        <g stroke={color}>
          <line x1="70" y1="352" x2="330" y2="352" />
          <line x1="455" y1="352" x2="595" y2="352" />
        </g>
        <g
          fontSize="11"
          fontFamily="ui-monospace, Menlo, monospace"
          textAnchor="middle"
          fill={color}
        >
          <text x="200" y="372">{"52'-0\""}</text>
          <text x="525" y="372">{"28'-0\""}</text>
        </g>
      </svg>
    </div>
  );
}
