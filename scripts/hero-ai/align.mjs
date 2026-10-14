// Locks one timelapse's AI frames to one camera before `npm run hero-frames`
// cuts them for a hero:
//
//   node scripts/hero-ai/align.mjs <sequence> [--ref NN] [--wide NN,NN]
//
// <sequence> is a folder in scripts/hero-ai (e.g. kitchen-remodel) holding
// frames/NN.png. Gemini keeps the camera within a pixel through most edits,
// but a chain of edits can drift — on the ADU, frames made from an early key
// came out 64 px higher and 2% larger than the rest, which jolts the scroll.
// For each frame this finds the scale, rotation and shift that best match the
// reference frame (the last one, or --ref), warps the frame onto it, and fills
// any edge the frame no longer covers from the nearest frame that needed no
// fill. Writes <sequence>/aligned/NN.png (lossless).
//
// It matches on the parts of the shot that never change. Those can be set in
// <sequence>/config.json as "static": [[x0, y0, x1, y1], ...] (fractions of
// the frame); then every frame is matched to the reference, and the light is
// evened out from frame to frame (see deflicker). Without them a room may
// change completely between the first day and the last, so each frame is
// matched to its already-aligned neighbor instead — one day apart, they share
// most of the picture — and only moved by a small, clearly better fit. The
// color is left alone.
//
// --wide names frames that came back from Gemini zoomed or moved further than
// the usual drift (up to 20% and 200 px) — searched that far and allowed that
// big a correction. Only for frames that need it: a wide search on a frame
// that changed a lot can find a false fit.
//
// sharp comes with Next.js; nothing else is needed.

import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const sharp = createRequire(new URL("../../package.json", import.meta.url))("sharp");

const { values, positionals } = parseArgs({ allowPositionals: true, options: { ref: { type: "string" }, wide: { type: "string" } } });
if (!positionals[0]) throw new Error("Usage: node scripts/hero-ai/align.mjs <sequence> [--ref NN] [--wide NN,NN]");
const WIDE = new Set((values.wide ?? "").split(",").map((n) => n.trim()).filter(Boolean));
const DIR = path.join(HERE, positionals[0]);
const IN = path.join(DIR, "frames");
const OUT = path.join(DIR, "aligned");
const config = existsSync(path.join(DIR, "config.json")) ? JSON.parse(readFileSync(path.join(DIR, "config.json"), "utf8")) : {};

// Parts of the shot that never change, as fractions of the frame — from
// config.json, or the whole frame (less a thin border) when it names none.
const STATIC = config.static ?? [[0.02, 0.02, 0.98, 0.98]];
const TUNED = Boolean(config.static);
// Without tuned regions, a frame is only moved if that raises its match by
// at least this much — a room that changes a lot between days mustn't be
// shifted to line up its new furniture.
const MIN_GAIN = TUNED ? 0 : 0.03;
// Uncovered edges up to this many px are filled by stretching the edge pixels;
// wider ones come from another frame, blended in over FEATHER px.
const CLAMP = 4;
const FEATHER = 40;
const DEG = Math.PI / 180;

// ---- measuring ----------------------------------------------------------

// Gradient magnitude of the frame at 1/`f` size — edges, not colors, so a
// hazier or sunnier day still matches.
async function gradients(file, f, size) {
  const w = Math.round(size.w / f), h = Math.round(size.h / f);
  const g = await sharp(file).resize(w, h).greyscale().blur(0.7).raw().toBuffer();
  const d = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x, gx = g[i + 1] - g[i - 1], gy = g[i + w] - g[i - w];
      d[i] = Math.sqrt(gx * gx + gy * gy);
    }
  const idx = [];
  for (const [x0, y0, x1, y1] of STATIC)
    for (let y = Math.ceil(y0 * h); y < Math.floor(y1 * h); y++)
      for (let x = Math.ceil(x0 * w); x < Math.floor(x1 * w); x++) idx.push(y * w + x);
  return { w, h, d, idx: Int32Array.from(idx) };
}

// A transform maps a reference pixel p to the frame: s·R(θ)·(p − c) + c + t.
function mapper({ s, th, tx, ty }, w, h) {
  const a = Math.cos(th) * s, b = Math.sin(th) * s, cx = w / 2, cy = h / 2;
  return (x, y) => [a * (x - cx) - b * (y - cy) + cx + tx, b * (x - cx) + a * (y - cy) + cy + ty];
}

