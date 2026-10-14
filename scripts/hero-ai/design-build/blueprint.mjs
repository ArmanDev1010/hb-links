// Draws the Design-Build page's hero timelapse: a blueprint lying on a
// wooden table, its ends rolled up, with the front elevation of a two-story
// house drawn on it stage by stage the way the house is built — foundation,
// framing, sheathing, roof, windows, stucco — then dimensioned, landscaped
// and titled. The all-white HB Links logo (logo-white.png) is printed across
// the top of the sheet, over the house.
//
//   node scripts/hero-ai/design-build/blueprint.mjs
//
// Writes frames/01.png … 12.png (1920x1080) next to this file; the last is
// the finished sheet. Then build it like any sequence (see ../README.md).

import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const ROOT = path.join(HERE, "../../..");
const sharp = createRequire(path.join(ROOT, "package.json"))("sharp");
const OUT = path.join(HERE, "frames");
const W = 1920, H = 1080;

// ---- seeded randomness, so every frame matches ----------------------------
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// ---- layout ---------------------------------------------------------------
const PAPER = { x0: 180, y0: 85, x1: 1740, y1: 995 }; // the flat part
const ROLL = 92; // width of each rolled-up end
const BORDER = { x0: 220, y0: 120, x1: 1700, y1: 960 };
const STRIP = 1525; // the title block runs down the right edge from here

// The house's front elevation (px; 1 ft ≈ 20 px).
const L = 790, R = 1470, G = 800; // walls and grade
const EAVE = { x0: 758, x1: 1502, y: 475 };
const RIDGE = { x0: 1020, x1: 1240, y: 355 };
const STUD = 26.7; // 16" on center
const FLOOR1 = { plate: [794, 800], top: [641, 653], studs: [653, 794] };
const BAND = [621, 641]; // floor system between the floors
const FLOOR2 = { plate: [615, 621], top: [475, 487], studs: [487, 615] };
const OPEN1 = [
  { x0: 830, x1: 990, y0: 675, y1: 770 },
  { x0: 1095, x1: 1165, y0: 668, y1: 800, door: true },
  { x0: 1250, x1: 1430, y0: 675, y1: 770 },
];
const OPEN2 = [
  { x0: 840, x1: 980, y0: 515, y1: 595 },
  { x0: 1080, x1: 1180, y0: 525, y1: 590 },
  { x0: 1280, x1: 1420, y0: 515, y1: 595 },
];
const CHIMNEY = { x0: 1360, x1: 1410, top: 330 };
const roofTop = (x) =>
  x <= RIDGE.x0
    ? EAVE.y - ((x - EAVE.x0) * (EAVE.y - RIDGE.y)) / (RIDGE.x0 - EAVE.x0)
    : x >= RIDGE.x1
      ? EAVE.y - ((EAVE.x1 - x) * (EAVE.y - RIDGE.y)) / (EAVE.x1 - RIDGE.x1)
      : RIDGE.y;
const ROOF = `${EAVE.x0},${EAVE.y} ${RIDGE.x0},${RIDGE.y} ${RIDGE.x1},${RIDGE.y} ${EAVE.x1},${EAVE.y}`;

// ---- drawing helpers --------------------------------------------------------
const line = (x1, y1, x2, y2, w = 1, extra = "") =>
  `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke-width="${w}" ${extra}/>`;
const rect = (x0, y0, x1, y1, w = 1, extra = "") =>
  `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" stroke-width="${w}" ${extra}/>`;
const text = (x, y, s, size, extra = "") =>
  `<text x="${x}" y="${y}" font-size="${size}" font-family="Arial, Helvetica, sans-serif" fill="#e9f1ff" stroke="none" ${extra}>${s}</text>`;
const inOpening = (x, y0, y1, openings) =>
  openings.find((o) => x > o.x0 - 3 && x < o.x1 + 3 && y1 > o.y0 && y0 < o.y1);

