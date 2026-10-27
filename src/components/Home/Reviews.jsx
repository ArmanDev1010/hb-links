"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsArrowUpRight } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

import { reviews } from "@/data/reviews";
import Reveal from "@/components/UI/Reveal";
import { SECTION_TITLE } from "@/components/UI/titles";

const toRad = (deg) => (deg * Math.PI) / 180;

const DESKTOP_HEIGHT = 420;
const DESKTOP_RADIUS = 340;
const DESKTOP_ARC_SPAN_DEG = 90;
const DESKTOP_CX = -DESKTOP_RADIUS + 60;
const DESKTOP_CY = DESKTOP_HEIGHT / 2;

const MOBILE_TRACK_HEIGHT = 170;
const MOBILE_ARC_SPAN_DEG = 70;
const MOBILE_BULGE = 90;

const buildGeometry = ({
  orientation,
  width,
  height,
  radius,
  arcSpan,
  cx,
  cy,
}) => {
  const startAngle = -arcSpan / 2;
  const endAngle = arcSpan / 2;

  // Points are rounded, so the server's and Safari's last-digit trig
  // differences don't make React see a hydration mismatch.
  const r = (n) => Math.round(n * 100) / 100;
  const pointAt = (percent) => {
    const deg = startAngle + percent * (endAngle - startAngle);
    if (orientation === "horizontal") {
      return {
        x: r(cx + radius * Math.sin(toRad(deg))),
        y: r(cy + radius * Math.cos(toRad(deg))),
      };
    }
    return {
      x: r(cx + radius * Math.cos(toRad(deg))),
      y: r(cy + radius * Math.sin(toRad(deg))),
    };
  };

  const startPt = pointAt(0);
  const endPt = pointAt(1);
  const sweepFlag = orientation === "horizontal" ? 0 : 1;
  const path = `M ${startPt.x} ${startPt.y} A ${r(radius)} ${r(radius)} 0 0 ${sweepFlag} ${endPt.x} ${endPt.y}`;

  return { pointAt, path, width, height };
};

const AUTOPLAY_MS = 4500;

// How long the avatars take to glide to their new places — shorter with the
// device's "reduce motion" setting on (see Reviews).
const GLIDE = { full: 0.9, calm: 0.6 };

const MOUNTED_SLOTS = [-2, -1, 0, 1, 2];

const opacityForDiff = (diff) => Math.max(0, 1 - Math.abs(diff) * 0.5);
const scaleForDiff = (diff) =>
  diff === 0 ? 1 : Math.max(0.6, 1 - Math.abs(diff) * 0.2);

// A quote's place in the crossfade (see Reviews): waiting below, showing, or
// lifting away. The leaving one fades out first, then the next fades in.
const QUOTE_STATES = {
  waiting: { opacity: 0, y: 10 },
  shown: { opacity: 1, y: 0 },
  leaving: { opacity: 0, y: -10 },
};
const QUOTE_EASE = [0.22, 1, 0.36, 1];
const QUOTE_OUT = 0.25;
const QUOTE_IN = 0.5;
// With "reduce motion" on (`calm`) the quotes only fade: each one moves while
// it's invisible.
function quoteTransition(state, calm) {
  if (state === "waiting") return { duration: 0 };
  const fade =
    state === "leaving"
      ? { duration: QUOTE_OUT, ease: QUOTE_EASE }
      : { duration: QUOTE_IN, delay: QUOTE_OUT, ease: QUOTE_EASE };
  const still = { duration: 0, delay: state === "leaving" ? QUOTE_OUT : 0 };
  return { opacity: fade, y: calm ? still : fade };
}

const QUOTE_CHAR_LIMIT_WITH_IMAGES = 260;
// Reviews without images have no image row (~150px + gap) taking up space,
// so they show more of the quote to fill that space with real content
// instead of leaving it blank — keeps the card height roughly constant.
const QUOTE_CHAR_LIMIT_NO_IMAGES = 480;

