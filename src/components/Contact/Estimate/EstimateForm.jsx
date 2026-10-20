"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  TbArrowLeft,
  TbArrowRight,
  TbCheck,
  TbMapPin,
  TbMapPinQuestion,
} from "react-icons/tb";

import { BlueprintCamera, GridPaper } from "./BlueprintCamera";
import { useContactForm } from "@/hooks/useContactForm";
import { FormLegalNote, SmsConsent } from "@/components/UI/FormConsent";
import { PHONE_PATTERN, formatPhoneInput } from "@/lib/phone";
import {
  ESTIMATE_STEPS,
  LOCATION_AREAS,
  findOption,
  getBlueprintMarks,
} from "@/data/estimate";

const EASE = [0.22, 1, 0.36, 1];

// Long enough to see the pick land before the next question slides in.
const ADVANCE_DELAY = 260;

const EMPTY_ANSWERS = {
  project: null,
  area: null,
  address: "",
};

const slide = {
  enter: (direction) => ({ opacity: 0, x: direction * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction * -28 }),
};

// The location step's pick for anywhere outside LOCATION_AREAS, typed into
// the box under the picks.
const OTHER_AREA = "Other area";

// The location is one of the picked areas, or what was typed for "Other
// area".
function resolveLocation({ area, address }) {
  if (area === OTHER_AREA) return address.trim();
  return area ? `${area}, CA` : "";
}

function isAnswered(stepId, answers) {
  if (stepId === "location") return Boolean(resolveLocation(answers));
  return Boolean(answers[stepId]);
}

// The nearest ancestor that scrolls on its own — the request modal's body —
// or null when the form sits in the page itself and the window scrolls.
function scrollParent(node) {
  for (
    let el = node?.parentElement;
    el && el !== document.body;
    el = el.parentElement
  ) {
    const { overflowY } = getComputedStyle(el);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight
    ) {
      return el;
    }
  }
  return null;
}

const PRIMARY_BUTTON =
  "group shrink-0 h-[46px] rounded-[20px] flex items-center justify-center gap-2 bg-black px-6 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-third disabled:opacity-35 disabled:hover:bg-black disabled:cursor-not-allowed cursor-pointer";

const inputClasses =
  "mt-1.5 w-full h-[46px] bg-[#f5f4f1] border rounded-[20px] px-4 text-[14.5px] outline-none placeholder:text-black/30 transition-colors duration-200";

