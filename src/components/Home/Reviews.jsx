"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaRegStar } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

import { reviews } from "@/data/reviews";

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

  const pointAt = (percent) => {
    const deg = startAngle + percent * (endAngle - startAngle);
    if (orientation === "horizontal") {
      return {
        x: cx + radius * Math.sin(toRad(deg)),
        y: cy + radius * Math.cos(toRad(deg)),
      };
    }
    return {
      x: cx + radius * Math.cos(toRad(deg)),
      y: cy + radius * Math.sin(toRad(deg)),
    };
  };

  const startPt = pointAt(0);
  const endPt = pointAt(1);
  const sweepFlag = orientation === "horizontal" ? 0 : 1;
  const path = `M ${startPt.x} ${startPt.y} A ${radius} ${radius} 0 0 ${sweepFlag} ${endPt.x} ${endPt.y}`;

  return { pointAt, path, width, height };
};

const AUTOPLAY_MS = 4500;
const MOUNTED_SLOTS = [-2, -1, 0, 1, 2];

const opacityForDiff = (diff) => Math.max(0, 1 - Math.abs(diff) * 0.5);
const scaleForDiff = (diff) =>
  diff === 0 ? 1 : Math.max(0.6, 1 - Math.abs(diff) * 0.2);

const QUOTE_CHAR_LIMIT_WITH_IMAGES = 260;
// Reviews without images have no image row (~150px + gap) taking up space,
// so they show more of the quote to fill that space with real content
// instead of leaving it blank — keeps the card height roughly constant.
const QUOTE_CHAR_LIMIT_NO_IMAGES = 480;

function QuoteText({ quote, charLimit }) {
  const isLong = quote.length > charLimit;
  const displayText = isLong ? quote.slice(0, charLimit).trimEnd() : quote;

  return (
    <p className="italic text-lg text-gray-700 leading-relaxed max-w-xl pointer-events-none">
      {displayText}
      {isLong && (
        <>
          {"... "}
          <Link
            href={
              "https://www.google.com/maps/place/HB+Links/@33.786671,-118.2990476,352820m/data=!3m1!1e3!4m8!3m7!1s0x641cd639313d13b9:0xf7b403aff7a5bf6d!8m2!3d33.786671!4d-118.2990476!9m1!1b1!16s%2Fg%2F11mrpgwyyc?hl=en&entry=ttu&g_ep=EgoyMDI2MDcyOC4wIKXMDSoASAFQAw%3D%3D"
            }
            className="pointer-events-auto not-italic font-bold text-black hover:underline"
          >
            Read More
          </Link>
        </>
      )}
    </p>
  );
}

export default function Reviews({ noBtn = false }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 1080);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
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
      setActiveIndex((prev) => (prev + 1) % reviews.length);
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
    <section className="relative pt-[60px] 1080:pb-[100px] pb-[60px] overflow-hidden">
      <div className="w-full lg:w-10/12 lg:mx-auto 700:px-5 px-3 550:mb-30 mb-20 text-center">
        <p className="ck-tagline text-sm uppercase font-xbold tracking-widest mb-4 pointer-events-none">
          Testimonials
        </p>
        <h2 className="font-gt pb-1 font-semibold text-3xl 700:text-4xl 1080:text-5xl leading-[1] pointer-events-none">
          What our clients have to say about us
        </h2>
        <div className="inline-flex my-8 items-center pointer-events-none gap-3 rounded-full border border-black/20 px-4 py-2.5 backdrop-blur-sm">
          <FcGoogle className="w-[20px] h-[20px]" />
          <div className="flex items-center gap-[3px]">
            {Array.from({ length: 5 }).map((_, key) => (
              <div key={key}>
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
          <span className="text-[0.8125rem] leading-none text-gray-600">
            7+ Google reviews
          </span>
        </div>
        {noBtn ? null : (
          <div className="flex flex-col 700:self-end items-center gap-2">
            <p className="700:text-xs text-[0.8125rem] 700:font-semibold uppercase tracking-[0.1em] text-gray-400 m-0 pointer-events-none">
              Worked with us?
            </p>
            <Link href={"https://g.page/r/CW2_pfevA7T3EAE/review"} className="">
              <div
                className="flex items-center gap-4 rounded-md w-fit border-[1.5px] px-[1.5rem] py-[0.75rem] text-[15px] font-[500] bg-third text-white tracking-[0.1em] 
              hover:bg-white hover:text-black transition-all ease-[cubic-bezier(0.4,0,0.2,1)] duration-400"
              >
                <FaRegStar className="w-[15px] h-[15px]" />
                Leave a Review
              </div>
            </Link>
          </div>
        )}
      </div>
      <div className="max-w-[1200px] mx-auto w-full px-[3%] grid grid-cols-1 1080:grid-cols-[340px_1fr] 1080:gap-20 550:gap-16 gap-10 items-center">
        {/* Left: curved avatar track */}
        <div
          ref={trackRef}
          className={`relative mx-auto ${isMobile ? "w-full" : ""}`}
          style={
            isMobile
              ? { height: MOBILE_TRACK_HEIGHT }
              : { width: desktopGeo.width, height: DESKTOP_HEIGHT }
          }
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
                  onClick={() => setActiveIndex(i)}
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
                    duration: 0.9,
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
                          review.avatar ? review.avatar : "/reviews/avatar.png"
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
                        className={`block font-semibold ${isActive ? "text-base" : "text-[13px]"}`}
                      >
                        {review.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500 justify-center">
                        <FaStar className="text-third w-3 h-3" />
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
                        <FaStar className="text-third w-3 h-3" />
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

        {/* Right: active quote */}
        <motion.div
          layout
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[160px] max-1080:mx-auto"
        >
          <span className="block text-6xl font-serif text-third/30 leading-none mb-2 pointer-events-none">
            "
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5"
            >
              <QuoteText
                quote={reviews[activeIndex].quote}
                charLimit={
                  reviews[activeIndex].images
                    ? QUOTE_CHAR_LIMIT_WITH_IMAGES
                    : QUOTE_CHAR_LIMIT_NO_IMAGES
                }
              />

              {reviews[activeIndex].images ? (
                <div
                  className={`self-end pointer-events-none ${reviews[activeIndex].images.length == 4 ? "w-full" : "w-[60%]"} flex justify-center gap-2`}
                >
                  {reviews[activeIndex].images.map((review_img, ind) => (
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
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
