// The sheet The Build's drawing is drawn on (11-21, the user: "an actual
// blueprint" behind it): a blueprint in HB's own colour, Forest Green with
// a fine white grid, darker toward its edges; a border round it like a
// drawing sheet's; the drawing's floor plan small in its top left corner as a
// key plan; and a title block in the top right one (where the drawing
// leaves room) naming the stage pointed at, in Electric Lime on the dark,
// with its number as the sheet number — with none (`stage` null), the
// drawing ("Exploded view") and how many stages it has. The key plan and
// the title block are left off on a phone. `children`: the drawing
// (BuildLayers), over it.

const SHEET_STYLE = {
  backgroundColor: "#0A4523",
  backgroundImage: [
    "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.28))",
    "linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(255,255,255,0.09) 1px, transparent 1px)",
    "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
    "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "100% 100%, 120px 120px, 120px 120px, 24px 24px, 24px 24px",
  backgroundPosition: "center",
};

const pad = (n) => String(n).padStart(2, "0");

// A drawing's floor plan, small, as a key plan (its model's `plan`, in
// feet: x across, z back from the front, which is at the bottom): its
// walls, its rooms' walls (and any dashed), its windows (the wall opened, a
// pane across it), its front door and its swing, its fixtures, the rooms'
// names, and the dimensions of the part it's about (`dim`, else its first
// walls).
const SHEET = "#0A4523";
function KeyPlan({ plan, className = "" }) {
  const [w, d] = plan.size;
  const k = Math.min(140 / w, 96 / d);
  const ox = 22 + (140 - w * k) / 2;
  const oy = 20 + (96 - d * k) / 2 + d * k;
  const X = (x) => ox + x * k;
  const Y = (z) => oy - z * k;
  const line = ([x1, z1, x2, z2]) => ({ x1: X(x1), y1: Y(z1), x2: X(x2), y2: Y(z2) });
  const [dx0, dz0, dx1, dz1] = plan.dim ?? plan.walls[0];
  const front = plan.walls[0][1];
  const ft = (n) => `${Math.round(n)}'-0"`;
  return (
    <svg viewBox="0 0 200 150" aria-hidden="true" className={`pointer-events-none ${className}`} fill="none" stroke="#fff">
      {plan.walls.map(([x0, z0, x1, z1], i) => (
        <rect key={i} x={X(x0)} y={Y(z1)} width={(x1 - x0) * k} height={(z1 - z0) * k} strokeWidth="2.2" strokeOpacity="0.85" />
      ))}
      {plan.lines.map((l, i) => (
        <line key={i} {...line(l)} strokeWidth="1.2" strokeOpacity="0.7" />
      ))}
      {(plan.dashes ?? []).map((l, i) => (
        <line key={i} {...line(l)} strokeWidth="1" strokeOpacity="0.6" strokeDasharray="3 2" />
      ))}
      {plan.windows.map((l, i) => (
        <g key={i}>
          <line {...line(l)} stroke={SHEET} strokeWidth="3.2" />
          <line {...line(l)} strokeWidth="0.8" strokeOpacity="0.8" />
        </g>
      ))}
      {plan.doors.map(([a, b], i) => {
        const r = (b - a) * k;
        return (
          <g key={i}>
            <line x1={X(a)} y1={Y(front)} x2={X(b)} y2={Y(front)} stroke={SHEET} strokeWidth="3.2" />
            <path d={`M${X(b)} ${Y(front)}V${Y(front) - r}A${r} ${r} 0 0 0 ${X(a)} ${Y(front)}`} strokeWidth="0.8" strokeOpacity="0.7" />
          </g>
        );
      })}
      <g strokeWidth="0.8" strokeOpacity="0.6">
        {plan.boxes.map(([x0, z0, x1, z1], i) => (
          <rect key={i} x={X(x0)} y={Y(z1)} width={(x1 - x0) * k} height={(z1 - z0) * k} />
        ))}
      </g>
      <g fill="#fff" fillOpacity="0.6" stroke="none" fontSize="5.5" letterSpacing="1.2" textAnchor="middle">
        {plan.labels.map(([x, z, text]) => (
          <text key={text} x={X(x)} y={Y(z)}>
            {text}
          </text>
        ))}
      </g>
      {/* the dimensions: across the top, down the right */}
      <g strokeWidth="0.7" strokeOpacity="0.6">
        <path
          d={`M${X(dx0)} ${Y(dz1) - 9}H${X(dx1)}M${X(dx0)} ${Y(dz1) - 12}v6M${X(dx1)} ${Y(dz1) - 12}v6M${X(dx1) + 9} ${Y(dz1)}V${Y(dz0)}M${X(dx1) + 6} ${Y(dz1)}h6M${X(dx1) + 6} ${Y(dz0)}h6`}
        />
      </g>
      <g fill="#fff" fillOpacity="0.7" stroke="none" fontSize="6" textAnchor="middle">
        <text x={(X(dx0) + X(dx1)) / 2} y={Y(dz1) - 11.5}>
          {ft(dx1 - dx0)}
        </text>
        <text x={X(dx1) + 16} y={(Y(dz0) + Y(dz1)) / 2} transform={`rotate(90 ${X(dx1) + 16} ${(Y(dz0) + Y(dz1)) / 2})`}>
          {ft(dz1 - dz0)}
        </text>
      </g>
      <text x="22" y="144" fill="#fff" fillOpacity="0.55" stroke="none" fontSize="5.5" letterSpacing="2">
        KEY PLAN
      </text>
    </svg>
  );
}

export default function BuildSheet({ stage, title, total, name, plan, children }) {
  return (
    <div className="relative isolate h-full w-full overflow-hidden" style={SHEET_STYLE}>
      {/* the sheet's border */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-2.5 700:inset-3 border border-white/25" />
      <KeyPlan plan={plan} className="max-700:hidden absolute left-7 top-7 w-[150px] 1440:w-[176px]" />
      {/* the title block, in the border's top corner */}
      <div
        aria-hidden="true"
        className="max-700:hidden pointer-events-none absolute right-3 top-3 flex border-l border-b border-white/25 bg-[#0A4523] text-white"
      >
        <div className="px-4 py-2.5 border-r border-white/25">
          <p className="text-[9px] uppercase tracking-[0.26em] text-white/55">HB Links · {name}</p>
          <p className="mt-1.5 min-w-[11rem] text-[11px] font-semibold uppercase tracking-[0.2em] text-lime">
            {stage === null ? "Exploded view" : title}
          </p>
        </div>
        <div className="px-4 py-2.5 text-center">
          <p className="text-[9px] uppercase tracking-[0.26em] text-white/55">{stage === null ? "Stages" : "Stage"}</p>
          <p className="mt-1 font-gt font-semibold leading-none text-[20px]">
            {stage === null ? (
              pad(total)
            ) : (
              <>
                {pad(stage + 1)}
                <span className="text-[11px] text-white/45">/{pad(total)}</span>
              </>
            )}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