function OptionCard({ option, selected, onSelect }) {
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative w-full rounded-[20px] flex items-center gap-4 border px-4 py-4 550:px-5 text-left transition-colors duration-200 cursor-pointer ${
        selected
          ? "border-third bg-third/[0.04]"
          : "border-black/15 bg-white hover:border-black/40"
      }`}
    >
      <span
        className={`grid place-items-center w-11 h-11 shrink-0 border text-[22px] transition-colors duration-200 ${
          selected
            ? "border-third/40 text-third"
            : "border-black/10 text-black/70"
        }`}
      >
        <Icon />
      </span>
      <span className="min-w-0 pr-5">
        <span className="block text-[15px] font-semibold leading-snug">
          {option.label || option.title}
        </span>
        <span className="block mt-0.5 text-[13px] leading-snug text-fourth">
          {option.hint}
        </span>
      </span>
      {selected && (
        <span className="absolute top-2.5 right-2.5 grid place-items-center w-5 h-5 rounded-full bg-third text-white text-[13px]">
          <TbCheck />
        </span>
      )}
    </button>
  );
}

function AreaButton({
  selected,
  onClick,
  icon: Icon = TbMapPin,
  className = "",
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`${className} flex items-center gap-2 min-w-0 rounded-[20px] border px-3.5 550:px-4 py-3.5 text-left text-[13.5px] 550:text-[14.5px] font-semibold leading-tight transition-colors duration-200 cursor-pointer ${
        selected
          ? "border-third bg-third/[0.04] text-third"
          : "border-black/15 bg-white hover:border-black/40"
      }`}
    >
      <Icon
        className={`shrink-0 text-[17px] ${selected ? "text-third" : "text-black/40"}`}
      />
      {children}
    </button>
  );
}

// Seven areas to tap (data/estimate.js LOCATION_AREAS) — a tap moves straight
// on, like the other picks — then "Other area", filling out the last row, and
// the box to type a city, ZIP or address in, always showing under them.
// "Other area" puts the cursor in the box, and typing in it picks "Other
// area"; the box's Continue button (Enter works too) moves on from either.
function LocationStep({
  area,
  address,
  onPickArea,
  onAddressChange,
  onContinue,
}) {
  const inputRef = useRef(null);
  const canContinue = Boolean(resolveLocation({ area, address }));

  // Labelled with aria-label rather than an id'd <label>: the homepage can
  // have this form in its section and in the request modal at once, and a
  // generated id wasn't staying stable between server and client.
  return (
    <div>
      <div className="grid gap-2.5 grid-cols-2 @min-[480px]:grid-cols-3">
        {LOCATION_AREAS.map((name) => (
          <AreaButton
            key={name}
            selected={area === name}
            onClick={() => onPickArea(name)}
          >
            {name}
          </AreaButton>
        ))}
        {/* beside the last area two-up; two cells wide three-up */}
        <AreaButton
          selected={area === OTHER_AREA}
          onClick={() => {
            onPickArea(OTHER_AREA);
            inputRef.current?.focus();
          }}
          icon={TbMapPinQuestion}
          className="@min-[480px]:col-span-2"
        >
          Other area
          <span className="hidden @min-[480px]:inline font-normal text-fourth">
            — type it in below
          </span>
        </AreaButton>
      </div>

      <div className="mt-3 flex flex-col @min-[480px]:flex-row gap-2.5">
        <div className="relative flex-1">
          <TbMapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-black/40" />
          <input
            ref={inputRef}
            aria-label="City, ZIP code or street address"
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onContinue();
              }
            }}
            autoComplete="street-address"
            placeholder="City, ZIP code or street address"
            className="w-full h-[46px] bg-[#f5f4f1] rounded-[20px] border border-transparent pl-11 pr-4 text-[14.5px] outline-none placeholder:text-black/30 focus:border-black transition-colors duration-200"
          />
        </div>
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={PRIMARY_BUTTON}
        >
          Continue
          <TbArrowRight className="text-lg transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

// The <label> wraps its input, which ties the two together for screen
// readers without an id — see LocationStep for why ids aren't used here.
function Field({ label, error, children }) {
  return (
    <label className="block min-w-0">
      <span className="block text-[12px] text-fourth">{label}</span>
      {children}
      {error && (
        <span className="block mt-1 text-xs text-red-600">{error.message}</span>
      )}
    </label>
  );
}

// Name and phone, with the optional text opt-in under them. Continue checks
// both before moving on — the request itself is sent from the last step.
// The phone shapes itself into (747) 777-7777 as it's typed (lib/phone).
function ContactStep({ form, onContinue }) {
  const {
    register,
    formState: { errors },
  } = form;

  const borderClass = (name) =>
    errors[name] ? "border-red-400" : "border-transparent focus:border-black";

  const phoneField = register("phone", {
    required: "Phone Number is required.",
    pattern: {
      value: PHONE_PATTERN,
      message: "Please enter a 10-digit phone number.",
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onContinue();
      }}
      noValidate
    >
      <div className="grid grid-cols-1 @min-[520px]:grid-cols-2 gap-x-3 gap-y-4">
        <Field label="Name" error={errors.name}>
          <input
            {...register("name", { required: "Full Name is required." })}
            type="text"
            autoComplete="name"
            placeholder="John"
            className={`${inputClasses} ${borderClass("name")}`}
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input
            {...phoneField}
            onChange={(event) => {
              formatPhoneInput(event.target);
              return phoneField.onChange(event);
            }}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(818) 555-0123"
            className={`${inputClasses} ${borderClass("phone")}`}
          />
        </Field>
      </div>

      <SmsConsent register={register} className="mt-4" />

      <button type="submit" className={`${PRIMARY_BUTTON} mt-5`}>
        Continue
        <TbArrowRight className="text-lg transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}

// The optional message, and the button that sends the request. `hb_check`
// is a field people never see or reach: only a bot fills it in, and the API
// route quietly drops those requests (the form has no CAPTCHA).
function DetailsStep({ form }) {
  const { register, handleFormSubmit, isSubmitting } = form;

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <textarea
        {...register("message")}
        aria-label="Anything else we should know? (optional)"
        rows={4}
        placeholder="Lot size, budget, timing, ideas you have in mind — whatever helps."
        className="w-full bg-[#f5f4f1] rounded-[20px] border border-transparent px-4 py-3 text-[14.5px] leading-relaxed outline-none resize-none placeholder:text-black/30 focus:border-black transition-colors duration-200"
      />
      <div aria-hidden="true" className="sr-only">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("hb_check")}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`${PRIMARY_BUTTON} mt-4 w-full @min-[480px]:w-auto @min-[480px]:min-w-[280px] !justify-between`}
      >
        {isSubmitting ? "Sending..." : "Request my estimate"}
        <TbArrowRight className="text-lg transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
      <FormLegalNote className="mt-3" />
    </form>
  );
}

// Under the blueprint camera (below 1080px, and in the modal): the answers
// so far as one line of text across the top of the card, each tappable to
// jump back to its step. Hidden until there's a first answer.
function MobilePicks({ answers, location, step, onJump, className = "" }) {
  const project = findOption("project", answers.project);
  const values = {
    project: project?.label || answers.project,
    location,
  };
  const picks = ESTIMATE_STEPS.map((s, index) => ({
    value: values[s.id],
    index,
  })).filter((pick) => pick.value);

  if (!picks.length) return null;

  return (
    <div
      className={`${className} px-4 550:px-8 py-3.5 border-b border-black/10 bg-[#f7f7f5]`}
    >
      <p className="text-[11px] uppercase tracking-[0.16em] text-fourth pointer-events-none">
        Your picks{" "}
        <span className="normal-case tracking-normal text-black/35">
          — tap one to change it
        </span>
      </p>
      <p className="mt-1.5 text-[14px] font-semibold leading-relaxed">
        {picks.map((pick, i) => (
          <span key={pick.index}>
            {i > 0 && <span className="font-normal text-black/30"> · </span>}
            <button
              type="button"
              onClick={() => onJump(pick.index)}
              aria-current={pick.index === step ? "step" : undefined}
              className={`inline text-left break-words underline decoration-dotted underline-offset-4 transition-colors duration-200 cursor-pointer hover:text-third hover:decoration-third ${
                pick.index === step
                  ? "text-third decoration-third"
                  : "decoration-black/30"
              }`}
            >
              {pick.value}
            </button>
          </span>
        ))}
      </p>
    </div>
  );
}

