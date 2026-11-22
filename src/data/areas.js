// What makes each /general-contractor-<area> page its own, keyed by area
// name (FEATURED_CITIES in lib/seo.js): the area's own `faqs`, which replace
// the homepage's generic questions on its page (getHomeFAQs). Los Angeles
// (the homepage) has no entry.
//
// Local facts only where they're checkable (11-20: the user had the permit
// and power facts taken off these pages, with the local notes and the before
// and after).
export const areaContent = {
  "Woodland Hills": {
    faqs: [
      {
        question: "How do you keep a new ADU cool in Woodland Hills summers?",
        answer:
          "Woodland Hills regularly records some of the hottest summer days in Los Angeles. New living space is built to California's Title 24 energy code, and we pay extra attention to what keeps it comfortable in July: insulation, glazing that cuts solar heat, and right-sized cooling — often a ductless mini-split for an ADU or garage conversion.",
      },
      {
        question: "Can I build an ADU on a hillside lot in Woodland Hills?",
        answer:
          "Often, yes. Hillside lots south of Ventura Boulevard usually fall under the Baseline Hillside Ordinance and the city's fire-zone rules, which affect grading, access, and materials. Slope and street access shape where an ADU can sit, so we review your parcel's designations and bring in a soils engineer early, before you pay for full design.",
      },
    ],
  },

  Encino: {
    faqs: [
      {
        question: "Can you build on a hillside lot in Encino?",
        answer:
          "Yes. Hillside lots in Encino fall under LA's Baseline Hillside Ordinance, which limits floor area and grading, and many also sit in a Very High Fire Hazard Severity Zone with added fire-safety requirements. We review your parcel's designations and bring in a soils engineer early, so you know what's buildable before paying for full design.",
      },
      {
        question: "What if there's an oak tree where I want to build?",
        answer:
          "Native oaks are protected in Los Angeles, along with western sycamores, Southern California black walnuts and California bay laurels. Work near one needs a plan to protect its roots and canopy, and removing one requires a city permit and usually replacement trees. Often the better answer is to shift or reshape the footprint — we look at that first.",
      },
    ],
  },

  Tarzana: {
    faqs: [
      {
        question: "How big can an ADU be in Tarzana?",
        answer:
          "Tarzana is part of the City of Los Angeles, where a detached ADU can be up to 1,200 square feet. State law also guarantees most single-family lots at least an 800 sq ft ADU with 4-foot side and rear setbacks, regardless of lot-coverage limits. Your lot's size, slope and existing structures set the real number, which we confirm on site.",
      },
      {
        question: "Can you build on a narrow hillside street in Tarzana?",
        answer:
          "Yes — it just takes more planning. We schedule deliveries around the street, size equipment to fit, use a concrete pump where a truck can't reach, and arrange any street-use permits the city requires for staging in the road. You'll know the plan, and what it costs, before work starts.",
      },
    ],
  },

  Calabasas: {
    faqs: [
      {
        question: "Does my HOA have to approve an ADU in Calabasas?",
        answer:
          "If your home is in an HOA, its architectural committee reviews the design. California law (Civil Code §4751) keeps HOAs from banning ADUs on single-family lots, but they can set reasonable design standards — so we design the unit to match the house and prepare the HOA submittal alongside the rest of the plans.",
      },
      {
        question: "What do fire-zone rules mean for a project in Calabasas?",
        answer:
          "In a Very High Fire Hazard Severity Zone, new construction follows California's wildfire building code: a Class A roof, ember-resistant vents, ignition-resistant exterior walls and decking, and windows with at least one tempered pane. It affects which materials we specify and what they cost, so it's in the estimate from the start.",
      },
    ],
  },

  "Canoga Park": {
    faqs: [
      {
        question: "Can I convert my garage into an ADU in Canoga Park?",
        answer:
          "In most cases, yes. A converted garage has to meet current code for living space — insulation, egress windows, electrical, plumbing, and sometimes foundation work — but state law doesn't require you to replace the parking you lose. We evaluate the existing slab and framing first, so the estimate reflects what your garage actually needs.",
      },
      {
        question: "Will I need an electrical upgrade to add an ADU?",
        answer:
          "Often, in an older Canoga Park home. An ADU adds a kitchen, a bathroom, and heating and cooling, and a 100-amp service usually can't carry both units. We run a load calculation during design, and if the house needs a bigger panel or service, we handle the upgrade and the LADWP coordination as part of the project.",
      },
    ],
  },

  "Sherman Oaks": {
    faqs: [
      {
        question: "Can I add a second story to my home in Sherman Oaks?",
        answer:
          "Often, yes. A structural engineer first checks whether the existing foundation and framing can carry the new load — older homes sometimes need foundation upgrades — and we confirm the addition fits LA's floor-area and height limits for your lot. Then we design it, permit it through LADBS, and build it.",
      },
      {
        question: "Does building near Mulholland Drive need extra approval?",
        answer:
          "It can. Parcels within the Mulholland Scenic Parkway Specific Plan go through an added design review for new construction and many additions, on top of the usual LADBS permit. We look up your parcel's designations before design and build the review into the schedule.",
      },
    ],
  },

  Reseda: {
    faqs: [
      {
        question: "Can I rent out an ADU in Reseda?",
        answer:
          "Yes. Under California law, cities can't require you to live on the property to rent an ADU, so you can rent the unit long-term while living in the main house — or rent both. Cities can require ADU rentals to run longer than 30 days, so plan on long-term tenants rather than short-term stays.",
      },
      {
        question: "Should I retrofit my foundation while I'm remodeling?",
        answer:
          "If your Reseda home sits on a raised foundation and was built before modern seismic codes, it's worth checking. Bolting the house to its foundation and bracing the cripple walls is a modest add-on while a crew is already on site, and the state's Earthquake Brace + Bolt program offers grants for it in many ZIP codes.",
      },
    ],
  },

  Northridge: {
    faqs: [
      {
        question: "Can I build both an ADU and a JADU on my Northridge lot?",
        answer:
          "Usually, yes. California law allows a single-family lot to have one ADU plus one junior ADU (up to 500 sq ft, carved out of the existing house). On larger Northridge lots that combination works well — the ADU as a rental, the JADU for family or another tenant (a JADU does require the owner to live on the property). We confirm what your lot supports during the site visit.",
      },
      {
        question: "Is it cheaper to build an ADU and a JADU at the same time?",
        answer:
          "Building them together usually costs less than building them separately: one set of plans, one permit process, one mobilization, and trades who do both units' plumbing and electrical in the same visits. We price both together and separately, so you can see the difference.",
      },
    ],
  },
};
