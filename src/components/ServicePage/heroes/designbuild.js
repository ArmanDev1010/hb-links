// The Design-Build page's hero (ServicePage/ServiceHero, 11-21, the user:
// bring back the old blueprint hero — the house drafted on a blue sheet —
// mixed with the drawn build). It opens on a blueprint unrolling across the
// lot, and the house is drafted on it in white line by line: the sheet's
// border, the floor plan where the house will stand, its front elevation
// along the front of the sheet, the title block with the HB Links logo, a
// ruler and a pencil left on the paper. Then the paper dissolves into the
// ground and the house is built out of its own drawing (Home/intro/
// designbuild.js): the plan in green, its wireframe, the slab, the framing,
// the walls and roofs, the garden, the lights. `k`: 0-1.

import { drawDesignBuild } from "@/components/Home/intro/designbuild";
import { clamp } from "@/components/Home/intro/kit";
import { block, fillPoly, groundGlow, groundQuad, lerp, line, rgba, step, stroke, span } from "./kit";

const SHEET = { x: [-6, 48], z: [-15, 28] };
const BLUE = [26, 72, 140];
const INK = "rgba(240,246,255,";
// where the build takes over from the drawing
const BUILD_FROM = 0.26;

// the plan (the house's footprint: its walls and rooms) and the upper
// storey over it, dashed
const PLAN = [
  [[0, 0], [34, 0]], [[34, 0], [34, 24]], [[34, 24], [0, 24]], [[0, 24], [0, 0]],
  [[8, 0], [8, 24]], [[0, 14], [8, 14]], [[20, 9], [20, 24]], [[20, 9], [34, 9]],
];
const PLAN_ABOVE = [[[12, -5], [40, -5]], [[40, -5], [40, 17]], [[40, 0], [34, 0]]];
// the front elevation along the front of the sheet: ft across and ft up,
// laid on the paper at `E0` with its heights scaled by `ES`
const E0 = -13.2;
const ES = 0.27;
const ELEVATION = [
  [[-2, 0], [42, 0]],
  [[0, 0.8], [0, 10.5]], [[0, 10.5], [12, 10.5]], [[34, 0.8], [34, 9.5]],
  [[12, 9.5], [12, 20]], [[12, 20], [40, 20]], [[40, 20], [40, 9.5]], [[40, 9.5], [12, 9.5]],
  [[39.35, 0], [39.35, 9.5]],
  // the tall window, the door, the glass wall, the ribbon window
  [[2.6, 3.2], [6, 3.2]], [[6, 3.2], [6, 8.6]], [[6, 8.6], [2.6, 8.6]], [[2.6, 8.6], [2.6, 3.2]],
  [[12.6, 0.8], [12.6, 8.8]], [[12.6, 8.8], [16, 8.8]], [[16, 8.8], [16, 0.8]],
  [[20.5, 0.8], [20.5, 9.2]], [[20.5, 9.2], [33, 9.2]], [[33, 9.2], [33, 0.8]], [[24.6, 0.8], [24.6, 9.2]], [[28.8, 0.8], [28.8, 9.2]],
  [[15, 12.3], [37, 12.3]], [[37, 12.3], [37, 17.7]], [[37, 17.7], [15, 17.7]], [[15, 17.7], [15, 12.3]], [[22.3, 12.3], [22.3, 17.7]], [[29.6, 12.3], [29.6, 17.7]],
];
const TITLE = { x: [40.5, 47], z: [-14.2, -7.4] };

export function drawDesignBuildBlueprint(G, k, assets) {
  const paper = 1 - step(k, 0.3, 0.44);
  if (paper > 0) blueprint(G, k, paper, assets);
  const kk = clamp((k - BUILD_FROM) / (1 - BUILD_FROM));
  if (kk > 0) drawDesignBuild(G, kk, assets);
}
// the crew's times, given in the build's own terms
export const toBuild = (p) => BUILD_FROM + p * (1 - BUILD_FROM);

