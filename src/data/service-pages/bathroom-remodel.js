const bathroomRemodel = {
  slug: "bathroom-remodel",
  navLabel: "Bathroom Remodel",
  navBlurb: "Showers, tubs, tile and fixtures",
  title: "Bathroom Remodel",
  metaTitle: "Bathroom Remodeling Contractor in Los Angeles",
  serviceType: "Bathroom Remodeling",
  description:
    "Bathroom remodeling in Los Angeles — plumbing, waterproofing, tile, and fixtures done in the right order by one licensed team. CSLB #1144057.",
  keywords: [
    "bathroom remodel Los Angeles",
    "bathroom remodeling contractor Los Angeles",
    "shower remodel Los Angeles",
    "tub to shower conversion Los Angeles",
    "bathroom remodel San Fernando Valley",
  ],
  // Behind the page's hero and on its homepage service card.
  image: {
    src: "/images/services/bathroom-remodel.png",
    alt: "Remodeled bathroom with a floating white-oak vanity, a walk-in glass shower and a freestanding soaking tub",
  },
  hero: "Bathroom remodels across Los Angeles and the San Fernando Valley — plumbing, waterproofing, tile, and fixtures sequenced by one licensed team, so it's done right the first time.",
  specs: [
    { label: "Duration", value: "3–8 Weeks" },
    { label: "Scope", value: "Demo to Finish" },
    { label: "License", value: "B · C-10 · C-36" },
  ],
  // The Build, under the hero (ServicePage/ServiceBuild): the stages of the
  // build, each with its icon (a key in ServiceBuild's ICONS)
  build: {
    heading: ["Your Bathroom,","Step by Step"],
    intro:
      "How a bathroom comes together with us — from the studs out, so it lasts behind the tile.",
    steps: [
      {
        icon: "demo",
        title: "Demo & Prep",
        text: "The old bathroom comes out down to the studs and the subfloor, and what's behind the walls is checked.",
      },
      {
        icon: "systems",
        title: "Plumbing & Electrical",
        text: "The supply and drain lines, the shower valve, the fan and new circuits are roughed in.",
      },
      {
        icon: "water",
        title: "Waterproofing",
        text: "Backer board and a waterproof membrane go on every wet wall and the shower floor, which is flood-tested.",
      },
      {
        icon: "tile",
        title: "Tile",
        text: "The floor and wall tile are set, grouted and sealed.",
      },
      {
        icon: "bath",
        title: "Vanity & Fixtures",
        text: "The vanity, mirror, toilet and shower or tub fixtures go in.",
      },
      {
        icon: "light",
        title: "Lights & Walkthrough",
        text: "The lights and fan are connected, everything's cleaned, and we walk it with you before handover.",
      },
    ],
  },
  process: {
    closing: "Every Bathroom",
    intro:
      "Every bathroom remodel runs the same way — clear estimate, locked selections, coordinated build, walkthrough at handoff.",
    steps: [
      {
        label: "Consultation & Estimate",
        description:
          "We walk your existing bathroom, discuss what you want to change, and put together a detailed estimate. You'll know the real cost before any decisions are locked in.",
      },
      {
        label: "Design & Material Selection",
        description:
          "Tile, fixtures, vanities, hardware — every selection gets confirmed before demo starts. No mid-project surprises because a finish you wanted is out of stock.",
      },
      {
        label: "Construction & Coordination",
        description:
          "We manage demo, waterproofing, tile, plumbing, and electrical. Our crew coordinates every phase so the project moves on schedule.",
      },
      {
        label: "Walkthrough & Handoff",
        description:
          "We walk the finished bathroom with you. Everything is reviewed and signed off before handover.",
      },
    ],
  },
  estimateHeading: {
    firstLine: "Ready to Rebuild",
    secondLine: "Your",
    italic: "Bathroom?",
  },
  faqTopic: "Bathroom Remodeling",
  faqIntro:
    "Answers to the questions homeowners ask most before starting a bathroom remodel across Los Angeles and the San Fernando Valley.",
  faqs: [
    {
      question: "How much does a bathroom remodel cost in Los Angeles?",
      answer:
        "Fixture relocations, tile and material selections, and whether the shower needs its waterproofing rebuilt are the biggest factors. A same-layout refresh costs far less than moving the toilet or converting a tub to a walk-in shower. We provide a detailed written estimate after seeing the space. {{Get a free on-site estimate}} for your exact number.",
    },
    {
      question: "How long does a bathroom remodel take?",
      answer:
        "Most bathroom remodels run 3–8 weeks, depending on scope, tile lead times, and plumbing complexity. We set the schedule during planning and tell you about any change before it affects the timeline.",
    },
    {
      question: "Can I stay home if it's my only bathroom?",
      answer:
        "Usually, yes — but it's worth planning around. We sequence the project to keep downtime as short as possible, though a full gut remodel means some period without a working bathroom in that space. We're upfront about how long during planning.",
    },
    {
      question: "Can you convert a tub into a walk-in shower?",
      answer:
        "Yes. A tub-to-shower conversion usually means relocating the drain, installing a new shower valve, and building a fully waterproofed shower pan — all handled under our own C-36 plumbing license.",
    },
    {
      question: "Do I need a permit for a bathroom remodel?",
      answer:
        "If you're moving plumbing, adding circuits, or changing walls, yes. Replacing a vanity or retiling in place often doesn't need one. We confirm what your project requires during the estimate and manage the permit when it's needed.",
    },
    {
      question: "What if you find water damage or mold behind the tile?",
      answer:
        "Older bathrooms sometimes hide water damage behind tile, especially around tubs and showers, that isn't visible until demolition. We stop, show you what we found, and walk through the cost and schedule impact before we continue.",
    },
  ],
  coverage: {
    heading: ["Bathroom Remodels", "Across Los Angeles"],
    description:
      "We remodel bathrooms throughout Los Angeles and Ventura Counties. Free on-site estimates anywhere in our coverage zone.",
  },
  related: [
    {
      slug: "kitchen-remodel",
      note: "Same plumbing and electrical trades — pair the two for one schedule and one contract.",
    },
    {
      slug: "home-remodel",
      note: "Updating more than one room? Remodel the whole house under a single plan instead.",
    },
    {
      slug: "home-additions",
      note: "Want a bigger primary bath than the footprint allows? A primary suite addition makes the room.",
    },
  ],
};

export default bathroomRemodel;