// ---- the stages ---------------------------------------------------------------
function sheet() {
  let s = rect(BORDER.x0, BORDER.y0, BORDER.x1, BORDER.y1, 2.6);
  s += rect(BORDER.x0 + 9, BORDER.y0 + 9, BORDER.x1 - 9, BORDER.y1 - 9, 0.9);
  s += line(STRIP, BORDER.y0 + 9, STRIP, BORDER.y1 - 9, 1.6);
  s += line(STRIP + 5, BORDER.y0 + 9, STRIP + 5, BORDER.y1 - 9, 0.7);
  // title block
  const x = STRIP + 14, cx = (STRIP + 5 + BORDER.x1 - 9) / 2;
  const rows = [
    [218, 0.8], [326, 0.8], [432, 0.8], [536, 0.8], [640, 0.8], [850, 0.8],
  ];
  for (const [y, w] of rows) s += line(STRIP + 5, y, BORDER.x1 - 9, y, w);
  s += text(cx, 178, "HB LINKS", 16, `text-anchor="middle" font-weight="bold" font-style="italic" letter-spacing="2"`);
  s += text(cx, 248, "DESIGN-BUILD", 13, `text-anchor="middle" font-weight="bold" letter-spacing="1.5"`);
  s += text(cx, 268, "GENERAL CONTRACTOR", 8.5, `text-anchor="middle" letter-spacing="1.2"`);
  s += text(cx, 284, "LICENSED &amp; INSURED", 8.5, `text-anchor="middle" letter-spacing="1.2"`);
  s += text(cx, 304, "CSLB #1144057", 9.5, `text-anchor="middle" letter-spacing="1.4"`);
  s += text(x, 344, "PROJECT", 7.5, `letter-spacing="1.5" opacity="0.75"`);
  s += text(x, 366, "TWO-STORY", 12, `font-weight="bold" letter-spacing="1"`);
  s += text(x, 384, "RESIDENCE", 12, `font-weight="bold" letter-spacing="1"`);
  s += text(x, 410, "LOS ANGELES, CA", 9, `letter-spacing="1.2"`);
  s += text(x, 450, "DRAWING", 7.5, `letter-spacing="1.5" opacity="0.75"`);
  s += text(x, 472, "FRONT", 12, `font-weight="bold" letter-spacing="1"`);
  s += text(x, 490, "ELEVATION", 12, `font-weight="bold" letter-spacing="1"`);
  s += text(x, 516, "PHASE: DESIGN-BUILD", 8, `letter-spacing="1.1"`);
  s += text(x, 554, "SCALE", 7.5, `letter-spacing="1.5" opacity="0.75"`);
  s += text(x, 574, "1/4&quot; = 1&apos;-0&quot;", 11, `letter-spacing="0.8"`);
  s += text(x, 600, "DRAWN BY: HB LINKS", 8, `letter-spacing="1.1"`);
  s += text(x, 616, "CHECKED: PM", 8, `letter-spacing="1.1"`);
  // revisions
  s += text(x, 660, "REVISIONS", 7.5, `letter-spacing="1.5" opacity="0.75"`);
  for (let i = 0; i < 6; i++) {
    const y = 672 + i * 28;
    s += rect(x, y, BORDER.x1 - 23, y + 22, 0.6);
    s += line(x + 26, y, x + 26, y + 22, 0.6);
  }
  s += text(x + 8, 688, "0", 9);
  s += text(x + 33, 688, "ISSUED FOR PERMIT", 7.5, `letter-spacing="0.6"`);
  s += text(x, 874, "SHEET", 7.5, `letter-spacing="1.5" opacity="0.75"`);
  s += text(cx, 925, "A-201", 34, `text-anchor="middle" font-weight="bold" letter-spacing="1"`);
  return s;
}

function grade() {
  let s = line(330, G, 1505, G, 2.6);
  // earth hatch below grade, around the foundation
  for (let x = 334; x < 1503; x += 12) {
    if (x > L - 22 && x < R + 22) continue;
    s += line(x, G + 4, x - 9, G + 13, 0.8);
  }
  return s;
}

function foundation() {
  const dash = `stroke-dasharray="9 5"`;
  let s = rect(L, G, R, G + 38, 1.4, dash);
  s += rect(L - 16, G + 38, L + 40, G + 58, 1.4, dash);
  s += rect(R - 40, G + 38, R + 16, G + 58, 1.4, dash);
  s += rect(1110, G + 38, 1150, G + 58, 1.2, dash);
  for (let x = L + 30; x < R; x += 120) s += line(x, G - 9, x, G + 26, 1, `stroke-dasharray="3 3"`);
  return s;
}

function framingWall(f, openings) {
  let s = rect(L, f.plate[0], R, f.plate[1], 1.1);
  s += rect(L, f.top[0], R, (f.top[0] + f.top[1]) / 2, 1.1);
  s += rect(L, (f.top[0] + f.top[1]) / 2, R, f.top[1], 1.1);
  const [a, b] = f.studs;
  for (let x = L + 1.5; x <= R - 1; x += STUD) {
    const o = inOpening(x, a, b, openings);
    if (!o) s += line(x, a, x, b, 1.1);
    else {
      if (o.y0 - 14 > a) s += line(x, a + 0, x, o.y0 - 14, 1.1); // cripple above header
      if (!o.door && o.y1 + 4 < b) s += line(x, o.y1 + 4, x, b, 1.1); // cripple below sill
    }
  }
  for (const o of openings) {
    s += line(o.x0 - 3, a, o.x0 - 3, b, 1.3) + line(o.x1 + 3, a, o.x1 + 3, b, 1.3); // king studs
    s += line(o.x0, o.y0 - 14, o.x0, b, 1.1) + line(o.x1, o.y0 - 14, o.x1, b, 1.1); // jacks
    s += rect(o.x0 - 3, o.y0 - 14, o.x1 + 3, o.y0, 1.4); // header
    s += line(o.x0 - 3, o.y0 - 7, o.x1 + 3, o.y0 - 7, 0.6);
    if (!o.door) s += rect(o.x0, o.y1, o.x1, o.y1 + 4, 1.1); // sill
  }
  return s;
}

function framing1() {
  return framingWall(FLOOR1, OPEN1);
}

