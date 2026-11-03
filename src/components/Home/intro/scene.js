// The homepage hero, drawn on a 2D canvas as the visitor scrolls: one property
// at dusk where HB Links does four of its services, one after another. It
// opens on the house with what's to come outlined in dashed lines over the
// lot, each named in a locked tag. Then, as the visitor scrolls, the camera
// moves to each in turn and it's built: an ADU in the back corner of the lot
// (from the HB Links logo chalked on the empty ground), a home remodel (the
// roof lifted off on a new kitchen and bath), a home addition, a deck and patio. Each one's
// tag fills as it's built and unlocks when it's done, and the service is named
// beside the scene. At the end the camera pulls back to the finished
// property, its lights on.
//
//   drawScene(context, { width, height, dpr, t, portrait, layout, calm, fonts, logo })
//
// paints the scene at progress `t` (0-1) on a canvas of `width` x `height`
// CSS px at `dpr` device px each. `layout` places it around the hero's copy,
// as fractions of the screen: `copyTop` (where the copy starts), `copyLeft`
// and `copyRight` (where its text starts and how far right it reaches).
// `calm` is the Reduce Motion version: the camera holds its angle (no swing
// or tilt), only moving from one service to the next as the visitor scrolls. `fonts.gt` is the site's
// display face; `logo` is the white HB Links logo
// (public/Logos/white_horizontal.png) once it has loaded, for the ADU's yard
// sign.
//
// Everything is drawn from shapes and numbers, in feet: the house and its
// yard in property.js (the house at 0, 0), the ADU in adu.js (its own frame,
// set at ADU_AT). y points up, and the camera looks at the fronts and right
// sides from above, in parallel projection.

import { clamp, lerp, ease, span, mix, rgba, RAD, C, groundGlow, rng } from "./kit";
import { drawADU, ADU_BOUNDS } from "./adu";
import { drawProperty, PROPERTY_BOUNDS, ghostADU, ghostRemodel, ghostAddition, ghostDeck } from "./property";
import { drawGround, drawStreetLights, NEIGHBOUR_PARTS, dust } from "./context";

// ---- the property ----------------------------------------------------------
// where the ADU's frame sits on the ground ([x, z]): behind the house, far
// enough back that it shows over the house's roof
const ADU_AT = [6, 44];
const shift = ({ x, y, z }, [ax, az]) => ({ x: [x[0] + ax, x[1] + ax], y, z: [z[0] + az, z[1] + az] });
const ADU_EXTENT = shift(ADU_BOUNDS, ADU_AT);

// The services, in the order they're done. `focus` is what the camera frames
// while each is built; `tag` is where its name hangs over it (`short` on a
// narrow screen); `ghost` outlines it before it starts; `clear` (if not
// `focus`) is what its caption keeps clear of on a wide screen.
const SERVICES = [
  { name: "ADU Build", short: "ADU", focus: ADU_EXTENT, tag: [21, 17.5, 54], ghost: ghostADU },
  { name: "Home Remodel", short: "Remodel", focus: { x: [-2, 38], y: [0, 11], z: [-4, 26] }, tag: [12, 19.5, 12], ghost: ghostRemodel },
  { name: "Home Additions", short: "Addition", focus: { x: [8, 56], y: [0, 17], z: [-6, 28] }, clear: { x: [-2, 51], y: [0, 17], z: [-2, 25] }, tag: [43, 17.5, 12], ghost: ghostAddition },
  { name: "Deck & Patio", short: "Deck & Patio", focus: { x: [2, 44], y: [0, 12], z: [-20, 4] }, tag: [20.7, 12.5, -6], ghost: ghostDeck },
];

// ---- timeline --------------------------------------------------------------
// The opening holds until the first chapter. In each service's chapter the
// camera moves to it over TRAVEL, and it's built over the rest; the ADU, the
// first, has longer. From BACK the camera pulls back out to the whole property.
const CHAPTERS = [[0.03, 0.31], [0.31, 0.51], [0.51, 0.71], [0.71, 0.91]];
const TRAVEL = 0.05;
const BACK = [0.91, 0.96];

// how far service `i` has got at scroll `t` (0 = not started, 1 = done)
function progress(i, t) {
  const [c0, c1] = CHAPTERS[i];
  return span(t, c0 + TRAVEL * 0.6, c1 - 0.015);
}

