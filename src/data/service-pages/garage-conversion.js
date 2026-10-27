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
  included: {
    heading: ["Garage to Home", "One Contract"],
    intro:
      "A garage conversion through HB Links takes the structure you already have and makes it a legal, comfortable place to live — from the slab and the old garage door to the kitchen, bath, and final inspection.",
    items: [
      {
        title: "Garage Assessment",
        description:
          "Slab, footings, framing, roof, and the route to your sewer line checked before design, so the estimate reflects what your garage actually needs.",
      },
      {
        title: "Plans & Permits",
        description:
          "Floor plan, structural and Title 24 energy calcs, and the permit filed with LADBS or your city. We answer plan-check corrections ourselves.",
      },
      {
        title: "Slab & Moisture",
        description:
          "The sloped garage slab leveled and sealed with a moisture barrier, or new footings where the old ones fall short of code.",
      },
      {
        title: "Door Infill & Windows",
        description:
          "The garage door opening framed in as a finished wall with windows and an entry door, plus code-compliant egress in every bedroom.",
      },
      {
        title: "Insulation & Mechanicals",
        description:
          "Insulated walls and ceiling, heating and cooling, new circuits, and supply and drain lines tied into the house's water and sewer.",
      },
      {
        title: "Kitchen, Bath & Finishes",
        description:
          "Kitchen, bathroom, flooring, and fixtures installed, then the final inspection. Ready to live in or rent the day it's signed off.",
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
  guide: {
    eyebrow: "Know Before You Convert",
    heading: ["From Garage to", "Legal Living Space"],
    intro:
      "California law makes garage conversions easier than most people expect — and a garage still needs real work to pass as a home. Here's what changes and what the rules say.",
    items: [
      {
        title: "You don't have to replace the parking",
        body: "When a garage is converted to an ADU, or torn down to build one, state law bars the city from making you replace those parking spaces. That rule is what turns most Los Angeles garages into candidates for a conversion.",
      },
      {
        title: "Existing setbacks stay as they are",
        body: "A new ADU generally sits at least 4 feet from the side and rear property lines, but a garage you convert doesn't have to — even one built right on the line. A detached garage can also grow by up to 150 sq ft to make room for an entry. The same exemption covers a new structure built in the same location and to the same dimensions as the old garage.",
      },
      {
        title: "The slab and foundation",
        body: "Garage slabs slope toward the door and usually have no moisture barrier under them. We check the slab for level, cracks and moisture, and the footings for depth, then fix what's needed — leveling, a vapor barrier, a raised floor, or new footings where the old ones fall short.",
      },
      {
        title: "Walls, windows and the garage door",
        body: "The garage door opening is framed in as a finished exterior wall, usually with windows or the new entry door. Bedrooms need an egress window big enough to climb out of, and habitable rooms need at least a 7-foot ceiling — which most garages have, once the floor is built up.",
      },
      {
        title: "Insulation, comfort and Title 24",
        body: [
          "A converted garage becomes conditioned living space, so it has to meet California's Title 24 energy code: insulated walls and ceiling, energy-rated windows, and heating and cooling — often a ductless mini-split.",
          "New detached ADUs generally have to include solar panels under the same code. Conversions of an existing garage generally don't, which is one more way a conversion saves money over building new.",
        ],
      },
      {
        title: "Plumbing, sewer and power",
        body: "The new kitchen and bathroom drain to your existing sewer line. If the garage sits lower than the line, a pump may be needed — we find that out at the assessment, not mid-build. Most conversions need new circuits and some need a panel upgrade. For a conversion inside an existing structure, the city generally can't require a new or separate utility connection.",
      },
      {
        title: "Fees and permit review",
        body: "ADUs under 750 sq ft are exempt from impact fees, which covers most garage conversions. Once your application is complete, state law gives the city 60 days to approve or deny it.",
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
      "We convert garages throughout Los Angeles County. Free on-site estimates anywhere in our coverage zone.",
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
