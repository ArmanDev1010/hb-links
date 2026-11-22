import { servicePageHref } from "@/lib/cities";

const garageConversion = {
  slug: "garage-conversion",
  navLabel: "Garage Conversion",
  navBlurb: "Your garage, made a legal home",
  title: "Garage Conversions",
  metaTitle: "Garage Conversion Contractor in Los Angeles, CA",
  serviceType: "Garage Conversion",
  description:
    "Garage conversions in Los Angeles — attached and detached garages turned into legal ADUs and JADUs, permitted and built by one licensed team. CSLB #1144057.",
  keywords: [
    "garage conversion Los Angeles",
    "garage conversion contractor Los Angeles",
    "garage to ADU conversion Los Angeles",
    "garage conversion ADU Los Angeles",
    "convert garage to living space Los Angeles",
    "garage conversion cost Los Angeles",
    "garage conversion San Fernando Valley",
  ],
  // Behind the page's hero and on its homepage service card: the garage
  // conversion timelapse's finished frame.
  image: {
    src: "/images/services/garage-conversion.webp",
    alt: "Detached garage converted into a white stucco ADU with a black front door, a slatted wood accent wall and a small patio",
  },
  hero: "Attached and detached garages across Los Angeles and the San Fernando Valley turned into legal ADUs and JADUs — slab, walls, utilities, and finishes permitted and built by one licensed team.",
  specs: [
    { label: "Duration", value: "2–4 Months" },
    { label: "Scope", value: "Garage to ADU / JADU" },
    { label: "License", value: "B · C-10 · C-36" },
  ],
  // The Build, under the hero (ServicePage/ServiceBuild): the stages of the
  // build, each with its icon (a key in ServiceBuild's ICONS)
  build: {
    heading: ["Your Garage,","Step by Step"],
    intro:
      "How a garage becomes a home with us — from the old door coming out to the porch light going on.",
    steps: [
      {
        icon: "measure",
        title: "The Garage, Checked",
        text: "The slab, footings, framing and roof are checked, and the route to the sewer found, before anything changes.",
      },
      {
        icon: "demo",
        title: "The Door Comes Out",
        text: "The garage door and its track come out, leaving the opening ready to be framed in.",
      },
      {
        icon: "frame",
        title: "Framed In",
        text: "The opening is framed as a finished wall, with the window and entry door where the plan puts them.",
      },
      {
        icon: "systems",
        title: "Insulated & Wired",
        text: "The walls and ceiling are insulated, new circuits and plumbing run, and the floor leveled over a vapor barrier.",
      },
      {
        icon: "window",
        title: "Stucco, Windows & Doors",
        text: "The new wall is stuccoed to match the rest, and the windows and entry door go in.",
      },
      {
        icon: "keys",
        title: "Finishes & Porch",
        text: "The kitchen, bath, floors and fixtures inside; a porch, path and planting outside — then the final inspection.",
      },
    ],
  },
  options: {
    eyebrow: "Which Garage?",
    heading: ["Four Ways to", "Convert a Garage"],
    intro:
      "What you can build depends on the garage you have — whether it stands on its own or is part of the house, and whether it's sound enough to keep. We'll tell you which fits on the site visit.",
    items: [
      {
        title: "Detached Garage to ADU",
        plan: "adu-garage",
        description:
          "The most common conversion: a freestanding garage becomes a studio or one-bedroom with its own entry, kitchen, and bathroom.",
        facts: [
          { label: "Becomes", value: "Full ADU" },
          { label: "Size", value: "Garage + up to 150 sq ft" },
          { label: "Owner on site", value: "Not required" },
        ],
      },
      {
        title: "Attached Garage to ADU",
        plan: "garage-attached-adu",
        description:
          "Shares a wall with the house but lives on its own — a separate entrance, kitchen, and bathroom, with the shared wall rebuilt as a fire-rated separation.",
        facts: [
          { label: "Becomes", value: "Full ADU" },
          { label: "Size", value: "The garage's footprint" },
          { label: "Owner on site", value: "Not required" },
        ],
      },
      {
        title: "Attached Garage to JADU",
        plan: "garage-attached-jadu",
        description:
          "A junior ADU of up to 500 sq ft inside the house's walls, with an efficiency kitchen and its own entrance. The bathroom can be its own or shared with the house.",
        facts: [
          { label: "Becomes", value: "Junior ADU" },
          { label: "Size", value: "Up to 500 sq ft" },
          { label: "Owner on site", value: "Required" },
        ],
      },
      {
        title: "Rebuild on the Footprint",
        plan: "garage-rebuild",
        description:
          "When the garage is too far gone to save, a new ADU built in the same spot and to the same dimensions keeps the garage's setbacks — even right on the property line.",
        facts: [
          { label: "Becomes", value: "New detached ADU" },
          { label: "Size", value: "Same footprint" },
          { label: "Owner on site", value: "Not required" },
        ],
        href: servicePageHref("adu-builder"),
        linkLabel: "New ADU Construction",
      },
    ],
  },
  process: {
    closing: "Every Conversion",
    intro:
      "Every garage conversion runs the same way — the garage assessed first, permits secured, a coordinated build, and a walkthrough at handoff.",
    steps: [
      {
        label: "Garage Assessment",
        description:
          "We check the slab, framing, roof, and sewer route, and confirm what your lot allows — ADU or JADU, entry location, and any hillside, fire-zone or historic-district rules. You get a real scope and budget before design starts.",
      },
      {
        label: "Design & Permits",
        description:
          "We lay out the floor plan, run structural and energy calcs, and file the permit. Every fixture and finish is confirmed before construction begins.",
      },
      {
        label: "Conversion",
        description:
          "Slab work, door infill, insulation, mechanicals, and finishes managed in sequence by our team, with one point of contact from kickoff to handoff.",
      },
      {
        label: "Inspection & Handoff",
        description:
          "Final punch list and city inspection, then we walk the finished unit with you. It's ready for family or a tenant on day one.",
      },
    ],
  },
  estimateHeading: {
    firstLine: "Ready to Convert",
    secondLine: "Your",
    italic: "Garage?",
  },
  faqTopic: "Garage Conversions",
  faqIntro:
    "Answers to the questions homeowners ask most before converting a garage across Los Angeles and the San Fernando Valley.",
  faqs: [
    {
      question: "How much does a garage conversion cost in Los Angeles?",
      answer:
        "It depends on the garage's size, the condition of the slab and framing, how far the new drains run to your sewer line, and the kitchen and bathroom you choose. A conversion usually costs less than a new detached ADU because the foundation, walls, and roof are already there. We give you a written estimate after assessing the garage, not a per-square-foot guess. {{Get a free on-site estimate}} for your exact number.",
    },
    {
      question: "How long does a garage conversion take?",
      answer:
        "Construction typically runs 2–4 months from permit issuance. Plans and permitting come first; once the application is complete, state law gives the city 60 days to approve or deny it. We lay out the full schedule before work starts.",
    },
    {
      question: "Do I need a permit to convert my garage?",
      answer:
        "Yes. A legal conversion needs a building permit — in the City of Los Angeles through LADBS, in independent cities like Calabasas through their own building department. An unpermitted conversion can't be legally rented, can surface as a problem when you sell, and may have to be torn out. We prepare the plans, submit them, and schedule every inspection.",
    },
    {
      question: "Do I have to replace the parking I lose?",
      answer:
        "No. When a garage is converted to an ADU, California law prohibits the city from requiring you to replace those parking spaces.",
    },
    {
      question: "Can I convert an attached garage?",
      answer:
        "Yes, two ways. As a full ADU, it gets its own entrance, kitchen and bathroom, and the wall it shares with the house is rebuilt as a fire-rated separation. As a junior ADU of up to 500 sq ft, it stays part of the house — it needs an efficiency kitchen and its own entrance, can share the house's bathroom, and requires the owner to live on the property.",
    },
    {
      question: "Can I rent out my converted garage?",
      answer:
        "Yes. A garage converted to an ADU can be rented, and you don't have to live on the property. A junior ADU can be rented too, but the owner has to live in the main house or the JADU. Cities can require ADU rentals to run longer than 30 days, so plan on long-term tenants rather than short-term stays.",
    },
  ],
  coverage: {
    heading: ["Garages Converted", "Across Los Angeles"],
    description:
      "We convert garages throughout Los Angeles and Ventura Counties. Free on-site estimates anywhere in our coverage zone.",
  },
  related: [
    {
      slug: "adu-builder",
      note: "No garage, or not the right spot? We'll price a new detached or attached ADU on the same site visit.",
    },
    {
      slug: "deck-and-patio",
      note: "Give the new unit an outdoor space of its own while the crew and permits are already in place.",
    },
    {
      slug: "home-remodel",
      note: "Refresh the main house at the same time — one crew, one contract, one schedule.",
    },
  ],
};

export default garageConversion;