function framing2() {
  let s = rect(L, BAND[0], R, BAND[1], 1.3);
  for (let x = L + 40; x < R; x += 40) s += line(x, BAND[0] + 4, x, BAND[1] - 4, 0.5);
  return s + framingWall(FLOOR2, OPEN2);
}

function roofFraming() {
  let s = `<polyline points="${EAVE.x0},${EAVE.y} ${RIDGE.x0},${RIDGE.y}" stroke-width="2" fill="none"/>`;
  s += `<polyline points="${RIDGE.x1},${RIDGE.y} ${EAVE.x1},${EAVE.y}" stroke-width="2" fill="none"/>`;
  s += rect(RIDGE.x0, RIDGE.y - 4, RIDGE.x1, RIDGE.y + 3, 1.4);
  s += line(EAVE.x0, EAVE.y, EAVE.x1, EAVE.y, 1.2);
  for (let x = EAVE.x0 + 8; x < EAVE.x1 - 4; x += STUD) s += line(x, EAVE.y, x, roofTop(x) + 2, 1);
  return s;
}

const wallOutline = () =>
  rect(L, FLOOR2.top[0], R, G, 2.4) +
  line(L, BAND[0], R, BAND[0], 0.8) +
  line(L, BAND[1], R, BAND[1], 0.8) +
  OPEN1.concat(OPEN2).map((o) => rect(o.x0, o.y0, o.x1, o.y1, 1.6)).join("");
const roofOutline = () => `<polygon points="${ROOF}" stroke-width="2.4" fill="none"/>`;

function wallPlywood() {
  const dash = `stroke-dasharray="6 5"`;
  let s = "";
  for (let x = L + 80; x < R; x += 80)
    for (const [a, b] of [[FLOOR2.top[0], BAND[0]], [BAND[1], G]]) {
      // skip the parts that cross openings
      let y = a;
      for (const o of OPEN1.concat(OPEN2).filter((o) => x > o.x0 && x < o.x1 && o.y1 > a && o.y0 < b).sort((p, q) => p.y0 - q.y0)) {
        if (o.y0 > y) s += line(x, y, x, o.y0, 0.7, dash);
        y = Math.max(y, o.y1);
      }
      if (y < b) s += line(x, y, x, b, 0.7, dash);
    }
  for (const y of [548, 718]) s += line(L, y, R, y, 0.7, dash);
  return s;
}

function roofPlywood() {
  let s = `<g clip-path="url(#roof)">`;
  for (const y of [440, 400]) s += line(EAVE.x0, y, EAVE.x1, y, 0.7, `stroke-dasharray="6 5"`);
  return s + `</g>`;
}

function roofing() {
  const r = rng(7);
  let s = `<g clip-path="url(#roof)">`;
  let row = 0;
  for (let y = EAVE.y - 8; y > RIDGE.y + 2; y -= 8, row++) {
    s += line(EAVE.x0, y, EAVE.x1, y, 0.75);
    for (let x = EAVE.x0 + (row % 2 ? 9 : 0); x < EAVE.x1; x += 18 + r() * 3) s += line(x, y, x, y + 8, 0.5);
  }
  s += `</g>`;
  s += roofOutline();
  s += rect(EAVE.x0 - 4, EAVE.y, EAVE.x1 + 4, EAVE.y + 8, 1.4); // fascia
  s += line(RIDGE.x0, RIDGE.y - 2, RIDGE.x1, RIDGE.y - 2, 2.4); // ridge cap
  // chimney
  const base = roofTop(CHIMNEY.x1);
  s += `<polygon points="${CHIMNEY.x0},${roofTop(CHIMNEY.x0) + 1} ${CHIMNEY.x0},${CHIMNEY.top} ${CHIMNEY.x1},${CHIMNEY.top} ${CHIMNEY.x1},${base + 1}" stroke-width="1.8" fill="#1b467f"/>`;
  s += rect(CHIMNEY.x0 - 6, CHIMNEY.top - 10, CHIMNEY.x1 + 6, CHIMNEY.top, 1.6);
  s += rect(CHIMNEY.x0 + 12, CHIMNEY.top - 22, CHIMNEY.x1 - 12, CHIMNEY.top - 10, 1.2);
  return s;
}

