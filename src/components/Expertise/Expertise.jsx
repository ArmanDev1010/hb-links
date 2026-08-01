import ExpertiseHero from "./components/Expertise/ExpertiseHero";
import ExpertiseServices from "./components/Expertise/ExpertiseServices";

export default function Expertise({ title, services, page = {} }) {
  return (
    <>
      <ExpertiseHero title={title} />
      <ExpertiseServices services={services} />
    </>
  );
}
