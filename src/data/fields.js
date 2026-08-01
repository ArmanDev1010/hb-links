import {
  BsPersonCircle,
  BsEnvelope,
  BsTelephone,
  BsGeoAlt,
} from "react-icons/bs";

export const fields = [
  { place: "Full Name", clean: "name", icon: <BsPersonCircle /> },
  { place: "Phone Number", clean: "phone", icon: <BsTelephone /> },
  { place: "Email", clean: "mail", icon: <BsEnvelope /> },
  { place: "Address / General Location", clean: "address", icon: <BsGeoAlt /> },
];
