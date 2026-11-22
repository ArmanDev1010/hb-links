// The area pages' hero opening (Home/HeroIntro with a `place`): before the
// property is built, a map of the San Fernando Valley, drawn in the scene's
// lines on the dark — the hills as contours, the freeways, the mile grid of
// boulevards — with the area's lot pinned and every other area we serve
// named faintly. As the visitor scrolls it zooms in on the pin, down through
// the boulevards (the nearest named) and the side streets to the block and
// its lots, the pinned one outlined; then the plan tilts up into the scene's
// camera and the property stands on that lot (scene.js drawScene, from its
// opening shot), and the hero plays on as the homepage's does.
//
//   drawAreaScene(context, { ...drawScene's, t, place })
//
// The /contact page draws the same map, still, round Woodland Hills
// (drawCoverageMap; Contact/Estimate/ContactMap): the cities we work in
// marked, and a ring sweeping out over them.
//
// `t` is the whole hero's progress: the map takes the first MAP_SHARE of it,
// the property's builds the rest. `drawMapLife` is drawn over it every frame
// (in place of context.js drawLife, which it draws for the property once it
// shows): traffic on the freeways and a beacon pulsing round the pin.
//
// Everything is in the property's frame, in feet (the house at 0, 0; x east,
// z north): the map is laid round the lot from rough latitudes and
// longitudes — a drawing of the Valley, not a survey.

import { clamp, lerp, ease, span, rgba, RAD, C } from "./kit";
import { drawScene, openingFrame, projector, grain } from "./scene";
import { drawLife } from "./context";
import { HOME_BASE as BASE } from "@/data/coverage";

// How much of the hero's scroll the map takes; HeroIntro's track is longer
// on an area page so the builds after it keep the homepage's pace.
export const MAP_SHARE = 0.24;

// Within the map's share: it holds, zooms in, and tilts up into the scene
// (the last two overlap a little so it never stops between them).
const HOLD = 0.05;
const ZOOM_END = 0.62;
const TILT = 0.56;

const FT_LAT = 364000;
const FT_LON = FT_LAT * Math.cos(34.2 * RAD);
// the lot in the property's frame (the ADU's yard at the back): its middle
// is where the pin goes
const LOT = { x0: -8, x1: 56, z0: -20.6, z1: 70.5 };
const LOT_MID = [(LOT.x0 + LOT.x1) / 2, (LOT.z0 + LOT.z1) / 2];
// the side streets round it: east-west every STREET_EW ft (the scene's own
// street, z -37.5, among them), north-south every STREET_NS
const STREET_EW = 216;
const STREET_NS = 660;
const NS_AT = -213;
const LOT_W = 64;

const NAV = 96;
const SILVER = [197, 204, 208];

// ---- the Valley ------------------------------------------------------------
// [latitude, longitude]: where each area's name goes and where its lot is
// (inside the area, between two boulevards, off the freeway). `left` sets the
// name on the dot's left.
const AREAS = {
  "Woodland Hills": { label: [34.1683, -118.6059], lot: [34.1768, -118.5972] },
  Encino: { label: [34.1592, -118.5012], lot: [34.1705, -118.5098] },
  Tarzana: { label: [34.173, -118.553], lot: [34.183, -118.5448] },
  Calabasas: { label: [34.1578, -118.6384], lot: [34.1445, -118.642], left: true },
  "Canoga Park": { label: [34.2011, -118.598], lot: [34.1974, -118.5797] },
  "Sherman Oaks": { label: [34.1511, -118.449], lot: [34.1645, -118.4402] },
  Reseda: { label: [34.2011, -118.536], lot: [34.1975, -118.5448] },
  Northridge: { label: [34.2283, -118.5367], lot: [34.2283, -118.5273] },
};

// the contact map's middle (data/coverage.js)
const HOME_BASE = BASE.at;

