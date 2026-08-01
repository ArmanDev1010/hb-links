import { BsTelephone, BsEnvelope, BsGeoAlt } from "react-icons/bs";

export const contactInfo = [
  { type: "License", label: "CSLB #1144057" },
  {
    type: "Phone",
    label: "+1 (818) 303-3555",
    href: "tel:+1 (818) 303-3555",
    icon: <BsTelephone />,
  },
  {
    type: "E-Mail",
    label: "info@hb-links.com",
    href: "mailto:info@hb-links.com",
    icon: <BsEnvelope />,
  },
  {
    type: "Area",
    label: "California, USA",
    href: "https://www.google.com/maps/place/HB+Links/@33.786671,-118.2990476,352820m/data=!3m1!1e3!4m8!3m7!1s0x641cd639313d13b9:0xf7b403aff7a5bf6d!8m2!3d33.786671!4d-118.2990476!9m1!1b1!16s%2Fg%2F11mrpgwyyc?hl=en&entry=ttu&g_ep=EgoyMDI2MDcyOC4wIKXMDSoASAFQAw%3D%3D",
    icon: <BsGeoAlt />,
  },
];
