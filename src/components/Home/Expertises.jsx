import React from "react";

import Expertise from "./components/Expertise";
import { pages } from "@/data/pages";

export default function Expertises() {
  return (
    <section className="relative overflow-hidden py-5" id="expertise">
      <div className="max-w-[1680px] mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        {[pages[1], pages[2], pages[3], pages[4]].map((text, key) => (
          <Expertise text={text} reverse={key % 2 === 1} key={key} />
        ))}
      </div>
    </section>
  );
}