// [longitude, latitude] along each road
const VENTURA = [
  [-118.628, 34.1625], [-118.606, 34.1683], [-118.585, 34.1705], [-118.553, 34.1718], [-118.536, 34.1702],
  [-118.518, 34.1655], [-118.501, 34.1592], [-118.483, 34.1575], [-118.466, 34.1545], [-118.449, 34.1511],
  [-118.431, 34.149], [-118.413, 34.146], [-118.396, 34.143], [-118.37, 34.1395], [-118.34, 34.137],
];
const FREEWAYS = [
  {
    shield: "101",
    tag: [-118.49, 34.1628],
    road: [
      [-118.82, 34.15], [-118.76, 34.146], [-118.7, 34.147], [-118.665, 34.15], [-118.642, 34.1538],
      [-118.622, 34.1635], [-118.603, 34.1712], [-118.58, 34.1745], [-118.553, 34.1752], [-118.536, 34.1738],
      [-118.518, 34.1693], [-118.501, 34.1645], [-118.485, 34.161], [-118.4705, 34.1575], [-118.449, 34.1565],
      [-118.431, 34.1575], [-118.413, 34.1565], [-118.396, 34.153], [-118.38, 34.149], [-118.36, 34.143], [-118.33, 34.134],
    ],
  },
  {
    shield: "405",
    tag: [-118.4722, 34.212],
    road: [
      [-118.478, 34.06], [-118.476, 34.1], [-118.4745, 34.13], [-118.4705, 34.1575], [-118.4712, 34.18],
      [-118.4722, 34.2], [-118.4725, 34.22], [-118.4705, 34.245], [-118.4685, 34.27], [-118.47, 34.295],
      [-118.475, 34.32], [-118.48, 34.36],
    ],
  },
  {
    shield: "118",
    tag: [-118.565, 34.2768],
    road: [
      [-118.78, 34.271], [-118.68, 34.274], [-118.62, 34.2755], [-118.58, 34.2765], [-118.536, 34.2775],
      [-118.5, 34.278], [-118.47, 34.277], [-118.44, 34.2765], [-118.41, 34.2785], [-118.38, 34.282], [-118.34, 34.286],
    ],
  },
  {
    road: [[-118.388, 34.152], [-118.389, 34.17], [-118.393, 34.19], [-118.398, 34.21], [-118.407, 34.23], [-118.415, 34.245], [-118.42, 34.26]],
  },
];
// the boulevards: north-south ones from Ventura up to the hills, east-west
// ones from the Valley's west edge across
const NORTH_SOUTH = [
  ["Fallbrook Ave", -118.624], ["Topanga Canyon Blvd", -118.6065], ["Canoga Ave", -118.5975], ["De Soto Ave", -118.5885],
  ["Winnetka Ave", -118.571], ["Tampa Ave", -118.5535], ["Reseda Blvd", -118.536], ["White Oak Ave", -118.5185],
  ["Balboa Blvd", -118.501], ["Sepulveda Blvd", -118.4665], ["Van Nuys Blvd", -118.449], ["Woodman Ave", -118.4315],
  ["Coldwater Canyon Ave", -118.4135], ["Laurel Canyon Blvd", -118.396],
];
const EAST_WEST = [
  ["Oxnard St", 34.1793, -118.6065], ["Victory Blvd", 34.1866, -118.648], ["Vanowen St", 34.1938, -118.648],
  ["Sherman Way", 34.2011, -118.645], ["Saticoy St", 34.2085, -118.61], ["Roscoe Blvd", 34.2212, -118.606],
  ["Nordhoff St", 34.2355, -118.62], ["Devonshire St", 34.2577, -118.62],
];
const NORTH_END = 34.27;
const EAST_END = -118.36;
const REGIONS = [
  { text: "San Fernando Valley", at: [34.238, -118.535], size: 12, spacing: 6, alpha: 0.26 },
  { text: "Santa Monica Mountains", at: [34.118, -118.54], size: 10, spacing: 6, alpha: 0.3 },
];

// Ventura Boulevard's latitude at a longitude (held level past its ends).
function venturaAt(lon) {
  if (lon <= VENTURA[0][0]) return VENTURA[0][1];
  for (let i = 1; i < VENTURA.length; i++) {
    const [x1, y1] = VENTURA[i];
    if (lon <= x1) {
      const [x0, y0] = VENTURA[i - 1];
      return lerp(y0, y1, (lon - x0) / (x1 - x0));
    }
  }
  return VENTURA[VENTURA.length - 1][1];
}

// ---- the hills -------------------------------------------------------------
// A height over the map, 0 on the Valley floor rising into the Santa Monica
// Mountains south of Ventura, the Simi Hills west and the hills north, with
// the Sepulveda Pass cut through for the 405 — made uneven with noise — and
// its contours, found once.
function hash(i, j) {
  let h = Math.imul(i, 374761393) + Math.imul(j, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function noise(x, y) {
  const i = Math.floor(x), j = Math.floor(y);
  const fx = x - i, fy = y - j;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return lerp(lerp(hash(i, j), hash(i + 1, j), u), lerp(hash(i, j + 1), hash(i + 1, j + 1), u), v);
}
const fbm = (x, y) => 0.55 * noise(x, y) + 0.3 * noise(2.1 * x + 5.3, 2.1 * y + 1.7) + 0.15 * noise(4.3 * x + 9.1, 4.3 * y + 3.2);
const rise = (k) => {
  const c = clamp(k);
  return c * c * (3 - 2 * c);
};
const northEdge = (lon) => (lon < -118.53 ? 34.262 : lon > -118.44 ? 34.305 : lerp(34.262, 34.305, (lon + 118.53) / 0.09));
function height(lon, lat) {
  const n = fbm(lon / 0.02, lat / 0.02);
  const wobble = (n - 0.5) * 0.02;
  const south = lon < -118.628 ? 34.162 : venturaAt(lon) - 0.002;
  let h = rise((south - lat + wobble) / 0.07);
  h = Math.max(h, rise((-118.646 - lon + wobble) / 0.06));
  h = Math.max(h, rise((lat - northEdge(lon) + wobble) / 0.06));
  if (lat < 34.16) h *= 1 - 0.6 * Math.exp(-(((lon + 118.4735) / 0.009) ** 2));
  // peaks and ridges inside the hills, so the contours ring round them
  const ridges = fbm(lon / 0.009 + 40, lat / 0.009 + 17);
  return h * (0.45 + 0.9 * ridges);
}

const LEVELS = [0.1, 0.22, 0.34, 0.46, 0.58, 0.7, 0.82];
// marching squares: for each corner pattern, the cell edges each line joins
// (0 bottom, 1 right, 2 top, 3 left)
const CASES = [[], [[3, 0]], [[0, 1]], [[3, 1]], [[1, 2]], [[3, 0], [1, 2]], [[0, 2]], [[3, 2]], [[3, 2]], [[0, 2]], [[0, 1], [3, 2]], [[1, 2]], [[3, 1]], [[0, 1]], [[3, 0]], []];
let CONTOURS = null; // per level, [lon, lat, lon, lat, ...]
function contours() {
  if (CONTOURS) return CONTOURS;
  const [lon0, lon1, lat0, lat1, step] = [-118.84, -118.3, 34.04, 34.36, 0.0025];
  const nx = Math.round((lon1 - lon0) / step), ny = Math.round((lat1 - lat0) / step);
  const H = new Float32Array((nx + 1) * (ny + 1));
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) H[j * (nx + 1) + i] = height(lon0 + i * step, lat0 + j * step);
  CONTOURS = LEVELS.map((level) => {
    const out = [];
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const a = H[j * (nx + 1) + i], b = H[j * (nx + 1) + i + 1];
        const c = H[(j + 1) * (nx + 1) + i + 1], d = H[(j + 1) * (nx + 1) + i];
        const code = (a > level ? 1 : 0) | (b > level ? 2 : 0) | (c > level ? 4 : 0) | (d > level ? 8 : 0);
        if (!CASES[code].length) continue;
        const x = lon0 + i * step, y = lat0 + j * step;
        const cross = (p, q) => (level - p) / (q - p);
        const edge = (e) =>
          e === 0 ? [x + step * cross(a, b), y]
          : e === 1 ? [x + step, y + step * cross(b, c)]
          : e === 2 ? [x + step * cross(d, c), y + step]
          : [x, y + step * cross(a, d)];
        for (const [e0, e1] of CASES[code]) out.push(...edge(e0), ...edge(e1));
      }
    }
    return out;
  });
  return CONTOURS;
}

