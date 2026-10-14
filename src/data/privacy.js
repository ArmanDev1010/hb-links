// The legal pages (/terms-of-service, /privacy-policy, ...; routes in
// app/(legal)) — the footer's legal links, the sitemap, the navbar's light
// pages, and each page's switcher, title and meta description. `updated`
// (YYYY-MM-DD) is the page's "Last updated" date: change it whenever that
// page's wording changes. A new page also needs its own app/(legal) route.
// The pages' text lives in data/legal/, kept out of here so the footer
// (a client component) doesn't pull it into the browser bundle.
export const privacyPages = [
  {
    label: "Terms of Service",
    slug: "terms-of-service",
    updated: "2026-10-10",
    description:
      "The terms for using hb-links.com, the website of HB LINKS LLC, a licensed California contractor (CSLB #1144057).",
  },
  {
    label: "Privacy Policy",
    slug: "privacy-policy",
    updated: "2026-10-10",
    description:
      "What information HB LINKS LLC collects through hb-links.com and when you contact us, how we use and share it, and the choices you have.",
  },
  {
    label: "SMS Terms & Conditions",
    slug: "sms-terms",
    updated: "2026-10-10",
    description:
      "How HB LINKS LLC text messages work: what we send, how often, what it costs, and how to opt out (reply STOP) or get help (reply HELP).",
  },
  {
    label: "Disclaimer",
    slug: "disclaimer",
    updated: "2026-10-08",
    description:
      "What to keep in mind when relying on information on hb-links.com, including zoning and permit details, timelines, costs, photos, and reviews.",
  },
  {
    label: "Accessibility",
    slug: "accessibility",
    updated: "2026-10-14",
    description:
      "HB LINKS LLC's commitment to an accessible website, the standard we work toward, and how to get help if something on hb-links.com doesn't work for you.",
  },
];