function windowsAndDoor() {
  let s = "";
  for (const o of OPEN1.concat(OPEN2)) {
    if (o.door) {
      s += rect(o.x0 + 4, o.y0 + 4, o.x1 - 4, o.y1, 1.2);
      s += rect(o.x0 + 26, o.y0 + 18, o.x1 - 26, o.y1 - 18, 1.1);
      s += line(o.x0 + 30, o.y0 + 30, o.x0 + 38, o.y0 + 22, 0.6) + line(o.x0 + 30, o.y0 + 44, o.x0 + 40, o.y0 + 34, 0.6);
      s += `<circle cx="${o.x1 - 14}" cy="${(o.y0 + o.y1) / 2 + 6}" r="2.6" stroke-width="1"/>`;
      s += rect(o.x0 - 22, G - 7, o.x1 + 22, G, 1.4); // step
      continue;
    }
    s += rect(o.x0 + 5, o.y0 + 5, o.x1 - 5, o.y1 - 5, 1.1);
    const panes = o.x1 - o.x0 > 120 ? 2 : 1;
    if (panes === 2) s += line((o.x0 + o.x1) / 2, o.y0 + 5, (o.x0 + o.x1) / 2, o.y1 - 5, 1.4);
    const pw = (o.x1 - o.x0 - 10) / panes;
    for (let p = 0; p < panes; p++) {
      const px = o.x0 + 5 + p * pw;
      s += line(px + pw * 0.2, o.y0 + 30, px + pw * 0.38, o.y0 + 12, 0.6);
      s += line(px + pw * 0.24, o.y0 + 44, px + pw * 0.5, o.y0 + 16, 0.6);
    }
    s += rect(o.x0 - 8, o.y1, o.x1 + 8, o.y1 + 5, 1.4); // sill
  }
  // entry canopy
  const c = { x0: 1068, x1: 1192, y: 660, peak: 636 }, cx = (c.x0 + c.x1) / 2;
  s += `<polygon points="${c.x0},${c.y} ${cx},${c.peak} ${c.x1},${c.y}" stroke-width="1.8" fill="#1b467f"/>`;
  s += line(c.x0 + 10, c.y - 4, cx, c.peak + 5, 0.6) + line(cx, c.peak + 5, c.x1 - 10, c.y - 4, 0.6);
  s += rect(c.x0 - 2, c.y, c.x1 + 2, c.y + 5, 1.2);
  s += `<polyline points="${c.x0 + 8},${c.y + 5} ${c.x0 + 8},${c.y + 22} ${c.x0 + 24},${c.y + 5}" stroke-width="1" fill="none"/>`;
  s += `<polyline points="${c.x1 - 8},${c.y + 5} ${c.x1 - 8},${c.y + 22} ${c.x1 - 24},${c.y + 5}" stroke-width="1" fill="none"/>`;
  return s;
}

function stucco() {
  const r = rng(21);
  let s = rect(L - 7, BAND[0] + 2, R + 7, BAND[1] - 2, 1.6); // belly band
  s += line(L - 7, BAND[1] - 6, R + 7, BAND[1] - 6, 0.6);
  for (const o of OPEN1.concat(OPEN2)) if (!o.door) s += rect(o.x0 - 9, o.y0 - 9, o.x1 + 9, o.y1, 1);
  // stucco stipple
  const openings = OPEN1.concat(OPEN2);
  for (let i = 0; i < 1500; i++) {
    const x = L + 4 + r() * (R - L - 8), y = FLOOR2.top[0] + 10 + r() * (G - FLOOR2.top[0] - 14);
    if (y > BAND[0] - 2 && y < BAND[1] + 2) continue;
    if (openings.some((o) => x > o.x0 - 12 && x < o.x1 + 12 && y > o.y0 - 12 && y < o.y1 + 8)) continue;
    if (x > 1060 && x < 1200 && y > 630 && y < 690) continue;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="0.8" fill="#e9f1ff" stroke="none" opacity="0.55"/>`;
  }
  // gutter and downspout
  s += rect(EAVE.x0 - 2, EAVE.y + 8, EAVE.x1 + 2, EAVE.y + 15, 1.2, `rx="3"`);
  s += `<polyline points="${R + 18},${EAVE.y + 15} ${R + 18},${EAVE.y + 30} ${R - 4},${EAVE.y + 42} ${R - 4},${G - 18} ${R + 10},${G - 6}" stroke-width="5.5" stroke-linejoin="round" fill="none"/>`;
  s += `<polyline points="${R + 18},${EAVE.y + 15} ${R + 18},${EAVE.y + 30} ${R - 4},${EAVE.y + 42} ${R - 4},${G - 18} ${R + 10},${G - 6}" stroke-width="2.6" stroke-linejoin="round" fill="none" stroke="#1b467f"/>`;
  return s;
}

function tick(x, y) {
  return line(x - 6, y + 6, x + 6, y - 6, 1.6);
}

function dimensions() {
  let s = "";
  // overall width
  s += line(L, G + 66, L, G + 92, 0.7) + line(R, G + 66, R, G + 92, 0.7);
  s += line(L - 12, G + 84, R + 12, G + 84, 0.9) + tick(L, G + 84) + tick(R, G + 84);
  s += text((L + R) / 2, G + 78, "34&apos;-0&quot;", 13, `text-anchor="middle" letter-spacing="1"`);
  // opening widths along the first floor
  const xs = [L, ...OPEN1.flatMap((o) => [o.x0, o.x1]), R];
  for (let i = 0; i < xs.length - 1; i++) {
    s += tick(xs[i], G + 110);
    const ft = ((xs[i + 1] - xs[i]) / 20).toFixed(0);
    s += text((xs[i] + xs[i + 1]) / 2, G + 104, `${ft}&apos;`, 10, `text-anchor="middle"`);
  }
  s += tick(R, G + 110) + line(L - 12, G + 110, R + 12, G + 110, 0.7);
  // levels on the left
  const levels = [
    [RIDGE.y, "T.O. RIDGE", "26&apos;-0&quot;"],
    [EAVE.y, "T.O. PLATE", "19&apos;-0&quot;"],
    [BAND[1], "2ND FLOOR", "9&apos;-10&quot;"],
    [G, "FIN. FLOOR", "0&apos;-0&quot;"],
  ];
  s += line(752, RIDGE.y, 752, G, 0.8);
  for (const [y, name, h] of levels) {
    s += line(712, y, L - (y === RIDGE.y ? -230 : 10), y, 0.6, `stroke-dasharray="10 4 2 4"`);
    s += tick(752, y);
    s += `<circle cx="700" cy="${y}" r="8" stroke-width="1.2" fill="none"/>`;
    s += `<path d="M700 ${y - 8} A8 8 0 0 1 708 ${y} L700 ${y} Z M700 ${y + 8} A8 8 0 0 1 692 ${y} L700 ${y} Z" fill="#e9f1ff" stroke="none"/>`;
    s += text(684, y - 4, name, 9.5, `text-anchor="end" letter-spacing="1"`);
    s += text(684, y + 10, h, 9.5, `text-anchor="end" letter-spacing="1"`);
  }
  return s;
}

function shrub(cx, base, rad, r) {
  let d = `M${cx - rad} ${base}`;
  const n = 5 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI + (i * Math.PI) / n, a1 = Math.PI + ((i + 1) * Math.PI) / n;
    const x1 = cx + rad * Math.cos(a1), y1 = base + rad * 0.8 * Math.sin(a1);
    d += ` A${(rad / n) * 1.9} ${(rad / n) * 1.9} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    void a0;
  }
  return `<path d="${d}" stroke-width="1" fill="none"/>`;
}

