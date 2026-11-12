"use client";

import { useEffect, useState } from "react";
import { BsArrowUpRight, BsClock } from "react-icons/bs";

import { contactInfo, socials } from "@/data/contact";

const phone = contactInfo.find((item) => item.type === "Phone");
const email = contactInfo.find((item) => item.type === "E-Mail");
const area = contactInfo.find((item) => item.type === "Area");

// Office hours, every day, Los Angeles time.
const OPENS = 7;
const CLOSES = 19;

// Whether we're open right now in LA — null until mounted, so the server
// render and the first client render agree; rechecked every minute.
function useOpenNow() {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const check = () => {
      const hour = Number(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "numeric",
          hourCycle: "h23",
        }).format(new Date()),
      );
      setOpen(hour >= OPENS && hour < CLOSES);
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  return open;
}

// Colours for each background. The brand green is too dark to read on black,
// so on dark "Open now" and the hovers use the lighter green they always had
// (the user kept it, 11-12, over the spec's lime); the square is HB Green
// everywhere.
const TONES = {
  dark: {
    square: "bg-third",
    rule: "border-white/10",
    body: "text-silver",
    accent: "text-[#3fbf74]",
    dot: "bg-[#3fbf74]",
    closed: "text-silver/70",
    closedDot: "bg-white/30",
    cell: "border-white/[0.06] bg-white/[0.04]",
    cellHover: "hover:border-white/15 hover:bg-white/[0.08]",
    icon: "border-white/15 bg-white/[0.06] text-silver group-hover:text-[#3fbf74]",
    label: "text-silver/70",
    value: "text-white",
    arrow: "text-silver/50 group-hover:text-[#3fbf74]",
    socialIcon: "text-silver group-hover:text-[#3fbf74]",
  },
  light: {
    square: "bg-third",
    rule: "border-black/10",
    body: "text-fourth",
    accent: "text-third",
    dot: "bg-third",
    closed: "text-fourth",
    closedDot: "bg-black/30",
    cell: "border-black/10 bg-white",
    cellHover: "hover:border-black/25",
    icon: "border-black/10 bg-concrete text-fourth group-hover:text-third",
    label: "text-fourth",
    value: "text-black",
    arrow: "text-fourth/60 group-hover:text-third",
    socialIcon: "text-fourth group-hover:text-third",
  },
};

function OpenStatus({ tone }) {
  const open = useOpenNow();
  if (open === null) return null;

  return (
    <span
      className={`flex items-center gap-2 text-[11.5px] tracking-widest ${
        open ? tone.accent : tone.closed
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          open ? `${tone.dot} animate-pulse` : tone.closedDot
        }`}
      />
      {open ? "Open now" : "Closed · opens 7am"}
    </span>
  );
}

// One contact detail — a link when it goes somewhere.
function DirectCell({ tone, icon, label, value, href, className = "" }) {
  const external = href?.startsWith("http");
  const Tag = href ? "a" : "div";

  return (
    <Tag
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group relative flex items-center gap-3 min-w-0 border px-3.5 py-3 transition-colors duration-200 ${tone.cell} ${
        href ? tone.cellHover : ""
      } ${className}`}
    >
      <span
        className={`grid place-items-center w-9 h-9 shrink-0 border text-[15px] transition-colors duration-200 ${tone.icon}`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className={`block text-[11px] leading-none ${tone.label}`}>
          {label}
        </span>
        <span
          className={`mt-1.5 block truncate text-[13.5px] font-semibold leading-tight ${tone.value}`}
        >
          {value}
        </span>
      </span>
      {href && (
        <BsArrowUpRight
          className={`absolute top-2.5 right-2.5 text-[11px] transition-colors duration-200 ${tone.arrow}`}
        />
      )}
    </Tag>
  );
}

// Our social pages: one tile per platform, styled like the cells around
// it, the icon big in the middle. Together they take one cell's place in
// the grid.
function SocialTiles({ tone }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {socials.map(({ name, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`HB Links on ${name}`}
          title={name}
          className={`group grid place-items-center min-h-[62px] border transition-colors duration-200 ${tone.cell} ${tone.cellHover}`}
        >
          <Icon
            className={`text-[20px] transition-colors duration-200 ${tone.socialIcon}`}
          />
        </a>
      ))}
    </div>
  );
}

// "Reach Us Direct" — the row under the estimate form in EstimateSection:
// a short pitch with a live open / closed badge on the left, the contact
// details as cells on the right. `dark` for the homepage's HB Black section.
export default function ReachUsDirect({ dark = false, className = "" }) {
  const tone = dark ? TONES.dark : TONES.light;

  return (
    <div
      className={`pt-10 1080:pt-12 border-t ${tone.rule} grid grid-cols-1 1080:grid-cols-[minmax(280px,4fr)_minmax(0,8fr)] 1080:gap-x-8 1080:px-8 1080:items-center gap-y-6 ${className}`}
    >
      <div className="pointer-events-none">
        <div className="flex items-center justify-between 1080:justify-start gap-6">
          <div className="flex items-center gap-2.5">
            <span className={`w-2 h-2 shrink-0 ${tone.square}`} />
            <span className="uppercase text-[12px] font-bold tracking-[0.16em]">
              Reach Us Direct
            </span>
          </div>
          <OpenStatus tone={tone} />
        </div>
        <p className="mt-4 font-gt font-semibold text-[21px] 700:text-[24px] leading-tight">
          Rather talk it through?
        </p>
        <p
          className={`mt-2 max-w-md text-[14px] 550:text-[14.5px] leading-relaxed ${tone.body}`}
        >
          Call, email or message us on Instagram — whatever&apos;s easiest
          for you.
        </p>
      </div>

      {/* 3 across when there's room, 2 when narrower, 1 on small phones —
          hours takes the leftover width of its row. */}
      <div className="@container min-w-0">
        <div className="grid grid-cols-1 @min-[420px]:grid-cols-2 @min-[620px]:grid-cols-3 gap-1.5">
          <DirectCell
            tone={tone}
            icon={phone.icon}
            label="Call"
            value={phone.label}
            href={phone.href}
          />
          <DirectCell
            tone={tone}
            icon={email.icon}
            label="Email"
            value={email.label}
            href={email.href}
          />
          <SocialTiles tone={tone} />
          <DirectCell
            tone={tone}
            icon={area.icon}
            label="Service area"
            value={area.label}
            href={area.href}
          />
          <DirectCell
            tone={tone}
            icon={<BsClock />}
            label="Hours"
            value="Sun – Sat · 7am – 7pm"
            className="@min-[420px]:col-span-2 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
