import {
  TbHomePlus,
  TbHomeEdit,
  TbStairsUp,
  TbTrees,
  TbRulerMeasure,
  TbHelp,
  TbHome,
} from "react-icons/tb";
import { BsGoogle, BsPeople, BsTelephone, BsThreeDots } from "react-icons/bs";
import { primaryServices } from "@/data/services";
import { socials } from "@/data/contact";
import { servicePageHref } from "@/lib/cities";

// The step-by-step estimate form (components/Contact/Estimate). Each
// option's `title` is also the value sent with the request, so the lead
// message reads exactly what the visitor picked.

// Per-service extras for the first question, keyed by the service's href
// (its service page). `pin` names the part of the blueprint
// (EstimateBlueprint) that lights up when that project is picked. The
// homepage's service cards (Home/Services) show the same icon and hint.
export const projectExtras = {
  [servicePageHref("adu-builder")]: {
    icon: TbHomePlus,
    hint: "detached, attached or garage conversion",
    pin: "adu",
  },
  [servicePageHref("home-remodel")]: {
    icon: TbHomeEdit,
    hint: "kitchen, bath or whole home",
    pin: "remodel",
  },
  [servicePageHref("home-additions")]: {
    icon: TbStairsUp,
    hint: "room additions & second stories",
    pin: "addition",
  },
  [servicePageHref("deck-and-patio")]: {
    icon: TbTrees,
    hint: "decks, patio covers & outdoor kitchens",
    pin: "patio",
  },
  [servicePageHref("design-build")]: {
    icon: TbRulerMeasure,
    hint: "plans, permits & construction",
    pin: "plans",
  },
};

// Matches the "Not Sure / Other" entry in projectTypeOptions (data/services).
const notSureOption = {
  title: "Not Sure / Other",
  label: "Not sure yet",
  icon: TbHelp,
  hint: "we'll talk through your options",
};

const projectOptions = [
  ...primaryServices.map((service) => ({
    title: service.title,
    icon: TbHome,
    ...projectExtras[service.href],
  })),
  notSureOption,
];

// One-tap picks for the location step: Los Angeles, then six of the service
// areas with their own pages (FEATURED_CITIES in lib/seo) — the West Valley
// neighborhoods most of our ADU, remodel and addition work comes from. For
// everywhere else there's an "Other area" pick that opens a box to type it
// in. A pick is sent as "<name>, CA".
export const LOCATION_AREAS = [
  "Los Angeles",
  "Woodland Hills",
  "Encino",
  "Sherman Oaks",
  "Tarzana",
  "Calabasas",
  "Northridge",
];

// "How did you hear about us?" on the last step, under the message box —
// required, one pick, tap it again to clear it. Referral and "You called
// me" (people our own calls reached) come before the social pages, which
// come from data/contact.js `socials`, in their usual order, so a new
// profile shows up here too. The user chose Google search over a separate
// Google Maps pick (11-11). Labels stay short enough to fit on one line
// two-up on a phone. `OTHER_SOURCE` opens a box to type where, which then
// has to be filled in. The pick, or what was typed for "Other", is sent as
// the lead's "Found us" line.
export const OTHER_SOURCE = "Other";

export const LEAD_SOURCES = [
  { title: "Google search", icon: BsGoogle },
  { title: "Referral", icon: BsPeople },
  { title: "You called me", icon: BsTelephone },
  ...socials.map(({ name, icon }) => ({ title: name, icon })),
  { title: OTHER_SOURCE, icon: BsThreeDots },
];

// `optional` adds a light "(optional)" after the question.
export const ESTIMATE_STEPS = [
  {
    id: "project",
    label: "project",
    question: "What are you planning?",
    options: projectOptions,
  },
  {
    id: "location",
    label: "location",
    question: "Where's the property?",
  },
  {
    id: "contact",
    label: "contact",
    question: "How can we reach you?",
  },
  // The optional message, then "How did you hear about us?" (required), then
  // Send. No "(optional)" in this heading: the user moved it into the
  // message box's placeholder (11-11), since the step itself isn't optional.
  {
    id: "details",
    label: "details",
    question: "Anything else we should know?",
  },
];

// Looks up the picked option for a step, for its label and pin.
export function findOption(stepId, value) {
  const step = ESTIMATE_STEPS.find((s) => s.id === stepId);
  return step?.options?.find((option) => option.title === value) ?? null;
}

// What the blueprint (EstimateBlueprint) draws for the answers so far: the
// project's `pin`, and the location on the sign out front. Undefined for
// anything unanswered.
export function getBlueprintMarks(answers, location) {
  return {
    pin: findOption("project", answers.project)?.pin,
    address: location || undefined,
  };
}
