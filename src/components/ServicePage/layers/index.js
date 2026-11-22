// The Build's drawings (ServicePage/BuildLayers): each service taken apart
// layer by layer, as an architect's exploded view on a blueprint (11-21,
// the user: "like LeTara's Layer by layer", "like you would have it on a
// blueprint", "more of a 3D look", "more obvious" as you scroll), drawn
// with the pieces in kit.js on the sheet BuildSheet lays under it.
//
// A drawing (a model, by its service page's slug) is:
//   stages   how many stages its build has (its page's `build.steps`)
//   levels   where each level of it is moved to, apart from the one under
//            it: feet up, or [x, y, z] feet
//   parts    each { stage (0-5, or null for what's there already, drawn
//            faint and never lit), level, bounds ({ x, y, z } ranges: for
//            fitting it, its shadow and pointing at it), draw(R, k),
//            ghost (true for its box, or a function: its dashed outline
//            before it's built), drop (ft it drops into place from, or
//            rises from below 0), shadow (one under it), hit (false: not
//            pointed at), mark ([x, y, z] ft: where its stage's number
//            points, if not the middle of its stage's biggest part's right
//            side) }, drawn in order — the levels bottom up
//   label    what it shows, for a screen reader
//   short    the service, for the sheet's title block
//   plan     its floor plan, for the sheet's key plan (BuildSheet)
//
// Before the section's reached each part is a dashed outline; then the
// stages are built in turn, each part in its own way (`k` 0-1). Freshly
// built work is drawn in Electric Lime and settles to white. The stage
// pointed at (`on`) lifts out and lights up in lime, glowing, while the
// rest fade back into the sheet (`dim`).
//
// Each stage is numbered on the drawing, to match the list of stages beside
// it (11-21, the user: "add the numbers like we did on LeTara on the
// build"): as on LeTara's Layer by layer, a number in a column beside the
// drawing on a dashed leader to its layer — here a square (HB's mark, not
// LeTara's hexagon), white on the sheet, in a column on the right (the key
// plan has the top left), lime while its stage is pointed at. Each number
// comes in as its stage is built.

import { RAD, convexHull, ease, lerp, rgba, span } from "@/components/Home/intro/kit";
import { projector } from "@/components/Home/intro/scene";
import { LIME, SHEET, WHITE, flat, ghostBox, softShadow } from "./kit";
import adu from "./adu";
import garage from "./garage";
import addition from "./addition";
import remodel from "./remodel";
import kitchen from "./kitchen";
import bathroom from "./bathroom";
import deck from "./deck";
import designBuild from "./designbuild";

const CAMERA = { yaw: -35 * RAD, pitch: 30 * RAD };

// The services drawn layer by layer, by their service page's slug.
export const LAYERED = {
  "adu-builder": adu,
  "garage-conversion": garage,
  "home-additions": addition,
  "home-remodel": remodel,
  "kitchen-remodel": kitchen,
  "bathroom-remodel": bathroom,
  "deck-and-patio": deck,
  "design-build": designBuild,
};

// where a level is moved to, as [x, y, z] ft
const offsetOf = (level) => (Array.isArray(level) ? level : [0, level, 0]);
const cornersOf = ({ x, y, z }, [dx, dy, dz]) => x.flatMap((a) => y.flatMap((b) => z.map((c) => [a + dx, b + dy, c + dz])));
// room over each part for it to lift into while it's read
const LIFT = 2.4;
const withLift = ({ x, y, z }) => ({ x, y: [y[0], y[1] + LIFT], z });