function blueprint(G, k, a, assets) {
  const { ctx, P, lw } = G;
  const [x0, x1] = SHEET.x;
  const [z0, z1] = SHEET.z;
  const unroll = step(k, 0, 0.07);
  const xr = lerp(x0 + 1.2, x1, unroll);
  // the paper, lighter toward its middle
  fillPoly(ctx, P, groundQuad([x0, z0, xr, z1], 0.02), rgba(BLUE, a));
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  groundGlow(ctx, P, (x0 + xr) / 2, 6, 30, `rgba(70,110,170,${0.35 * a})`, "rgba(0,0,0,0)", 0.025);
  ctx.restore();
  // the rolls: the one it unrolled from, on the left, and the one still
  // rolling out
  block(G, [x0 - 0.9, x0 + 0.3], [0, 1.2], [z0 - 0.6, z1 + 0.6], [220, 226, 232], a);
  block(G, [xr - 0.3, xr + 0.9], [0, 1.2], [z0 - 0.6, z1 + 0.6], [220, 226, 232], a);
  const d = span(k, 0.07, 0.28);
  if (d <= 0) return;
  const ink = (alpha) => `${INK}${alpha * a})`;
  const draw = (segs, from, to, y = 0.03, alpha = 0.85, dash = null) => {
    const g = span(d, from, to);
    if (g <= 0) return;
    ctx.save();
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    segs.forEach(([p, q], i) => {
      const kk = span(g, (i / segs.length) * 0.7, (i / segs.length) * 0.7 + 0.3);
      if (kk > 0) line(ctx, P, [p[0], y, p[1]], [q[0], y, q[1]], kk);
    });
    stroke(ctx, ink(alpha), Math.max(1.3, lw(0.15)));
    ctx.restore();
  };
  // the sheet's border
  const b = 1;
  draw([[[x0 + b, z0 + b], [x1 - b, z0 + b]], [[x1 - b, z0 + b], [x1 - b, z1 - b]], [[x1 - b, z1 - b], [x0 + b, z1 - b]], [[x0 + b, z1 - b], [x0 + b, z0 + b]]], 0, 0.2, 0.03, 0.6);
  // the plan, then the storey over it, dashed
  draw(PLAN, 0.12, 0.5, 0.03, 0.95);
  draw(PLAN_ABOVE, 0.4, 0.55, 0.03, 0.7, [3, 3]);
  // the front elevation
  draw(ELEVATION.map(([p, q]) => [[p[0], E0 + p[1] * ES], [q[0], E0 + q[1] * ES]]), 0.45, 0.9, 0.03, 0.9);
  // the title block, and the ruler and pencil
  const [tx0, tx1] = TITLE.x;
  const [tz0, tz1] = TITLE.z;
  draw([[[tx0, tz0], [tx0, tz1]], [[tx0, tz1], [tx1, tz1]], [[tx0, tz0 + 2.6], [tx1, tz0 + 2.6]], [[tx0 + 4.3, tz0], [tx0 + 4.3, tz0 + 2.6]]], 0.7, 0.85, 0.03, 0.7);
  const tools = step(d, 0.25, 0.4);
  block(G, [x0 + 1.8, x0 + 2.6], [0.02, 0.12], [8, 24], [236, 232, 214], a * tools);
  block(G, [x0 + 3.2, x0 + 3.6], [0.02, 0.3], [10, 19], [226, 182, 58], a * tools);
  block(G, [x0 + 3.2, x0 + 3.6], [0.02, 0.3], [9.2, 10], [240, 210, 190], a * tools);
  const words = step(d, 0.85, 1);
  if (words > 0) {
    onPaper(G, tx0 + 0.5, tz1 - 0.5, (c) => {
      if (assets.logo?.complete && assets.logo.naturalWidth) {
        const w = 52;
        c.globalAlpha = words * a;
        c.drawImage(assets.logo, 0, 0, w, (w * assets.logo.naturalHeight) / assets.logo.naturalWidth);
      }
    });
    text(G, "DESIGN-BUILD · A NEW HOME", tx0 + 0.5, tz0 + 2.1, 5.2, words * a, assets.gt);
    text(G, "A-201", tx0 + 4.8, tz0 + 1.2, 9, words * a, assets.gt);
    text(G, "FRONT ELEVATION", 0, E0 - 0.7, 6.5, words * a, assets.gt);
  }
}

// draws `fn` in the paper's own plane, 10 units to the foot, from (x, z),
// across to +x and down the sheet toward the front (-z)
function onPaper(G, x, z, fn) {
  const { ctx, P } = G;
  const [ox, oy] = P(x, 0.04, z);
  const [ax, ay] = P(x + 1, 0.04, z);
  const [bx, by] = P(x, 0.04, z - 1);
  ctx.save();
  ctx.transform((ax - ox) / 10, (ay - oy) / 10, (bx - ox) / 10, (by - oy) / 10, ox, oy);
  fn(ctx);
  ctx.restore();
}
function text(G, words, x, z, size, a, gt) {
  onPaper(G, x, z, (c) => {
    c.font = `600 ${size}px ${gt}`;
    c.textBaseline = "alphabetic";
    c.fillStyle = `rgba(240,246,255,${0.9 * a})`;
    if ("letterSpacing" in c) c.letterSpacing = "1px";
    c.fillText(words, 0, 0);
  });
}

