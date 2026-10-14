import { ExternalLink } from "./links";

// The site's FAQs and service pages state ADU size limits, permit rules and
// typical timelines; this page is what keeps those from reading as promises.
// The licensing section must match the CSLB record exactly.
const disclaimer = {
  intro: (
    <p>
      The information on hb-links.com (the &ldquo;Site&rdquo;) is here to
      help you learn about HB LINKS LLC and plan your project. Please keep the
      following in mind when you rely on it.
    </p>
  ),
  sections: [
    {
      id: "general-information",
      heading: "General information only",
      body: (
        <p>
          Content on the Site &mdash; including FAQs, service descriptions, and
          information about ADUs, zoning, and permits &mdash; is general
          information, not legal, architectural, engineering, tax, or financial
          advice, and it may not reflect the requirements for your property.
          Using the Site doesn&rsquo;t create a contractor, design, or other
          professional relationship with us. Talk with us, and with the right
          professionals, before making decisions about your project.
        </p>
      ),
    },
    {
      id: "zoning-permits",
      heading: "Zoning, permits, and building codes",
      body: (
        <p>
          ADU, zoning, and building rules vary by city and county and change
          over time. The building department with jurisdiction over your
          property &mdash; such as the Los Angeles Department of Building and
          Safety (LADBS) or your city&rsquo;s building department &mdash; makes
          the final decisions about what can be built and which permits are
          required. We confirm the requirements for your project during the
          estimate process, but we can&rsquo;t guarantee that a permit will be
          issued, or how long plan review and inspections will take, because
          government agencies control those steps.
        </p>
      ),
    },
    {
      id: "timelines-costs",
      heading: "Timelines and costs",
      body: (
        <p>
          Timelines, sizes, and cost factors described on the Site are typical
          ranges, not promises. Your project&rsquo;s actual cost and schedule
          depend on your property, design choices, site conditions (including
          conditions hidden inside walls or underground), engineering, agency
          review, material availability, weather, and any changes you request.
          Only the price and schedule in your signed written contract are
          binding.
        </p>
      ),
    },
    {
      id: "images",
      heading: "Photos and illustrations",
      body: (
        <p>
          Some images on the Site are illustrations, renderings, or
          representative examples rather than photos of a specific HB LINKS
          project &mdash; including the blueprint drawings in our estimate
          form. Colors, materials, and finishes may look different on screen
          than in person.
        </p>
      ),
    },
    {
      id: "reviews",
      heading: "Reviews and testimonials",
      body: (
        <p>
          Reviews on the Site come from real HB LINKS customers and are shared
          with their permission. They describe individual experiences; your
          results may differ depending on the scope and circumstances of your
          project.
        </p>
      ),
    },
    {
      id: "licensing",
      heading: "Licensing",
      body: (
        <>
          <p>
            HB LINKS LLC is licensed by the California Contractors State
            License Board (CSLB), license #1144057, in these classifications:
          </p>
          <ul>
            <li>B &mdash; General Building</li>
            <li>C-10 &mdash; Electrical</li>
            <li>C-36 &mdash; Plumbing</li>
          </ul>
          <p>
            You can verify any California contractor&rsquo;s license on the{" "}
            <ExternalLink href="https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx">
              CSLB website
            </ExternalLink>
            . Work that requires a classification we don&rsquo;t hold is
            performed by appropriately licensed subcontractors or as otherwise
            permitted by California law.
          </p>
        </>
      ),
    },
    {
      id: "external-links",
      heading: "Links to other sites",
      body: (
        <p>
          Links to other websites are provided for convenience. We don&rsquo;t
          control or endorse those sites and aren&rsquo;t responsible for their
          content.
        </p>
      ),
    },
    {
      id: "changes",
      heading: "Changes",
      body: (
        <p>
          We may update the Site and this Disclaimer at any time. The
          &ldquo;Last updated&rdquo; date above shows when this page last
          changed.
        </p>
      ),
    },
  ],
};

export default disclaimer;
