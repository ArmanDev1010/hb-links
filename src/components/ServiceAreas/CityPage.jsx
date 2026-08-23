import CityHero from "./CityHero";
import CityTrust from "./CityTrust";
import CityServices from "./CityServices";
import CityAreaCTA from "./CityAreaCTA";
import SubTradeFAQ from "../Expertise/components/SubTrade/SubTradeFAQ";
import Reviews from "../Home/Reviews";
import ContactSection from "../Contact/ContactSection";
import { services } from "@/data/services";
import { buildCityFAQs } from "@/lib/cities";

export default function CityPage({ city }) {
  return (
    <>
      <CityHero city={city} />
      <CityTrust city={city} />
      <CityServices city={city} trades={services} />
      <Reviews noBtn />
      <CityAreaCTA city={city} />
      <SubTradeFAQ faqs={buildCityFAQs(city)} />
      <ContactSection tradesPage />
    </>
  );
}