function landscape() {
  const r = rng(5);
  let s = "";
  // shrubs along the house
  for (const [a, b] of [[L + 8, 1080], [1185, R - 8]])
    for (let x = a + 14; x < b - 10; x += 34 + r() * 12) s += shrub(x, G, 16 + r() * 8, r);
  // a tree on the left
  const tx = 470, ty = 620;
  s += line(tx - 3, G, tx - 3, ty + 40, 1.4) + line(tx + 3, G, tx + 3, ty + 40, 1.4);
  let d = "";
  const n = 22;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rad = 78 + (i % 2 ? 6 : -4) + r() * 4;
    const x = tx + rad * Math.cos(a), y = ty + rad * 0.92 * Math.sin(a);
    d += i ? ` A9 9 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}` : `M${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  s += `<path d="${d}" stroke-width="1.2" fill="none"/>`;
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2, rr = r() * 50;
    s += `<path d="M${(tx + rr * Math.cos(a)).toFixed(1)} ${(ty + rr * Math.sin(a)).toFixed(1)} q8 -6 16 0" stroke-width="0.7" fill="none"/>`;
  }
  // a low fence on the left, and one past the house on the right
  for (const [a, b] of [[340, 600]]) {
    s += line(a, G - 34, b, G - 34, 1.1) + line(a, G - 30, b, G - 30, 0.6);
    for (let x = a; x <= b; x += 10) s += line(x, G - 34, x, G, 0.7);
    for (let x = a; x <= b; x += 60) s += rect(x - 4, G - 42, x + 4, G, 1.1);
  }
  return s;
}

function notes() {
  let s = "";
  const keynotes = [
    "COMP. SHINGLE ROOF — CHARCOAL",
    "SMOOTH STUCCO FINISH — WHITE",
    "BLACK ALUMINUM WINDOWS",
    "STUCCO BELLY BAND",
    "ENTRY CANOPY W/ BRACKETS",
    "GUTTER &amp; DOWNSPOUT",
  ];
  s += text(270, 176, "KEYNOTES", 11, `font-weight="bold" letter-spacing="2"`);
  s += line(270, 184, 470, 184, 0.8);
  keynotes.forEach((k, i) => {
    const y = 206 + i * 22;
    s += `<polygon points="${277},${y - 12} ${285},${y - 7} ${285},${y + 2} ${277},${y + 7} ${269},${y + 2} ${269},${y - 7}" stroke-width="0.9" fill="none"/>`;
    s += text(277, y - 0.5, i + 1, 8.5, `text-anchor="middle"`);
    s += text(296, y, k, 9.5, `letter-spacing="0.9"`);
  });
  // their tags on the drawing
  const tags = [[1130, 418], [1010, 720], [1350, 556], [900, 631], [1130, 650], [1490, 600]];
  tags.forEach(([x, y], i) => {
    s += `<polygon points="${x},${y - 11} ${x + 9},${y - 5.5} ${x + 9},${y + 5.5} ${x},${y + 11} ${x - 9},${y + 5.5} ${x - 9},${y - 5.5}" stroke-width="1" fill="#1b467f"/>`;
    s += text(x, y + 3.5, i + 1, 9, `text-anchor="middle" font-weight="bold"`);
  });
  // drawing title and scale bar
  const ty = 935;
  s += `<circle cx="${L + 20}" cy="${ty - 6}" r="19" stroke-width="1.4" fill="none"/>`;
  s += line(L + 1, ty - 6, L + 39, ty - 6, 1);
  s += text(L + 20, ty - 10, "1", 11, `text-anchor="middle" font-weight="bold"`);
  s += text(L + 20, ty + 7, "A-201", 7.5, `text-anchor="middle"`);
  s += text(L + 52, ty - 4, "FRONT ELEVATION", 20, `font-weight="bold" letter-spacing="2"`);
  s += line(L + 52, ty + 3, L + 290, ty + 3, 1.6) + line(L + 52, ty + 7, L + 290, ty + 7, 0.6);
  s += text(L + 52, ty + 21, "SCALE: 1/4&quot; = 1&apos;-0&quot;", 9, `letter-spacing="1.4"`);
  for (let i = 0; i < 4; i++)
    s += `<rect x="${1240 + i * 40}" y="${ty - 2}" width="40" height="7" stroke-width="0.8" fill="${i % 2 ? "none" : "#e9f1ff"}"/>`;
  ["0", "2&apos;", "4&apos;", "8&apos;"].forEach((t, i) => (s += text(1240 + [0, 40, 80, 160][i], ty + 18, t, 8, `text-anchor="middle"`)));
  return s;
}

