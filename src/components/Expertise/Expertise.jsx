import ExpertiseHero from "./components/Expertise/ExpertiseHero";
import ExpertiseServices from "./components/Expertise/ExpertiseServices";
import ExpertiseJourney from "./components/Expertise/ExpertiseJourney";
import SubTradeFAQ from "./components/SubTrade/SubTradeFAQ";
import Reviews from "../Home/Reviews";
import ServiceAreas from "../ServiceAreas/ServiceAreas";
import ContactSection from "../Contact/ContactSection";

export default function Expertise({
  title,
  paragraph,
  services,
  image,
  faqs = [],
  servicesHeadline,
}) {
  return (
    <>
      <ExpertiseHero title={title} paragraph={paragraph} image={image} />
      <ExpertiseServices
        title={title}
        services={services}
        servicesHeadline={servicesHeadline}
      />
      <ServiceAreas compact />
      <ExpertiseJourney title={title} />
      <Reviews noBtn />
      <SubTradeFAQ title={title} faqs={faqs} />
      <ContactSection tradesPage />
    </>
  );
}
