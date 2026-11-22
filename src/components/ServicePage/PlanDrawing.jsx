// Small drawings in an architect's hand for a service's options (Compare
// Options, ServiceOptions): the lot from above with the house and what the
// option builds in green, a house from the side, or its rooms. Each option in
// a page's data names one with `plan` (a key below). The view box is 400 ×
// 260; the street runs along the bottom. Lines are the drawing's dark ink,
// faint; what's built is green, filled; what was there is dashed.

const INK = "rgba(11,15,13,0.55)";
const FAINT = "rgba(11,15,13,0.28)";
const GREEN = "#106B37";

// the lot: its property line (dashed), the street and the house
const LOT = { x: 40, y: 18, w: 320, h: 200 };
const HOUSE = { x: 104, y: 128, w: 176, h: 70 };

function Lot({ house = true, driveway = true }) {
  return (
    <>
      <rect x={LOT.x} y={LOT.y} width={LOT.w} height={LOT.h} fill="none" stroke={FAINT} strokeDasharray="6 5" />
      <line x1="20" y1="242" x2="380" y2="242" stroke={FAINT} />
      <text x="200" y="256" textAnchor="middle" fontSize="9" letterSpacing="3" fill={FAINT}>STREET</text>
      {driveway && <rect x="300" y="150" width="36" height="68" fill="rgba(11,15,13,0.05)" stroke={FAINT} />}
      {house && <Box {...HOUSE} label="HOUSE" />}
    </>
  );
}

function Box({ x, y, w, h, label, kind = "house" }) {
  const styles = {
    house: { fill: "rgba(11,15,13,0.06)", stroke: INK, dash: undefined, text: INK },
    new: { fill: "rgba(16,107,55,0.18)", stroke: GREEN, dash: undefined, text: GREEN },
    old: { fill: "none", stroke: INK, dash: "5 4", text: INK },
  }[kind];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={styles.fill} stroke={styles.stroke} strokeWidth={kind === "new" ? 1.6 : 1.1} strokeDasharray={styles.dash} />
      {label && (
        <text x={x + w / 2} y={y + h / 2 + 3.5} textAnchor="middle" fontSize="9.5" fontWeight="700" letterSpacing="1.5" fill={styles.text}>
          {label}
        </text>
      )}
    </g>
  );
}

// a dimension: a line with end ticks and its label
function Dim({ x1, y1, x2, y2, label }) {
  const vertical = x1 === x2;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g stroke={GREEN} strokeWidth="0.9">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      {vertical ? (
        <>
          <line x1={x1 - 4} y1={y1} x2={x1 + 4} y2={y1} />
          <line x1={x2 - 4} y1={y2} x2={x2 + 4} y2={y2} />
        </>
      ) : (
        <>
          <line x1={x1} y1={y1 - 4} x2={x1} y2={y1 + 4} />
          <line x1={x2} y1={y2 - 4} x2={x2} y2={y2 + 4} />
        </>
      )}
      <text
        x={vertical ? mx + 7 : mx}
        y={vertical ? my + 3 : my - 5}
        textAnchor={vertical ? "start" : "middle"}
        fontSize="8.5"
        fill={GREEN}
        stroke="none"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        {label}
      </text>
    </g>
  );
}

// a house from the side: ground, walls, a gable; `upper` adds a second storey
function Elevation({ upper }) {
  return (
    <>
      <line x1="30" y1="220" x2="370" y2="220" stroke={FAINT} />
      <rect x="110" y="150" width="180" height="70" fill="rgba(11,15,13,0.06)" stroke={INK} />
      {upper ? (
        <>
          <rect x="110" y="86" width="180" height="64" fill="rgba(16,107,55,0.18)" stroke={GREEN} strokeWidth="1.6" />
          <polygon points="98,86 200,40 302,86" fill="none" stroke={GREEN} strokeWidth="1.6" />
          <polygon points="98,150 200,104 302,150" fill="none" stroke={INK} strokeDasharray="5 4" />
          <text x="200" y="122" textAnchor="middle" fontSize="9.5" fontWeight="700" letterSpacing="1.5" fill={GREEN}>NEW FLOOR</text>
        </>
      ) : (
        <polygon points="98,150 200,104 302,150" fill="none" stroke={INK} />
      )}
      <text x="200" y="190" textAnchor="middle" fontSize="9.5" fontWeight="700" letterSpacing="1.5" fill={INK}>HOUSE</text>
      <Dim x1={318} y1={upper ? 40 : 104} x2={318} y2={220} label={upper ? "2 STORIES" : "1 STORY"} />
    </>
  );
}