// what each frame shows, in order (the framing makes way for the sheathing)
const FRAMES = [
  [],
  [grade, foundation],
  [grade, foundation, framing1],
  [grade, foundation, framing1, framing2],
  [grade, foundation, framing1, framing2, roofFraming],
  [grade, wallOutline, roofOutline, wallPlywood, roofPlywood],
  [grade, wallOutline, wallPlywood, roofing],
  [grade, wallOutline, wallPlywood, roofing, windowsAndDoor],
  [grade, wallOutline, roofing, windowsAndDoor, stucco],
  [grade, wallOutline, roofing, windowsAndDoor, stucco, dimensions],
  [grade, wallOutline, roofing, windowsAndDoor, stucco, dimensions, landscape],
  [grade, wallOutline, roofing, windowsAndDoor, stucco, dimensions, landscape, notes],
];

// ---- drafting tools, between the keynotes and the drawing --------------------
const TOOLS_SHIFT = { x: 30, y: -34 }; // all three together, from where they're drawn
function tools() {
  // a 12-inch steel ruler
  const len = 334, ht = 30, unit = len / 12;
  let ticks = "";
  for (let i = 1; i < 12 * 8; i++) {
    const x = (i * unit) / 8;
    const h = i % 8 === 0 ? 12 : i % 4 === 0 ? 9 : i % 2 === 0 ? 6.5 : 4;
    ticks += `<line x1="${x.toFixed(1)}" y1="${ht}" x2="${x.toFixed(1)}" y2="${ht - h}" stroke="#41474d" stroke-width="${i % 8 ? 0.6 : 0.9}"/>`;
    if (i % 8 === 0) ticks += `<text x="${x.toFixed(1)}" y="${ht - 14}" font-size="7.5" font-family="Arial, Helvetica, sans-serif" fill="#41474d" text-anchor="middle">${i / 8}</text>`;
  }
  const ruler = `<g transform="translate(262 384) rotate(-7)">
    <rect x="6" y="8" width="${len}" height="${ht}" rx="2" fill="#000" opacity="0.45" filter="url(#toolShadow)"/>
    <rect width="${len}" height="${ht}" rx="2" fill="url(#steel)"/>
    <rect width="${len}" height="${ht}" rx="2" filter="url(#brushed)" opacity="0.35"/>
    <line x1="1" y1="0.6" x2="${len - 1}" y2="0.6" stroke="#fff" stroke-width="1" opacity="0.8"/>
    ${ticks}
    <circle cx="${len - 14}" cy="10" r="3.4" fill="#7b848c"/><circle cx="${len - 14}" cy="10" r="2" fill="#2b3035"/>
  </g>`;
  // a pencil lying across the top margin of the sheet
  const pencil = `<g transform="translate(286 438) rotate(-3)">
    <rect x="8" y="9" width="298" height="13" rx="3" fill="#000" opacity="0.45" filter="url(#toolShadow)"/>
    <polygon points="0,6 26,0 26,12" fill="#e7c8a0"/><polygon points="0,6 9,4 9,8" fill="#333"/>
    <rect x="26" y="0" width="230" height="12" fill="url(#pencil)"/>
    <line x1="26" y1="4" x2="256" y2="4" stroke="#b07f12" stroke-width="0.6" opacity="0.6"/>
    <rect x="256" y="0" width="22" height="12" fill="url(#ferrule)"/>
    <rect x="278" y="0" width="20" height="12" rx="3" fill="#d8857c"/>
  </g>`;
  // a white vinyl eraser in its paper sleeve
  const eraser = `<g transform="translate(500 470) rotate(14)">
    <rect x="5" y="8" width="66" height="30" rx="4" fill="#000" opacity="0.45" filter="url(#toolShadow)"/>
    <rect width="66" height="30" rx="4" fill="#f1f2ef"/>
    <rect x="1" y="1" width="64" height="5" rx="3" fill="#fff" opacity="0.7"/>
    <rect x="20" y="-1" width="46" height="32" rx="2" fill="url(#sleeve)"/>
    <line x1="24" y1="9" x2="60" y2="9" stroke="#fff" stroke-width="1.4" opacity="0.8"/>
    <line x1="24" y1="15" x2="52" y2="15" stroke="#fff" stroke-width="1" opacity="0.6"/>
  </g>`;
  return `<g transform="translate(${TOOLS_SHIFT.x} ${TOOLS_SHIFT.y})">${ruler + eraser + pencil}</g>`;
}