// ---- fitting it to the canvas ---------------------------------------------
// Where everything goes on a canvas `width` by `height` (CSS px): the
// drawing's scale and middle (inside `inset`: room kept clear round it, px
// on each side), each layer's outline on screen for pointing at it, and the
// stages' numbers (`column`: the x their squares are centred on).
const MARK = 12; // half a number's square, px
const MARK_GAP = 46; // px at least from one number to the next
export function layoutLayers(model, { width, height, dpr, inset = [14, 14, 14, 14], column = width - 28 }) {
  const [top, right, bottom, left] = inset;
  const P1 = projector(CAMERA, 1, 0, 0);
  let [ex0, ex1, ey0, ey1] = [Infinity, -Infinity, Infinity, -Infinity];
  for (const part of model.parts)
    for (const c of cornersOf(withLift(part.bounds), offsetOf(model.levels[part.level]))) {
      const [x, y] = P1(...c);
      ex0 = Math.min(ex0, x);
      ex1 = Math.max(ex1, x);
      ey0 = Math.min(ey0, y);
      ey1 = Math.max(ey1, y);
    }
  const w = width - left - right;
  const h = height - top - bottom;
  const s = Math.min(w / (ex1 - ex0), h / (ey1 - ey0));
  const P = projector(CAMERA, s, left + w / 2 - ((ex0 + ex1) / 2) * s, top + h / 2 - ((ey0 + ey1) / 2) * s);
  // the parts on screen, the top one first
  const hits = model.parts
    .filter((part) => part.stage !== null && part.hit !== false)
    .map((part) => ({
      stage: part.stage,
      hull: convexHull(cornersOf(part.bounds, offsetOf(model.levels[part.level])).map((c) => P(...c).slice(0, 2))),
    }))
    .reverse();
  // the numbers: each stage's leader runs to its biggest part on screen —
  // the middle of that part's right side, which always faces the camera, or
  // the point the part names (`mark`, ft in its own frame) — from its
  // square in the column; the squares evenly down the side, in the order of
  // what they point at, top to bottom, so no two leaders cross
  const [ux, uy] = P(0, 1, 0);
  const [zx, zy] = P(0, 0, 0);
  const area = (pts) => {
    const hull = convexHull(pts);
    let sum = 0;
    for (let i = 0; i < hull.length; i++) {
      const [ax, ay] = hull[i];
      const [bx, by] = hull[(i + 1) % hull.length];
      sum += ax * by - bx * ay;
    }
    return Math.abs(sum) / 2;
  };
  const marks = [];
  for (let stage = 0; stage < model.stages; stage++) {
    const parts = model.parts.filter((part) => part.stage === stage);
    if (!parts.length) continue;
    const sized = parts.map((part) => {
      const off = offsetOf(model.levels[part.level]);
      return { part, off, size: part.mark ? Infinity : area(cornersOf(part.bounds, off).map((c) => P(...c).slice(0, 2))) };
    });
    const { part, off } = sized.reduce((a, b) => (b.size > a.size ? b : a));
    const { x, y, z } = part.bounds;
    const [px, py, pz] = part.mark ?? [x[1], (y[0] + y[1]) / 2, (z[0] + z[1]) / 2];
    marks.push({ stage, anchor: P(px + off[0], py + off[1], pz + off[2]).slice(0, 2) });
  }
  marks.sort((a, b) => a.anchor[1] - b.anchor[1]);
  if (marks.length) {
    const n = marks.length;
    const lo = marks[0].anchor[1];
    const hi = marks[n - 1].anchor[1];
    const run = Math.max((n - 1) * MARK_GAP, hi - lo);
    const room = [top + MARK, height - bottom - MARK];
    const first = Math.min(Math.max((lo + hi) / 2 - run / 2, room[0]), room[1] - run);
    marks.forEach((m, i) => (m.y = n > 1 ? first + (i * run) / (n - 1) : (lo + hi) / 2));
  }
  return { model, P, s, width, height, dpr, hits, marks, column, up: [ux - zx, uy - zy] };
}

// The stage of the number or top part under the point (x, y) on the
// canvas, or null.
export function hitLayers(view, x, y) {
  if (!view) return null;
  for (const m of view.marks)
    if (Math.abs(x - view.column) <= MARK + 2 && Math.abs(y - m.y) <= MARK + 2) return m.stage;
  for (const { stage, hull } of view.hits) {
    let inside = hull.length > 2;
    let sign = 0;
    for (let i = 0; i < hull.length && inside; i++) {
      const [ax, ay] = hull[i];
      const [bx, by] = hull[(i + 1) % hull.length];
      const cross = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
      if (cross === 0) continue;
      if (!sign) sign = Math.sign(cross);
      else if (Math.sign(cross) !== sign) inside = false;
    }
    if (inside) return stage;
  }
  return null;
}

