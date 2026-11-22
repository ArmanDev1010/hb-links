const designBuild = {
  slug: "design-build",
  navLabel: "Design-Build",
  navBlurb: "Design, permits and the build in one",
  title: "Design-Build Contractor",
  metaTitle: "Design-Build Contractor in Los Angeles, CA",
  serviceType: "Design-Build Construction",
  description:
    "Design-build contractor in Los Angeles — one team for design, permits, and construction on ADUs, remodels, and additions, budgeted before ground breaks.",
  keywords: [
    "design-build contractor Los Angeles",
    "design build firm Los Angeles",
    "design build ADU Los Angeles",
    "design build remodel Los Angeles",
    "design and build San Fernando Valley",
  ],
  // Behind the page's hero and on its homepage service card.
  image: {
    src: "/images/services/design-build-blueprint.jpg",
    alt: "Blueprint of a two-story house's front elevation on a drafting table, with the HB Links title block",
  },
  hero: "One team from first sketch to final walkthrough across Los Angeles and the San Fernando Valley — design, permits, and construction under one contract and one point of accountability.",
  specs: [
    { label: "Duration", value: "Varies by Project" },
    { label: "Scope", value: "Concept to Keys" },
    { label: "License", value: "B · C-10 · C-36" },
  ],
  // The Build, under the hero (ServicePage/ServiceBuild): the stages of the
  // build, each with its icon (a key in ServiceBuild's ICONS)
  build: {
    heading: ["Your Home,","Step by Step"],
    intro:
      "How a design-build project goes with us — from the first sketch to the keys.",
    steps: [
      {
        icon: "pencil",
        title: "Design",
        text: "Plans, elevations and selections are worked out with you, and priced as they change.",
      },
      {
        icon: "permit",
        title: "Permits",
        text: "The permit set and the engineering go to the city, and we answer plan check.",
      },
      {
        icon: "foundation",
        title: "Foundation",
        text: "Once it's approved, the slab is formed and poured.",
      },
      {
        icon: "frame",
        title: "Framing",
        text: "The floors are framed and sheathed, and the plumbing and electrical roughed in.",
      },
      {
        icon: "window",
        title: "Roof & Exterior",
        text: "Roofing, stucco, windows and doors close the house in.",
      },
      {
        icon: "keys",
        title: "Finishes & Keys",
        text: "Interior finishes, landscaping and lights — then the final inspection and the keys.",
      },
    ],
  },
  options: {
    // shown as cards side by side (the section's design before 11-20)
    layout: "cards",
    eyebrow: "Two Ways to Build",
    heading: ["Design-Build vs.", "Design-Bid-Build"],
    intro:
      "There are two common ways to get from an idea to a finished project. The difference is when you learn what it costs, and who answers for the problems that come up along the way.",
    items: [
      {
        title: "Design-Build",
        description:
          "One team designs and builds. Construction pricing runs alongside design, so the plans are drawn to a budget you've already seen, and buildability questions get solved on paper.",
        facts: [
          { label: "Contracts", value: "One" },
          { label: "Cost known", value: "During design" },
          { label: "Accountability", value: "One team" },
        ],
      },
      {
        title: "Design-Bid-Build",
        description:
          "An architect designs, then contractors bid on the finished plans. It's common, but cost and buildability surface late — after you've already paid for the design.",
        facts: [
          { label: "Contracts", value: "Two or more" },
          { label: "Cost known", value: "After design" },
          { label: "Accountability", value: "Split" },
        ],
      },
    ],
  },
  process: {
    closing: "One Team",
    intro:
      "Every design-build project runs the same way — feasibility, locked design and permits, coordinated build, walkthrough at handoff.",
    steps: [
      {
        label: "Discovery & Consultation",
        description:
          "We start by listening. Tell us what you want, what the property allows, and what the project needs to cost. We evaluate feasibility honestly before a dollar gets spent on design.",
      },
      {
        label: "Design & Pre-Construction",
        description:
          "Our team develops the design concept alongside your input and manages permits, approvals, and trade scheduling. Every decision gets reviewed and confirmed before construction begins.",
      },
      {
        label: "Construction",
        description:
          "One team builds the project to the approved plans. No handoff between designer and builder, no finger-pointing when something needs to change. We own it.",
      },
      {
        label: "Walkthrough & Handoff",
        description:
          "We walk the completed project with you and address every punch list item before you sign off.",
      },
    ],
  },
  estimateHeading: {
    firstLine: "One Team.",
    secondLine: "One",
    italic: "Process.",
  },
  faqTopic: "Design-Build",
  faqIntro:
    "Answers to the questions homeowners ask most before choosing design-build for a project across Los Angeles and the San Fernando Valley.",
  faqs: [
    {
      question:
        "How is design-build different from hiring an architect and contractor separately?",
      answer:
        "With separate teams, the architect's design gets handed to a contractor after the fact, and cost or buildability issues often surface late — sometimes after months of design work. Design-build keeps both under one team from the start, so those issues get resolved during planning instead.",
    },
    {
      question: "Can I use my own architect?",
      answer:
        "Yes. We collaborate with architects, engineers, and consultants you bring on, or coordinate the design work directly — whichever fits the project.",
    },
    {
      question: "What kinds of projects do you deliver as design-build?",
      answer:
        "ADUs, home additions, second stories, whole-home remodels, and kitchen and bathroom remodels. Design-build is especially useful for ADUs and additions, where permitting and buildability questions come up early and often.",
    },
    {
      question: "How much does a design-build project cost?",
      answer:
        "It depends on the project — an ADU, an addition, and a whole-home remodel price very differently. What design-build changes is when you learn the number: construction pricing runs alongside design, so you see real costs before the plans are finalized. {{Get a free on-site estimate}} for your exact number.",
    },
    {
      question: "Is design-build more expensive than traditional delivery?",
      answer:
        "Not typically. Value engineering happens earlier in the process, which tends to reduce costly changes during construction compared to a design-then-bid approach.",
    },
    {
      question: "What happens if the scope or budget changes mid-project?",
      answer:
        "Because design and construction sit under one team, scope changes get priced and scheduled in real time instead of triggering a separate negotiation with an outside contractor. You'll know the cost and schedule impact before we proceed.",
    },
  ],
  coverage: {
    heading: ["Design-Build", "Across Los Angeles"],
    description:
      "We design and build throughout Los Angeles and Ventura Counties. Free on-site estimates anywhere in our coverage zone.",
  },
  related: [
    {
      slug: "adu-builder",
      note: "ADUs are a natural fit for design-build — permits and buildability come up early and often.",
    },
    {
      slug: "home-additions",
      note: "Additions gain the most from one team — structure, permits, and budget move together.",
    },
    {
      slug: "home-remodel",
      note: "Whole-home remodels stay on budget when design and pricing happen side by side.",
    },
  ],
};

export default designBuild;