// ---- the table and the paper ------------------------------------------------
function baseSvg() {
  const { x0, y0, x1, y1 } = PAPER;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <filter id="wood" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0016 0.045" numOctaves="4" seed="11"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1"/>
      <feComponentTransfer>
        <feFuncR type="table" tableValues="0.13 0.27 0.4 0.33"/>
        <feFuncG type="table" tableValues="0.075 0.16 0.24 0.2"/>
        <feFuncB type="table" tableValues="0.04 0.085 0.13 0.11"/>
      </feComponentTransfer>
    </filter>
    <filter id="streaks" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.003 0.6" numOctaves="2" seed="17"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.025  0 0 0 0 0.01  -1.6 0 0 0 0.95"/>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.1 0.62"/>
    </filter>
    <filter id="mottle" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.0045" numOctaves="3" seed="8"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.3 0 0 0 -0.62"/>
    </filter>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="16"/></filter>
    <linearGradient id="light" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.10"/><stop offset="0.55" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.22"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/>
    </radialGradient>
    <linearGradient id="rollL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6c7886"/><stop offset="0.25" stop-color="#cfd8e2"/><stop offset="0.42" stop-color="#e6ecf2"/>
      <stop offset="0.75" stop-color="#aab6c3"/><stop offset="1" stop-color="#6f7c8b"/>
    </linearGradient>
    <linearGradient id="rollR" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#76838f"/><stop offset="0.3" stop-color="#b7c3cf"/><stop offset="0.55" stop-color="#dfe6ed"/>
      <stop offset="0.8" stop-color="#c3cdd8"/><stop offset="1" stop-color="#5f6b78"/>
    </linearGradient>
    <linearGradient id="curlL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#000" stop-opacity="0.5"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="curlR" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0.16"/><stop offset="0.35" stop-color="#000" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </linearGradient>
    <filter id="toolShadow" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="4"/></filter>
    <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3f5f7"/><stop offset="0.18" stop-color="#c9cfd4"/><stop offset="0.5" stop-color="#e4e8eb"/>
      <stop offset="0.82" stop-color="#b3bbc2"/><stop offset="1" stop-color="#8d969e"/>
    </linearGradient>
    <filter id="brushed" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.004 0.9" numOctaves="2" seed="21"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.2 0.7" result="b"/>
      <feComposite in="b" in2="SourceAlpha" operator="in"/>
    </filter>
    <linearGradient id="sleeve" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3f6fb8"/><stop offset="1" stop-color="#244a86"/>
    </linearGradient>
    <linearGradient id="pencil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6c94a"/><stop offset="0.45" stop-color="#e2a91c"/><stop offset="1" stop-color="#9b6b0c"/>
    </linearGradient>
    <linearGradient id="ferrule" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e9edf0"/><stop offset="0.5" stop-color="#9aa3aa"/><stop offset="1" stop-color="#5e666c"/>
    </linearGradient>
    <clipPath id="paper"><rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}"/></clipPath>
  </defs>

  <rect width="100%" height="100%" filter="url(#wood)"/>
  <rect width="100%" height="100%" filter="url(#streaks)" opacity="0.5"/>
  ${[150, 420, 690, 960].map((y) => `<rect x="0" y="${y}" width="${W}" height="2" fill="#140b05" opacity="0.65"/>`).join("")}
  <rect width="100%" height="100%" fill="url(#vignette)"/>

  <!-- shadows on the table -->
  <rect x="${x0 - ROLL + 18}" y="${y0 + 12}" width="${x1 - x0 + 2 * ROLL}" height="${y1 - y0 + 4}" rx="20" fill="#000" opacity="0.55" filter="url(#shadow)"/>

  <!-- the sheet -->
  <rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="#1b467f"/>
  <g clip-path="url(#paper)">
    <rect width="100%" height="100%" filter="url(#mottle)" opacity="0.22"/>
    <rect width="100%" height="100%" filter="url(#grain)" opacity="0.55"/>
    ${Array.from({ length: 70 }, (_, i) => `<line x1="${x0 + i * 24}" y1="${y0}" x2="${x0 + i * 24}" y2="${y1}" stroke="#cfe0ff" stroke-width="0.6" opacity="${i % 5 ? 0.035 : 0.07}"/>`).join("")}
    ${Array.from({ length: 40 }, (_, i) => `<line x1="${x0}" y1="${y0 + i * 24}" x2="${x1}" y2="${y0 + i * 24}" stroke="#cfe0ff" stroke-width="0.6" opacity="${i % 5 ? 0.035 : 0.07}"/>`).join("")}
    <!-- old fold creases -->
    <line x1="${x0}" y1="540" x2="${x1}" y2="546" stroke="#fff" stroke-width="1.2" opacity="0.09"/>
    <line x1="${x0}" y1="542" x2="${x1}" y2="548" stroke="#000" stroke-width="1.6" opacity="0.13"/>
    <line x1="960" y1="${y0}" x2="955" y2="${y1}" stroke="#fff" stroke-width="1.2" opacity="0.07"/>
    <line x1="962" y1="${y0}" x2="957" y2="${y1}" stroke="#000" stroke-width="1.6" opacity="0.11"/>
    <rect width="100%" height="100%" fill="url(#light)"/>
    <rect x="${x0}" y="${y0}" width="70" height="${y1 - y0}" fill="url(#curlL)"/>
    <rect x="${x1 - 60}" y="${y0}" width="60" height="${y1 - y0}" fill="url(#curlR)"/>
  </g>

  <!-- the rolled-up ends: the paper's pale back on the outside -->
  <rect x="${x0 - ROLL + 8}" y="${y0 - 6}" width="${ROLL}" height="${y1 - y0 + 12}" rx="${ROLL / 2}" ry="10" fill="url(#rollL)"/>
  <ellipse cx="${x0 - ROLL / 2 + 8}" cy="${y0 - 2}" rx="${ROLL / 2 - 2}" ry="8" fill="#5d6873"/>
  <ellipse cx="${x0 - ROLL / 2 + 8}" cy="${y0 - 2}" rx="${ROLL / 2 - 14}" ry="5" fill="none" stroke="#1b467f" stroke-width="2"/>
  <ellipse cx="${x0 - ROLL / 2 + 8}" cy="${y0 - 2}" rx="${ROLL / 2 - 26}" ry="3" fill="none" stroke="#c9d1d9" stroke-width="1.5"/>
  <rect x="${x0 - ROLL + 8}" y="${y0 - 6}" width="${ROLL}" height="${y1 - y0 + 12}" rx="${ROLL / 2}" ry="10" filter="url(#grain)" opacity="0.35"/>
  <rect x="${x0 - 4}" y="${y0 - 6}" width="12" height="${y1 - y0 + 12}" fill="#163c6e"/>
  <rect x="${x1 - 8}" y="${y0 - 6}" width="${ROLL}" height="${y1 - y0 + 12}" rx="${ROLL / 2}" ry="10" fill="url(#rollR)"/>
  <rect x="${x1 - 8}" y="${y0 - 6}" width="${ROLL}" height="${y1 - y0 + 12}" rx="${ROLL / 2}" ry="10" filter="url(#grain)" opacity="0.35"/>
  <rect x="${x1 - 8}" y="${y0 - 6}" width="12" height="${y1 - y0 + 12}" fill="#163c6e"/>
  <ellipse cx="${x1 + ROLL / 2 - 8}" cy="${y0 - 2}" rx="${ROLL / 2 - 2}" ry="8" fill="#5d6873"/>
  <ellipse cx="${x1 + ROLL / 2 - 8}" cy="${y0 - 2}" rx="${ROLL / 2 - 14}" ry="5" fill="none" stroke="#1b467f" stroke-width="2"/>
  <ellipse cx="${x1 + ROLL / 2 - 8}" cy="${y0 - 2}" rx="${ROLL / 2 - 26}" ry="3" fill="none" stroke="#c9d1d9" stroke-width="1.5"/>