// Where the camera's headed at scroll `t`: from service `from`'s view to
// service `to`'s (-1 = the whole property), `k` of the way.
function heading(t) {
  if (t < CHAPTERS[0][0]) return { from: -1, to: -1, k: 1 };
  if (t >= BACK[0]) return { from: SERVICES.length - 1, to: -1, k: ease(span(t, ...BACK)) };
  const i = CHAPTERS.findIndex(([, c1]) => t < c1);
  return { from: i - 1, to: i, k: ease(span(t, CHAPTERS[i][0], CHAPTERS[i][0] + TRAVEL)) };
}

// ---- the camera ------------------------------------------------------------
// Parallel projection from `yaw` around the property and `pitch` above it,
// `s` px per foot, the origin at (ox, oy). Returns [x, y, depth] (depth grows
// away from the camera).
function projector({ yaw, pitch }, s, ox, oy) {
  const ca = Math.cos(yaw);
  const sa = Math.sin(yaw);
  const ce = Math.cos(pitch);
  const se = Math.sin(pitch);
  return (x, y, z) => {
    const xr = x * ca - z * sa;
    const zr = x * sa + z * ca;
    return [ox + xr * s, oy - (y * ce + zr * se) * s, zr * ce - y * se];
  };
}

// The camera swings slowly round as the scroll goes, higher over the whole
// property, lower at each service. It rises to look into the house while its
// kitchen and bath are done (`inside`), and over the ADU while the logo is
// chalked and the slab poured (`high`). Reduce Motion holds its angle.
function camera(t, calm, overview, inside, high) {
  if (calm) return { yaw: -35 * RAD, pitch: 32 * RAD };
  return { yaw: lerp(-38, -32, ease(t)) * RAD, pitch: (27 + 9 * overview + 8 * inside + 10 * high) * RAD };
}

// The extent of `e` on screen from this camera, at 1 px per foot.
function measure(cam, e) {
  const P1 = projector(cam, 1, 0, 0);
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const x of e.x) for (const y of e.y) for (const z of e.z) {
    const [sx, sy] = P1(x, y, z);
    x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
  }
  return { x0, x1, y0, y1 };
}
// ... of service `i`'s view, or of the whole property (-1): its size and its
// middle
function view(cam, i) {
  const parts = (i < 0 ? [ADU_EXTENT, PROPERTY_BOUNDS] : [SERVICES[i].focus]).map((e) => measure(cam, e));
  const x0 = Math.min(...parts.map((m) => m.x0)), x1 = Math.max(...parts.map((m) => m.x1));
  const y0 = Math.min(...parts.map((m) => m.y0)), y1 = Math.max(...parts.map((m) => m.y1));
  return { w: x1 - x0, h: y1 - y0, mx: (x0 + x1) / 2, my: (y0 + y1) / 2 };
}

// Where the scene goes: beside the copy on a wide screen, or above it
// (whichever lets the ADU be bigger); above it on a phone. The navbar floats
// over the top NAV px.
const NAV = 96;
function stage({ width: w, height: h, portrait, layout }, cam) {
  const top = NAV + h * 0.015;
  const above = { x0: w * 0.03, x1: w * 0.97, y0: top, y1: Math.max(top + h * 0.22, layout.copyTop * h - h * 0.025) };
  if (portrait) return { box: above, beside: false };
  const beside = { x0: w * clamp(layout.copyRight + 0.025, 0.38, 0.7), x1: w * 0.99, y0: top, y1: h * 0.985 };
  const m = view(cam, 0);
  const fit = (b) => Math.min((b.x1 - b.x0) / m.w, (b.y1 - b.y0) / m.h);
  return fit(beside) >= fit(above) ? { box: beside, beside: true } : { box: above, beside: false };
}

