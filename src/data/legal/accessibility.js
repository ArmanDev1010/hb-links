import { EmailLink, ExternalLink, PhoneLink } from "./links";

// Only list measures that are actually in place — an accessibility
// statement that overstates conformance is worse than none. "What we've
// done" maps to: wrapped <label>s on the form fields (EstimateForm), the
// reduced-motion handling (MotionPreferences, RotatingWord, globals.css, and
// the calmer versions in HeroBuildSequence and Reviews),
// and alt text on every image.
const accessibility = {
  intro: (
    <p>
      HB LINKS LLC wants everyone, including people with disabilities, to be
      able to use hb-links.com (the &ldquo;Site&rdquo;) and reach us easily.
    </p>
  ),
  sections: [
    {
      id: "standard",
      heading: "Our standard",
      body: (
        <p>
          We&rsquo;re working to make the Site conform to the{" "}
          <ExternalLink href="https://www.w3.org/TR/WCAG21/">
            Web Content Accessibility Guidelines (WCAG) 2.1
          </ExternalLink>
          , Level AA. These guidelines explain how to make web content more
          usable for people who are blind or have low vision, are deaf or hard
          of hearing, or have mobility, cognitive, or other disabilities. The
          Site may not yet fully meet every guideline, and we keep improving it.
        </p>
      ),
    },
    {
      id: "measures",
      heading: "What we’ve done",
      body: (
        <ul>
          <li>Labeled form fields so screen readers announce them correctly.</li>
          <li>Added text alternatives to images.</li>
          <li>
            Respected your device&rsquo;s &ldquo;reduce motion&rdquo; setting
            by turning off or toning down sliding and rotating animations.
          </li>
          <li>
            Offered phone and email as alternatives to the online form.
          </li>
          <li>
            Reviewed new pages and features for accessibility as we build them.
          </li>
        </ul>
      ),
    },
    {
      id: "limitations",
      heading: "Known limitations",
      body: (
        <>
          <p>
            Some content, such as Google Maps and Instagram, is provided by
            other companies and is outside our control.
          </p>
          <p>
            If anything on the Site gets in your way, including the form, call
            us at <PhoneLink /> or email <EmailLink /> and we&rsquo;ll take
            your request directly.
          </p>
        </>
      ),
    },
    {
      id: "feedback",
      heading: "Feedback and help",
      body: (
        <p>
          If you have trouble using any part of the Site, or ideas for making it
          more accessible, contact us at <PhoneLink /> or <EmailLink />. Please
          tell us which page you were on and what went wrong. We aim to respond
          within two business days.
        </p>
      ),
    },
  ],
};

export default accessibility;