// a floor plan: four rooms, `on` the ones remodeled
function Rooms({ on = [], open = false, kitchen = null }) {
  const rooms = [
    { id: "kitchen", x: 70, y: 40, w: 120, h: 90, label: "KITCHEN" },
    { id: "living", x: 190, y: 40, w: 140, h: 90, label: "LIVING" },
    { id: "bed", x: 70, y: 130, w: 150, h: 80, label: "BEDROOM" },
    { id: "bath", x: 220, y: 130, w: 110, h: 80, label: "BATH" },
  ];
  return (
    <>
      {rooms.map((r) => (
        <Box key={r.id} {...r} kind={on.includes(r.id) ? "new" : "house"} />
      ))}
      {open && <line x1="190" y1="40" x2="190" y2="130" stroke="#fff" strokeWidth="3" />}
      {open && <line x1="190" y1="40" x2="190" y2="130" stroke={INK} strokeDasharray="5 4" />}
      {kitchen === "same" && <path d="M76 46 h108 M76 46 v70" stroke={GREEN} strokeWidth="5" fill="none" />}
      {kitchen === "new" && (
        <>
          <path d="M76 46 h108" stroke={GREEN} strokeWidth="5" fill="none" />
          <rect x="104" y="80" width="56" height="18" fill={GREEN} opacity="0.55" />
        </>
      )}
      {kitchen === "open" && (
        <>
          <path d="M76 46 h108" stroke={GREEN} strokeWidth="5" fill="none" />
          <rect x="150" y="78" width="80" height="18" fill={GREEN} opacity="0.55" />
        </>
      )}
    </>
  );
}

const PLANS = {
  "adu-detached": (
    <>
      <Lot />
      <Box x={252} y={34} w={92} h={62} label="ADU" kind="new" />
      <Dim x1={344} y1={18} x2={344} y2={34} label="4 FT" />
      <Dim x1={344} y1={96} x2={360} y2={96} label="" />
    </>
  ),
  "adu-attached": (
    <>
      <Lot />
      <Box x={150} y={78} w={96} h={50} label="ADU" kind="new" />
    </>
  ),
  "adu-garage": (
    <>
      <Lot />
      <Box x={262} y={34} w={82} h={66} label="GARAGE → ADU" kind="new" />
      <line x1="300" y1="100" x2="318" y2="150" stroke={FAINT} strokeDasharray="4 4" />
    </>
  ),
  "adu-junior": (
    <>
      <Lot />
      <Box x={212} y={128} w={68} h={70} label="JADU" kind="new" />
      <text x="246" y="122" textAnchor="middle" fontSize="8" letterSpacing="1.5" fill={GREEN}>≤ 500 SQ FT</text>
    </>
  ),
  "garage-attached-adu": (
    <>
      <Lot driveway={false} />
      <Box x={280} y={138} w={64} h={60} label="ADU" kind="new" />
    </>
  ),
  "garage-attached-jadu": (
    <>
      <Lot driveway={false} />
      <Box x={280} y={138} w={64} h={60} label="JADU" kind="new" />
    </>
  ),
  "garage-rebuild": (
    <>
      <Lot />
      <Box x={262} y={40} w={74} h={56} kind="old" />
      <Box x={256} y={34} w={88} h={66} label="NEW ADU" kind="new" />
      <text x="300" y="112" textAnchor="middle" fontSize="8" letterSpacing="1.5" fill={INK}>SAME FOOTPRINT</text>
    </>
  ),
  "addition-room": (
    <>
      <Lot />
      <Box x={150} y={78} w={96} h={50} label="ADDITION" kind="new" />
    </>
  ),
  "addition-second": <Elevation upper />,
  "remodel-one": <Rooms on={["kitchen"]} />,
  "remodel-multi": <Rooms on={["kitchen", "living", "bath"]} />,
  "remodel-whole": <Rooms on={["kitchen", "living", "bed", "bath"]} />,
  "kitchen-same": <Rooms kitchen="same" />,
  "kitchen-new": <Rooms kitchen="new" />,
  "kitchen-open": <Rooms open kitchen="open" />,
  deck: (
    <>
      <Lot />
      <Box x={130} y={82} w={124} h={46} label="DECK" kind="new" />
      {[146, 162, 178, 194, 210, 226, 242].map((x) => (
        <line key={x} x1={x} y1="84" x2={x} y2="126" stroke={GREEN} strokeWidth="0.6" opacity="0.6" />
      ))}
    </>
  ),
  "patio-cover": (
    <>
      <Lot />
      <Box x={130} y={78} w={124} h={50} label="PATIO COVER" kind="new" />
      <line x1="130" y1="78" x2="254" y2="128" stroke={GREEN} strokeWidth="0.8" opacity="0.6" />
      <line x1="254" y1="78" x2="130" y2="128" stroke={GREEN} strokeWidth="0.8" opacity="0.6" />
    </>
  ),
  pergola: (
    <>
      <Lot />
      <rect x="130" y="78" width="124" height="50" fill="none" stroke={GREEN} strokeWidth="1.6" />
      {[140, 152, 164, 176, 188, 200, 212, 224, 236, 248].map((x) => (
        <line key={x} x1={x} y1="78" x2={x} y2="128" stroke={GREEN} strokeWidth="1.2" />
      ))}
      <text x="192" y="72" textAnchor="middle" fontSize="9.5" fontWeight="700" letterSpacing="1.5" fill={GREEN}>PERGOLA</text>
    </>
  ),
};

export const hasPlan = (key) => Boolean(key && PLANS[key]);

export default function PlanDrawing({ plan, title }) {
  return (
    <svg
      viewBox="0 0 400 262"
      role="img"
      aria-label={`${title}, drawn as a simple plan`}
      className="block h-auto w-full font-montserrat"
    >
      {PLANS[plan]}
    </svg>
  );
}
