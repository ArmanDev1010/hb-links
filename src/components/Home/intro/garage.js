// A garage conversion, for the Garage Conversion page's hero (ServicePage/
// ServiceHero): the ADU's building (adu.js), finished, standing in as a
// detached two-car garage — its roll-up door across the front, a driveway
// in front of it — turned into a home. The door rolls up into the opening,
// the opening is framed in, stuccoed to match, and the new window and slider
// show; then the driveway gives way to the porch, the lawn and the pavers,
// and the lights come on. `k` is how far the conversion has got (0 = the
// garage, 1 = done, lit).
//
// In feet, as adu.js: the building is 30 wide (x) by 20 deep (z), its front
// at z = 0, the slab's top 0.6 up.

import { lerp, ease, span, mix, rgba, C, fillPoly, line, groundQuad } from "./kit";
import { drawADU } from "./adu";
import { ghost } from "./property";

// The two-car door across the front, over where the window and slider go.
const DOOR = { s: [2.6, 18.4], y: [0.6, 7.6] };
// The driveway up to it.
const DRIVE = [1.6, -11, 19.4, -0.05];
// When each piece of the conversion happens.
const T = {
  door: [0.1, 0.24], // the door rolls up
  frame: [0.24, 0.38], // the opening framed in
  infill: [0.36, 0.5], // sheathed and stuccoed
  reveal: [0.48, 0.6], // the new window and slider show
  drive: [0.58, 0.7], // the driveway broken out
  yard: [0.6, 1], // the ADU's own finish: porch, lawn, pavers, lights
};
// The ADU's build progress the garage starts at: shell, stucco and trim
// done, its yard not started.
const SHELL = 0.83;

const quad = (at, s0, s1, y0, y1) => [at(s0, y0), at(s1, y0), at(s1, y1), at(s0, y1)];

export function drawGarageConversion(G, k, assets) {
  const { ctx, P, lw } = G;
  // the driveway, under everything, gone once the yard goes in
  const drive = 1 - ease(span(k, ...T.drive));
  if (drive > 0) {
    fillPoly(ctx, P, groundQuad(DRIVE, 0.025), rgba(C.concrete, 0.85 * drive));
    ctx.beginPath();
    for (const z of [-3.7, -7.4]) line(ctx, P, [DRIVE[0], 0.03, z], [DRIVE[2], 0.03, z]);
    line(ctx, P, [10.5, 0.03, DRIVE[1]], [10.5, 0.03, DRIVE[3]]);
    ctx.strokeStyle = rgba([0, 0, 0], 0.18 * drive);
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  drawADU(G, lerp(SHELL, 1, span(k, ...T.yard)), assets);

  // Over the front wall, a hair in front of it: the opening while it's open,
  // its new framing, the infill — until the new wall shows from under it.
  const at = (s, y) => [s, y, -0.06];
  const [s0, s1] = DOOR.s;
  const [y0, y1] = DOOR.y;
  const covered = 1 - ease(span(k, ...T.reveal));
  if (covered > 0) {
    const infill = ease(span(k, ...T.infill));
    // dark inside, turning to fresh stucco as it's filled in
    fillPoly(ctx, P, quad(at, s0, s1, y0, y1), rgba(mix([18, 20, 20], C.stucco, infill), covered));
    // the framing: plates, studs 16" apart, the window's and slider's
    // headers and sills
    const studs = span(k, ...T.frame) * (1 - infill);
    if (studs > 0) {
      ctx.beginPath();
      line(ctx, P, at(s0, y0 + 0.15), at(s1, y0 + 0.15), ease(studs));
      line(ctx, P, at(s0, y1 - 0.15), at(s1, y1 - 0.15), ease(studs));
      for (let s = s0 + 0.2, i = 0; s < s1; s += 1.33, i++) {
        const g = ease(span(studs, (i / 14) * 0.6, (i / 14) * 0.6 + 0.4));
        if (g > 0) line(ctx, P, at(s, y0), at(s, lerp(y0, y1, g)));
      }
      line(ctx, P, at(3, 7.2), at(8, 7.2), ease(studs));
      line(ctx, P, at(3, 2.8), at(8, 2.8), ease(studs));
      line(ctx, P, at(11, 7.2), at(17, 7.2), ease(studs));
      ctx.strokeStyle = rgba(C.wood, 0.95 * covered);
      ctx.lineWidth = lw(0.18);
      ctx.stroke();
    }
  }

  // The door, rolling up into the opening's head.
  const up = ease(span(k, ...T.door));
  if (up < 1) {
    const bottom = lerp(y0, y1, up);
    fillPoly(ctx, P, quad(at, s0, s1, bottom, y1), rgba([222, 220, 214]));
    ctx.beginPath();
    // its panels' grooves, rolling up with it
    for (let i = 1; i < 4; i++) {
      const y = bottom + ((y1 - y0) / 4) * i;
      if (y < y1) line(ctx, P, at(s0, y), at(s1, y));
    }
    ctx.strokeStyle = rgba([0, 0, 0], 0.22);
    ctx.lineWidth = 1;
    ctx.stroke();
    // its trim
    ctx.beginPath();
    line(ctx, P, at(s0, y0), at(s0, y1));
    line(ctx, P, at(s0, y1), at(s1, y1));
    line(ctx, P, at(s1, y1), at(s1, y0));
    ctx.strokeStyle = rgba(C.trim, 0.9);
    ctx.lineWidth = lw(0.22);
    ctx.stroke();
  }
}

// Before it starts: the new window and slider, outlined on the door.
export function ghostGarageConversion(G, a) {
  const z = -0.1;
  const rect = ([x0, x1], [y0, y1]) => [
    [[x0, y0, z], [x1, y0, z]],
    [[x1, y0, z], [x1, y1, z]],
    [[x1, y1, z], [x0, y1, z]],
    [[x0, y1, z], [x0, y0, z]],
  ];
  ghost(G, [...rect([3, 8], [3, 7]), ...rect([11, 17], [0.6, 7])], a);
}
