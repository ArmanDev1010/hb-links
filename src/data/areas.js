// One local FAQ per /home-builder-<area> page, keyed by area name
// (FEATURED_CITIES in lib/seo.js). It's added to that page's FAQ section and
// FAQPage schema (getHomeFAQs), so each area page answers a question no
// other area page does. Los Angeles (the homepage) has no entry.
export const areaFAQs = {
  "Woodland Hills": {
    question: "Who issues building permits in Woodland Hills?",
    answer:
      "Woodland Hills is a neighborhood of the City of Los Angeles, not a separate city, so permits for ADUs, additions and remodels are issued by the Los Angeles Department of Building and Safety (LADBS). We prepare the plans, submit them, and respond to plan-check corrections as part of the project.",
  },

  Encino: {
    question: "Can you build on a hillside lot in Encino?",
    answer:
      "Yes. Hillside lots in Encino fall under LA's Baseline Hillside Ordinance, which limits floor area and grading, and many also sit in a Very High Fire Hazard Severity Zone with added fire-safety requirements. We review your parcel's designations and bring in a soils engineer early, so you know what's buildable before paying for full design.",
  },

  Tarzana: {
    question: "How big can an ADU be in Tarzana?",
    answer:
      "Tarzana is part of the City of Los Angeles, where a detached ADU can be up to 1,200 square feet. State law also guarantees most single-family lots at least an 800 sq ft ADU with 4-foot side and rear setbacks, regardless of lot-coverage limits. Your lot's size, slope and existing structures set the real number, which we confirm on site.",
  },

  Calabasas: {
    question: "Who approves an ADU or addition in Calabasas?",
    answer:
      "Calabasas is an independent city, so plans are reviewed and permitted by the City of Calabasas — not LADBS. If your home is in an HOA, its architectural committee reviews the design too; California law (Civil Code §4751) prevents HOAs from banning ADUs, but they can still set reasonable design standards. We handle both submittals.",
  },

  "Canoga Park": {
    question: "Can I convert my garage into an ADU in Canoga Park?",
    answer:
      "In most cases, yes. A converted garage has to meet current code for living space — insulation, egress windows, electrical, plumbing, and sometimes foundation work — but state law doesn't require you to replace the parking you lose. We evaluate the existing slab and framing first, so the estimate reflects what your garage actually needs.",
  },

  "Sherman Oaks": {
    question: "Can I add a second story to my home in Sherman Oaks?",
    answer:
      "Often, yes. A structural engineer first checks whether the existing foundation and framing can carry the new load — older homes sometimes need foundation upgrades — and we confirm the addition fits LA's floor-area and height limits for your lot. Then we design it, permit it through LADBS, and build it.",
  },

  Reseda: {
    question: "Can I rent out an ADU in Reseda?",
    answer:
      "Yes. Under California law, cities can't require you to live on the property to rent an ADU, so you can rent the unit long-term while living in the main house — or rent both. Cities can require ADU rentals to run longer than 30 days, so plan on long-term tenants rather than short-term stays.",
  },

  Northridge: {
    question: "Can I build both an ADU and a JADU on my Northridge lot?",
    answer:
      "Usually, yes. California law allows a single-family lot to have one ADU plus one junior ADU (up to 500 sq ft, carved out of the existing house). On larger Northridge lots that combination works well — the ADU as a rental, the JADU for family or another tenant (a JADU does require the owner to live on the property). We confirm what your lot supports during the site visit.",
  },
};
