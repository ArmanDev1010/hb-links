// Google Analytics 4 — the "HB Links" property. The Privacy Policy
// (data/legal/privacy-policy.js) describes it: keep Google Signals and ad
// personalization off, or that policy has to change first.
export const GA_ID = "G-6E8F5RD1GC";

// GA runs on the live site only, so dev and preview visits aren't counted.
export const LIVE_HOST = "hb-links.com";

// Sends a GA event. Does nothing where GA isn't loaded.
export function trackEvent(name, params) {
  window.gtag?.("event", name, params);
}
