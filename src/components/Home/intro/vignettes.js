// The homepage's Services section draws each service on its own little
// stage (Home/ServiceDrawing), in the hero's style and with the hero's own
// pieces: the drafting grid, the ADU, the house with its remodel, addition
// and deck. Before a card is reached it shows the service's dashed outline,
// like a service still locked in the hero; then the service is built,
// `k` going from 0 to its `end`.

import { C, RAD, clamp, span, rgba, groundGlow } from "./kit";
import { drawADU, ADU_BOUNDS } from "./adu";
import { drawProperty, ghostADU, ghostRemodel, ghostAddition, ghostDeck } from "./property";
import { drawDesignBuild, ghostDesignBuild, DESIGN_BUILD_BOUNDS } from "./designbuild";
import { projector, measure, grid } from "./scene";

// Each service's stage, by its service page's slug: what the camera frames,
// how it's built and outlined, where its build stops and how long it takes
// (seconds), and where its build goes back to when the card is pointed at
// (`replay`): the ADU to its slab, the remodel to its bare rooms, the
// addition and the deck to their footings, Design-Build to its design
// (the plan on the ground, the wireframe over it).
// - Home Remodel stops with the roof still lifted, the new kitchen and bath
//   on show inside.
// - Design-Build is a modern two-storey home of its own (designbuild.js):
//   designed on the ground, then built inside its wireframe, finished and
//   lit.
export const VIGNETTES = {
  "adu-builder": {
    focus: ADU_BOUNDS,
    draw: (G, k, assets) => drawADU(G, k, assets),
    ghost: ghostADU,
    end: 1,
    seconds: 3.4,
    replay: 0.25,
  },
  "home-remodel": {
    focus: { x: [-4, 40], y: [0, 17], z: [-4, 26] },
    draw: (G, k) => drawProperty(G, { remodel: k, addition: 0, deck: 0 }),
    ghost: ghostRemodel,
    end: 0.86,
    seconds: 3,
    replay: 0.12,
  },
  "home-additions": {
    focus: { x: [-2, 56], y: [0, 17], z: [-4, 28] },
    draw: (G, k) => drawProperty(G, { remodel: 1, addition: k, deck: 0 }),
    ghost: ghostAddition,
    end: 1,
    seconds: 3,
    replay: 0.08,
  },
  "deck-and-patio": {
    focus: { x: [0, 44], y: [0, 17], z: [-20, 24] },
    draw: (G, k) => drawProperty(G, { remodel: 1, addition: 0, deck: k }),
    ghost: ghostDeck,
    end: 1,
    seconds: 3,
    replay: 0.14,
  },
  "design-build": {
    focus: DESIGN_BUILD_BOUNDS,
    draw: (G, k, assets) => drawDesignBuild(G, k, assets),
    ghost: ghostDesignBuild,
    end: 1,
    seconds: 3.6,
    replay: 0.12,
  },
};

// The camera: the hero's, held at one angle.
const CAMERA = { yaw: -35 * RAD, pitch: 30 * RAD };

// Service `slug`'s stage at this size: the service framed in `box`
// (fractions of the canvas, room left under it for the card's text), and
// the ground under it (the dark, a soft glow and the drafting grid) on a
// canvas of its own, drawn again only when the camera turns.
export function stageFor(slug, { width, height, dpr }, box = [0.06, 0.08, 0.94, 0.72]) {
  const v = VIGNETTES[slug];
  const m = measure(CAMERA, v.focus);
  const [bx0, by0, bx1, by1] = [box[0] * width, box[1] * height, box[2] * width, box[3] * height];
  const s = Math.min((bx1 - bx0) / (m.x1 - m.x0), (by1 - by0) / (m.y1 - m.y0));
  const P = projector(CAMERA, s, (bx0 + bx1) / 2 - ((m.x0 + m.x1) / 2) * s, (by0 + by1) / 2 - ((m.y0 + m.y1) / 2) * s);
  const middle = [(v.focus.x[0] + v.focus.x[1]) / 2, (v.focus.y[0] + v.focus.y[1]) / 2, (v.focus.z[0] + v.focus.z[1]) / 2];
  const ground = document.createElement("canvas");
  ground.width = Math.round(width * dpr);
  ground.height = Math.round(height * dpr);
  const stage = {
    v,
    s,
    lw: (ft, min = 1) => Math.max(min, ft * s),
    width,
    height,
    dpr,
    middle,
    // where the service's middle sits on the card, whichever way the camera turns
    anchor: P(...middle),
    ground,
    turn: null,
    P: null,
  };
  turnStage(stage, 0);
  return stage;
}

// Turns the stage's camera `turn` degrees round the service (keeping its
// middle where it was, at the same scale) and draws the ground again.
export function turnStage(stage, turn) {
  if (stage.turn === turn) return;
  const { s, width, height, dpr, middle, anchor, ground } = stage;
  const cam = { yaw: CAMERA.yaw + turn * RAD, pitch: CAMERA.pitch };
  const [x, y] = projector(cam, s, 0, 0)(...middle);
  stage.P = projector(cam, s, anchor[0] - x, anchor[1] - y);
  stage.turn = turn;

  const g = ground.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.fillStyle = rgba(C.bg);
  g.fillRect(0, 0, width, height);
  groundGlow(g, stage.P, middle[0], middle[2], 46, rgba([70, 130, 96], 0.22));
  grid(g, stage.P, [middle[0], middle[2]], Math.max(36, (0.62 * width) / s), clamp((s - 4) / 8));
}

// The stage with its service `k` of the way through its build.
export function drawVignette(ctx, stage, k, assets) {
  const { v, P, s, lw, dpr, ground } = stage;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(ground, 0, 0);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const G = { ctx, P, s, lw };
  v.draw(G, k, assets);
  // the outline, fading as the work starts
  v.ghost(G, 1 - span(k, 0, 0.1));
}