// The reviews on HB Links' Google listing: "Read More" and the rating badge
// open them in a new tab.
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/HB+Links/@33.786671,-118.2990476,352820m/data=!3m1!1e3!4m8!3m7!1s0x641cd639313d13b9:0xf7b403aff7a5bf6d!8m2!3d33.786671!4d-118.2990476!9m1!1b1!16s%2Fg%2F11mrpgwyyc?hl=en&entry=ttu&g_ep=EgoyMDI2MDcyOC4wIKXMDSoASAFQAw%3D%3D";

function QuoteText({ quote, charLimit }) {
  const isLong = quote.length > charLimit;
  const displayText = isLong ? quote.slice(0, charLimit).trimEnd() : quote;

  return (
    <p className="italic text-[17px] text-fourth leading-relaxed max-w-xl pointer-events-none">
      {displayText}
      {isLong && (
        <>
          {"... "}
          <Link
            href={GOOGLE_REVIEWS_URL}
            className="pointer-events-auto not-italic font-bold text-black hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read More
          </Link>
        </>
      )}
    </p>
  );
}

// The site skips sliding animations for visitors with "reduce motion" on
// (components/UI/MotionPreferences), but here the avatars sliding along the
// arc are how you see the reviews change, so they still play — calmer: a
// shorter glide, and the quote only fades. The heading and the carousel
// rise in as they scroll into view (UI/Reveal, CSS, which tones itself down
// for the setting); the "never" opt-out covers only the carousel inside.
export default function Reviews() {
  const calm = useReducedMotion();
  // the review showing, and the one before it (fading out)
  const [{ index: activeIndex, prev: prevIndex }, setActive] = useState({
    index: 0,
    prev: null,
  });
  const show = (i) =>
    setActive((s) => (s.index === i ? s : { index: i, prev: s.index }));
  const [isMobile, setIsMobile] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    // the same breakpoint as the layout's 1080: classes
    const wide = window.matchMedia("(min-width: 1080px)");
    const checkScreen = () => setIsMobile(!wide.matches);
    checkScreen();
    wide.addEventListener("change", checkScreen);
    return () => wide.removeEventListener("change", checkScreen);
  }, []);

  useEffect(() => {
    if (!trackRef.current) return;
    const measure = () => setTrackWidth(trackRef.current?.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((s) => ({
        index: (s.index + 1) % reviews.length,
        prev: s.index,
      }));
    }, AUTOPLAY_MS);
    return () => clearInterval(interval);
  }, []);

  const desktopGeo = useMemo(
    () =>
      buildGeometry({
        orientation: "vertical",
        width: Math.max(DESKTOP_CX + DESKTOP_RADIUS, 0) + 40,
        height: DESKTOP_HEIGHT,
        radius: DESKTOP_RADIUS,
        arcSpan: DESKTOP_ARC_SPAN_DEG,
        cx: DESKTOP_CX,
        cy: DESKTOP_CY,
      }),
    [],
  );

  const mobileGeo = useMemo(() => {
    if (!trackWidth) return null;
    const mobileCx = trackWidth / 2;
    const halfSpanRad = toRad(MOBILE_ARC_SPAN_DEG / 2);
    const radius = trackWidth / 2 / Math.sin(halfSpanRad);
    const cy = MOBILE_BULGE - radius;
    return buildGeometry({
      orientation: "horizontal",
      width: trackWidth,
      height: MOBILE_TRACK_HEIGHT,
      radius,
      arcSpan: MOBILE_ARC_SPAN_DEG,
      cx: mobileCx,
      cy,
    });
  }, [trackWidth]);

  const geo = isMobile ? mobileGeo : desktopGeo;
  const total = reviews.length;

  return (
    <section className="relative overflow-hidden pb-[100px] 1080:pb-[120px]">
      <div className="w-full 1080:w-10/12 1080:mx-auto 700:px-[32px] px-[24px] 1080:mb-24 mb-12 text-center">
        <Reveal
          as="p"
          className="mb-6 800:mb-8 550:text-[13px] text-[12.5px] text-fourth uppercase font-light tracking-[0.3em] pointer-events-none"
        >
          Testimonials
        </Reveal>
        <Reveal
          as="h2"
          delay={0.05}
          className={`${SECTION_TITLE} pointer-events-none`}
        >
          Results Speak for Themselves
        </Reveal>
        {/* The rating badge opens the reviews on Google. On hover it lifts,
            the stars pop one after another, and the arrow nudges out. */}
        <Reveal delay={0.1} className="inline-flex mt-8">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Rated 5 stars in 10+ Google reviews. Read them on Google (opens in a new tab)"
            className="group inline-flex items-center gap-3 rounded-full bg-white border border-black/20 px-4 py-2.5 backdrop-blur-sm
              transition-[translate,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
              hover:-translate-y-0.5 hover:border-black/45 hover:shadow-[0_12px_28px_-14px_rgba(0,0,0,0.35)]
              focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-third"
          >
            <FcGoogle className="w-[20px] h-[20px]" />
            <div className="flex items-center gap-[3px]">
              {Array.from({ length: 5 }).map((_, key) => (
                <div
                  key={key}
                  className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.2]"
                  style={{ transitionDelay: `${key * 45}ms` }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    style={{ fill: "oklch(75% 0.18 80)" }}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>{" "}
                  </svg>
                </div>
              ))}
            </div>
            <span className="text-[1rem] font-bold leading-none">5</span>
            <span className="h-3.5 w-px shrink-0 bg-black/25"></span>
            <span className="text-[0.8125rem] leading-none text-fourth transition-colors duration-300 group-hover:text-black">
              10+ Google Reviews
            </span>
            <BsArrowUpRight
              aria-hidden="true"
              className="-ml-1 text-[13px] text-fourth transition-[translate,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-third"
            />
          </a>
        </Reveal>
      </div>
      <Reveal
        delay={0.15}
        className="max-w-[1200px] mx-auto w-full 700:px-[32px] px-[24px] grid grid-cols-1 1080:grid-cols-[340px_1fr] 1080:gap-24 gap-8 items-center"
      >
        <MotionConfig reducedMotion="never">
          {/* Left: curved avatar track */}
          <div
            ref={trackRef}
            // sized by CSS, so it's the right size before the page's script
            // knows the screen (a phone would start 250px too tall and the
            // page below would jump)
            className="relative mx-auto w-full h-(--track-h-phone) 1080:w-(--track-w) 1080:h-(--track-h)"
            style={{
              "--track-h-phone": `${MOBILE_TRACK_HEIGHT}px`,
              "--track-w": `${desktopGeo.width}px`,
              "--track-h": `${DESKTOP_HEIGHT}px`,
            }}
          >
            {geo && (
              <svg
                width={isMobile ? trackWidth : desktopGeo.width}
                height={isMobile ? MOBILE_TRACK_HEIGHT : DESKTOP_HEIGHT}
                className="absolute top-0 left-0 pointer-events-none overflow-visible"
              >
                <path
                  d={geo.path}
                  fill="none"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="1"
                />
              </svg>
            )}

            {geo &&
              reviews.map((review, i) => {
                let diff = i - activeIndex;
                if (diff > total / 2) diff -= total;
                if (diff < -total / 2) diff += total;

                if (!MOUNTED_SLOTS.includes(diff)) return null;

                const percent = 0.5 + diff * 0.38;
                const point = geo.pointAt(percent);
                const isActive = diff === 0;
                const opacity = opacityForDiff(diff);
                const scale = scaleForDiff(diff);
                const avatarOffset = isActive ? 28 : 18;

                return (
                  <motion.button
                    key={review.name}
                    onClick={() => show(i)}
                    className={`absolute top-0 left-0 ${
                      opacity === 0 ? "pointer-events-none" : ""
                    }`}
                    initial={false}
                    animate={{
                      x: point.x - avatarOffset,
                      y: point.y - avatarOffset,
                      opacity,
                      scale,
                    }}
                    transition={{
                      type: "tween",
                      ease: [0.22, 1, 0.36, 1],
                      duration: calm ? GLIDE.calm : GLIDE.full,
                    }}
                  >
                    {/* the avatar alone defines this element's box/anchor —
                      text below is absolutely positioned so its width
                      never shifts where the avatar sits */}
                    <span
                      className={`relative block rounded-full overflow-hidden transition-all duration-500 ease-out ${
                        isActive
                          ? "w-14 h-14 ring-2 ring-third"
                          : "w-9 h-9 grayscale"
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={
                            review.avatar
                              ? review.avatar
                              : "/reviews/avatar.png"
                          }
                          fill
                          sizes="(max-width: 1080px) 56px, 56px"
                          alt={`${review.name} avatar`}
                          className="object-cover bg-black"
                        />
                      </div>
                    </span>

                    {isMobile ? (
                      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-center">
                        <span
                          className={`block font-semibold ${isActive ? "text-[15px]" : "text-[13px]"}`}
                        >
                          {review.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-fourth justify-center">
                          <FaStar className="text-[oklch(75%_0.18_80)] w-3 h-3" />
                          <span className="font-semibold text-black">
                            {review.rating}
                          </span>
                          on {review.date}
                        </span>
                      </span>
                    ) : (
                      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap text-left">
                        <span
                          className={`block font-semibold ${isActive ? "text-base" : "text-[13px]"}`}
                        >
                          {review.name}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <FaStar className="text-[oklch(75%_0.18_80)] w-3 h-3" />
                          <span className="font-semibold text-black">
                            {review.rating}
                          </span>
                          on {review.date}
                        </span>
                      </span>
                    )}
                  </motion.button>
                );
              })}
          </div>

          {/* Right: the quotes, all stacked in one grid cell, so the box is
              always as tall as the longest — on phones the page below stays
              put as they change. Only the showing one can be read or
              reached; the rest are see-through and inert. */}
          <div className="relative min-h-[160px] max-1080:mx-auto">
            <div className="grid">
              {reviews.map((review, i) => {
                const state =
                  i === activeIndex
                    ? "shown"
                    : i === prevIndex
                      ? "leaving"
                      : "waiting";
                return (
                  <motion.div
                    key={review.name}
                    initial={false}
                    animate={QUOTE_STATES[state]}
                    transition={quoteTransition(state, calm)}
                    aria-hidden={state !== "shown"}
                    inert={state !== "shown"}
                    className="col-start-1 row-start-1 1080:self-center flex flex-col gap-5"
                  >
                    <div>
                      <span className="block text-5xl font-serif text-third/30 leading-none mb-2 pointer-events-none">
                        "
                      </span>
                      <QuoteText
                        quote={review.quote}
                        charLimit={
                          review.images
                            ? QUOTE_CHAR_LIMIT_WITH_IMAGES
                            : QUOTE_CHAR_LIMIT_NO_IMAGES
                        }
                      />
                    </div>

                    {review.images ? (
                      <div
                        className={`self-end pointer-events-none ${review.images.length == 4 ? "w-full" : "w-[60%]"} flex justify-center gap-2`}
                      >
                        {review.images.map((review_img, ind) => (
                          <div
                            className="bg-black flex-grow h-[150px] overflow-hidden bg-cover bg-center bg-no-repeat"
                            key={ind}
                            style={{
                              backgroundImage: `url(${review_img})`,
                            }}
                          ></div>
                        ))}
                      </div>
                    ) : null}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </MotionConfig>
      </Reveal>
    </section>
  );
}
