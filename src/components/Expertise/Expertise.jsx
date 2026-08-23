import ExpertiseHero from "./components/Expertise/ExpertiseHero";
import ExpertiseServices from "./components/Expertise/ExpertiseServices";
import ServiceAreas from "../ServiceAreas/ServiceAreas";
import ContactSection from "../Contact/ContactSection";

export default function Expertise({ title, services, image }) {
  return (
    <>
      <ExpertiseHero title={title} image={image} />
      <ExpertiseServices services={services} />
      <ServiceAreas compact />
      <ContactSection />
    </>
  );
}