// Normalized cross-correlation of the reference's static background with the
// frame warped by `t`.
function score(ref, frm, t) {
  const map = mapper(t, ref.w, ref.h), w = ref.w, fd = frm.d;
  let sa = 0, sb = 0, saa = 0, sbb = 0, sab = 0, n = 0;
  for (const i of ref.idx) {
    const x = i % w, [u, v] = map(x, (i - x) / w);
    if (u < 1 || v < 1 || u >= w - 2 || v >= ref.h - 2) continue;
    const x0 = u | 0, y0 = v | 0, ax = u - x0, ay = v - y0, j = y0 * w + x0;
    const b = (fd[j] * (1 - ax) + fd[j + 1] * ax) * (1 - ay) + (fd[j + w] * (1 - ax) + fd[j + w + 1] * ax) * ay;
    const a = ref.d[i];
    sa += a; sb += b; saa += a * a; sbb += b * b; sab += a * b; n++;
  }
  if (n < ref.idx.length * 0.6) return -1;
  return (sab - (sa * sb) / n) / Math.sqrt((saa - (sa * sa) / n) * (sbb - (sb * sb) / n) + 1e-9);
}

// Best transform within `range` ([min, max, step] around `t` for s, θ, tx, ty).
function search(ref, frm, t, range) {
  const steps = ([lo, hi, st], c) => Array.from({ length: Math.round((hi - lo) / st) + 1 }, (_, k) => c + lo + k * st);
  let best = { ...t, ncc: -2 };
  for (const s of steps(range[0], t.s))
    for (const th of steps(range[1], t.th))
      for (const tx of steps(range[2], t.tx))
        for (const ty of steps(range[3], t.ty)) {
          const ncc = score(ref, frm, { s, th, tx, ty });
          if (ncc > best.ncc) best = { s, th, tx, ty, ncc };
        }
  return best;
}

// Coarse to fine: a wide search at 1/8 size, then tighter ones at 1/4 and 1/2.
// Neighbors (`near`) only need a narrow first search.
async function measure(refPyramid, file, size, near = false, wide = false) {
  let t = { s: 1, th: 0, tx: 0, ty: 0 };
  const plan = [
    [8, wide ? [[-0.2, 0.2, 0.02], [0, 0, 1], [-24, 24, 2], [-24, 24, 2]] : near ? [[-0.03, 0.03, 0.01], [0, 0, 1], [-6, 6, 1], [-6, 6, 1]] : [[-0.1, 0.1, 0.01], [0, 0, 1], [-16, 16, 1], [-16, 16, 1]]],
    [4, [[-0.01, 0.01, 0.0025], [-0.6 * DEG, 0.6 * DEG, 0.3 * DEG], [-2, 2, 0.5], [-2, 2, 0.5]]],
    [2, [[-0.003, 0.003, 0.001], [-0.2 * DEG, 0.2 * DEG, 0.1 * DEG], [-1, 1, 0.25], [-1, 1, 0.25]]],
  ];
  for (const [k, [f, range]] of plan.entries()) {
    if (k) { t.tx *= 2; t.ty *= 2; }
    t = search(refPyramid[f], await gradients(file, f, size), t, range);
  }
  return { ...t, tx: t.tx * 2, ty: t.ty * 2 };
}

// ---- warping ------------------------------------------------------------

const cubic = (p0, p1, p2, p3, x) =>
  p1 + 0.5 * x * (p2 - p0 + x * (2 * p0 - 5 * p1 + 4 * p2 - p3 + x * (3 * (p1 - p2) + p3 - p0)));

// Resamples `src` (raw RGB) through transform `t` with Catmull-Rom; samples
// past the edge take the nearest edge pixel.
function warp(src, w, h, t) {
  const out = Buffer.alloc(w * h * 3), map = mapper(t, w, h);
  const at = (x, y, k) => src[(Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))) * 3 + k];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const [u, v] = map(x, y), x0 = Math.floor(u), y0 = Math.floor(v), fx = u - x0, fy = v - y0;
      for (let k = 0; k < 3; k++) {
        const row = (yy) => cubic(at(x0 - 1, yy, k), at(x0, yy, k), at(x0 + 1, yy, k), at(x0 + 2, yy, k), fx);
        const val = cubic(row(y0 - 1), row(y0), row(y0 + 1), row(y0 + 2), fy);
        out[(y * w + x) * 3 + k] = Math.max(0, Math.min(255, Math.round(val)));
      }
    }
  return out;
}

