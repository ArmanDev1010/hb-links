import SubTradeHero from "./components/SubTrade/SubTradeHero";
import SubTradeOverview from "./components/SubTrade/SubTradeOverview";
import SubTradeScope from "./components/SubTrade/SubTradeScope";
import SubTradeFAQ from "./components/SubTrade/SubTradeFAQ";
import SubTradeRelated from "./components/SubTrade/SubTradeRelated";
import SubTradeCTA from "./components/SubTrade/SubTradeCTA";
import Reviews from "../Home/Reviews";
import ContactSection from "../Contact/ContactSection";
import ServiceAreas from "../ServiceAreas/ServiceAreas";

export default function SubTrade({ category, service }) {
  const {
    title,
    description,
    intro,
    scope = [],
    benefits = [],
    faqs = [],
    image: serviceImage,
  } = service;

  // Sub-trades rarely have a dedicated photo — fall back to the parent
  // trade's image until one is added directly on the dropdown entry.
  const image = serviceImage || category.image;

  const related = (category.dropdown || [])
    .filter((item) => item.href !== service.href)
    .slice(0, 3);

  return (
    <>
      <SubTradeHero
        trade={category}
        title={title}
        description={description}
        image={image}
        benefits={benefits}
      />
      <SubTradeOverview title={title} intro={intro} />
      <SubTradeScope scope={scope} />
      <Reviews noBtn />
      <SubTradeCTA title={title} />
      <SubTradeFAQ faqs={faqs} />
      <ServiceAreas compact />
      <SubTradeRelated trade={category} services={related} />
      <ContactSection tradesPage />
    </>
  );
}
