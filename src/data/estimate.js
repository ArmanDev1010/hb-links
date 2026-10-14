import {
  TbHomePlus,
  TbHomeEdit,
  TbStairsUp,
  TbTrees,
  TbRulerMeasure,
  TbHelp,
  TbHome,
} from "react-icons/tb";
import { primaryServices } from "@/data/services";
import { servicePageHref } from "@/lib/cities";

// The step-by-step estimate form (components/Contact/Estimate). Each
// option's `title` is also the value sent with the request, so the lead
// message reads exactly what the visitor picked.

// Per-service extras for the first question, keyed by the service's href
// (its service page). `pin` names the part of the blueprint
// (EstimateBlueprint) that lights up when that project is picked.
const projectExtras = {
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

// One-tap picks for the location step: six of the service areas with their
// own pages (FEATURED_CITIES in lib/seo) — the West Valley neighborhoods most
// of our ADU, remodel and addition work comes from. "Los Angeles" is left
// out (it'd cover everyone, so it tells us nothing); for everywhere else
// there's an "Other area" pick that opens a box to type it in. A pick is
// sent as "<name>, CA".
export const LOCATION_AREAS = [
  "Woodland Hills",
  "Encino",
  "Sherman Oaks",
  "Tarzana",
  "Calabasas",
  "Northridge",
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
  {
    id: "details",
    label: "details",
    question: "Anything else we should know?",
    optional: true,
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