// ---- the map round one area's lot ------------------------------------------
const GEOMETRY = {};
function geometry(place) {
  const area = AREAS[place];
  if (!area) return null;
  GEOMETRY[place] ??= build(area.lot, place);
  return GEOMETRY[place];
}
// the map laid round [lat0, lon0] (at LOT_MID), every area but `except` named
function build([lat0, lon0], except) {
  const x = (lon) => (lon - lon0) * FT_LON + LOT_MID[0];
  const z = (lat) => (lat - lat0) * FT_LAT + LOT_MID[1];
  const road = (pts) => pts.map(([lon, lat]) => [x(lon), z(lat)]);
  const freeways = FREEWAYS.map((f) => {
    const pts = road(f.road);
    const lengths = [0];
    for (let i = 1; i < pts.length; i++) lengths.push(lengths[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, lengths, shield: f.shield, tag: f.tag && [x(f.tag[0]), z(f.tag[1])] };
  });
  return {
    contours: contours().map((segs) => {
      const out = new Float64Array(segs.length);
      for (let i = 0; i < segs.length; i += 2) {
        out[i] = x(segs[i]);
        out[i + 1] = z(segs[i + 1]);
      }
      return out;
    }),
    ventura: road(VENTURA),
    freeways,
    lines: [
      ...NORTH_SOUTH.map(([name, lon]) => ({ name, a: [x(lon), z(Math.max(venturaAt(lon), 34.16) + 0.0012)], b: [x(lon), z(NORTH_END)], across: false })),
      ...EAST_WEST.map(([name, lat, west]) => ({ name, a: [x(west), z(lat)], b: [x(EAST_END), z(lat)], across: true })),
    ],
    areas: Object.entries(AREAS)
      .filter(([name]) => name !== except)
      .map(([name, { label, left }]) => ({ name, at: [x(label[1]), z(label[0])], left })),
    regions: REGIONS.map((r) => ({ ...r, at: [x(r.at[1]), z(r.at[0])] })),
    coords: `${lat0.toFixed(4)}° N · ${Math.abs(lon0).toFixed(4)}° W`,
    middle: [x(-118.52), z(34.2)],
  };
}

// ---- drawing helpers -------------------------------------------------------
// The ground (y 0) through the projection, as an affine map: [x, z] to the
// screen.
function flat(P) {
  const [x0, y0] = P(0, 0, 0);
  const [ax, ay] = P(1, 0, 0);
  const [bx, by] = P(0, 0, 1);
  return { x0, y0, ax: ax - x0, ay: ay - y0, bx: bx - x0, by: by - y0 };
}
const onMap = (M, x, z) => [M.x0 + x * M.ax + z * M.bx, M.y0 + x * M.ay + z * M.by];

// A segment cut to the rectangle `r` (Liang–Barsky), or null when it misses.
function clipped(x1, y1, x2, y2, r) {
  let t0 = 0, t1 = 1;
  const dx = x2 - x1, dy = y2 - y1;
  const p = [-dx, dx, -dy, dy];
  const q = [x1 - r.x0, r.x1 - x1, y1 - r.y0, r.y1 - y1];
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) return null;
      continue;
    }
    const k = q[i] / p[i];
    if (p[i] < 0) {
      if (k > t1) return null;
      if (k > t0) t0 = k;
    } else {
      if (k < t0) return null;
      if (k < t1) t1 = k;
    }
  }
  return [x1 + t0 * dx, y1 + t0 * dy, x1 + t1 * dx, y1 + t1 * dy];
}
// a line from world [x, z] a to b onto the current path, cut to the screen
function segment(ctx, M, a, b, r) {
  const [x1, y1] = onMap(M, a[0], a[1]);
  const [x2, y2] = onMap(M, b[0], b[1]);
  const c = clipped(x1, y1, x2, y2, r);
  if (!c) return;
  ctx.moveTo(c[0], c[1]);
  ctx.lineTo(c[2], c[3]);
}
function polyline(ctx, M, pts, r) {
  for (let i = 1; i < pts.length; i++) segment(ctx, M, pts[i - 1], pts[i], r);
}

