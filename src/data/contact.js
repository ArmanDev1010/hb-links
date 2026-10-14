import { BsEnvelope, BsGeoAlt, BsInstagram } from "react-icons/bs";
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
  {
    type: "Instagram",
    label: "@HB_LINKS",
    href: "https://www.instagram.com/hb_links/",
    icon: <BsInstagram />,
  },
];