// ---- drawing it -----------------------------------------------------------
// `arrive`: each stage's build, 0-1; `on`: each stage pointed at, 0-1;
// `dim`: whether one is (0-1); `calm`: Reduce Motion (nothing drops in);
// `font`: the family the numbers are set in.
export function drawLayers(ctx, view, { arrive, on, dim, calm, font = "sans-serif" }) {
  const { model, P, s, width, height, dpr } = view;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.lineJoin = "round";
  ctx.lineCap = "butt";

  // the parts still to come, dashed
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  for (const part of model.parts) {
    if (!part.ghost) continue;
    const g = 1 - ease(span(arrive[part.stage ?? 0], 0, 0.6));
    if (g <= 0) continue;
    ctx.strokeStyle = rgba(WHITE, 0.4 * g);
    const R = { ctx, P, s, off: offsetOf(model.levels[part.level]) };
    if (part.ghost === true) ghostBox(R, part.bounds.x, part.bounds.y, part.bounds.z);
    else part.ghost(R);
  }
  ctx.restore();

  // the parts, bottom up: each its shadow, then itself (glowing lime while
  // its stage is being read)
  for (const part of model.parts) {
    const context = part.stage === null;
    const k = arrive[part.stage ?? 0];
    if (k <= 0) continue;
    const o = context ? 0 : on[part.stage];
    const settling = calm ? 0 : 1 - ease(span(k, 0, 0.5));
    const [dx, dy, dz] = offsetOf(model.levels[part.level]);
    const R = {
      ctx,
      P,
      s,
      dpr,
      off: [dx, dy + o * (calm ? 0.6 : LIFT) + (part.drop ?? 0) * settling, dz],
      a: lerp(1, 0.38, dim * (1 - o)) * ease(span(k, 0, 0.3)) * (context ? (part.faint ?? 0.6) : 1),
      on: o,
      fresh: !context && k < 1 ? 1 - ease(span(k, 0.55, 1)) : 0,
    };
    if (part.shadow) {
      const { x: [x0, x1], y: [y0], z: [z0, z1] } = part.bounds;
      softShadow({ ...R, off: [dx, dy, dz] }, flat([x0, z0, x1, z1], y0 - 0.6), lerp(14, 22, o), lerp(0.55, 0.4, o));
    }
    if (o > 0.01) {
      ctx.save();
      ctx.shadowColor = rgba(LIME, 0.45 * o);
      ctx.shadowBlur = 12 * o * dpr;
      part.draw(R, k);
      ctx.restore();
    } else part.draw(R, k);
  }

  drawMarks(ctx, view, { arrive, on, dim, calm, font });
}

// The stages' numbers, over the drawing: each its leader (dashed, a dot at
// its layer, following the layer as it lifts) and its square.
function drawMarks(ctx, view, { arrive, on, dim, calm, font }) {
  const { marks, column: cx, up } = view;
  ctx.save();
  ctx.font = `600 11px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const m of marks) {
    const shown = ease(span(arrive[m.stage], 0.35, 1));
    if (shown <= 0) continue;
    const o = on[m.stage];
    const a = shown * lerp(1, 0.45, dim * (1 - o));
    const lift = o * (calm ? 0.6 : LIFT);
    const ax = m.anchor[0] + up[0] * lift;
    const ay = m.anchor[1] + up[1] * lift;
    const ink = (alpha) => (o > 0.5 ? rgba(LIME, alpha) : rgba(WHITE, alpha));
    // the leader: a short way across from the square, then straight to the
    // layer
    ctx.setLineDash([3, 3]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = ink((0.4 + 0.5 * o) * a);
    ctx.beginPath();
    ctx.moveTo(cx - MARK, m.y);
    ctx.lineTo(Math.max(ax, cx - MARK - 14), m.y);
    ctx.lineTo(ax, ay);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = ink(0.85 * a);
    ctx.beginPath();
    ctx.arc(ax, ay, 2, 0, Math.PI * 2);
    ctx.fill();
    // the square, over the sheet's grid
    ctx.globalAlpha = a;
    ctx.fillStyle = o > 0.5 ? rgba(LIME) : rgba(SHEET);
    ctx.fillRect(cx - MARK, m.y - MARK, MARK * 2, MARK * 2);
    ctx.strokeStyle = o > 0.5 ? rgba(LIME) : rgba(WHITE, 0.6);
    ctx.lineWidth = 1.2;
    ctx.strokeRect(cx - MARK + 0.5, m.y - MARK + 0.5, MARK * 2 - 1, MARK * 2 - 1);
    ctx.fillStyle = o > 0.5 ? rgba(SHEET) : rgba(WHITE, 0.92);
    ctx.fillText(String(m.stage + 1).padStart(2, "0"), cx, m.y + 0.5);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}