// The four-step estimate request — what, where, who, and anything else —
// in one white card, used by the homepage and /contact (EstimateSection)
// and the header's request modal. Each question has "Step 2 of 4" over it
// and a progress line under it. From 1080px up the card splits in two: the
// questions on the white, and the blueprint centred on white drafting-grid
// paper beside them. Below that there's no blueprint — just the questions,
// with the tappable "Your picks" line across the top. `showLabel` is the "Complete the Form" line across the top (off
// in the modal, whose own header already says it); `shadow` is the card's
// drop shadow. The card
// sets its own text colour so it reads the same whatever it's placed in.
// Steps and options live in data/estimate.js. Boris isn't named anywhere
// here; he's introduced in the thank-you modal once it's sent.

// The card's two columns (questions | blueprint) from 1080px up.
const CARD_COLUMNS = "1080:grid-cols-[minmax(0,8fr)_minmax(300px,4fr)]";

// How much of the blueprint panel's width the whole drawing takes at the
// "full" shot, leaving a margin of grid paper around it.
const PANEL_FILL = 86;

// Desktop's camera: how long it holds a zoomed-in shot before gliding back
// out to the whole drawing, and how it moves — a touch slower than the
// phone's, the panel being bigger.
const DESK_HOLD = 1800;
const DESK_MOVE = "900ms cubic-bezier(0.22, 1, 0.36, 1)";

// Where the blueprint camera should point after an answer: the part that
// answer changes, or the whole drawing.
function shotFor(stepId, value) {
  if (!value) return "full";
  if (stepId === "project") return findOption("project", value)?.pin ?? "full";
  if (stepId === "location") return "address";
  return "full";
}

