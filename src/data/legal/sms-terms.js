import { DocLink, EmailLink, PhoneLink } from "./links";

// Covers every item the carriers' A2P 10DLC review and the CTIA messaging
// guidelines check for: program name and description, how people opt in,
// frequency, "message and data rates may apply", STOP / HELP, the carrier
// liability line, and the privacy link. The opt-in methods under "How you
// opt in" must match what's registered for the business number's A2P
// campaign. The website's one is the estimate form's optional, unchecked
// text box (SmsConsent in components/UI/FormConsent.jsx).
const smsTerms = {
  intro: (
    <p>
      These SMS Terms &amp; Conditions apply to text messages that HB LINKS
      LLC (&ldquo;HB LINKS,&rdquo; &ldquo;we,&rdquo; or &ldquo;us&rdquo;) sends
      to customers and people who request estimates from us. By opting in to
      receive our texts, you agree to these terms.
    </p>
  ),
  sections: [
    {
      id: "program",
      heading: "What we send",
      body: (
        <>
          <p>
            <strong>Program name:</strong> HB LINKS Customer Text Messages.
          </p>
          <p>
            We send one-to-one text messages about your estimate request and
            project, including replies to your questions, estimate and
            appointment scheduling, appointment reminders, project and schedule
            updates, and customer support.
          </p>
        </>
      ),
    },
    {
      id: "opt-in",
      heading: "How you opt in",
      body: (
        <p>
          You can opt in by checking the text-message box when you request an
          estimate on our website, by asking us to text you, by saying yes when
          we ask &mdash; for example, during a call &mdash; or by texting us
          first at <PhoneLink />. Consent to receive text messages is not a condition of
          buying any goods or services from us.
        </p>
      ),
    },
    {
      id: "frequency",
      heading: "Message frequency",
      body: (
        <p>Message frequency varies depending on your request and project.</p>
      ),
    },
    {
      id: "cost",
      heading: "Cost",
      body: (
        <p>
          Message and data rates may apply. Check with your mobile carrier for
          details about your plan.
        </p>
      ),
    },
    {
      id: "opt-out",
      heading: "How to opt out",
      body: (
        <p>
          Reply <strong>STOP</strong> to any message to stop receiving texts
          from us. You&rsquo;ll get one final message confirming you&rsquo;ve
          been unsubscribed, and no more messages after that. You can also tell
          us by phone or email that you no longer want texts. If you change
          your mind later, reply <strong>START</strong> or let us know.
        </p>
      ),
    },
    {
      id: "help",
      heading: "Help",
      body: (
        <p>
          Reply <strong>HELP</strong> to any message for help, or contact us at{" "}
          <PhoneLink /> or <EmailLink />.
        </p>
      ),
    },
    {
      id: "carriers",
      heading: "Carriers",
      body: (
        <p>Mobile carriers are not liable for delayed or undelivered messages.</p>
      ),
    },
    {
      id: "eligibility",
      heading: "Your number",
      body: (
        <p>
          To opt in, you must be at least 18 and the account holder for the
          mobile number, or have the account holder&rsquo;s permission. If you
          change or give up your mobile number, please let us know or reply
          STOP from that number first, so we don&rsquo;t text its next owner.
        </p>
      ),
    },
    {
      id: "privacy",
      heading: "Privacy",
      body: (
        <p>
          We handle your mobile number and consent as described in our{" "}
          <DocLink slug="privacy-policy">Privacy Policy</DocLink>. No mobile
          information will be shared with third parties or affiliates for
          marketing or promotional purposes. Text messaging opt-in data and
          consent will not be shared with any third parties.
        </p>
      ),
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      body: (
        <p>
          We may update these SMS Terms from time to time. When we do,
          we&rsquo;ll post the new version on this page and update the
          &ldquo;Last updated&rdquo; date above. Our{" "}
          <DocLink slug="terms-of-service">Terms of Service</DocLink> also apply.
        </p>
      ),
    },
  ],
};

export default smsTerms;
