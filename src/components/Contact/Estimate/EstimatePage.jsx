import EstimateForm from "./EstimateForm";
import ContactMap from "./ContactMap";
import ReachUsDirect, { DirectCard } from "./ReachUsDirect";
import Reveal from "@/components/UI/Reveal";
import { SECTION_TITLE } from "@/components/UI/titles";

// The /contact page (11-20, the user). The heading, a line under it and the
// estimate form (the homepage's, without its blueprint: the map is this
// page's picture) on the left, the form on the first screen; under the form,
// from 1080px, Reach Us Direct as the homepage's contact section has it
// (ReachUsDirect). Behind it all a map of the San Fernando Valley
// (ContactMap) with the cities we work in marked — no pin, no address, no
// distances — a ring sweeping out over them, black falling over its top
// behind the navbar. On a phone the map is behind the top of the page and
// the "Reach us direct" card (ReachUsDirect's DirectCard) follows the form.
// The bottom leaves room for the footer's diagonal (Footer).
//
// The map is outside the wide-screen zoom (it's sized by the screen's
// height); the heading, the form and Reach Us Direct are inside it.
export default function EstimatePage() {
  return (
    <section className="relative isolate overflow-clip bg-black text-white pb-[100px] 700:pb-[130px] 1080:pb-[160px]">
      {/* the map, behind the top of the page */}
      <div className="absolute inset-x-0 top-0 h-[calc(64*var(--svh))] min-h-[460px] 1080:h-[calc(100*var(--vh))] 1080:min-h-[760px]">
        <ContactMap view="narrow" className="1080:hidden absolute inset-0" />
        <ContactMap view="wide" className="max-1080:hidden absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[17%] 1080:h-[30%] bg-gradient-to-b from-black via-black/85 to-transparent" />
        <div aria-hidden="true" className="max-1080:hidden pointer-events-none absolute inset-y-0 left-0 w-[64%] bg-gradient-to-r from-black/95 via-black/65 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] 1080:h-[28%] bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="wide-zoom relative z-10 max-w-[1680px] mx-auto w-full px-[24px] 700:px-[32px] pt-[calc(40*var(--svh))] 1080:pt-[208px] grid grid-cols-1 1080:grid-cols-12 gap-x-8 1440:gap-x-12">
        <div className="1080:col-span-8 1440:col-span-7">
          {/* the heading, a shade under it so the map's names never show
              through its text (11-22, the user): solid below 1080px, the
              map fading out above it; from 1080px a lighter one, fading
              out past the text's right end */}
          <div className="relative pointer-events-none">
            <span
              aria-hidden="true"
              className="1080:hidden absolute -z-10 -inset-x-[24px] 700:-inset-x-[32px] -top-[110px] -bottom-[32px] bg-[linear-gradient(to_bottom,transparent,rgb(11_15_13/0.94)_110px)]"
            />
            <span
              aria-hidden="true"
              className="max-1080:hidden absolute -z-10 -left-12 -top-12 -bottom-12 w-[calc(36rem+228px)] bg-[linear-gradient(to_right,rgb(11_15_13/0.7)_calc(100%-180px),transparent)] [mask-image:linear-gradient(to_bottom,transparent,#000_48px,#000_calc(100%-48px),transparent)]"
            />
            <p className="flex items-center gap-4">
              <span className="block h-2 w-2 shrink-0 bg-lime" />
              <span className="550:text-[13px] text-[12.5px] uppercase font-light tracking-[0.3em] text-silver/80">
                Free estimate<span className="max-550:hidden"> · Takes a minute</span>
              </span>
            </p>
            <h1 className={`mt-5 ${SECTION_TITLE}`}>
              Let&apos;s Talk About Your <span className="italic text-lime">Project</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] 550:text-[16px] leading-relaxed text-silver">
              Tell us about it and we&apos;ll come out for a free on-site
              estimate, then give you one fixed, written price.
            </p>
          </div>

          {/* the form */}
          <div className="mt-8 1080:mt-10">
            <EstimateForm shadow={false} showLabel={false} blueprint={false} />
          </div>

          {/* a phone's "Reach us direct" card */}
          <Reveal delay={0.1} className="1080:hidden mt-10">
            <DirectCard />
          </Reveal>
        </div>

        {/* from 1080px, Reach Us Direct across the page under the form, as
            the homepage's contact section has it */}
        <Reveal delay={0.1} className="max-1080:hidden 1080:col-span-12 mt-12">
          <ReachUsDirect dark />
        </Reveal>
      </div>
    </section>
  );
}