// How many px of each output edge the warped frame leaves uncovered.
function uncovered(t, w, h) {
  const map = mapper(t, w, h), e = { top: 0, bottom: 0, left: 0, right: 0 };
  for (let x = 0; x < w; x++)
    for (let y = 0; y < h; y++) {
      const [u, v] = map(x, y);
      if (v < 0) e.top = Math.max(e.top, y + 1);
      if (v > h - 1) e.bottom = Math.max(e.bottom, h - y);
      if (u < 0) e.left = Math.max(e.left, x + 1);
      if (u > w - 1) e.right = Math.max(e.right, w - x);
    }
  return e;
}

// Blends `fill` into `img` over each edge uncovered by more than CLAMP px.
function fillEdges(img, fill, w, h, edges) {
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let a = 1;
      const side = (dist, extent) => { if (extent > CLAMP) a = Math.min(a, Math.max(0, (dist - extent) / FEATHER)); };
      side(y, edges.top); side(h - 1 - y, edges.bottom); side(x, edges.left); side(w - 1 - x, edges.right);
      if (a >= 1) continue;
      for (let k = 0, o = (y * w + x) * 3; k < 3; k++, o++) img[o] = Math.round(img[o] * a + fill[o] * (1 - a));
    }
}

// ---- color --------------------------------------------------------------

// Each AI edit shifts the light a little, so scrolling through them flickers
// like a cloudy day. Every frame's color is eased toward the average of its
// neighbours' (DEFLICKER frames either side), measured on the static
// background — the overall drift stays, the jumps go. A frame far from the
// rest (the dusk shot) is left alone and kept out of the averages.
const DEFLICKER = 2;
const MAX_GAIN = 0.06;

