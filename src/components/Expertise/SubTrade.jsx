import SubTradeHero from "./components/SubTrade/SubTradeHero";

export default function SubService({ category, service }) {
  let { title, description, deliverables = [], capabilities = [] } = service;

  return (
    <>
      <SubTradeHero />
    </>
  );
}
