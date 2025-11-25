"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { privacyPages } from "@/data/privacy";

const contentMap = {
  "terms-of-service": {
    title: "Terms of Service",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: "By accessing or using HB LINKS’ website, services, or communications, you agree to be bound by these Terms of Service. If you do not agree with any part of these Terms, you must refrain from using our services. These Terms apply to all users, including clients, visitors, and authorized representatives. HB LINKS reserves the right to update or modify these Terms at any time. Continued use of our services constitutes acceptance of any revised Terms.",
      },
      {
        heading: "2. Scope of Services",
        body: "HB LINKS is a licensed contractor in California (CSLB #1144057), offering professional services including low voltage systems, security systems, CCTV, access control, networking, AV integration, audio/video solutions, surveillance systems, and smart home installations. Our services may include consultation, installation, configuration, maintenance, and support. We reserve the right to modify, discontinue, or enhance any service offering without prior notice.",
      },
      {
        heading: "3. Account Access and Authorized Users",
        body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify HB LINKS immediately of any unauthorized access or suspected breach. You may permit authorized users to access services through your account, but you remain fully responsible for their compliance with these Terms. HB LINKS is not liable for any loss or damage resulting from your failure to secure your account.",
      },
      {
        heading: "4. Software Updates and Service Modifications",
        body: "HB LINKS may provide automatic updates, patches, or enhancements to software or systems used in connection with our services. By using our services, you consent to such updates. We reserve the right to require installation of updates to maintain service functionality. HB LINKS may also modify or discontinue services at its discretion, including for legal compliance or technical reasons.",
      },
      {
        heading: "5. Third-Party Products and Services",
        body: "Our services may integrate or rely on third-party products, software, or services. HB LINKS does not control or endorse third-party providers and is not liable for their performance, content, or compliance. Use of third-party services may be subject to separate terms and conditions. You agree not to hold HB LINKS responsible for any issues arising from third-party integrations.",
      },
      {
        heading: "6. Limitations and Disclaimers",
        body: "HB LINKS provides services on an 'as-is' and 'as-available' basis. We do not guarantee uninterrupted service or error-free performance. Our systems are not certified for emergency response or life-critical applications. You agree not to rely on our services for emergency notifications or high-risk activities. HB LINKS disclaims all warranties, including merchantability, fitness for a particular purpose, and non-infringement, to the maximum extent permitted by law.",
      },
      {
        heading: "7. Liability and Indemnification",
        body: "To the fullest extent permitted by law, HB LINKS is not liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability is limited to the amount you paid for services in the preceding 12 months. You agree to indemnify and hold harmless HB LINKS and its officers, employees, and agents from any claims, damages, or expenses resulting from your violation of these Terms or misuse of our services.",
      },
      {
        heading: "8. Dispute Resolution and Arbitration",
        body: "Any disputes arising from these Terms or our services shall be resolved through binding arbitration, unless you opt out within 30 days of accepting these Terms. Arbitration will be conducted in accordance with the rules of the International Centre for Dispute Resolution (ICDR), and governed by the Federal Arbitration Act. You may opt out by submitting written notice to HB LINKS. Arbitration will be confidential, and the arbitrator’s decision will be final and binding.",
      },
      {
        heading: "9. Class Action Waiver",
        body: "You agree that any dispute resolution will be conducted on an individual basis and not as part of a class, consolidated, or representative action. The arbitrator may not consolidate claims or preside over any class proceedings. If this waiver is found unenforceable, the arbitration clause will be void.",
      },
      {
        heading: "10. Governing Law and Jurisdiction",
        body: "These Terms are governed by the laws of the State of California. Any legal proceedings related to these Terms shall be brought in the courts located in Los Angeles County, California, unless otherwise required by law. HB LINKS reserves the right to pursue legal action in other jurisdictions where harm has occurred.",
      },
      {
        heading: "11. Export Compliance",
        body: "You agree to comply with all applicable export laws and regulations. Our services may not be used in countries subject to U.S. embargoes or sanctions. You represent that you are not on any U.S. government list of prohibited parties and will not use our services in violation of export restrictions.",
      },
      {
        heading: "12. Copyright and DMCA",
        body: "If you believe that any content on our website infringes your copyright, you may submit a DMCA notice to our designated agent. Your notice must include all required elements under 17 U.S.C. § 512(c)(3). If you believe your content was removed in error, you may submit a counter-notice. Misrepresentations may result in liability under Section 512(f).",
      },
      {
        heading: "13. Miscellaneous",
        body: "These Terms constitute the entire agreement between you and HB LINKS regarding our services. If any provision is found unenforceable, the remainder will remain in effect. You may not assign your rights under these Terms without our written consent. Our failure to enforce any provision does not waive our rights. Any claim must be brought within one year of its occurrence. Section headings are for convenience only and do not affect interpretation.",
      },
    ],
  },

  "privacy-policy": {
    title: "Privacy Policy",
    sections: [
      {
        heading: "1. Introduction",
        body: "We collect personal information that you provide to us, such as your name, phone number, email address, service address, and details about your project or service needs. We may also collect basic technical information when you visit our website (such as IP address and browser type). We use this information to:",
        bullets: [
          "Schedule and manage appointments and installations",
          "Communicate about quotes, projects, and support",
          "Send invoices and payment information",
          "Improve our services and website",
          "Comply with legal and regulatory requirements",
        ],
      },
      {
        heading: "2. SMS/Text Messaging",
        body: "If you choose to receive text messages from us, we will use your mobile number to send one-to-one, service-related messages such as appointment confirmations, schedule updates, installation notifications, and customer support. We do not sell your personal information. We do not share SMS consent or mobile numbers with third parties or affiliates for their own marketing purposes. SMS consent is not shared with third parties. We may share your information with trusted service providers (for example, phone/SMS platforms, payment processors, or IT providers) who help us operate our business and who are required to protect your information. You can opt out of SMS at any time by replying STOP to any message from us.",
      },
      {
        heading: "3. Information We Collect",
        body: "We collect both personally identifiable information (PII) and non-personally identifiable information (Non-PII) to provide and improve our services. PII may include your name, phone number, email address, property address, and payment details. Non-PII may include technical data such as IP addresses, browser type, device identifiers, and usage patterns. We may also collect system-related data during installations, such as device configurations, network topology, and site layout details. This information may be collected directly from you, through automated technologies, or from third-party sources with your consent.",
      },
      {
        heading: "4. How We Use Your Information",
        body: "We use your information to operate, maintain, and improve our services. This includes scheduling appointments, customizing installations, processing payments, sending updates, and responding to inquiries. We may also use your information to analyze service usage, enhance our website, develop new offerings, and ensure compliance with applicable laws. Additionally, we may use your contact information to send you promotional emails or service updates. You can opt out of marketing communications at any time by following the unsubscribe instructions in our emails. However, we may still contact you regarding your account or service-related matters.",
      },
      {
        heading: "5. Data Protection and Security",
        body: "We implement commercially reasonable safeguards to protect your information from unauthorized access, alteration, or disclosure. These include secure email systems, encrypted storage, firewalls, and access controls. We regularly review our security practices to ensure they meet industry standards. While no system is completely secure, we take appropriate steps to mitigate risks. You are responsible for maintaining the confidentiality of your login credentials and for any activity that occurs under your account. We recommend using strong passwords and logging out of shared devices to prevent unauthorized access.",
      },
      {
        heading: "6. Sharing of Information",
        body: "We may share your information with trusted third-party service providers who assist us in delivering services, such as hosting platforms, payment processors, subcontractors, and analytics providers. These partners are contractually obligated to use your data only for the purposes specified by HB LINKS and to maintain strict confidentiality. We may also disclose your information if required by law, court order, or legal process, or in connection with a business transfer, merger, or acquisition. We do not sell your personal information to third parties under any circumstances.",
      },
      {
        heading: "7. Cookies and Tracking Technologies",
        body: "Our website may use cookies, web beacons, and similar technologies to collect usage data and improve functionality. Cookies help us remember your preferences, analyze traffic, and deliver relevant content. You can manage cookie settings through your browser, but disabling cookies may affect your experience. We may also use third-party analytics tools such as Google Analytics to understand how users interact with our site. These tools may collect information across websites and apps. For more information, please review the privacy policies of these third-party providers.",
      },
      {
        heading: "8. Children’s Privacy",
        body: "Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from children. If we become aware that we have inadvertently collected such information, we will take immediate steps to delete it from our systems. Parents or legal guardians who believe their child has provided us with personal information may contact us to request its removal. We encourage parents to monitor their children's online activities and to use parental controls where appropriate.",
      },
      {
        heading: "9. Your Rights and Choices",
        body: "You have the right to access, update, correct, or delete your personal information. You may also request details about how your data is used or shared. To make a request, contact us at info@hb-links.com or call +1 (818) 303-3555. We will verify your identity before processing your request and respond within the timeframe required by law. If you maintain an account with us, you may update your information by logging in and modifying your profile. Please note that we may retain certain information as required by law or for legitimate business purposes.",
      },
      {
        heading: "10. Data Retention",
        body: "We retain personal information only as long as necessary to fulfill the purposes outlined in this policy or as required by law. This includes retaining data for service history, legal compliance, dispute resolution, and enforcement of our agreements. When data is no longer needed, we securely delete or anonymize it using industry-standard practices. We may retain anonymized or aggregated data for analytical purposes indefinitely, provided it cannot be used to identify any individual.",
      },
      {
        heading: "11. Third-Party Services and Links",
        body: "Our website may contain links to third-party websites, applications, or services. These are provided for your convenience and do not imply endorsement. We are not responsible for the privacy practices, content, or security of third-party sites. We encourage you to review the privacy policies of any external sites you visit before providing them with your personal information. Your interactions with third-party services are governed by their respective terms and policies.",
      },
      {
        heading: "12. California Privacy Rights",
        body: "If you are a California resident, you have the right to request information about the categories of personal information we have disclosed to third parties for direct marketing purposes. You may make one such request per calendar year by contacting us in writing and providing a current California address. We will respond within 30 days as required by California Civil Code Section 1798.83. Additionally, under the California Consumer Privacy Act (CCPA), you may have further rights regarding access to, deletion of, and control over your personal data.",
      },
      {
        heading: "13. Changes to This Policy",
        body: "We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or service offerings. When we make changes, we will revise the effective date at the top of this page and post the updated policy on our website. If the changes are significant, we may notify you by email or through a notice on our site. Your continued use of our services after any updates constitutes your acceptance of the revised policy.",
      },
      {
        heading: "14. Contact Us",
        body: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:\n\nHB LINKS\nLicensed in California (CSLB #1144057)\nPhone: +1 (818) 303-3555\nEmail: info@hb-links.com\nWebsite: hb-links.com\n\nWe are committed to resolving any privacy-related concerns promptly and transparently. If you believe your data has been handled improperly, we encourage you to reach out so we can address the issue.",
      },
    ],
  },

  "sms-terms": {
    title: "SMS Terms & Conditions",
    sections: [
      {
        heading: "SMS Terms & Conditions – HB Links LLC",
        body: "By providing your mobile number and choosing to receive text messages from HB Links LLC (“HB Links”), you agree to these SMS Terms & Conditions.",
      },
      {
        heading: "Program description",
        body: "We send one-to-one, service-related text messages, including: appointment confirmations, scheduling changes, installation updates, and customer support communications.",
      },
      {
        heading: "Message frequency",
        body: "Messaging frequency may vary depending on your ongoing services and interactions with us.",
      },
      {
        heading: "Charges",
        body: "Message and data rates may apply depending on your mobile plan. Check with your wireless carrier for details.",
      },
      {
        heading: "Opt-out",
        body: "You can opt out of receiving SMS messages at any time by replying STOP to any message we send. You may receive a final message confirming your opt-out.",
      },
      {
        heading: "Help",
        body: "For assistance, reply HELP or contact us at info@hb-links.com or visit www.hb-links.com.",
      },
      {
        heading: "Privacy Policy",
        body: "Visit www.hb-links.com for our Privacy Policy and Terms of Service.",
      },
    ],
  },

  disclaimer: {
    title: "Disclaimer",
    sections: [
      {
        heading: "1. General Information Only",
        body: "The content provided on the HB LINKS website, including service descriptions, blog posts, and technical resources, is for general informational purposes only. While we strive to ensure accuracy, we make no guarantees regarding the completeness, reliability, or timeliness of any information presented. Nothing on this site should be construed as legal, technical, or professional advice specific to your situation.",
      },
      {
        heading: "2. No Guarantees or Warranties",
        body: "All services and content are provided 'as is' and 'as available' without warranties of any kind, either express or implied. HB LINKS disclaims all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement. We do not guarantee that our website or services will be uninterrupted, error-free, or secure.",
      },
      {
        heading: "3. External Links and Third Parties",
        body: "Our website may contain links to third-party websites or services. These links are provided for convenience only. HB LINKS does not endorse or assume responsibility for the content, privacy practices, or accuracy of any third-party sites. Accessing third-party content is done at your own risk.",
      },
      {
        heading: "4. Service Limitations",
        body: "Our services, including security systems, smart home integrations, and networking solutions, are not certified for emergency response or life-critical applications. HB LINKS is not liable for any damages resulting from reliance on our systems for emergency notifications, life safety, or mission-critical operations.",
      },
      {
        heading: "5. Licensing and Compliance",
        body: "HB LINKS is a licensed contractor in the State of California (CSLB #1144057). While we follow all applicable codes and regulations, it is the client’s responsibility to ensure that any installation or service complies with local ordinances, HOA rules, or property-specific requirements.",
      },
      {
        heading: "6. Changes to This Disclaimer",
        body: "We reserve the right to update or modify this Disclaimer at any time without prior notice. Your continued use of our website or services after any changes constitutes acceptance of the updated terms.",
      },
      {
        heading: "7. Contact Us",
        body: "If you have any questions about this Disclaimer or our services, please contact us:\n\nHB LINKS\nLicensed in California (CSLB #1144057)\nPhone: +1 (818) 303-3555\nEmail: info@hb-links.com\nWebsite: [Insert your website URL]",
      },
    ],
  },
};

