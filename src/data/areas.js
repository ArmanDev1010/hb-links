// What makes each /general-contractor-<area> page its own, keyed by area
// name (FEATURED_CITIES in lib/seo.js): a `guide` to building there
// (rendered like a service page's "Know Before You Build",
// components/ServicePage/ServiceGuide) and the area's own `faqs`, which
// replace the homepage's generic questions on its page (getHomeFAQs).
// Without them the area pages were ~81% the same text as each other and
// the homepage — near-duplicate city pages, which Google treats as doorway
// pages. Los Angeles (the homepage) has no entry.
//
// Local facts only where they're checkable: who issues permits, the city's
// hillside / fire / scenic-corridor overlays, the utility, landmarks.
export const areaContent = {
  "Woodland Hills": {
    guide: {
      eyebrow: "Building in Woodland Hills",
      heading: ["Two Kinds of", "Woodland Hills"],
      intro:
        "North and south of Ventura Boulevard are almost different places to build. Here's what changes from one side to the other — and what the whole neighborhood has in common.",
      items: [
        {
          title: "The flats north of Ventura",
          body: "Most homes north of the boulevard are single-story ranch houses on flat lots, many from the 1950s and '60s. Long backyards and detached garages make them strong candidates for a detached ADU or a garage conversion, and the flat ground keeps foundations simple.",
        },
        {
          title: "The hills south of Ventura",
          body: "South of the boulevard, lots climb into the Santa Monica Mountains. Much of that area falls under LA's Baseline Hillside Ordinance, which limits floor area and grading, and sits in a Very High Fire Hazard Severity Zone with its own construction rules. We look up your parcel on ZIMAS, the city's zoning map, before design starts.",
        },
        {
          title: "Built for Valley heat",
          body: "Woodland Hills regularly records some of the hottest summer days in Los Angeles. New space here is built to California's Title 24 energy code, and we pay extra attention to what makes it comfortable in July: insulation, glazing that cuts solar heat, and right-sized cooling — often a ductless mini-split for an ADU or garage conversion.",
        },
        {
          title: "Permits and power",
          body: "Woodland Hills is part of the City of Los Angeles, so plans go through LADBS and power comes from LADWP. When an ADU or addition needs a bigger electrical service, we coordinate the upgrade with LADWP as part of the project.",
        },
      ],
    },
    faqs: [
      {
        question: "Who issues building permits in Woodland Hills?",
        answer:
          "Woodland Hills is a neighborhood of the City of Los Angeles, not a separate city, so permits for ADUs, additions and remodels are issued by the Los Angeles Department of Building and Safety (LADBS). We prepare the plans, submit them, and respond to plan-check corrections as part of the project.",
      },
      {
        question: "Can I build an ADU on a hillside lot in Woodland Hills?",
        answer:
          "Often, yes. Hillside lots south of Ventura Boulevard usually fall under the Baseline Hillside Ordinance and the city's fire-zone rules, which affect grading, access, and materials. Slope and street access shape where an ADU can sit, so we review your parcel's designations and bring in a soils engineer early, before you pay for full design.",
      },
    ],
  },

  Encino: {
    guide: {
      eyebrow: "Building in Encino",
      heading: ["What Shapes", "an Encino Build"],
      intro:
        "Encino's larger lots open up options the rest of the Valley doesn't always have — and its hills add rules worth knowing before you plan.",
      items: [
        {
          title: "Room for more",
          body: "Many Encino lots, especially south of Ventura Boulevard, are large enough for a detached ADU of up to 1,200 sq ft without crowding the yard — or for a ground-floor addition instead of a second story. We measure what your lot allows before you settle on either.",
        },
        {
          title: "Hillside lots and soils reports",
          body: "Hillside parcels fall under LA's Baseline Hillside Ordinance, and many sit in a Very High Fire Hazard Severity Zone. New foundations and grading on a slope usually need a geology and soils report reviewed by LADBS, so we bring in a geotechnical engineer at the start rather than after plan check asks for one.",
        },
        {
          title: "Protected trees",
          body: "Los Angeles protects native oaks, western sycamores, Southern California black walnuts and California bay laurels, and Encino's older properties have plenty of them. Building near a protected tree needs a plan for its roots and canopy, and removing one needs a city permit — so we map trees on the site survey, before the footprint is drawn.",
        },
        {
          title: "Permits and power",
          body: "Encino is part of the City of Los Angeles: plans go through LADBS and power comes from LADWP. We file both and schedule every inspection.",
        },
      ],
    },
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
    guide: {
      eyebrow: "Building in Tarzana",
      heading: ["Planning a", "Tarzana Project"],
      intro:
        "Tarzana's flats are some of the easiest lots in the Valley to build an ADU on; its hillside streets take more planning. Here's what we look at.",
      items: [
        {
          title: "Ranch lots ready for an ADU",
          body: "North of Ventura Boulevard, Tarzana is mostly single-story ranch homes on flat lots, often with a detached garage and a deep backyard. That's the classic setup for a detached ADU or a garage conversion — and in the City of Los Angeles a detached ADU can be up to 1,200 sq ft.",
        },
        {
          title: "Hillside streets and site access",
          body: "South of the boulevard, narrow, winding streets make deliveries part of the plan: where the dumpster goes, how concrete reaches the forms, where the crew parks. We plan the site logistics before construction and arrange any street-use permits the city requires.",
        },
        {
          title: "Hillside and fire-zone rules",
          body: "Hillside lots fall under the Baseline Hillside Ordinance, and many are in a Very High Fire Hazard Severity Zone, where new construction needs ignition-resistant materials and ember-resistant vents. We check your parcel's designations before design.",
        },
      ],
    },
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
    guide: {
      eyebrow: "Building in Calabasas",
      heading: ["Calabasas Runs", "Its Own Review"],
      intro:
        "Calabasas isn't part of the City of Los Angeles, and that changes who reviews your plans and which rules apply on top of state ADU law.",
      items: [
        {
          title: "Its own city, its own permits",
          body: "Calabasas incorporated in 1991 and reviews its own projects — plans go to the City of Calabasas, not LADBS. State ADU law still applies, but the city's municipal code sets the local standards, so we design to Calabasas' rules from the first sketch.",
        },
        {
          title: "HOAs and architectural review",
          body: "Many Calabasas neighborhoods have a homeowners association with an architectural committee. California Civil Code §4751 keeps HOAs from banning ADUs on single-family lots, but they can set reasonable design standards — so we prepare the HOA submittal alongside the city's.",
        },
        {
          title: "Fire-zone construction",
          body: "Much of Calabasas lies in a Very High Fire Hazard Severity Zone, where California's wildfire building code applies: a Class A roof, ember-resistant vents, ignition-resistant siding and decking, and multi-pane windows with tempered glass. It shapes material choices and budget, so we spec it from day one.",
        },
        {
          title: "Oak trees",
          body: "Calabasas protects its oak trees, and building near one takes a city permit and a protection plan. We map the trees on the site survey and work the footprint around them where we can.",
        },
      ],
    },
    faqs: [
      {
        question: "Who approves an ADU or addition in Calabasas?",
        answer:
          "Calabasas is an independent city, so plans are reviewed and permitted by the City of Calabasas — not LADBS. If your home is in an HOA, its architectural committee reviews the design too; California law (Civil Code §4751) prevents HOAs from banning ADUs, but they can still set reasonable design standards. We handle both submittals.",
      },
      {
        question: "What do fire-zone rules mean for a project in Calabasas?",
        answer:
          "In a Very High Fire Hazard Severity Zone, new construction follows California's wildfire building code: a Class A roof, ember-resistant vents, ignition-resistant exterior walls and decking, and windows with at least one tempered pane. It affects which materials we specify and what they cost, so it's in the estimate from the start.",
      },
    ],
  },

  "Canoga Park": {
    guide: {
      eyebrow: "Building in Canoga Park",
      heading: ["Made for", "Garage Conversions"],
      intro:
        "Canoga Park's post-war streets have exactly what an ADU needs: flat ground, deep lots, and a garage at the back. Here's what we plan around.",
      items: [
        {
          title: "The garage at the back of the lot",
          body: "Many Canoga Park homes have a detached garage behind the house, reached by a long driveway — the classic garage-conversion setup. The driveway becomes the ADU's private entrance, and state law means the parking you give up doesn't have to be replaced.",
        },
        {
          title: "Flat lots, simpler foundations",
          body: "Most of Canoga Park sits on flat ground outside the hillside ordinance, so a new detached ADU usually goes on a straightforward slab without the grading, soils work and access planning a hillside lot needs.",
        },
        {
          title: "Power for a second home",
          body: "Houses from the 1950s and '60s often run on a 100-amp electrical service or less, which won't carry a second kitchen and its own heating and cooling. We size the load early and coordinate a panel or service upgrade with LADWP as part of the project.",
        },
      ],
    },
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
    guide: {
      eyebrow: "Building in Sherman Oaks",
      heading: ["Building Up in", "Sherman Oaks"],
      intro:
        "Land in Sherman Oaks is some of the most valuable in the Valley, which changes how homeowners add space — and the hills to the south add their own review.",
      items: [
        {
          title: "Up instead of out",
          body: "On a smaller lot, a second story adds bedrooms without giving up the yard. A structural engineer checks whether the existing foundation and framing can carry it — older homes sometimes need foundation work first — and the design has to fit LA's floor-area limits and the encroachment plane that slopes the allowed height in from the side property lines.",
        },
        {
          title: "Hillside lots south of Ventura",
          body: "The streets climbing toward Mulholland fall under the Baseline Hillside Ordinance, and many are in a Very High Fire Hazard Severity Zone. Grading, retaining walls and fire-rated materials can be a real part of a hillside budget, so we price them up front.",
        },
        {
          title: "The Mulholland Scenic Parkway",
          body: "Properties near Mulholland Drive can fall within the Mulholland Scenic Parkway Specific Plan, which adds design review for new construction and additions. We check your parcel on ZIMAS before design, so that review is planned for rather than discovered.",
        },
      ],
    },
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
    guide: {
      eyebrow: "Building in Reseda",
      heading: ["Building on", "Reseda's Flats"],
      intro:
        "Reseda is flat, central and full of post-war homes — straightforward lots for new space, and older houses worth bringing up to date while the crew is there.",
      items: [
        {
          title: "Room behind the house",
          body: "Typical Reseda lots are flat with a backyard deep enough for a detached ADU, outside the hillside ordinance's limits. That keeps foundations simple and leaves the choice of size and layout mostly to you and the 1,200 sq ft cap the city allows.",
        },
        {
          title: "An ADU as a rental",
          body: "Under California law you can rent an ADU long-term while living in the main house — or rent both — and the city can't require you to live on site. A separate entrance, its own laundry, and a little outdoor space make a unit easier to rent; we plan for them from the start.",
        },
        {
          title: "Earthquake country",
          body: "The 1994 Northridge earthquake was centered in Reseda. Raised-foundation homes built before modern codes often lack foundation bolts and braced cripple walls, and a remodel or ADU project is a good time to add them — California's Earthquake Brace + Bolt program offers grants for the retrofit in many ZIP codes.",
        },
      ],
    },
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
    guide: {
      eyebrow: "Building in Northridge",
      heading: ["Two Units,", "One Northridge Lot"],
      intro:
        "On a single-family lot, California allows an ADU and a junior ADU together. Northridge's lot sizes make that combination unusually practical.",
      items: [
        {
          title: "An ADU and a JADU together",
          body: "State law lets a single-family lot have one ADU plus one junior ADU of up to 500 sq ft carved out of the house. Built together, they share one design, one permit process and one crew — the ADU as a rental, the JADU for family or a second tenant. A JADU does require the owner to live on the property.",
        },
        {
          title: "Near CSUN",
          body: "Homes near California State University, Northridge sit close to a large campus of students, faculty and staff. If you're building to rent, we'll talk through layouts that suit long-term tenants — separate entrances, private outdoor space, and laundry in the unit.",
        },
        {
          title: "Older homes, current code",
          body: "Much of Northridge was built in the decades after World War II, and many homes have had partial repairs and updates since. When we open walls for a remodel or tie in an addition, we check the wiring, plumbing and foundation connections, and tell you what we find before we continue.",
        },
      ],
    },
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
