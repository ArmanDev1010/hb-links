import ExpertiseCards from "./components/Expertise/ExpertiseCards";
import ExpertiseHero from "./components/Expertise/ExpertiseHero";
import ExpertiseIntro from "./components/Expertise/ExpertiseIntro";
import ExpertiseServices from "./components/Expertise/ExpertiseServices";

export default function Expertise({ title, services, page = {} }) {
  const { description, cards = [] } = page;

  return (
    <div>
      <ExpertiseHero title={title} />
      <section
        className="relative overflow-hidden bg-neutral-800 text-neutral-50 py-20 text-black"
        id="expertise_intro"
      >
        <ExpertiseIntro description={description} />
        <ExpertiseCards cards={cards} />
      </section>
      <ExpertiseServices services={services} />
    </div>
  );
}
