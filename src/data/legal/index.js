import termsOfService from "./terms-of-service";
import privacyPolicy from "./privacy-policy";
import smsTerms from "./sms-terms";
import disclaimer from "./disclaimer";
import accessibility from "./accessibility";

// Each legal page's text, keyed by the slugs in data/privacy.js.
// A document is an `intro` plus numbered `sections` ({ id, heading, body });
// each section's id is its anchor in the page's "On this page" list.
export const legalDocuments = {
  "terms-of-service": termsOfService,
  "privacy-policy": privacyPolicy,
  "sms-terms": smsTerms,
  disclaimer,
  accessibility,
};
