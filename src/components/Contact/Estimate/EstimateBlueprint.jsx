"use client";

import { AnimatePresence, motion } from "framer-motion";

// Line-drawing elevation of a Valley lot — a single-story house, a patio
// cover, a detached ADU in back, and a proposed second story — standing in
// for a project photo. The form's answers show up on it (getBlueprintMarks
// in data/estimate.js):
//   pin       the picked project's part lights up, with a labelled pin
//   address   the picked area or typed address on a yard sign in front of
//             the house, cut short with "…" past SIGN_MAX characters

// Line colours for the white drafting-grid paper it's drawn on — the
// estimate form's blueprint panel (BlueprintCamera, EstimateForm). The
// picked part shows in the brand green. `mark` is for the sign; `paper`
// fills it so the house lines behind it don't show through.
const colors = {
  paper: "#ffffff",
  line: "rgba(0,0,0,0.38)",
  faint: "rgba(0,0,0,0.16)",
  mark: "rgba(0,0,0,0.58)",
  accent: "#106b37",
  accentFill: "rgba(16,107,55,0.14)",
  dimText: "rgba(0,0,0,0.42)",
};

// Pin positions as % of the 640×380 drawing; `side` is where the label sits
// so it doesn't cover a neighbouring part or run off the panel.
const PINS = {
  adu: { label: "ADU", x: 82, y: 55.8, side: "top" },
  remodel: { label: "Remodel", x: 19.5, y: 71, side: "top" },
  addition: { label: "Addition", x: 31, y: 39.5, side: "right" },
  patio: { label: "Deck & Patio", x: 58, y: 66, side: "top" },
  plans: { label: "Design-Build", x: 31, y: 92.5, side: "right" },
};

const FADE = { transition: "opacity 300ms, stroke 300ms, fill 300ms" };

function Part({ active, children }) {
  return (
    <g
      stroke={active ? colors.accent : colors.line}
      fill={active ? colors.accentFill : "none"}
      style={FADE}
    >
      {children}
    </g>
  );
}

// The address on a yard sign out in the front lawn: a board on two stakes
// driven in below the house's ground line (with a few blades of grass), so
// it reads as standing in front of the house. It sits at the house's front-left corner, clear of
// the windows (so a Remodel highlight never sits behind it) and the door.
// Filled with the paper so the house lines behind it don't show through.
// A picked area's ", CA" is left off the board; the text sits in a nested
// <svg>, which clips it to the board in case an unusually wide address still
// runs long after trimming.
const SIGN_MAX = 17;

function Grass({ x }) {
  return (
    <path
      d={`M${x - 8} 344 l2 -6 M${x - 5} 344 l-1 -5 M${x + 5} 344 l1 -5 M${x + 8} 344 l-2 -6`}
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  );
}

function AddressSign({ address }) {
  const name = address.replace(/,\s*CA$/i, "");
  const text =
    name.length > SIGN_MAX ? `${name.slice(0, SIGN_MAX - 1).trimEnd()}…` : name;

  return (
    <g stroke={colors.mark} fill="none" style={FADE}>
      <line x1="50" y1="328" x2="50" y2="344" strokeWidth="2.5" />
      <line x1="148" y1="328" x2="148" y2="344" strokeWidth="2.5" />
      <Grass x={50} />
      <Grass x={148} />
      <rect
        x="24"
        y="296"
        width="150"
        height="32"
        rx="2"
        fill={colors.paper}
        strokeWidth="2"
      />
      <svg x="28" y="296" width="142" height="32">
        <text
          x="50%"
          y="21"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill={colors.mark}
          stroke="none"
        >
          {text}
        </text>
      </svg>
    </g>
  );
}

export default function EstimateBlueprint({ pin, address }) {
  const activePin = PINS[pin];

  return (
    <div className="relative w-full aspect-[640/380]">
      <svg
        viewBox="0 0 640 380"
        className="absolute inset-0 w-full h-full"
        strokeWidth="1.5"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Ground */}
        <line x1="10" y1="330" x2="630" y2="330" stroke={colors.line} />

        {/* Proposed second story — dashed until "Home Additions" is picked */}
        <g strokeDasharray={pin === "addition" ? undefined : "5 5"}>
          <Part active={pin === "addition"}>
            <rect x="120" y="120" width="160" height="60" />
            <polygon points="105,120 200,82 295,120" />
            <rect x="145" y="138" width="35" height="26" />
            <rect x="220" y="138" width="35" height="26" />
          </Part>
        </g>

        {/* Main house */}
        <g stroke={colors.line} fill="none">
          <rect x="70" y="225" width="260" height="105" />
          <polygon points="52,225 110,180 290,180 348,225" />
          <rect x="185" y="270" width="30" height="60" />
        </g>

        {/* Kitchen and bath windows */}
        <Part active={pin === "remodel"}>
          <rect x="95" y="250" width="60" height="40" />
          <line x1="125" y1="250" x2="125" y2="290" />
          <rect x="245" y="250" width="55" height="40" />
          <line x1="245" y1="270" x2="300" y2="270" />
        </Part>

        {/* Patio cover and deck */}
        <Part active={pin === "patio"}>
          <line x1="330" y1="250" x2="418" y2="250" strokeWidth="2.5" />
          {[338, 350, 362, 374, 386, 398, 410].map((x) => (
            <line key={x} x1={x} y1="243" x2={x} y2="250" />
          ))}
          <line x1="408" y1="250" x2="408" y2="322" />
          <rect x="330" y="322" width="88" height="8" />
        </Part>

        {/* Detached ADU */}
        <Part active={pin === "adu"}>
          <rect x="455" y="255" width="140" height="75" />
          <polygon points="443,255 525,212 607,255" />
          <rect x="475" y="290" width="24" height="40" />
          <rect x="525" y="275" width="50" height="30" />
        </Part>

        {/* Dimension lines */}
        <g
          stroke={pin === "plans" ? colors.accent : colors.faint}
          style={FADE}
        >
          <line x1="70" y1="352" x2="330" y2="352" />
          <line x1="70" y1="346" x2="70" y2="358" />
          <line x1="330" y1="346" x2="330" y2="358" />
          <line x1="455" y1="352" x2="595" y2="352" />
          <line x1="455" y1="346" x2="455" y2="358" />
          <line x1="595" y1="346" x2="595" y2="358" />
        </g>
        <g
          fill={pin === "plans" ? colors.accent : colors.dimText}
          fontSize="11"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
          textAnchor="middle"
          style={FADE}
        >
          <text x="200" y="372">{"52'-0\""}</text>
          <text x="525" y="372">{"28'-0\""}</text>
        </g>

        {/* The address on a sign out front, once they've typed it */}
        {address && <AddressSign address={address} />}

      </svg>

      <AnimatePresence>
        {activePin && (
          <motion.div
            key={pin}
            className="absolute"
            style={{ left: `${activePin.x}%`, top: `${activePin.y}%` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
          >
            <span className="absolute -translate-x-1/2 -translate-y-1/2 block w-3 h-3 rounded-full ring-4 bg-third ring-third/20" />
            <span
              className={`absolute whitespace-nowrap border border-third bg-third text-white px-2 py-1 text-[11px] ${
                activePin.side === "top"
                  ? "bottom-3 -translate-x-1/2"
                  : "top-0 left-3 -translate-y-1/2"
              }`}
            >
              {activePin.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