export default function LegalPage() {
  const pathname = usePathname();
  const { slug } = useParams();
  const content = contentMap[slug];

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-xl">Page not found.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#1f1f1f] text-white pb-16">
      <div className="h-[80px]"></div>

      <div className="pt-16 px-[3%] flex gap-10 max-1080:gap-0">
        <div className="flex-1 pb-8 text-gray-200 pointer-events-none max-1080:pr-[5%] max-550:!px-[3%]">
          <h2 className="text-[6vw] leading-[1.4] uppercase mb-[7rem] text-white max-550:text-[7vw] max-550:mb-[5rem] max-400:text-[9vw]">
            {content.title}
          </h2>
          {content.sections.map(({ heading, body, bullets }, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-3xl font-semibold mt-10 mb-4 max-550:text-2xl">
                {heading}
              </h2>
              <p className="whitespace-pre-line mb-10 opacity-80 leading-[1.5] text-lg max-550:text-base">
                {body}
              </p>
              {bullets && (
                <ul className="flex flex-col gap-3 mb-10">
                  {bullets?.map((text, key) => (
                    <p
                      key={key}
                      className="opacity-70 leading-[1.5] text-lg max-550:text-base"
                    >
                      • {text}
                    </p>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <aside className="w-[25%] px-5 max-1080:w-[20%] max-1080:pr-0 max-900:hidden">
          <ul className="w-full flex flex-col gap-3 text-lg font-medium max-1080:text-base">
            {privacyPages.map(({ label, slug: linkSlug }) => {
              const isActive = pathname.includes(linkSlug);
              return (
                <li key={linkSlug}>
                  <Link
                    href={`/legal/${linkSlug}`}
                    className={`transition-colors ${
                      isActive
                        ? "text-white font-bold"
                        : "opacity-50 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      <div className="absolute top-[80px] left-[calc(75%-1.5%)] bg-white/30 h-[95%] w-[1px] z-[3] max-1080:left-[calc(80%-1.5%)] max-900:hidden" />
    </div>
  );
}