// ---- around the property ---------------------------------------------------
// The dark stage, with a faint green glow behind what's in view that warms
// as the lights come on.
function backdrop(ctx, P, [fx, fz], w, h, lit) {
  ctx.fillStyle = rgba(C.bg);
  ctx.fillRect(0, 0, w, h);
  const [gx, gy] = P(fx, 4, fz);
  const r = Math.max(w, h) * 0.62;
  const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
  g.addColorStop(0, rgba(mix([22, 78, 48], [70, 56, 34], lit), 0.34));
  g.addColorStop(0.45, rgba([14, 42, 28], 0.14));
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

// The ground's grid, every 2 ft (the 10 ft lines stronger), spreading out
// from what's in view and darkening as it goes, within `reach`: each line
// drawn once, its fade along it a gradient. `minor` fades the 2 ft lines out
// as the camera pulls back.
function grid(ctx, P, [cx, cz], reach, minor) {
  ctx.lineWidth = 1;
  const fade = (d) => Math.max(0, 1 - d / reach) ** 1.3;
  const draw = (a, b, offset, half, major) => {
    const strength = major ? 0.42 : 0.17 * minor;
    if (strength * fade(Math.abs(offset)) < 0.01) return;
    const [ax, ay] = P(...a);
    const [bx, by] = P(...b);
    const g = ctx.createLinearGradient(ax, ay, bx, by);
    for (let i = 0; i <= 8; i++) g.addColorStop(i / 8, rgba(C.grid, strength * fade(Math.hypot(offset, lerp(-half, half, i / 8)))));
    ctx.strokeStyle = g;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  };
  for (let x = Math.ceil((cx - reach) / 2) * 2; x <= cx + reach; x += 2) {
    const half = Math.sqrt(Math.max(0, reach * reach - (x - cx) ** 2));
    draw([x, 0, cz - half], [x, 0, cz + half], x - cx, half, x % 10 === 0);
  }
  for (let z = Math.ceil((cz - reach) / 2) * 2; z <= cz + reach; z += 2) {
    const half = Math.sqrt(Math.max(0, reach * reach - (z - cz) ** 2));
    draw([cx - half, 0, z], [cx + half, 0, z], z - cz, half, z % 10 === 0);
  }
}

// Film grain, a small tile of noise laid over the whole scene.
let GRAIN = null;
function grain(ctx, w, h) {
  if (typeof document === "undefined") return;
  if (!GRAIN) {
    GRAIN = document.createElement("canvas");
    GRAIN.width = GRAIN.height = 160;
    const g = GRAIN.getContext("2d");
    const image = g.createImageData(160, 160);
    const r = rng(7);
    for (let i = 0; i < image.data.length; i += 4) {
      const v = Math.round(r() * 255);
      image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
      image.data[i + 3] = 255;
    }
    g.putImageData(image, 0, 0);
  }
  ctx.save();
  ctx.globalAlpha = 0.045;
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = ctx.createPattern(GRAIN, "repeat");
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// ---- the scene -------------------------------------------------------------
// `life` says the moving things (context.js drawLife) are drawn over this
// every frame, the dust among them; without it the dust is drawn here.
// Returns what drawLife needs: the projection, what's in view, how far each
// service has got.
export function drawScene(ctx, { width, height, dpr, t, portrait, layout: given, calm, fonts, logo, life }) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const layout = { copyTop: 0.6, copyLeft: 0.03, copyRight: 0.45, ...given };
  const gt = fonts?.gt ?? "sans-serif";
  const done = SERVICES.map((_, i) => progress(i, t));
  const head = heading(t);
  const { k } = head;
  // how much each service's view (and the whole property's) is the one in view
  const weight = (i) => (i === head.to ? k : 0) + (i === head.from ? 1 - k : 0);
  const overview = weight(-1);
  const high = head.to === 0 ? ease(span(done[0], 0, 0.06)) * (1 - ease(span(done[0], 0.24, 0.46))) : 0;
  const cam = camera(t, calm, overview, weight(1), high);
  const { box, beside } = stage({ width, height, portrait, layout }, cam);

  // Each end of the move framed in the box, the scale between them changing
  // evenly.
  const fit = (i) => {
    const m = view(cam, i);
    const room = i < 0 ? 0.98 : 1;
    return { s: room * Math.min((box.x1 - box.x0) / m.w, (box.y1 - box.y0) / m.h), mx: m.mx, my: m.my };
  };
  const a = fit(head.from);
  const z = fit(head.to);
  const s = Math.exp(lerp(Math.log(a.s), Math.log(z.s), k));
  const P = projector(cam, s, (box.x0 + box.x1) / 2 - lerp(a.mx, z.mx, k) * s, (box.y0 + box.y1) / 2 - lerp(a.my, z.my, k) * s);
  const lw = (ft, min = 1) => Math.max(min, ft * s);

  // what's in view: its middle on the ground, and how far the lights are on
  const middle = (i) => {
    const [lo, hi] = i < 0 ? [ADU_EXTENT, PROPERTY_BOUNDS] : [SERVICES[i].focus, SERVICES[i].focus];
    return [(Math.min(lo.x[0], hi.x[0]) + Math.max(lo.x[1], hi.x[1])) / 2, (Math.min(lo.z[0], hi.z[0]) + Math.max(lo.z[1], hi.z[1])) / 2];
  };
  const [m0, m1] = [middle(head.from), middle(head.to)];
  const focus = [lerp(m0[0], m1[0], k), lerp(m0[1], m1[1], k)];
  const lit = done.reduce((sum, d) => sum + ease(span(d, 0.9, 1)), 0) / done.length;

  backdrop(ctx, P, focus, width, height, lit);
  groundGlow(ctx, P, focus[0], focus[1], 60, rgba(mix([70, 130, 96], [120, 104, 76], lit), 0.24));
  grid(ctx, P, focus, Math.max(70, (0.55 * width) / s), clamp((s - 5) / 8));
  const G = { ctx, P, s, lw };
  drawGround(G);

  // The ADU, the house and the neighbours, far to near; away from the
  // overview, whichever of the ADU and the house isn't being worked on is
  // dimmed (the neighbours are always darker).
  const Ga = { ctx, P: (x, y, zz) => P(x + ADU_AT[0], y, zz + ADU_AT[1]), s, lw };
  const depth = (e) => P((e.x[0] + e.x[1]) / 2, 0, (e.z[0] + e.z[1]) / 2)[2];
  const parts = [
    { e: ADU_EXTENT, bright: weight(0), draw: (c) => drawADU({ ...Ga, ctx: c }, done[0], { logo, gt }) },
    { e: PROPERTY_BOUNDS, bright: weight(1) + weight(2) + weight(3), draw: (c) => drawProperty({ ...G, ctx: c }, { remodel: done[1], addition: done[2], deck: done[3] }) },
    ...NEIGHBOUR_PARTS.map(({ e, draw }) => ({ e, bright: 1, draw: (c) => draw({ ...G, ctx: c }) })),
  ].sort((p, q) => depth(q.e) - depth(p.e));
  for (const { e, bright, draw } of parts) {
    const bounds = onScreen(P, e);
    if (bounds.x1 < 0 || bounds.x0 > width || bounds.y1 < 0 || bounds.y0 > height) continue;
    const b = lerp(DIM, 1, Math.max(overview, bright));
    if (b >= 0.999) draw(ctx);
    else dimmed(ctx, dpr, bounds, b, draw);
  }
  drawStreetLights(G);

  // the outlines of what's still to come, brighter for the one about to start
  SERVICES.forEach((service, i) => {
    const fade = 1 - span(done[i], 0, i === 0 ? 0.06 : 0.1);
    service.ghost(i === 0 ? Ga : G, fade * lerp(0.55, 1, Math.max(overview, weight(i))));
  });

  if (!life) dust(ctx, P, focus, calm ? 0 : t * 6, calm ? 0 : t * 5, lit);
  // (where the service being built is named small over the scene, the tags
  // step aside for it until the end)
  const named = !beside && t >= CHAPTERS[0][0] && t < BACK[0] + TRAVEL - 0.01;
  tags(ctx, P, t, done, gt, width, SERVICES.map((_, i) => (named ? null : Math.max(overview, weight(i)))));
  grain(ctx, width, height);
  captions(ctx, t, done, { width, height, portrait, layout, box, beside, P }, gt, calm);
  // (and where the copy is, which nothing that moves passes behind)
  const copy = beside
    ? { x0: 0, x1: layout.copyRight * width + 40, y0: layout.copyTop * height - 40, y1: height }
    : { x0: 0, x1: width, y0: layout.copyTop * height - 40, y1: height };
  return { P, s, lw, focus, done, t, lit, copy };
}

// where extent `e` is on screen (with room for trees and glows over it)
function onScreen(P, e) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const x of e.x) for (const y of [0, e.y[1] + 6]) for (const z of e.z) {
    const [sx, sy] = P(x, y, z);
    x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
  }
  return { x0, x1, y0, y1 };
}

