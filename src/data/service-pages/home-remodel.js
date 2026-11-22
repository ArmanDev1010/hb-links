const homeRemodel = {
  slug: "home-remodel",
  navLabel: "Home Remodel",
  navBlurb: "Whole-home and multi-room remodels",
  title: "Home Remodel",
  metaTitle: "Home Remodeling Contractor in Los Angeles, CA",
  serviceType: "Home Remodeling",
  description:
    "Home remodeling in Los Angeles — layouts, structural work, electrical, plumbing, and finishes managed by one licensed team on one contract. CSLB #1144057.",
  keywords: [
    "home remodel Los Angeles",
    "home remodeling contractor Los Angeles",
    "whole home remodel Los Angeles",
    "house renovation Los Angeles",
    "remodeling contractor San Fernando Valley",
  ],
  // Behind the page's hero and on its homepage service card.
  image: {
    src: "/images/services/home-remodel.png",
    alt: "Remodeled open-plan living room, dining area and kitchen with white-oak floors, built-in shelves and black-framed sliding doors to the backyard",
  },
  hero: "Whole-home and multi-room remodels across Los Angeles and the San Fernando Valley — every trade managed by one licensed team, on one contract, with no surprises.",
  specs: [
    { label: "Duration", value: "3–12 Months" },
    { label: "Scope", value: "Gut to Finish" },
    { label: "License", value: "B · C-10 · C-36" },
  ],
  // The Build, under the hero (ServicePage/ServiceBuild): the stages of the
  // build, each with its icon (a key in ServiceBuild's ICONS)
  build: {
    heading: ["Your Remodel,","Step by Step"],
    intro:
      "How a remodel goes with us — from opening up the walls to the final walkthrough.",
    steps: [
      {
        icon: "demo",
        title: "Opened Up",
        text: "Walls, ceilings and floors are opened where the plan calls for it, and what's behind them is checked.",
      },
      {
        icon: "systems",
        title: "Wiring & Plumbing",
        text: "Wiring, plumbing and ducts are updated while the walls are open, then insulated and closed up.",
      },
      {
        icon: "paint",
        title: "Floors & Paint",
        text: "New floors go down, and the walls and ceilings are finished and painted.",
      },
      {
        icon: "kitchen",
        title: "Kitchen",
        text: "Cabinets, counters, appliances and lighting go in where the new layout puts them.",
      },
      {
        icon: "bath",
        title: "Bathroom",
        text: "Waterproofing, tile, the vanity and the fixtures — built to last behind the surfaces you see.",
      },
      {
        icon: "keys",
        title: "Final Walkthrough",
        text: "Every room is cleaned, checked and walked with you before we hand it over.",
      },
    ],
  },
  options: {
    eyebrow: "Scope Your Remodel",
    heading: ["How Big Is", "Your Remodel?"],
    intro:
      "A remodel can be one room or the whole house. The scope decides whether you stay home during the work, what needs a permit, and how much of the house's wiring and plumbing gets replaced along the way.",
    items: [
      {
        title: "Single-Room Remodel",
        plan: "remodel-one",
        description:
          "One space rebuilt top to bottom — a living room opened up, a laundry moved, a dated primary suite redone — with the rest of the house untouched.",
        facts: [
          { label: "Living at home", value: "Usually" },
          { label: "Permit", value: "If systems change" },
          { label: "Best for", value: "One problem space" },
        ],
      },
      {
        title: "Multi-Room or Phased",
        plan: "remodel-multi",
        description:
          "Several rooms at once, often with walls moving between them, done in phases so part of the house stays livable while the rest is under construction.",
        facts: [
          { label: "Living at home", value: "Often, in phases" },
          { label: "Permit", value: "Usually" },
          { label: "Best for", value: "Open-plan layouts" },
        ],
      },
      {
        title: "Whole-Home Remodel",
        plan: "remodel-whole",
        description:
          "The house taken back to the studs — new layout, wiring, plumbing, insulation, and finishes throughout. The most disruption, and the most house for the money.",
        facts: [
          { label: "Living at home", value: "Usually not" },
          { label: "Permit", value: "Yes" },
          { label: "Best for", value: "Older homes" },
        ],
      },
    ],
  },
  process: {
    closing: "Every Remodel",
    intro:
      "Every home remodel runs the same way — clear estimate, locked selections, coordinated build, walkthrough at handoff.",
    steps: [
      {
        label: "Consultation & Scoping",
        description:
          "We walk the property, talk through what stays and what goes, and put together a real scope and a real budget. You'll know the project before anything moves forward.",
      },
      {
        label: "Design & Material Selection",
        description:
          "Every finish, material, and fixture confirmed before construction begins. We work through the details upfront so the build phase runs cleanly.",
      },
      {
        label: "Construction & Coordination",
        description:
          "Demo, rough work, and finishes managed in sequence by our team. Every trade, delivery, and inspection coordinated. One point of contact throughout.",
      },
      {
        label: "Walkthrough & Handoff",
        description:
          "We walk the completed home room by room. Every item on the punch list addressed before handoff.",
      },
    ],
  },
  estimateHeading: {
    firstLine: "Ready to Reimagine",
    secondLine: "Your",
    italic: "Home?",
  },
  faqTopic: "Home Remodeling",
  faqIntro:
    "Answers to the questions homeowners ask most before starting a home remodel across Los Angeles and the San Fernando Valley.",
  faqs: [
    {
      question: "How much does a home remodel cost in Los Angeles?",
      answer:
        "It depends on square footage, how many rooms are involved, whether walls move, and the finish level you choose. Opening load-bearing walls or replacing old wiring and plumbing adds scope a cosmetic refresh doesn't have. We price the project after walking the house — a written estimate, not a range off a calculator. {{Get a free on-site estimate}} for your exact number.",
    },
    {
      question: "How long does a whole-home remodel take?",
      answer:
        "Construction typically runs 3–12 months depending on scope, with design and permitting up front. We set the schedule before work starts and tell you about any change before it happens, not after.",
    },
    {
      question: "Can we live in the house during the remodel?",
      answer:
        "For a single room or a phased remodel, usually yes. For a full gut remodel, most families move out for at least part of the project, since water, power, and HVAC are offline at different stages. We map out the phases during planning so you can decide early.",
    },
    {
      question: "Do I need permits for a home remodel?",
      answer:
        "Almost always, if the work touches structure, electrical, or plumbing. In the City of Los Angeles that means LADBS; independent cities like Calabasas run their own review. We prepare and submit the plans and schedule every inspection as part of the project.",
    },
    {
      question:
        "Do you handle electrical and plumbing, or do I hire those separately?",
      answer:
        "We hold California licenses for general building (B), electrical (C-10), and plumbing (C-36), so those trades are scheduled and managed under one contract instead of being handed off to separate subcontractors.",
    },
    {
      question: "What if you find problems once the walls are open?",
      answer:
        "Older Los Angeles homes often hide outdated wiring, galvanized plumbing, or water damage that isn't visible until demolition. If we find something, we stop, show you, and walk through the cost and schedule impact before we continue.",
    },
  ],
  coverage: {
    heading: ["Home Remodels", "Across Los Angeles"],
    description:
      "We remodel homes throughout Los Angeles and Ventura Counties. Free on-site estimates anywhere in our coverage zone.",
  },
  related: [
    {
      slug: "kitchen-remodel",
      note: "The kitchen is usually the centerpiece of a whole-home remodel — or a project all on its own.",
    },
    {
      slug: "bathroom-remodel",
      note: "Bathrooms carry the most plumbing per square foot — remodel them while the walls are already open.",
    },
    {
      slug: "home-additions",
      note: "Need more space, not just better space? Add on in the same project, under the same contract.",
    },
  ],
};

export default homeRemodel;