// Short pieces of line sorted by how strong they are, each strength stroked
// once.
function buckets() {
  const paths = Array.from({ length: 6 }, () => new Path2D());
  return {
    add(alpha, x1, y1, x2, y2) {
      if (alpha <= 0.02) return;
      const p = paths[Math.min(5, Math.floor(alpha * 6))];
      p.moveTo(x1, y1);
      p.lineTo(x2, y2);
    },
    stroke(ctx, color, strength) {
      paths.forEach((p, i) => {
        ctx.strokeStyle = rgba(color, strength * ((i + 0.5) / 6));
        ctx.stroke(p);
      });
    },
  };
}

function label(ctx, text, x, y, { size, spacing, color, alpha, align = "left", weight = 600, gt, angle = 0 }) {
  if (alpha <= 0.01) return;
  ctx.save();
  ctx.translate(x, y);
  if (angle) ctx.rotate(angle);
  ctx.font = `${weight} ${size}px ${gt}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing}px`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = rgba(color, alpha);
  // (the letter spacing trails the last letter: nudge centred text back)
  ctx.fillText(text.toUpperCase(), align === "center" ? spacing / 2 : 0, 0);
  ctx.restore();
}

// ---- the map ---------------------------------------------------------------
function drawMap(ctx, geo, { P, s, A, width: w, height: h, portrait, gt, kt, calm, pin: showPin = true, compass = true }) {
  const M = flat(P);
  const screen = { x0: -40, y0: -40, x1: w + 40, y1: h + 40 };
  const away = 1 - ease(span(kt, 0, 0.35)); // the map's own marks, as it tilts into the scene

  // the dark, a green glow round the pin
  ctx.fillStyle = rgba(C.bg);
  ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(A[0], A[1], 0, A[0], A[1], Math.max(w, h) * 0.6);
  glow.addColorStop(0, "rgba(22,78,48,0.34)");
  glow.addColorStop(0.45, "rgba(14,42,28,0.14)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.lineCap = "round";
  // the hills, gone by the time the side streets are close
  const hills = 1 - span(Math.log(s), Math.log(0.05), Math.log(0.3));
  if (hills > 0) {
    ctx.lineWidth = 1;
    geo.contours.forEach((segs, li) => {
      ctx.beginPath();
      for (let i = 0; i < segs.length; i += 4) {
        const [x1, y1] = onMap(M, segs[i], segs[i + 1]);
        const [x2, y2] = onMap(M, segs[i + 2], segs[i + 3]);
        if ((x1 < 0 && x2 < 0) || (x1 > w && x2 > w) || (y1 < 0 && y2 < 0) || (y1 > h && y2 > h)) continue;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.strokeStyle = rgba(C.grid, (li % 2 ? 0.26 : 0.16) * hills);
      ctx.stroke();
    });
  }

  // the side streets round the lot, fading with distance from it
  const streets = span(s, 0.045, 0.12);
  if (streets > 0) {
    const R = 3400;
    const piece = 108;
    const fade = (x, z) => Math.max(0, 1 - Math.hypot(x - LOT_MID[0], z - LOT_MID[1]) / R) ** 1.4;
    const b = buckets();
    const k0 = Math.ceil((LOT_MID[1] - R + 37.5) / STREET_EW), k1 = Math.floor((LOT_MID[1] + R + 37.5) / STREET_EW);
    for (let k = k0; k <= k1; k++) {
      const zz = -37.5 + k * STREET_EW;
      for (let xx = LOT_MID[0] - R; xx < LOT_MID[0] + R; xx += piece) {
        const a = fade(xx + piece / 2, zz);
        if (a <= 0) continue;
        const [x1, y1] = onMap(M, xx, zz);
        const [x2, y2] = onMap(M, xx + piece, zz);
        const c = clipped(x1, y1, x2, y2, screen);
        if (c) b.add(a, ...c);
      }
    }
    const j0 = Math.ceil((LOT_MID[0] - R - NS_AT) / STREET_NS), j1 = Math.floor((LOT_MID[0] + R - NS_AT) / STREET_NS);
    for (let j = j0; j <= j1; j++) {
      const xx = NS_AT + j * STREET_NS;
      for (let zz = LOT_MID[1] - R; zz < LOT_MID[1] + R; zz += piece) {
        const a = fade(xx, zz + piece / 2);
        if (a <= 0) continue;
        const [x1, y1] = onMap(M, xx, zz);
        const [x2, y2] = onMap(M, xx, zz + piece);
        const c = clipped(x1, y1, x2, y2, screen);
        if (c) b.add(a, ...c);
      }
    }
    ctx.lineWidth = clamp(16 * s, 0.8, 12);
    ctx.lineCap = "butt";
    b.stroke(ctx, C.grid, 0.3 * streets);
    ctx.lineCap = "round";
  }

  // the lots on the blocks round the pinned one
  const lots = span(s, 0.22, 0.6);
  if (lots > 0) {
    const R = 900;
    const fade = (x, z) => Math.max(0, 1 - Math.hypot(x - LOT_MID[0], z - LOT_MID[1]) / R) ** 1.2;
    const b = buckets();
    const add = (xa, za, xb, zb) => {
      const a = fade((xa + xb) / 2, (za + zb) / 2);
      if (a <= 0) return;
      const [x1, y1] = onMap(M, xa, za);
      const [x2, y2] = onMap(M, xb, zb);
      const c = clipped(x1, y1, x2, y2, screen);
      if (c) b.add(a, ...c);
    };
    const k0 = Math.floor((LOT_MID[1] - R + 37.5) / STREET_EW) - 1, k1 = Math.ceil((LOT_MID[1] + R + 37.5) / STREET_EW);
    const j0 = Math.floor((LOT_MID[0] - R - NS_AT) / STREET_NS) - 1, j1 = Math.ceil((LOT_MID[0] + R - NS_AT) / STREET_NS);
    for (let k = k0; k <= k1; k++) {
      const front = -37.5 + k * STREET_EW + 16.9;
      const rear = -37.5 + (k + 1) * STREET_EW - 16.9;
      const middle = (front + rear) / 2;
      for (let j = j0; j <= j1; j++) {
        const west = NS_AT + j * STREET_NS + 17;
        const east = NS_AT + (j + 1) * STREET_NS - 17;
        for (const zz of [front, middle, rear])
          for (let xx = west; xx < east; xx += LOT_W) add(xx, zz, Math.min(east, xx + LOT_W), zz);
        for (let xx = Math.ceil((west - LOT.x0) / LOT_W) * LOT_W + LOT.x0; xx <= east; xx += LOT_W) {
          add(xx, front, xx, middle);
          add(xx, middle, xx, rear);
        }
        add(west, front, west, rear);
        add(east, front, east, rear);
      }
    }
    ctx.lineWidth = 1;
    b.stroke(ctx, C.grid, 0.5 * lots);
  }

  // the boulevards
  ctx.lineWidth = clamp(30 * s, 1.1, 18);
  ctx.beginPath();
  for (const { a, b } of geo.lines) segment(ctx, M, a, b, screen);
  polyline(ctx, M, geo.ventura, screen);
  ctx.strokeStyle = rgba([150, 166, 158], 0.34);
  ctx.stroke();

  // the freeways, drawn as two edges
  const wide = clamp(150 * s, 3.6, 60);
  ctx.beginPath();
  for (const f of geo.freeways) polyline(ctx, M, f.pts, screen);
  ctx.lineWidth = wide;
  ctx.strokeStyle = rgba(SILVER, 0.5);
  ctx.stroke();
  ctx.lineWidth = Math.max(1.4, wide - 2.4);
  ctx.strokeStyle = rgba(C.bg);
  ctx.stroke();

  // the pinned lot
  const outline = span(s, 0.1, 0.35) * away;
  if (outline > 0) {
    ctx.beginPath();
    [[LOT.x0, LOT.z0], [LOT.x1, LOT.z0], [LOT.x1, LOT.z1], [LOT.x0, LOT.z1]].forEach(([x, z], i) => {
      const [sx, sy] = onMap(M, x, z);
      if (i) ctx.lineTo(sx, sy);
      else ctx.moveTo(sx, sy);
    });
    ctx.closePath();
    ctx.fillStyle = rgba(C.lime, 0.08 * outline);
    ctx.fill();
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = rgba(C.lime, 0.85 * outline);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // the names: the regions and the other areas at the Valley's scale, the
  // freeways' shields, the nearest boulevards once they're close
  const far = 1 - span(s, 0.035, 0.07);
  for (const r of geo.regions) {
    const [x, y] = onMap(M, ...r.at);
    label(ctx, r.text, x, y, { size: r.size, spacing: r.spacing, color: SILVER, alpha: r.alpha * far, align: "center", gt });
  }
  for (const a of geo.areas) {
    const [x, y] = onMap(M, ...a.at);
    if (x < -100 || x > w + 100 || y < NAV || y > h) continue;
    // (a city we work in, on the contact map: a lime dot)
    const text = a.name;
    ctx.fillStyle = a.lit ? rgba(C.lime, 0.95) : rgba(SILVER, 0.55 * far);
    ctx.beginPath();
    ctx.arc(x, y, a.lit ? 3 : 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = `600 9.5px ${gt}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "2px";
    const left = a.left || x + 9 + ctx.measureText(text.toUpperCase()).width > w - 12;
    label(ctx, text, left ? x - 9 : x + 9, y, { size: 9.5, spacing: 2, color: a.lit ? [236, 242, 226] : SILVER, alpha: (a.lit ? 0.85 : 0.5) * far, align: left ? "right" : "left", gt });
  }
  const shields = 1 - span(s, 0.05, 0.11);
  if (shields > 0) {
    ctx.font = `700 9px ${gt}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "0.5px";
    for (const f of geo.freeways) {
      if (!f.shield) continue;
      const [x, y] = onMap(M, ...f.tag);
      if (x < 0 || x > w || y < NAV || y > h) continue;
      ctx.globalAlpha = shields;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x - 14, y - 8, 28, 16, 3);
      else ctx.rect(x - 14, y - 8, 28, 16);
      ctx.fillStyle = rgba(C.bg);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(SILVER, 0.7);
      ctx.stroke();
      ctx.fillStyle = rgba(SILVER, 0.95);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(f.shield, x + 0.5, y + 0.5);
      ctx.globalAlpha = 1;
    }
  }
  const named = span(s, 0.03, 0.055) * (1 - span(s, 0.7, 1.5)) * away;
  if (named > 0) {
    // the two nearest each way (Ventura too, when it's near), each named
    // along its line a little way from the pin
    const near = geo.lines
      .map((line) => {
        const [x1, y1] = onMap(M, ...line.a);
        const [x2, y2] = onMap(M, ...line.b);
        const dx = x2 - x1, dy = y2 - y1;
        const k = clamp(((A[0] - x1) * dx + (A[1] - y1) * dy) / (dx * dx + dy * dy));
        const px = x1 + dx * k, py = y1 + dy * k;
        return { line, px, py, dx, dy, d: Math.hypot(A[0] - px, A[1] - py) };
      })
      .filter((n) => n.d < Math.min(w, h) * 0.42);
    const pick = [false, true].flatMap((across) => near.filter((n) => n.line.across === across).sort((p, q) => p.d - q.d).slice(0, 2));
    for (const { line, px, py, dx, dy } of pick) {
      const len = Math.hypot(dx, dy);
      let angle = Math.atan2(dy, dx);
      if (angle > Math.PI / 2) angle -= Math.PI;
      if (angle <= -Math.PI / 2) angle += Math.PI;
      const shift = line.across ? 130 : -110;
      const ux = dx / len, uy = dy / len;
      const sign = (line.across ? ux : -uy) >= 0 ? 1 : -1;
      const x = px + ux * shift * sign + Math.sin(angle) * 9;
      const y = py + uy * shift * sign - Math.cos(angle) * 9;
      if (x < 30 || x > w - 30 || y < NAV + 60 || y > h - 20) continue;
      label(ctx, line.name, x, y, { size: 9, spacing: 2, color: SILVER, alpha: 0.62 * named, align: "center", gt, angle });
    }
  }

  // the edges fade to black, so the map never ends on screen
  const edge = ctx.createRadialGradient(A[0], A[1], Math.max(w, h) * 0.3, A[0], A[1], Math.max(w, h) * 0.95);
  edge.addColorStop(0, rgba(C.bg, 0));
  edge.addColorStop(1, rgba(C.bg, 0.92));
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, w, h);
  const top = ctx.createLinearGradient(0, 0, 0, NAV + 24);
  top.addColorStop(0, rgba(C.bg, 0.9));
  top.addColorStop(1, rgba(C.bg, 0));
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, w, NAV + 24);

  // the pin and its name
  const pin = onMap(M, ...LOT_MID);
  const pinned = showPin ? away : 0;
  if (pinned > 0) {
    const [x, y] = pin;
    ctx.save();
    ctx.globalAlpha = pinned;
    ctx.beginPath();
    ctx.ellipse(x, y, 7, 2.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fill();
    if (calm) {
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(C.lime, 0.3);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(x, y - 19, 8, Math.PI * 0.75, Math.PI * 2.25);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fillStyle = rgba(C.lime);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - 19, 3, 0, Math.PI * 2);
    ctx.fillStyle = rgba(C.bg);
    ctx.fill();
    ctx.restore();
    // its name to the side with the most room (the right, unless that runs
    // off the screen)
    ctx.save();
    ctx.font = `600 13px ${gt}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "2.5px";
    let wide = ctx.measureText(geo.place.toUpperCase()).width;
    ctx.font = `500 9.5px ${gt}`;
    if ("letterSpacing" in ctx) ctx.letterSpacing = "1.2px";
    wide = Math.max(wide, ctx.measureText(geo.coords).width);
    ctx.restore();
    const left = x + 18 + wide > w - 16;
    const tx = left ? x - 18 : x + 18;
    const align = left ? "right" : "left";
    label(ctx, geo.place, tx, y - 25, { size: 13, spacing: 2.5, color: C.lime, alpha: pinned, align, gt });
    label(ctx, geo.coords, tx, y - 9, { size: 9.5, spacing: 1.2, color: SILVER, alpha: 0.6 * pinned, align, weight: 500, gt });
  }

  // a north arrow and a scale bar, top right (not on the contact map)
  if (away > 0 && compass) {
    const nice = [50, 100, 200, 500, 1000, 2640, 5280, 10560, 26400];
    const ft = nice.filter((f) => f * s <= 120).pop() ?? 50;
    const bar = ft * s;
    const x1 = w - (portrait ? 20 : 40);
    const y = NAV + (portrait ? 18 : 28);
    ctx.save();
    ctx.globalAlpha = away;
    ctx.strokeStyle = rgba(SILVER, 0.6);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1 - bar, y - 4);
    ctx.lineTo(x1 - bar, y);
    ctx.lineTo(x1, y);
    ctx.lineTo(x1, y - 4);
    ctx.moveTo(x1 - bar / 2, y);
    ctx.lineTo(x1 - bar / 2, y - 2.5);
    ctx.stroke();
    ctx.restore();
    const text = ft >= 5280 ? `${ft / 5280} mi` : ft === 2640 ? "½ mi" : `${ft.toLocaleString("en-US")} ft`;
    label(ctx, text, x1, y - 13, { size: 9, spacing: 1.5, color: SILVER, alpha: 0.6 * away, align: "right", gt });
    // north: up the screen while the map lies flat
    const nx = x1 - bar - 26;
    ctx.save();
    ctx.globalAlpha = away;
    ctx.beginPath();
    ctx.moveTo(nx, y - 12);
    ctx.lineTo(nx + 4.5, y);
    ctx.lineTo(nx, y - 3);
    ctx.lineTo(nx - 4.5, y);
    ctx.closePath();
    ctx.fillStyle = rgba(SILVER, 0.7);
    ctx.fill();
    ctx.restore();
    label(ctx, "N", nx, y - 21, { size: 9, spacing: 0, color: SILVER, alpha: 0.6 * away, align: "center", gt });
  }

  return { pin, pinned };
}

// ---- the hero --------------------------------------------------------------
// the ground point at screen point `at` in a shot (the opening's)
function groundUnder({ cam, s, ox, oy }, [X, Y]) {
  const ca = Math.cos(cam.yaw), sa = Math.sin(cam.yaw), se = Math.sin(cam.pitch);
  const xr = (X - ox) / s;
  const zr = (oy - Y) / (s * se);
  return [xr * ca + zr * sa, -xr * sa + zr * ca];
}

let SCENE_LAYER = null;
export function drawAreaScene(ctx, opts) {
  const { width, height, dpr, t: u, portrait, calm, fonts, place } = opts;
  const geo = geometry(place);
  if (!geo) return drawScene(ctx, opts);
  if (u >= MAP_SHARE) return drawScene(ctx, { ...opts, t: span(u, MAP_SHARE, 1) });
  geo.place = place;
  const layout = { copyTop: 0.6, copyLeft: 0.03, copyRight: 0.45, ...opts.layout };
  const gt = fonts?.gt ?? "sans-serif";
  const p = u / MAP_SHARE;

  // the opening shot the map ends on, the pin in the middle of its box
  const open = openingFrame({ width, height, portrait, layout }, calm);
  const A = [(open.box.x0 + open.box.x1) / 2, (open.box.y0 + open.box.y1) / 2];
  const kz = ease(span(p, HOLD, ZOOM_END));
  const kt = ease(span(p, TILT, 1));
  // the scale: the Valley, then the lot in plan, then the opening shot's
  const s0 = portrait ? Math.max(width / 60000, height / 90000) : width / 112000;
  const s1 = open.s * 0.62;
  const s = Math.exp(lerp(Math.log(s0), Math.log(s1), kz) + Math.log(open.s / s1) * kt);
  const cam = { yaw: lerp(0, open.cam.yaw, kt), pitch: lerp(90 * RAD, open.cam.pitch, kt) };
  // On a wide screen the map opens on the Valley, centred halfway between
  // the pin and the Valley's middle; as it zooms in round the pin, the pin
  // glides to the middle of the box. Then, as it tilts, the opening shot's
  // ground comes to the middle instead.
  const start = portrait ? LOT_MID : [lerp(LOT_MID[0], geo.middle[0], 0.55), lerp(LOT_MID[1], geo.middle[1], 0.55)];
  const glide = 1 - ease(span(kz, 0, 0.7));
  const anchor = [A[0] + (LOT_MID[0] - start[0]) * s0 * glide, A[1] - (LOT_MID[1] - start[1]) * s0 * glide];
  const end = groundUnder(open, A);
  const look = [lerp(LOT_MID[0], end[0], kt), lerp(LOT_MID[1], end[1], kt)];
  const [lx, ly] = projector(cam, s, 0, 0)(look[0], 0, look[1]);
  const shot = { ...cam, s, ox: anchor[0] - lx, oy: anchor[1] - ly, band: kt };
  const P = projector(cam, s, shot.ox, shot.oy);
  const sceneShown = ease(span(kt, 0.05, 0.6));

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (sceneShown >= 1) {
    const scene = drawScene(ctx, { ...opts, layout, t: 0, shot });
    return { map: true, P, s, scene, sceneShown, pinned: 0 };
  }
  const { pin, pinned } = drawMap(ctx, geo, { P, s, A, width, height, portrait, gt, kt, calm });
  grain(ctx, width, height);
  let scene = null;
  if (sceneShown > 0) {
    // the property, fading in over the map as it tilts up
    const { width: cw, height: ch } = ctx.canvas;
    if (!SCENE_LAYER) SCENE_LAYER = document.createElement("canvas");
    if (SCENE_LAYER.width !== cw || SCENE_LAYER.height !== ch) {
      SCENE_LAYER.width = cw;
      SCENE_LAYER.height = ch;
    }
    scene = drawScene(SCENE_LAYER.getContext("2d"), { ...opts, layout, t: 0, shot });
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = sceneShown;
    ctx.drawImage(SCENE_LAYER, 0, 0);
    ctx.restore();
  }
  const traffic = (1 - span(s, 0.06, 0.2)) * (1 - kt);
  return { map: true, P, s, geo, pin, pinned, traffic, scene, sceneShown, width, height };
}

// ---- the contact map -------------------------------------------------------
// The map from above, still, round Woodland Hills (HOME_BASE) at `at`
// (fractions of the canvas), at a scale that fits `span` feet across: no
// pin, but each of `cities` ({ name, at: [lat, lon] }) marked. Returns what
// drawMapLife needs for the traffic and the sweep.
let COVER_GEO = null;
export function drawCoverageMap(ctx, { width, height, dpr, gt = "sans-serif", calm = false, at = [0.5, 0.4], span: across = 80000, cities = [] }) {
  COVER_GEO ??= build(HOME_BASE, null);
  const [lat0, lon0] = HOME_BASE;
  const areas = cities.map(({ name, at: [lat, lon], left }) => ({
    name,
    at: [(lon - lon0) * FT_LON + LOT_MID[0], (lat - lat0) * FT_LAT + LOT_MID[1]],
    lit: true,
    left,
  }));
  const geo = { ...COVER_GEO, areas };
  const s = width / across;
  const cam = { yaw: 0, pitch: 90 * RAD };
  const A = [width * at[0], height * at[1]];
  const [lx, ly] = projector(cam, s, 0, 0)(LOT_MID[0], 0, LOT_MID[1]);
  const P = projector(cam, s, A[0] - lx, A[1] - ly);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawMap(ctx, geo, { P, s, A, width, height, portrait: height > width, gt, kt: 0, calm, pin: false, compass: false });
  grain(ctx, width, height);
  const M = flat(P);
  const marks = areas.map((a) => {
    const [x, y] = onMap(M, ...a.at);
    return { x, y, d: Math.hypot(x - A[0], y - A[1]) };
  });
  const reach = Math.max(...marks.map((m) => m.d), 120) + 60;
  return { map: true, P, s, geo, pin: A, pinned: 0, traffic: 1, scene: null, sceneShown: 0, width, height, coverage: { center: A, reach, marks } };
}

// ---- what moves ------------------------------------------------------------
// Headlights one way and tail lights the other along each freeway, and a
// ring pulsing out from the pin; the property's own life (context.js
// drawLife) as it fades in. `sweep`: the contact map's ring's own clock
// (it keeps its pace with Reduce Motion while the traffic calms, 11-22).
const SPEED = 1500; // ft per second: a map's traffic, not a real one
export function drawMapLife(ctx, frame, time, sweep = time) {
  if (frame.scene && frame.sceneShown > 0) {
    ctx.save();
    ctx.globalAlpha = frame.sceneShown;
    drawLife(ctx, frame.scene, time);
    ctx.restore();
  }
  if (frame.sceneShown >= 1) return;
  const M = flat(frame.P);
  if (frame.traffic > 0) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const [fi, f] of frame.geo.freeways.entries()) {
      const total = f.lengths[f.lengths.length - 1];
      const count = Math.round(total / 2600);
      for (const dir of [1, -1]) {
        ctx.fillStyle = dir > 0 ? rgba([255, 230, 190], 0.85 * frame.traffic) : rgba([255, 92, 70], 0.8 * frame.traffic);
        for (let i = 0; i < count; i++) {
          const jitter = ((i * 7919 + fi * 104729) % 997) / 997;
          let d = ((i + jitter * 0.6) / count) * total + dir * time * SPEED * (0.85 + 0.3 * jitter);
          d = ((d % total) + total) % total;
          let k = 1;
          while (k < f.lengths.length - 1 && f.lengths[k] < d) k++;
          const [ax, az] = f.pts[k - 1];
          const [bx, bz] = f.pts[k];
          const along = (d - f.lengths[k - 1]) / (f.lengths[k] - f.lengths[k - 1] || 1);
          const [x, y] = onMap(M, lerp(ax, bx, along), lerp(az, bz, along));
          const [x2, y2] = onMap(M, bx, bz);
          const [x1, y1] = onMap(M, ax, az);
          const len = Math.hypot(x2 - x1, y2 - y1) || 1;
          const nx = (-(y2 - y1) / len) * 1.3 * dir, ny = ((x2 - x1) / len) * 1.3 * dir;
          const px = x + nx, py = y + ny;
          if (px < 0 || py < 0 || px > frame.width || py > frame.height) continue;
          ctx.fillRect(px - 0.9, py - 0.9, 1.8, 1.8);
        }
      }
    }
    ctx.restore();
  }
  // the contact map's sweep: a ring out from Woodland Hills every few
  // seconds, each city lighting as it passes
  if (frame.coverage) {
    const { center: [cx, cy], reach, marks } = frame.coverage;
    const phase = (sweep % 6) / 6;
    const r = reach * ease(phase);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(C.lime, 0.42 * (1 - phase));
    ctx.lineWidth = 1.3;
    ctx.stroke();
    for (const m of marks) {
      const k = Math.exp(-(((r - m.d) / 26) ** 2)) * (1 - 0.5 * phase);
      if (k < 0.02) continue;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 4 + 9 * k, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(C.lime, 0.75 * k);
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }
  if (frame.pinned > 0) {
    const [x, y] = frame.pin;
    const phase = (time % 2.4) / 2.4;
    ctx.beginPath();
    ctx.arc(x, y, 6 + 30 * ease(phase), 0, Math.PI * 2);
    ctx.strokeStyle = rgba(C.lime, 0.6 * (1 - phase) * frame.pinned);
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}
