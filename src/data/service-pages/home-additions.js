import { servicePageHref } from "@/lib/cities";

const homeAdditions = {
  slug: "home-additions",
  navLabel: "Home Additions",
  navBlurb: "Room additions and second stories",
  title: "Home Additions",
  metaTitle: "Home Addition Contractor in Los Angeles, CA",
  serviceType: "Home Additions",
  description:
    "Home additions in Los Angeles — room additions, second stories, and primary suites, engineered, permitted, and built by one licensed team. CSLB #1144057.",
  keywords: [
    "home addition contractor Los Angeles",
    "room addition Los Angeles",
    "second story addition Los Angeles",
    "home addition cost Los Angeles",
    "house addition San Fernando Valley",
  ],
  // Behind the page's hero and on its homepage service card.
  image: {
    src: "/images/services/home-additions.png",
    alt: "Sunroom addition with a vaulted ceiling and skylights, a fireplace wall, a row of black-framed windows and bifold glass doors into the house",
  },
  hero: "Room additions, second stories, and primary suites across Los Angeles and the San Fernando Valley — engineered, permitted, and built to look like they were always part of the house.",
  specs: [
    { label: "Duration", value: "3–9 Months" },
    { label: "Scope", value: "Foundation to Finish" },
    { label: "License", value: "B · C-10 · C-36" },
  ],
  included: {
    heading: ["More Space", "Built to Match"],
    intro:
      "A home addition through HB Links adds the space you need and ties it into the house so it looks original. Engineering, permits, structure, and finishes — one team, one contract.",
    items: [
      {
        title: "Site Assessment",
        description:
          "Lot survey, setback and floor-area analysis, and a structural review of the existing house before design starts.",
      },
      {
        title: "Permits & Engineering",
        description:
          "Structural engineering, Title 24 energy calcs, and permit review handled with LADBS. No third-party expediter.",
      },
      {
        title: "Foundation & Framing",
        description:
          "New footings, framing, and roof tied into the existing structure. Second stories get the first floor reinforced to carry the load.",
      },
      {
        title: "Mechanical",
        description:
          "Electrical, plumbing, and HVAC extended into the new space and brought up to code. Concealed routing, clean transitions, no patchwork.",
      },
      {
        title: "Envelope",
        description:
          "Roofline, stucco or siding, windows, and doors matched to the existing house. Weather-tight before interior work begins.",
      },
      {
        title: "Walkthrough",
        description:
          "Final review, city inspection, and punch list before handover. Every item addressed before you sign off.",
      },
    ],
  },
  options: {
    eyebrow: "Out, Up, or Separate?",
    heading: ["Three Ways to", "Add Space"],
    intro:
      "More room can come from building out, building up, or building a separate unit. Which one fits depends on your lot, your budget, and whether the space needs to be part of the house.",
    items: [
      {
        title: "Room Addition",
        description:
          "Builds out from the house on a new foundation — an extra bedroom, a bigger kitchen or family room, or a primary suite, tied in to look original.",
        facts: [
          { label: "Builds", value: "Out, ground floor" },
          { label: "Construction", value: "3–6 months" },
          { label: "Yard space", value: "Needed" },
        ],
      },
      {
        title: "Second-Story Addition",
        description:
          "Builds up over the existing house and keeps the yard. An engineer checks the first floor's foundation and framing, which often need reinforcing to carry it.",
        facts: [
          { label: "Builds", value: "Up, over the house" },
          { label: "Construction", value: "5–9 months" },
          { label: "Yard space", value: "None" },
        ],
      },
      {
        title: "ADU Instead",
        description:
          "A separate unit with its own entrance, kitchen, and bathroom. It can be rented, and state ADU rules often allow one where an addition wouldn't fit.",
        facts: [
          { label: "Builds", value: "A separate unit" },
          { label: "Construction", value: "2–8 months" },
          { label: "Yard space", value: "Backyard or garage" },
        ],
        href: servicePageHref("adu-builder"),
        linkLabel: "ADU Construction",
      },
    ],
  },
  process: {
    closing: "Every Addition",
    intro:
      "Every home addition runs the same way — clear estimate, permits secured, coordinated build, walkthrough at handoff.",
    steps: [
      {
        label: "Consultation & Feasibility",
        description:
          "We walk the property and check your project against setbacks, floor-area limits, and what the existing structure can carry. You get a real scope and budget before design starts.",
      },
      {
        label: "Design & Permits",
        description:
          "We finalize plans, run structural and energy calcs, and file permits with the city. Every fixture and finish confirmed before construction begins.",
      },
      {
        label: "Construction & Coordination",
        description:
          "Foundation, framing, tie-in, mechanicals, and finishes managed in sequence by our team. One point of contact throughout.",
      },
      {
        label: "Walkthrough & Handoff",
        description:
          "Final punch list and city inspection, then we walk the new space with you room by room before handover.",
      },
    ],
  },
  guide: {
    eyebrow: "Know Before You Add On",
    heading: ["What Shapes", "an LA Addition"],
    intro:
      "An addition is part of the house, so it plays by the house's rules — not the relaxed ones state law gives ADUs. These are the questions we answer before design starts.",
    items: [
      {
        title: "How much you can add",
        body: "In the City of Los Angeles' single-family zones, the Baseline Mansionization Ordinance caps a home's total floor area relative to the size of the lot, and hillside lots fall under the Baseline Hillside Ordinance instead. Your existing house counts against that cap, so the first step is measuring how much of it you've already used. Independent cities like Calabasas set their own limits.",
      },
      {
        title: "Setbacks and height",
        body: "An addition has to meet your zone's front, side, and rear setbacks and its height limit. For second stories, many Los Angeles neighborhoods also have an encroachment plane that limits how tall walls can rise near the side property lines — it shapes the roofline as much as the floor plan does.",
      },
      {
        title: "Can the house carry it?",
        body: "A structural engineer checks the existing foundation and framing before design. Older Los Angeles homes on raised foundations sometimes need new footings, shear walls, or hold-downs — and a second story almost always needs part of the first floor reinforced. Finding that out early keeps it out of change orders.",
      },
      {
        title: "Tying in to the house",
        body: "The tie-in — where the new structure meets the old — is where an addition succeeds or fails visually. We match the roofline, stucco or siding, windows, and floor heights so the addition looks like it was always there. It's also the most disruptive phase, so we schedule it with you.",
      },
      {
        title: "What the addition updates in the rest of the house",
        body: "A permitted addition brings some of the existing house up to current code: California requires smoke and carbon monoxide alarms throughout the home, the extra load often calls for an electrical panel upgrade, and the new space needs its own Title 24 energy calculations. We include all of it in the estimate, not as a surprise later.",
      },
      {
        title: "Property tax",
        body: "Only the addition is assessed. Under California's property tax rules, the new construction's value is added to your existing assessment — the rest of the house keeps its current base.",
      },
    ],
  },
  estimateHeading: {
    firstLine: "Ready to Expand",
    secondLine: "Your",
    italic: "Home?",
  },
  faqTopic: "Home Additions",
  faqIntro:
    "Answers to the questions homeowners ask most before building a home addition across Los Angeles and the San Fernando Valley.",
  faqs: [
    {
      question: "How much does a home addition cost in Los Angeles?",
      answer:
        "It depends on square footage, whether you're building out or up, the foundation and structural work involved, and finish level. Second stories often cost more per square foot than ground-floor additions because the existing structure may need reinforcing. We provide a written estimate after the site and structural review. {{Get a free on-site estimate}} for your exact number.",
    },
    {
      question: "How long does a home addition take?",
      answer:
        "Construction typically runs 3–6 months for a room addition and 5–9 months for a second story, depending on scope. Design, engineering, and permitting come first — we lay out the full schedule before work begins.",
    },
    {
      question: "Can I add a second story to my house?",
      answer:
        "Often, yes. A structural engineer first checks whether the existing foundation and framing can carry the new load — older homes sometimes need foundation upgrades — and we confirm the addition fits LA's floor-area and height limits for your lot.",
    },
    {
      question: "Should I build an addition or an ADU?",
      answer:
        "An addition expands your existing home — more bedrooms, a bigger kitchen, a primary suite. An ADU is a separate unit with its own entrance, kitchen, and bathroom that you can rent or use for family, and it often benefits from state rules that relax size and setback limits. We'll walk through both options during the consultation.",
    },
    {
      question: "Can we live at home during construction?",
      answer:
        "Usually, yes. Most of the work happens outside the existing footprint until the tie-in, when there's some disruption where the addition connects. Second-story additions are more disruptive, and some families move out for part of that project. We plan the phases with you up front.",
    },
    {
      question: "Do I need a permit for a home addition?",
      answer:
        "Yes. Every addition needs a building permit, structural plans, and Title 24 energy compliance. In the City of Los Angeles, plans go through LADBS; Calabasas and other independent cities run their own review. We handle the full submission.",
    },
  ],
  coverage: {
    heading: ["Home Additions", "Across Los Angeles"],
    description:
      "We build home additions throughout Los Angeles County. Free on-site estimates anywhere in our coverage zone.",
  },
  related: [
    {
      slug: "adu-builder",
      note: "If the new space needs its own entrance and kitchen, an ADU may be the better fit — and rentable.",
    },
    {
      slug: "home-remodel",
      note: "Remodel the existing rooms while the addition ties in — one disruption instead of two.",
    },
    {
      slug: "design-build",
      note: "Additions run smoother design-build: engineering, permits, and pricing settled together.",
    },
  ],
};

export default homeAdditions;
