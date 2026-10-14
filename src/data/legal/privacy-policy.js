import { DocLink, ExternalLink } from "./links";

// Must stay true to what the site actually does. Update it whenever a form
// field, vendor, or tracking script is added or removed — in particular:
// - Service providers are named by category (website host, phone and text
//   messaging provider, email provider). Google is named because the
//   Google Analytics terms require it.
// - "We don't sell or share for cross-context behavioral advertising" holds
//   only while Google Analytics runs without Google Signals or ads
//   personalization. Turning those on, or adding an ad pixel, means this
//   policy (and likely a consent banner) has to change first.
// - The two sentences about mobile information in "Text messages" are the
//   wording the carriers' A2P 10DLC reviewers look for — keep them verbatim.
const privacyPolicy = {
  intro: (
    <p>
      This Privacy Policy explains what information HB LINKS LLC (&ldquo;HB
      LINKS,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
      collects through hb-links.com (the &ldquo;Site&rdquo;) and when you
      communicate with us, how we use and share it, and the choices you have.
    </p>
  ),
  sections: [
    {
      id: "information-we-collect",
      heading: "Information we collect",
      body: (
        <>
          <h3>Information you give us</h3>
          <p>When you request an estimate or contact us, we collect:</p>
          <ul>
            <li>
              <strong>Contact details</strong> &mdash; your name, phone number,
              and email address.
            </li>
            <li>
              <strong>Project details</strong> &mdash; your property address or
              general location, project type, and anything else you choose to
              tell us.
            </li>
            <li>
              <strong>Communications</strong> &mdash; records of the calls,
              texts, and emails you exchange with us.
            </li>
          </ul>
          <p>
            If you hire us, we also collect the information needed to perform
            and bill for the work, such as property and permit details, site
            photos and measurements, and payment information.
          </p>
          <h3>Information collected automatically</h3>
          <p>
            When you visit the Site, we and our service providers automatically
            collect technical information, such as your IP address, browser and
            device type, the pages you view, the page that referred you, and
            your approximate location based on your IP address. This comes from
            our website host&rsquo;s server logs and Google Analytics,
            described under{" "}
            <a href="#cookies">Cookies and analytics</a> below.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use",
      heading: "How we use your information",
      body: (
        <>
          <p>We use your information to:</p>
          <ul>
            <li>
              respond to your request, prepare estimates, and schedule visits;
            </li>
            <li>
              contact you by phone or email about your request, and by text if
              you opted in;
            </li>
            <li>
              perform, manage, and bill for work under your contract, including
              permits, inspections, and warranty service;
            </li>
            <li>protect the Site from spam, fraud, and abuse;</li>
            <li>understand how the Site is used so we can improve it;</li>
            <li>
              keep business records and meet our legal, licensing, and tax
              obligations; and
            </li>
            <li>enforce our agreements and protect our rights.</li>
          </ul>
        </>
      ),
    },
    {
      id: "text-messages",
      heading: "Text messages",
      body: (
        <>
          <p>
            We text you only if you agree to it &mdash; for example, by
            checking the text-message box on our estimate form, asking us to
            text you, saying yes when we ask during a call, or texting us
            first. We use your mobile number to send messages about your
            request and project, such as estimate
            scheduling, appointment reminders, and project updates. Message
            frequency varies, and message and data rates may apply. Reply STOP
            to any message to opt out, or HELP for help. Our{" "}
            <DocLink slug="sms-terms">SMS Terms &amp; Conditions</DocLink> have
            the full details.
          </p>
          <p>
            No mobile information will be shared with third parties or
            affiliates for marketing or promotional purposes. All the
            categories of sharing described in this policy exclude text
            messaging originator opt-in data and consent; this information will
            not be shared with any third parties.
          </p>
        </>
      ),
    },
    {
      id: "sharing",
      heading: "How we share information",
      body: (
        <>
          <p>
            We don&rsquo;t sell your personal information, and we don&rsquo;t
            share it for cross-context behavioral advertising. We share it only
            as follows:
          </p>
          <ul>
            <li>
              <strong>Service providers</strong> that help us run our business
              and the Site &mdash; our website host, our phone and text
              messaging provider, our email provider, and Google (for Google
              Analytics). They may use your information only to
              provide services to us.
            </li>
            <li>
              <strong>Project partners</strong> &mdash; such as architects,
              engineers, designers, and licensed subcontractors &mdash; when
              needed to plan or perform your project.
            </li>
            <li>
              <strong>Government agencies</strong> &mdash; such as city and
              county building departments &mdash; when needed for permits and
              inspections.
            </li>
            <li>
              <strong>Legal and safety reasons</strong> &mdash; when required by
              law, subpoena, or court order, or to protect the rights,
              property, or safety of HB LINKS, our customers, or others.
            </li>
            <li>
              <strong>Business transfers</strong> &mdash; as part of a merger,
              sale, or transfer of all or part of our business.
            </li>
            <li>
              <strong>With your consent</strong> &mdash; or at your direction.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "cookies",
      heading: "Cookies and analytics",
      body: (
        <>
          <p>
            The Site uses cookies and similar technologies for analytics:
          </p>
          <ul>
            <li>
              <strong>Analytics.</strong> We use Google Analytics to understand
              how visitors find and use the Site, such as which pages are
              viewed and for how long. Google Analytics uses cookies and
              collects information such as your IP address, device and browser
              details, and the pages you visit. Learn{" "}
              <ExternalLink href="https://policies.google.com/technologies/partner-sites">
                how Google uses information from sites that use its services
              </ExternalLink>
              , or opt out with the{" "}
              <ExternalLink href="https://tools.google.com/dlpage/gaoptout">
                Google Analytics Opt-out Browser Add-on
              </ExternalLink>
              .
            </li>
          </ul>
          <p>
            Most browsers let you block or delete cookies. If you block them,
            parts of the Site may not work as intended.
          </p>
          <p>
            <strong>Do Not Track.</strong> Some browsers send &ldquo;Do Not
            Track&rdquo; signals. Because there&rsquo;s no common standard for
            responding to them, the Site doesn&rsquo;t currently respond to Do
            Not Track signals.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      heading: "How long we keep information",
      body: (
        <p>
          We keep estimate requests and related messages as long as needed to
          respond and follow up. We keep project records &mdash; such as
          contracts, plans, permits, invoices, and warranty information &mdash;
          as long as needed to meet our legal, licensing, tax, and warranty
          obligations, which can last ten years or more after a project is
          finished. When we no longer need information, we delete it or remove
          the details that identify you.
        </p>
      ),
    },
    {
      id: "security",
      heading: "How we protect information",
      body: (
        <p>
          We use reasonable administrative, technical, and physical safeguards
          to protect personal information. No website, transmission, or storage
          system is completely secure, so we can&rsquo;t guarantee absolute
          security. If a security breach affects your personal information,
          we&rsquo;ll notify you as the law requires.
        </p>
      ),
    },
    {
      id: "your-choices",
      heading: "Your choices",
      body: (
        <>
          <p>You can ask us to:</p>
          <ul>
            <li>tell you what personal information we have about you;</li>
            <li>correct information that&rsquo;s inaccurate; or</li>
            <li>delete your information.</li>
          </ul>
          <p>
            To make a request, call or email us using the details below.
            We&rsquo;ll verify your identity before acting on it and respond
            within 45 days. We may keep information the law requires us to
            keep, such as contract, permit, and tax records.
          </p>
          <p>
            You can stop text messages at any time by replying STOP to any
            message from us.
          </p>
        </>
      ),
    },
    {
      id: "california",
      heading: "California privacy rights",
      body: (
        <p>
          California&rsquo;s &ldquo;Shine the Light&rdquo; law (Civil Code
          &sect; 1798.83) lets California residents ask whether a business has
          disclosed their personal information to third parties for those third
          parties&rsquo; own direct marketing. We don&rsquo;t make those
          disclosures. If you have a question about your privacy rights under
          California law, contact us using the details below.
        </p>
      ),
    },
    {
      id: "children",
      heading: "Children’s privacy",
      body: (
        <p>
          The Site is meant for adults and isn&rsquo;t directed to children. We
          don&rsquo;t knowingly collect personal information from children
          under 16. If you believe a child has given us personal information,
          contact us and we&rsquo;ll delete it.
        </p>
      ),
    },
    {
      id: "other-sites",
      heading: "Links to other sites",
      body: (
        <p>
          The Site links to other websites and services, such as Google and
          Instagram. Their own privacy policies, not this one, govern how they
          handle your information.
        </p>
      ),
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: (
        <p>
          We may update this Privacy Policy from time to time. When we do,
          we&rsquo;ll post the new version on this page and update the
          &ldquo;Last updated&rdquo; date above. If we make significant
          changes, we&rsquo;ll also post a notice on the Site.
        </p>
      ),
    },
  ],
};

export default privacyPolicy;