export default function EstimateForm({
  className = "",
  showLabel = true,
  shadow = true,
}) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  // The blueprint camera's latest move (shotFor). `tick` counts every
  // move, so the same shot twice in a row — or each keystroke of the
  // address — still counts as a move. The panel (deskShot) zooms in,
  // holds, then settles back to the whole drawing.
  const [camera, setCamera] = useState({ shot: "full", tick: 0 });
  const setShot = (next) =>
    setCamera((prev) => ({ shot: next, tick: prev.tick + 1 }));
  const [deskShot, setDeskShot] = useState("full");
  const cardRef = useRef(null);
  const advanceTimer = useRef(null);
  const hasMoved = useRef(false);

  const total = ESTIMATE_STEPS.length;
  const current = ESTIMATE_STEPS[step];
  const location = resolveLocation(answers);

  const goTo = (index) => {
    clearTimeout(advanceTimer.current);
    hasMoved.current = true;
    setDirection(index > step ? 1 : -1);
    setStep(index);
  };

  const form = useContactForm({
    extraData: {
      service: answers.project,
      address: location,
    },
    onSuccess: () => {
      setAnswers(EMPTY_ANSWERS);
      setShot("full");
      goTo(0);
    },
  });

  const advanceSoon = () => {
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => goTo(step + 1), ADVANCE_DELAY);
  };

  const choose = (stepId, value) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
    setShot(shotFor(stepId, value));
    advanceSoon();
  };

  // "Other area" stays on the step for typing (keeping anything already
  // typed); an area clears the box and moves on like the other picks.
  const pickArea = (area) => {
    if (area === OTHER_AREA) {
      clearTimeout(advanceTimer.current);
      setAnswers((prev) => ({ ...prev, area }));
      setShot(shotFor("location", answers.address.trim()));
      return;
    }
    setAnswers((prev) => ({ ...prev, area, address: "" }));
    setShot("address");
    advanceSoon();
  };

  // Typing in the box picks "Other area".
  const changeAddress = (address) => {
    setAnswers((prev) => ({ ...prev, area: OTHER_AREA, address }));
    setShot(shotFor("location", address.trim()));
  };

  // Jumping back to a step ("Your picks") points the camera at what that
  // step's answer shows.
  const jumpTo = (index) => {
    const stepId = ESTIMATE_STEPS[index].id;
    setShot(
      shotFor(stepId, stepId === "location" ? location : answers[stepId]),
    );
    goTo(index);
  };

  const continueIfAnswered = () => {
    if (isAnswered(current.id, answers)) goTo(step + 1);
  };

  const continueFromContact = async () => {
    if (await form.trigger(["name", "phone"])) goTo(step + 1);
  };

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  // Follow each move in, hold it, then glide back out.
  useEffect(() => {
    setDeskShot(camera.shot);
    if (camera.shot === "full") return;
    const id = setTimeout(() => setDeskShot("full"), DESK_HOLD);
    return () => clearTimeout(id);
  }, [camera]);

  // On phones the options can sit below the fold — once the next question
  // has settled, bring the card's top back into view if it scrolled away:
  // inside the modal's own scroll area there, else the window (clearing the
  // fixed navbar).
  useEffect(() => {
    if (!hasMoved.current) return;
    const id = setTimeout(() => {
      const card = cardRef.current;
      if (!card) return;
      const top = card.getBoundingClientRect().top;
      const scroller = scrollParent(card);

      if (scroller) {
        const scrollerTop = scroller.getBoundingClientRect().top;
        if (top < scrollerTop) {
          scroller.scrollTo({
            top: scroller.scrollTop + top - scrollerTop - 16,
            behavior: "smooth",
          });
        }
      } else if (top < 90) {
        window.scrollTo({
          top: window.scrollY + top - 110,
          behavior: "smooth",
        });
      }
    }, 420);
    return () => clearTimeout(id);
  }, [step]);

  let body;
  if (current.id === "location") {
    body = (
      <LocationStep
        area={answers.area}
        address={answers.address}
        onPickArea={pickArea}
        onAddressChange={changeAddress}
        onContinue={continueIfAnswered}
      />
    );
  } else if (current.id === "contact") {
    body = <ContactStep form={form} onContinue={continueFromContact} />;
  } else if (current.id === "details") {
    body = <DetailsStep form={form} />;
  } else {
    // Two columns only once each card gets ~260px — narrower than that and
    // titles and hints wrap into cramped stacks, so one full-width column
    // reads better (phones, and the narrow form column at 1080–1150px).
    body = (
      <div className="grid gap-2.5 grid-cols-1 @min-[540px]:grid-cols-2">
        {current.options.map((option) => (
          <OptionCard
            key={option.title}
            option={option}
            selected={answers[current.id] === option.title}
            onSelect={() => choose(current.id, option.title)}
          />
        ))}
      </div>
    );
  }

  const marks = getBlueprintMarks(answers, location);

  // The project step says "Tap to continue" until answered; the others
  // (location's typing box, contact, details) have their own buttons.
  const picking = Boolean(current.options);

  // "Step 2 of 4", the question and the progress line, its options, and
  // Back / Continue. From 1080px the column supplies the side padding,
  // and the footer drops to the foot of the column.
  const questions = (
    <>
      <div className="px-4 550:px-8 1080:px-0 pt-5 550:pt-7 1080:pt-0 pointer-events-none">
        <p className="uppercase text-[11px] 550:text-[11.5px] font-semibold tracking-[0.16em] text-third">
          Step {step + 1} of {total}
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.h2
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-2 font-gt font-semibold text-[19px] 400:text-[21px] 550:text-[23px] 700:text-[28px] leading-tight"
          >
            {current.question}
            {current.optional && (
              <span className="font-light text-black/40"> (optional)</span>
            )}
          </motion.h2>
        </AnimatePresence>
        <div
          role="progressbar"
          aria-label="Progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step + 1}
          className="mt-4 h-[3px] rounded-full bg-black/[0.06] overflow-hidden"
        >
          <motion.div
            className="h-full bg-third"
            initial={false}
            animate={{ width: `${((step + 1) / total) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>
      </div>

      {/* @container: the steps lay themselves out by this box's width, so
          phones and the narrow desktop column both work. */}
      <div
        className="@container px-4 550:px-8 1080:px-0 pt-5 550:pt-6 pb-5 overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: EASE }}
          >
            {body}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="flex items-center justify-between gap-4 px-4 550:px-8 1080:px-0 pb-6 1080:pb-0 1080:mt-auto"
      >
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className="flex items-center gap-1.5 tracking-widest text-[12px] text-fourth transition-colors duration-200 hover:text-black cursor-pointer"
          >
            <TbArrowLeft /> Back
          </button>
        ) : (
          <span />
        )}
        {picking &&
          (isAnswered(current.id, answers) ? (
            <button
              type="button"
              onClick={continueIfAnswered}
              className="flex items-center gap-1.5 tracking-widest text-[12px] text-third transition-colors duration-200 hover:text-black cursor-pointer"
            >
              Continue <TbArrowRight />
            </button>
          ) : (
            <span className="text-[12px] tracking-widest text-fourth pointer-events-none">
              Tap to continue
            </span>
          ))}
      </div>
    </>
  );

  const cardClasses = `bg-white text-black border border-black/10 ${
    shadow ? "shadow-[0_24px_60px_-36px_rgba(0,0,0,0.35)]" : ""
  }`;

  return (
    <div ref={cardRef} className={`${cardClasses} ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between gap-4 px-4 550:px-8 py-4 550:py-5 border-b border-black/10 pointer-events-none">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-third shrink-0" />
            <div className="flex items-center gap-3 uppercase text-[11px] 400:text-[10.5px] 550:text-[12px] font-bold tracking-[0.16em]">
              <span className="whitespace-nowrap">Complete the Form</span>{" "}
              {/* The aside drops on phones, where it'd wrap the line. */}
              <span className="max-400:hidden">|</span>
              <span className="max-400:hidden text-[10px] 550:text-[11.5px] font-semibold italic tracking-widest text-fourth">
                Takes about a minute
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Below 1080px: the tappable picks. */}
      <MobilePicks
        answers={answers}
        location={location}
        step={step}
        onJump={jumpTo}
        className="1080:hidden"
      />

      <div className={`1080:grid ${CARD_COLUMNS}`}>
        <div className="min-w-0 1080:p-8 1080:flex 1080:flex-col">
          {questions}
        </div>

        {/* From 1080px: the blueprint on the white, its grid fading out at
            the edges, as tall as the questions beside it, with the whole
            drawing centred in it (PANEL_FILL of its width). */}
        <div
          aria-hidden="true"
          className="max-1080:hidden relative min-h-[320px] overflow-hidden bg-white pointer-events-none"
        >
          <GridPaper />

          <BlueprintCamera
            marks={marks}
            shot={deskShot}
            fill={PANEL_FILL}
            move={DESK_MOVE}
          />

          <span className="absolute top-4 left-5 bg-white/90 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-black/50">
            Your blueprint
          </span>
        </div>
      </div>
    </div>
  );
}
