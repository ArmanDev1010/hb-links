import { DocLink, EmailLink } from "./links";

// These cover the website only. The construction work itself is governed by
// each customer's signed written contract, so nothing here (warranty
// disclaimers, liability limits, venue) reaches the work — the contract,
// website-disclaimer, liability and governing-law sections each say so.
const termsOfService = {
  intro: (
    <p>
      These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
      hb-links.com (the &ldquo;Site&rdquo;), operated by HB LINKS LLC
      (&ldquo;HB LINKS,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
      &ldquo;our&rdquo;), a California limited liability company and licensed
      contractor (CSLB #1144057). By using the Site or sending us a request
      through it, you agree to these Terms. If you don&rsquo;t agree, please
      don&rsquo;t use the Site.
    </p>
  ),
  sections: [
    {
      id: "site-only",
      heading: "These terms cover the website",
      body: (
        <>
          <p>
            These Terms apply to the Site only. Any construction, remodeling,
            electrical, plumbing, or other work we perform for you is governed
            by a separate written contract between you and HB LINKS, as
            described below.
          </p>
        </>
      ),
    },
    {
      id: "contract",
      heading: "Our work and your contract",
      body: (
        <>
          <p>
            The Site describes the services we offer, such as ADUs, home
            additions, and remodels. Requesting an estimate, receiving a
            quote, or talking with us about a project doesn&rsquo;t create a
            contract or obligate you or us to anything.
          </p>
          <p>
            We start work only after you and HB LINKS sign a written contract.
            That contract &mdash; not the Site &mdash; sets the scope of work,
            price, payment schedule, timeline, and warranties, and describes
            your rights, including any right to cancel that California law
            provides. If anything on the Site conflicts with your signed
            contract, the contract controls.
          </p>
        </>
      ),
    },
    {
      id: "estimates",
      heading: "Estimates and project information",
      body: (
        <p>
          Timelines, sizes, and other project details on the Site, and any
          estimate we give before a contract is signed, are for planning
          purposes only. They depend on your property, plans, engineering,
          permit requirements, material costs, and conditions we may not know
          about until we inspect the site or begin work. Only the price and
          schedule in your signed contract are binding. Our{" "}
          <DocLink slug="disclaimer">Disclaimer</DocLink> explains more.
        </p>
      ),
    },
    {
      id: "requests",
      heading: "Sending us a request",
      body: (
        <>
          <p>When you send us a request through the Site, you agree to:</p>
          <ul>
            <li>
              give accurate information, including a phone number and email
              address that belong to you or that you&rsquo;re authorized to
              use;
            </li>
            <li>
              ask about property you own or are authorized to represent; and
            </li>
            <li>
              not send a request on someone else&rsquo;s behalf without their
              permission.
            </li>
          </ul>
          <p>
            By sending a request, you agree that we may contact you by phone or
            email about it. We text you only if you opt in, as described in our{" "}
            <DocLink slug="sms-terms">SMS Terms &amp; Conditions</DocLink>. Our{" "}
            <DocLink slug="privacy-policy">Privacy Policy</DocLink> explains how
            we handle your information.
          </p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      heading: "Acceptable use",
      body: (
        <>
          <p>You agree not to:</p>
          <ul>
            <li>use the Site for any unlawful purpose;</li>
            <li>
              send false, misleading, or spam requests, or impersonate anyone;
            </li>
            <li>
              try to gain unauthorized access to the Site, its servers, or any
              connected system;
            </li>
            <li>
              interfere with the Site&rsquo;s operation, including by
              introducing malware or overloading it; or
            </li>
            <li>
              copy or collect content or data from the Site by automated means
              (such as scraping) without our written permission.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "intellectual-property",
      heading: "Our content",
      body: (
        <>
          <p>
            The Site and its content &mdash; including text, photos, drawings,
            graphics, logos, and the HB LINKS name &mdash; belong to HB LINKS
            or are used with permission, and are protected by copyright,
            trademark, and other laws. You may view and print pages for your
            own personal, non-commercial use. You may not copy, modify,
            distribute, or reuse Site content for any other purpose without our
            written permission.
          </p>
          <p>
            Customer reviews, and any photos shared with them, appear with
            their authors&rsquo; permission and remain subject to their rights.
          </p>
        </>
      ),
    },
    {
      id: "copyright",
      heading: "Copyright concerns",
      body: (
        <p>
          If you believe content on the Site infringes your copyright, email
          us at <EmailLink /> with a description of the work, where it appears
          on the Site, your contact information, and a statement that you
          believe in good faith the use isn&rsquo;t authorized. We&rsquo;ll
          review it and respond promptly.
        </p>
      ),
    },
    {
      id: "third-parties",
      heading: "Third-party links and services",
      body: (
        <p>
          The Site links to and uses services run by other companies &mdash;
          for example, Google (maps, reviews, and analytics) and Instagram. We don&rsquo;t control those services and
          aren&rsquo;t responsible for their content or practices. Your use of
          them is governed by their own terms and privacy policies.
        </p>
      ),
    },
    {
      id: "site-disclaimer",
      heading: "Website disclaimer",
      body: (
        <>
          <p>
            The Site is provided &ldquo;as is&rdquo; and &ldquo;as
            available.&rdquo; To the fullest extent the law allows, we make no
            warranties about the Site, express or implied, including warranties
            of merchantability, fitness for a particular purpose, and
            non-infringement, and we don&rsquo;t promise the Site will be
            uninterrupted, error-free, or free of harmful components.
          </p>
          <p>
            This section applies to the Site only. It doesn&rsquo;t limit any
            warranty in your written contract, or any warranty or right the law
            provides, for work we perform.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      heading: "Limitation of liability",
      body: (
        <>
          <p>
            To the fullest extent the law allows, HB LINKS and its owners,
            employees, and agents won&rsquo;t be liable for any indirect,
            incidental, special, consequential, or punitive damages, or for
            lost data or profits, arising from your use of, or inability to
            use, the Site. Our total liability for any claim arising from your
            use of the Site is limited to one hundred dollars ($100).
          </p>
          <p>
            This limitation applies to your use of the Site only. Our
            responsibilities for work we perform are governed by your written
            contract and the law.
          </p>
        </>
      ),
    },
    {
      id: "indemnification",
      heading: "Indemnification",
      body: (
        <p>
          You agree to indemnify and hold harmless HB LINKS and its owners,
          employees, and agents from any claims, losses, and expenses
          (including reasonable attorneys&rsquo; fees) arising from your
          violation of these Terms or misuse of the Site.
        </p>
      ),
    },
    {
      id: "governing-law",
      heading: "Governing law and disputes",
      body: (
        <p>
          These Terms are governed by California law, without regard to its
          conflict-of-law rules. Any dispute arising from these Terms or your
          use of the Site will be resolved in the state or federal courts
          located in Los Angeles County, California, and you and HB LINKS
          consent to those courts&rsquo; jurisdiction. Disputes about work we
          perform are resolved as your written contract provides.
        </p>
      ),
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      body: (
        <p>
          We may update these Terms from time to time. When we do, we&rsquo;ll
          post the new version on this page and update the &ldquo;Last
          updated&rdquo; date above. Changes apply from the date they&rsquo;re
          posted, and your continued use of the Site after that means you
          accept them.
        </p>
      ),
    },
    {
      id: "general",
      heading: "General",
      body: (
        <p>
          If any part of these Terms is found unenforceable, the rest stays in
          effect. If we don&rsquo;t enforce a provision, that doesn&rsquo;t
          waive our right to enforce it later. These Terms, together with our{" "}
          <DocLink slug="privacy-policy">Privacy Policy</DocLink>,{" "}
          <DocLink slug="sms-terms">SMS Terms &amp; Conditions</DocLink>, and{" "}
          <DocLink slug="disclaimer">Disclaimer</DocLink>, are the entire
          agreement between you and HB LINKS about your use of the Site.
        </p>
      ),
    },
  ],
};

export default termsOfService;
