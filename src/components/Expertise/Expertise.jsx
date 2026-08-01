import ExpertiseHero from "./components/Expertise/ExpertiseHero";
import ExpertiseServices from "./components/Expertise/ExpertiseServices";
import ServiceAreas from "../ServiceAreas/ServiceAreas";
import ContactSection from "../Contact/ContactSection";

export default function Expertise({ title, services }) {
  return (
    <>
      <ExpertiseHero title={title} />
      <ExpertiseServices services={services} />
      <ContactSection tradesPage />
      <ServiceAreas />
    </>
  );
}
