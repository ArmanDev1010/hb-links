import { servicePageHref } from "@/lib/cities";

const aduBuilder = {
  slug: "adu-builder",
  featured: true,
  navLabel: "ADU",
  navBlurb: "Detached, attached and junior ADUs",
  title: "ADU Builder",
  // Garage conversions have their own page (garage-conversion.js), so this
  // title leaves them out — the two pages shouldn't compete for one search.
  metaTitle: "ADU Builder & Contractor in Los Angeles, CA",
  serviceType: "ADU Construction",
  description:
    "ADU builder in Los Angeles — detached ADUs, attached ADUs, and JADUs, designed, permitted, and built by one licensed team. CSLB #1144057.",
  keywords: [
    "ADU builder Los Angeles",
    "ADU contractor Los Angeles",
    "detached ADU builder Los Angeles",
    "attached ADU Los Angeles",
    "backyard ADU Los Angeles",
    "junior ADU Los Angeles",
    "ADU permit Los Angeles",
    "ADU cost Los Angeles",
  ],
  image: {
    src: "/images/services/adu.png",
    alt: "Finished backyard ADU with white stucco walls, black windows and an arched entry porch",
  },
  hero: "Detached ADUs, attached ADUs, garage conversions, and JADUs across Los Angeles and the San Fernando Valley — designed, permitted, and built by one licensed team.",
  specs: [
    { label: "Duration", value: "2–8 Months" },
    { label: "Scope", value: "ADU / Extension" },
    { label: "License", value: "B · C-10 · C-36" },
  ],
  // The Build, under the hero (ServicePage/ServiceBuild): the stages of the
  // build, each with its icon (a key in ServiceBuild's ICONS). The ADU's
  // run beside its layered drawing, so they're written out a little fuller.
  build: {
    heading: ["Your ADU,","Step by Step"],
    intro:
      "How a backyard ADU goes up with us — from the first lines on the ground to the lights in the yard.",
    steps: [
      {
        icon: "measure",
        title: "Layout & Site Prep",
        text: "We survey the lot, stake the ADU's footprint inside the setbacks and grade the pad, then dig the trenches for the water, sewer and power lines.",
      },
      {
        icon: "foundation",
        title: "Foundation",
        text: "Forms, rebar and the plumbing and electrical stubs go in and are inspected, then the concrete slab is poured, engineered for your lot's soil.",
      },
      {
        icon: "frame",
        title: "Framing",
        text: "The walls are framed in wood with headers over every door and window, and the plumbing, wiring and HVAC are roughed in while they're open.",
      },
      {
        icon: "roof",
        title: "Roof",
        text: "Rafters, roof sheathing and shingles close the ADU in, with flashing and gutters, so it's dry before the insulation and drywall go in.",
      },
      {
        icon: "window",
        title: "Windows & Stucco",
        text: "Energy-efficient windows and doors are set, then the walls are wrapped and finished in stucco to match the main house.",
      },
      {
        icon: "keys",
        title: "Finishes & Yard",
        text: "The kitchen, bathroom, flooring, paint and fixtures inside; a path, planting and lights outside — then the final inspection and your keys.",
      },
    ],
  },
  options: {
    eyebrow: "Compare ADU Types",
    heading: ["Which ADU", "Fits Your Lot?"],
    intro:
      "Nearly every single-family lot in Los Angeles can take at least one ADU — the question is which kind. It comes down to the space you have, what's already standing, and how you plan to use it.",
    items: [
      {
        title: "Detached ADU",
        plan: "adu-detached",
        description:
          "A freestanding backyard home on its own foundation — the most privacy and the most flexibility in layout, and the strongest rental.",
        facts: [
          { label: "Size", value: "Up to 1,200 sq ft" },
          { label: "Structure", value: "New, separate" },
          { label: "Owner on site", value: "Not required" },
        ],
      },
      {
        title: "Attached ADU",
        plan: "adu-attached",
        description:
          "Built onto the side or back of the house with its own entrance, kitchen, and bathroom. Its size is tied to the main home's — generally up to half its floor area.",
        facts: [
          { label: "Size", value: "Tied to the house" },
          { label: "Structure", value: "Shares a wall" },
          { label: "Owner on site", value: "Not required" },
        ],
      },
      {
        title: "Garage Conversion",
        plan: "adu-garage",
        description:
          "Your existing garage turned into a legal unit. The walls, roof, and slab are already there, the setbacks stay as they are, and the parking doesn't have to be replaced.",
        facts: [
          { label: "Size", value: "The garage's footprint" },
          { label: "Structure", value: "Existing garage" },
          { label: "Owner on site", value: "Not required" },
        ],
        href: servicePageHref("garage-conversion"),
        linkLabel: "Garage Conversions",
      },
      {
        title: "Junior ADU",
        plan: "adu-junior",
        description:
          "Up to 500 sq ft carved out of the existing house, with its own entrance and an efficiency kitchen. It can share the house's bathroom.",
        facts: [
          { label: "Size", value: "Up to 500 sq ft" },
          { label: "Structure", value: "Inside the house" },
          { label: "Owner on site", value: "Required" },
        ],
      },
    ],
  },
  process: {
    closing: "Every ADU",
    intro:
      "Every ADU project runs the same way — clear estimate, permits secured, coordinated build, walkthrough at handoff.",
    steps: [
      {
        label: "Consultation & Feasibility",
        description:
          "We walk the lot and check your project against Los Angeles' ADU rules — setbacks, size limits, parking, hillside or fire-zone if applicable. You get a real scope and budget before design starts.",
      },
      {
        label: "Design & Permits",
        description:
          "We finalize plans, run structural, and file permits with the city. Every fixture and finish confirmed before construction begins.",
      },
      {
        label: "Construction",
        description:
          "Foundation, framing, mechanicals, and interior finishes managed in sequence by our team. One on-site PM from kickoff to handoff.",
      },
      {
        label: "Walkthrough & Handoff",
        description:
          "Final punch list, city inspection, and handoff. Your ADU is ready for occupancy or rental on day one.",
      },
    ],
  },
  estimateHeading: {
    firstLine: "Ready to Build",
    secondLine: "Your",
    italic: "ADU?",
  },
  faqTopic: "ADU Construction",
  faqIntro:
    "Answers to the questions homeowners ask most before building an ADU across Los Angeles and the San Fernando Valley.",
  faqs: [
    {
      question: "How much does an ADU cost in Los Angeles?",
      answer:
        "It depends on the ADU type, square footage, site conditions, and finish level. Garage conversions and JADUs are generally the least expensive because the structure already exists; detached ADUs cost the most because they need a new foundation and full utility runs. We give you a firm, written estimate after walking your lot — not a per-square-foot guess over the phone. {{Get a free on-site estimate}} for your exact number.",
    },
    {
      question: "How long does it take to build an ADU?",
      answer:
        "Most ADUs take 2–8 months of construction from permit issuance — garage conversions and JADUs at the shorter end, detached ADUs at the longer end. Design and permitting come first — roughly 30–60 days with a pre-approved plan, or 8–16 weeks for a custom design.",
    },
    {
      question: "Do I need a permit to build an ADU in Los Angeles?",
      answer:
        "Yes. Every ADU needs a building permit. In the City of Los Angeles — including Woodland Hills, Encino, Sherman Oaks, and the rest of the Valley — plans go through LADBS; independent cities like Calabasas run their own review. We prepare the plans, submit them, and answer plan-check corrections as part of the project.",
    },
    {
      question:
        "What's the difference between a detached ADU, an attached ADU, a garage conversion, and a JADU?",
      answer:
        "A detached ADU is a fully separate structure with its own foundation. An attached ADU shares a wall with the main house. A garage conversion turns an existing garage into a legal living unit. A JADU (Junior ADU) is up to 500 sq ft, built inside the existing home, and can share a bathroom with the main house. Each has different permitting rules, and we'll tell you which fits your lot during the site visit.",
    },
    {
      question: "How big can an ADU be on my lot?",
      answer:
        "In the City of Los Angeles, a detached ADU can be up to 1,200 sq ft, and state law guarantees most single-family lots at least an 800 sq ft ADU with 4-foot side and rear setbacks. JADUs are capped at 500 sq ft inside the existing home. Your lot's slope, easements, and existing structures set the real number, which we confirm on site.",
    },
    {
      question: "Can I rent out my ADU?",
      answer:
        "Yes. California law lets you rent an ADU separately from the main house, and a standard ADU doesn't require you to live on the property. JADUs are different — the owner has to live in the main house or the JADU. Cities can also limit short-term rentals, so we confirm the rules for your address during planning.",
    },
  ],
  coverage: {
    heading: ["ADUs Built", "Across Los Angeles"],
    description:
      "We build ADUs throughout Los Angeles and Ventura Counties. Free on-site estimates anywhere in our coverage zone.",
  },
  related: [
    {
      slug: "home-additions",
      note: "Weighing an ADU against adding on to the house? We'll price both on the same site visit.",
    },
    {
      slug: "deck-and-patio",
      note: "Finish the backyard around the new unit while the crew and permits are already in place.",
    },
    {
      slug: "design-build",
      note: "ADUs are a natural fit for design-build — permits and buildability come up early and often.",
    },
  ],
};

export default aduBuilder;