${tools()}
</svg>`;
}

function inkSvg(stages) {
  const body = stages.map((f) => f()).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <clipPath id="roof"><polygon points="${ROOF}"/></clipPath>
    <filter id="print" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="3" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.45 0 0 0 0.62" result="na"/>
      <feComposite in="SourceGraphic" in2="na" operator="in" result="t"/>
      <feGaussianBlur in="t" stdDeviation="0.45"/>
    </filter>
  </defs>
  <g filter="url(#print)" stroke="#e9f1ff" fill="none" stroke-linecap="round" opacity="0.93">${body}</g>
</svg>`;
}

// the white logo, printed across the top of the sheet (a touch soft, like ink)
const LOGO_W = 330;
const logo = await sharp(path.join(HERE, "logo-white.png")).resize(LOGO_W).blur(0.4).png().toBuffer();
const logoMeta = await sharp(logo).metadata();
// a little right of the house's middle, still inside the slice phones see
const LOGO_X = Math.round((L + R) / 2 + 70 - LOGO_W / 2);
const LOGO_Y = Math.round(203 - logoMeta.height / 2);
const base = await sharp(Buffer.from(baseSvg())).png().toBuffer();
await mkdir(OUT, { recursive: true });
const sheetInk = await sharp(Buffer.from(inkSvg([sheet]))).png().toBuffer();
for (const [i, stages] of FRAMES.entries()) {
  const ink = await sharp(Buffer.from(inkSvg(stages))).png().toBuffer();
  const file = path.join(OUT, `${String(i + 1).padStart(2, "0")}.png`);
  await sharp(base)
    .composite([
      { input: sheetInk },
      { input: ink },
      { input: await sharp(logo).composite([{ input: Buffer.from([255, 255, 255, 235]), raw: { width: 1, height: 1, channels: 4 }, tile: true, blend: "dest-in" }]).png().toBuffer(), left: LOGO_X, top: LOGO_Y },
    ])
    .png()
    .toFile(file);
  console.log(path.relative(process.cwd(), file));
}

