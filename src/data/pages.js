import { services } from "./services";

export const pages = [
  {
    title: "Home",
    href: "/",
  },
  ...services,
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];