// How bright the part of the property not being worked on is.
const DIM = 0.25;

// Draws something (`draw(context)`) dimmed to `bright`: on a layer of its
// own, darkened there (only where it has drawn), then laid over the scene.
// Only the part of the screen it covers (`bounds`, CSS px) is touched.
let LAYER = null;
function dimmed(ctx, dpr, bounds, bright, draw) {
  const { width, height } = ctx.canvas;
  if (!LAYER) LAYER = document.createElement("canvas");
  if (LAYER.width !== width || LAYER.height !== height) {
    LAYER.width = width;
    LAYER.height = height;
  }
  const layer = LAYER.getContext("2d");
  const x0 = Math.max(0, Math.floor(bounds.x0 * dpr)), y0 = Math.max(0, Math.floor(bounds.y0 * dpr));
  const x1 = Math.min(width, Math.ceil(bounds.x1 * dpr)), y1 = Math.min(height, Math.ceil(bounds.y1 * dpr));
  if (x1 <= x0 || y1 <= y0) return;
  layer.setTransform(1, 0, 0, 1, 0, 0);
  layer.clearRect(x0, y0, x1 - x0, y1 - y0);
  layer.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw(layer);
  layer.setTransform(1, 0, 0, 1, 0, 0);
  layer.globalCompositeOperation = "source-atop";
  layer.fillStyle = rgba(C.bg, 1 - bright);
  layer.fillRect(x0, y0, x1 - x0, y1 - y0);
  layer.globalCompositeOperation = "source-over";
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(LAYER, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
  ctx.restore();
}

// Each service named over its place on the property, on a line up from it: a
// grey tag until it's started, filling green as it's built, green once it's
// done (with a ring that pulses out as it's finished). Kept on
// screen (horizontally), and slid or lifted clear of any tag it would
// overlap; shorter names on a narrow screen. While one service is built the
// others' tags fade back (`emphasis`; null leaves a tag out).
function tags(ctx, P, t, done, gt, width, emphasis) {
  const narrow = width < 700;
  ctx.save();
  ctx.font = `600 ${narrow ? 9 : 10}px ${gt}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = narrow ? "1.5px" : "2px";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const placed = [];
  const anchors = SERVICES.map((service, i) => ({ service, i, at: P(...service.tag) }));
  for (const { service, i, at: [x, y] } of anchors.sort((p, q) => p.at[1] - q.at[1])) {
    if (emphasis[i] === null) continue;
    const k = done[i];
    const text = (narrow ? service.short : service.name).toUpperCase();
    const w = ctx.measureText(text).width + 24;
    const tag = { x0: Math.min(Math.max(x - w / 2, 6), width - 6 - w), y0: y - 42, w, h: 22 };
    const hit = (r) => placed.find((p) => r.x0 < p.x0 + p.w + 4 && p.x0 < r.x0 + r.w + 4 && r.y0 < p.y0 + p.h + 4 && p.y0 < r.y0 + r.h + 4);
    for (let other = hit(tag); other; other = hit(tag)) {
      // slide clear of it if that's a short way and stays on screen; or lift
      const slide = tag.x0 + w / 2 < other.x0 + other.w / 2 ? other.x0 - 4 - w : other.x0 + other.w + 4;
      if (Math.abs(slide - tag.x0) < w / 2 && slide >= 6 && slide + w <= width - 6 && !hit({ ...tag, x0: slide })) tag.x0 = slide;
      else tag.y0 -= 26;
    }
    placed.push(tag);
    // (and fading out under the navbar)
    ctx.globalAlpha = lerp(0.3, 1, emphasis[i]) * clamp((tag.y0 - NAV + 20) / 40);
    const started = k > 0;
    const finished = k >= 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(Math.min(Math.max(x, tag.x0 + 11), tag.x0 + w - 11), tag.y0 + tag.h);
    ctx.strokeStyle = started ? "rgba(74,214,128,0.5)" : "rgba(255,255,255,0.28)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = started ? rgba(C.greenHi) : "rgba(255,255,255,0.45)";
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    const pill = () => {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(tag.x0, tag.y0, w, tag.h, tag.h / 2);
      else ctx.rect(tag.x0, tag.y0, w, tag.h);
    };
    pill();
    ctx.fillStyle = finished ? rgba(C.green) : "rgba(9,11,10,0.82)";
    ctx.fill();
    if (started && !finished) {
      // filling as it's built
      ctx.save();
      pill();
      ctx.clip();
      ctx.fillStyle = rgba(C.green, 0.9);
      ctx.fillRect(tag.x0, tag.y0, w * k, tag.h);
      ctx.restore();
    }
    pill();
    ctx.strokeStyle = finished ? "rgba(74,214,128,0.9)" : started ? "rgba(74,214,128,0.6)" : "rgba(255,255,255,0.16)";
    ctx.stroke();
    const ink = started ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)";
    ctx.fillStyle = ink;
    // (the letter spacing trails the last letter; nudge it back to centre)
    ctx.fillText(text, tag.x0 + w / 2 + 1, tag.y0 + tag.h / 2 + 0.5);
    // the ring as it's finished
    const pulse = span(t, CHAPTERS[i][1] - 0.015, CHAPTERS[i][1] + 0.01);
    if (pulse > 0 && pulse < 1) {
      const grow = 10 * ease(pulse);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(tag.x0 - grow, tag.y0 - grow, w + 2 * grow, tag.h + 2 * grow, tag.h / 2 + grow);
      else ctx.rect(tag.x0 - grow, tag.y0 - grow, w + 2 * grow, tag.h + 2 * grow);
      ctx.strokeStyle = rgba(C.greenHi, 0.8 * (1 - pulse));
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
  ctx.restore();
}

// The captions. While a service is built its name is set over the scene with
// four bars under it, one for each service, filling as each is built: on a
// wide screen halfway down the space over the headline, just short of the
// service (following it as the camera moves); elsewhere small at the top of
// the scene. The last one stays through the pull-back and goes as the first
// came, leaving the finished property on its own. Over the whole property,
// before and after, there's no caption: the tags name the services.
function captions(ctx, t, done, view, gt, calm) {
  const last = CHAPTERS.length - 1;
  const i = t >= CHAPTERS[last][0] ? last : CHAPTERS.findIndex(([c0, c1]) => t >= c0 && t < c1);
  if (i < 0) return;
  const [c0, c1] = CHAPTERS[i];
  const gone = i === last ? span(t, BACK[0], BACK[0] + TRAVEL - 0.01) : span(t, c1 - 0.012, c1);
  caption(ctx, view, gt, calm, {
    show: Math.min(span(t, c0 + 0.01, c0 + TRAVEL), 1 - gone),
    name: SERVICES[i].name,
    site: SERVICES[i].clear ?? SERVICES[i].focus,
    fill: (j) => done[j],
  });
}

function caption(ctx, { width: w, height: h, portrait, layout, box, beside, P }, gt, calm, { show, name, site, fill }) {
  if (show <= 0) return;
  const text = name.toUpperCase();
  const size = beside ? clamp(w * 0.015, 22, 36) : portrait ? 20 : 26;
  const bar = beside ? Math.round(size * 1.55) : portrait ? 32 : 40;
  const gap = beside ? Math.round(size * 0.45) : portrait ? 10 : 12;
  ctx.save();
  ctx.globalAlpha = show;
  ctx.textBaseline = "top";
  ctx.font = `600 ${size}px ${gt}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "1px";
  let x = portrait ? 24 : box.x0 + 8;
  let y = box.y0 + 6;
  if (beside) {
    // ending just short of the service's left edge (or of the scene's, if
    // the service is further in), never left of the copy
    const at = onScreen(P, site);
    const tall = size + gap + 3;
    const wide = Math.max(ctx.measureText(text).width, 4 * bar + 18);
    x = Math.max(layout.copyLeft * w, Math.min(box.x0 + w * 0.02, at.x0 - 16) - wide);
    y = (NAV + layout.copyTop * h) / 2 - tall / 2;
    if (!calm) y += (1 - ease(show)) * 10;
  }
  ctx.fillStyle = "#fff";
  ctx.fillText(text, x, y);
  for (let j = 0; j < SERVICES.length; j++) {
    const bx = x + j * (bar + 6);
    const by = y + size + gap;
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fillRect(bx, by, bar, 3);
    const f = fill(j);
    if (f > 0) {
      ctx.fillStyle = rgba(C.greenHi);
      ctx.fillRect(bx, by, bar * f, 3);
    }
  }
  ctx.restore();
}
