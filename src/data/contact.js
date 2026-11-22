import {
  BsEnvelope,
  BsFacebook,
  BsGeoAlt,
  BsInstagram,
  BsLinkedin,
  BsTiktok,
} from "react-icons/bs";
import { MdOutlineLocalPhone } from "react-icons/md";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { GOOGLE_MAPS_URL } from "@/lib/seo";

// The office address, written exactly as the Google Business Profile shows
// it — without the unit (11-20; the CSLB record has "Unit 103", which Google
// treats as the same place). layout.js puts the same street in the schema,
// so the site and Google match.
export const ADDRESS = {
  street: "5515 Canoga Ave",
  city: "Woodland Hills",
  region: "CA",
  zip: "91367",
};

export const contactInfo = [
  { type: "License", label: "CSLB #1144057" },
  {
    type: "Phone",
    label: "+1 (818) 303-3555",
    href: "tel:+1 (818) 303-3555",
    icon: <MdOutlineLocalPhone />,
  },
  {
    type: "E-Mail",
    label: "info@hb-links.com",
    href: "mailto:info@hb-links.com",
    icon: <BsEnvelope />,
  },
  {
    type: "Area",
    label: "Los Angeles & Ventura Counties",
    // for the narrow Reach Us Direct cell, where the full one gets cut off
    short: "LA & Ventura Counties",
    href: "https://share.google/XmhSxSeMGY10BV7ea",
    icon: <BsGeoAlt />,
  },
  {
    type: "Address",
    label: `${ADDRESS.street}, ${ADDRESS.city}, ${ADDRESS.region} ${ADDRESS.zip}`,
    // two lines where it's shown, so the city never breaks off alone
    lines: [ADDRESS.street, `${ADDRESS.city}, ${ADDRESS.region} ${ADDRESS.zip}`],
    href: GOOGLE_MAPS_URL,
    icon: <HiOutlineBuildingOffice2 />,
  },
];

// Our social pages — the same handle on every platform. Shown in the
// desktop nav (Instagram's square, all four in its hover dropdown), the
// phone menu, the footer and Reach Us Direct; layout.js lists them in the
// schema's sameAs. `icon` is the component, so each spot sizes it.
export const SOCIAL_HANDLE = "@hblinks.la";

// In this order everywhere they're shown.
export const socials = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/hblinks.la",
    icon: BsInstagram,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/hblinks.la",
    icon: BsLinkedin,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/hblinks.la",
    icon: BsFacebook,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@hblinks.la",
    icon: BsTiktok,
  },
];
