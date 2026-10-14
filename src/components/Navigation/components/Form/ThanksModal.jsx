"use client";

import { motion, useReducedMotion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import {
  TbCheck,
  TbFileDollar,
  TbHammer,
  TbKey,
  TbRulerMeasure,
} from "react-icons/tb";

const EASE = [0.22, 1, 0.36, 1];

// The road from request to finished project — the homepage's four steps
// (Home/Process), with the site visit split out of "We Discuss & Quote".
// Sending the form completes the first (DONE steps are done); the one after
// is up next — it glows in the tracker and is spelled out under it.
const STEPS = [
  { label: "Reach out", icon: TbCheck },
  { label: "Site visit", icon: TbRulerMeasure },
  { label: "Your quote", icon: TbFileDollar },
  { label: "We build", icon: TbHammer },
  { label: "Hand-over", icon: TbKey },
];
const DONE = 1;

// The steps side by side, joined by a line: done ones filled white with a
// tick, the next one ringed in white with a soft white aura that breathes
// (still, for "reduce motion"), the rest dimmed. The line into the next
// step draws itself in. Each connector runs from the previous step's
// circle centre to this one's, under the circles — which are filled, so it
// doesn't show through.
function StepTracker() {
  const reduceMotion = useReducedMotion();

  return (
    <ol className="grid grid-cols-5">
      {STEPS.map((step, index) => {
        const done = index < DONE;
        const next = index === DONE;
        const Icon = done ? TbCheck : step.icon;

        return (
          <motion.li
            key={step.label}
            aria-current={next ? "step" : undefined}
            className="relative flex flex-col items-center text-center"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.07, ease: EASE }}
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className="absolute top-[18px] 550:top-[22px] right-1/2 w-full h-px bg-white/[0.12]"
              >
                {index <= DONE && (
                  <motion.span
                    className="absolute inset-0 origin-left bg-white/60"
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
                  />
                )}
              </span>
            )}

            <span className="relative z-10 grid place-items-center w-9 h-9 550:w-11 550:h-11">
              {next && (
                <>
                  <motion.span
                    aria-hidden="true"
                    className="absolute -inset-2 rounded-full bg-white/30 blur-md"
                    animate={
                      reduceMotion
                        ? undefined
                        : { opacity: [0.35, 0.85, 0.35], scale: [0.9, 1.1, 0.9] }
                    }
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  {!reduceMotion && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(255,255,255,0.45)",
                          "0 0 0 14px rgba(255,255,255,0)",
                        ],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </>
              )}
              <span
                className={`relative grid place-items-center w-full h-full rounded-full text-[17px] 550:text-[20px] ${
                  done
                    ? "bg-white text-black"
                    : next
                      ? "bg-[#111111] border border-white text-white shadow-[0_0_20px_2px_rgba(255,255,255,0.25)]"
                      : "bg-[#111111] border border-white/15 text-white/35"
                }`}
              >
                <Icon />
              </span>
            </span>

            <span
              className={`mt-3 text-[10.5px] 550:text-[12px] leading-tight ${
                done
                  ? "text-white/70"
                  : next
                    ? "text-white font-semibold"
                    : "text-white/35"
              }`}
            >
              {step.label}
              {done && <span className="sr-only"> (done)</span>}
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
}

// Opens in place of the request modal after any contact form is sent
// successfully (see openThanks in context/ModalContext) — the same size as
// RequestModal, on the dark: "Request received", the thanks, and how many of
// the steps are done; then the step tracker and what the next step involves
// (Boris's call, then the site visit). From 1080px the intro sits left of
// the tracker, with the reviews line at its foot; below that it all stacks,
// reviews last.
export default function ThanksModal({ name, handleClose }) {
  const firstName = name.trim().split(/\s+/)[0];
  const reduceMotion = useReducedMotion();

  return (
    <div className="modal fixed inset-0 z-[100000] text-white">
      <motion.div
        className="fixed inset-0 bg-black/55 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      />

      <div className="relative z-10 h-full w-full flex items-center justify-center p-4 700:p-8 pointer-events-none">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="thanks-title"
          className="pointer-events-auto flex flex-col w-full max-w-[720px] 1080:max-w-[1040px] max-h-[90dvh] bg-[#111111] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <div className="flex items-center justify-between px-6 700:px-9 py-5 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-third shrink-0" />
              <span className="uppercase text-[12px] font-bold tracking-[0.16em] pointer-events-none">
                HB Links
              </span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="w-9 h-9 grid place-items-center border border-white/20 hover:bg-white hover:text-black hover:border-white transition-colors duration-200 cursor-pointer"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          <div className="modal-scroll modal-scroll-dark overflow-y-auto px-6 700:px-9 pt-8 700:pt-10 pb-9 700:pb-10">
            <div className="grid gap-y-9 1080:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] 1080:grid-rows-[auto_1fr] 1080:gap-x-14">
              <div className="pointer-events-none">
                <p className="flex items-center gap-2.5 uppercase text-[11px] 550:text-[11.5px] font-semibold tracking-[0.22em] text-white/70">
                  <motion.span
                    className="grid place-items-center w-6 h-6 shrink-0 rounded-full bg-third text-white text-[14px]"
                    initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <TbCheck />
                  </motion.span>
                  Request received
                </p>

                <h2
                  id="thanks-title"
                  className="mt-5 font-gt font-semibold text-[34px] 700:text-[40px] leading-[1.1]"
                >
                  Thanks {firstName}.
                </h2>
                <p className="mt-4 text-[15.5px] 700:text-[17px] leading-relaxed text-white/60">
                  Step {DONE} of {STEPS.length} is complete. Here&apos;s how
                  the rest goes.
                </p>
              </div>

              <div className="1080:col-start-2 1080:row-start-1 1080:row-span-2">
                <StepTracker />

                <motion.div
                  className="mt-8 border border-white/10 bg-white/[0.03] p-5 700:p-7"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.45, ease: EASE }}
                >
                  <p className="flex items-center gap-2.5 uppercase text-[11px] font-semibold tracking-[0.22em] text-white/50 pointer-events-none">
                    <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.55)]" />
                    Up next
                  </p>
                  <h3 className="mt-3 font-gt font-semibold text-[24px] 700:text-[28px] leading-tight pointer-events-none">
                    {STEPS[DONE].label}
                  </h3>
                  <p className="mt-3 text-[15px] 700:text-[16px] leading-relaxed text-white/65">
                    <span className="text-white font-medium">Boris</span> will
                    call you within{" "}
                    <mark className="bg-[#ffe45c] text-black font-medium px-1">
                      3 business hours
                    </mark>{" "}
                    from{" "}
                    <a
                      href="tel:+1 (818) 303-3555"
                      className="text-white font-medium whitespace-nowrap underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors duration-200"
                    >
                      (818) 303-3555
                    </a>{" "}
                    to set a time that works for you. Then we come out, walk
                    the property with you, take measurements, look at existing
                    conditions, and talk through the scope before we write up
                    your quote.
                  </p>
                </motion.div>
              </div>

              <div className="1080:col-start-1 1080:row-start-2 1080:self-end pt-6 1080:pt-0 border-t border-white/10 1080:border-t-0 flex flex-wrap items-center gap-x-3 gap-y-2 pointer-events-none">
                <div className="flex items-center gap-[3px]">
                  {Array.from({ length: 5 }).map((_, key) => (
                    <svg
                      key={key}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      style={{ fill: "oklch(75% 0.18 80)" }}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="text-[15px] font-bold leading-none">5.0</span>
                <span className="text-[13px] leading-none text-white/50">
                  from 10+ Google reviews
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