function deflicker(frames, w, h) {
  const means = frames.map(({ img }) => {
    const sum = [0, 0, 0];
    let n = 0;
    for (const [x0, y0, x1, y1] of STATIC)
      for (let y = Math.ceil(y0 * h); y < Math.floor(y1 * h); y += 2)
        for (let x = Math.ceil(x0 * w); x < Math.floor(x1 * w); x += 2, n++)
          for (let k = 0; k < 3; k++) sum[k] += img[(y * w + x) * 3 + k];
    return sum.map((v) => v / n);
  });
  const luma = means.map(([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b);
  const median = [...luma].sort((a, b) => a - b)[luma.length >> 1];
  const usual = luma.map((l) => Math.abs(l / median - 1) < 0.25);
  frames.forEach((f, i) => {
    if (!usual[i]) return console.log(`${f.name}: lighting left as is (a different time of day)`);
    const near = means.filter((_, j) => usual[j] && Math.abs(j - i) <= DEFLICKER);
    const gain = [0, 1, 2].map((k) => {
      const target = near.reduce((s, m) => s + m[k], 0) / near.length;
      return Math.min(1 + MAX_GAIN, Math.max(1 - MAX_GAIN, target / means[i][k]));
    });
    if (gain.every((g) => Math.abs(g - 1) < 0.005)) return;
    for (let o = 0; o < f.img.length; o += 3)
      for (let k = 0; k < 3; k++) f.img[o + k] = Math.min(255, Math.round(f.img[o + k] * gain[k]));
    console.log(`${f.name}: color ${gain.map((g) => `${g >= 1 ? "+" : ""}${((g - 1) * 100).toFixed(1)}%`).join(" / ")} (R/G/B)`);
  });
}

// ---- main ---------------------------------------------------------------

const names = (await readdir(IN)).filter((f) => /^\d+[a-z]?\.(png|jpe?g|webp)$/i.test(f)).sort();
const refName = values.ref ?? config.ref ?? path.parse(names[names.length - 1] ?? "").name;
const refFile = names.find((f) => path.parse(f).name === refName);
if (!refFile) throw new Error(`no frames/${refName}.* to align to in ${IN}`);
const refPath = path.join(IN, refFile);
const { width, height } = await sharp(refPath).metadata();
const size = { w: width, h: height };
const refPyramid = Object.fromEntries(await Promise.all([8, 4, 2].map(async (f) => [f, await gradients(refPath, f, size)])));

const pyramid = async (input) =>
  Object.fromEntries(await Promise.all([8, 4, 2].map(async (f) => [f, await gradients(input, f, size)])));
const identity = { s: 1, th: 0, tx: 0, ty: 0 };

// Lines frame `i` up with `target` (the reference's pyramid when tuned, else
// its aligned neighbor's). A frame with no reliable match follows `fallback`,
// its neighbor — edited from the same camera, it has the same drift.
async function alignFrame(i, target, fallback) {
  const name = names[i];
  const file = path.join(IN, name);
  const meta = await sharp(file).metadata();
  if (meta.width !== width || meta.height !== height)
    throw new Error(`${name} is ${meta.width}x${meta.height}; every frame must match ${refFile} (${width}x${height})`);
  const wide = WIDE.has(path.parse(name).name);
  const t = await measure(target, file, size, !TUNED, wide);
  const asIs = score(target[2], await gradients(file, 2, size), identity);
  const [maxScale, maxShift] = wide ? [0.2, 200] : [0.03, 30];
  const plausible =
    TUNED ||
    (Math.abs(t.s - 1) <= maxScale && Math.abs(t.th) <= 0.5 * DEG && Math.abs(t.tx) <= maxShift && Math.abs(t.ty) <= maxShift && t.ncc >= 0.3);
  const follow = !plausible && fallback && !fallback.still;
  if (follow) Object.assign(t, fallback.t);
  const still =
    (!plausible && !follow) ||
    (!follow && t.ncc - asIs < MIN_GAIN) ||
    (Math.abs(t.s - 1) < 0.0015 && Math.abs(t.th) < 0.05 * DEG && Math.abs(t.tx) < 1 && Math.abs(t.ty) < 1);
  const raw = await sharp(file).removeAlpha().raw().toBuffer();
  const img = still ? raw : warp(raw, width, height, t);
  const edges = still ? { top: 0, bottom: 0, left: 0, right: 0 } : uncovered(t, width, height);
  console.log(
    name.padEnd(8),
    still ? (plausible ? "aligned already" : "left as is (no reliable match)") : `${follow ? "no reliable match; follows its neighbor: " : ""}scale ${t.s.toFixed(4)}  rotate ${(t.th / DEG).toFixed(2)}°  shift ${t.tx.toFixed(1)}, ${t.ty.toFixed(1)} px`,
    ` (match ${t.ncc.toFixed(2)}${TUNED ? "" : " with its neighbor"})`,
  );
  return { name, t, img, edges, still };
}

const refIndex = names.indexOf(refFile);
const frames = new Array(names.length);
frames[refIndex] = {
  name: refFile, t: { ...identity, ncc: 1 }, still: true,
  img: await sharp(refPath).removeAlpha().raw().toBuffer(),
  edges: { top: 0, bottom: 0, left: 0, right: 0 },
};
console.log(refFile.padEnd(8), "the reference");
const neighbor = async (f) => pyramid(await sharp(f.img, { raw: { width, height, channels: 3 } }).png().toBuffer());
for (let i = refIndex - 1; i >= 0; i--) frames[i] = await alignFrame(i, TUNED ? refPyramid : await neighbor(frames[i + 1]), frames[i + 1]);
for (let i = refIndex + 1; i < names.length; i++) frames[i] = await alignFrame(i, TUNED ? refPyramid : await neighbor(frames[i - 1]), frames[i - 1]);

const covered = (f) => Object.values(f.edges).every((e) => e <= CLAMP);
for (const [i, f] of frames.entries()) {
  if (!covered(f)) {
    // the nearest frame in the sequence that covers the whole shot
    const donor = frames
      .map((g, j) => ({ g, d: Math.abs(j - i) }))
      .filter(({ g }) => covered(g))
      .sort((a, b) => a.d - b.d)[0]?.g;
    if (!donor) throw new Error(`nothing to fill ${f.name}'s edges from`);
    fillEdges(f.img, donor.img, width, height, f.edges);
    const e = f.edges;
    console.log(`${f.name}: filled edges (top ${e.top}, right ${e.right}, bottom ${e.bottom}, left ${e.left} px) from ${donor.name}`);
  }
}

if (TUNED) deflicker(frames, width, height);

await mkdir(OUT, { recursive: true });
for (const f of frames) {
  await sharp(f.img, { raw: { width, height, channels: 3 } })
    .png()
    .toFile(path.join(OUT, path.parse(f.name).name + ".png"));
}
console.log(`\n${frames.length} frames -> ${path.relative(process.cwd(), OUT) || OUT}`);
