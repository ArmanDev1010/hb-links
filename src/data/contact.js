import {
  BsEnvelope,
  BsFacebook,
  BsGeoAlt,
  BsInstagram,
  BsLinkedin,
  BsTiktok,
} from "react-icons/bs";
import { MdOutlineLocalPhone } from "react-icons/md";

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
    label: "Los Angeles County",
    href: "https://share.google/XmhSxSeMGY10BV7ea",
    icon: <BsGeoAlt />,
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
