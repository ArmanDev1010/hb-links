import EstimateSection from "@/components/Contact/Estimate/EstimateSection";
import {
  Bars,
  CUT_BOTH,
  CutLines,
  Glow,
  Grid,
  PULL_DOWN,
  PULL_UP,
} from "@/components/UI/Deco";

// The homepage's contact section: the estimate section (shared with
// /contact) on the footer's dark background. Service pages reuse it with
// their own `heading` ("Ready to Build Your ADU?"). Like every section it
// carries the gap to the next one below it — here as white space under the
// band (see Home/HomePage).
//
// `decorated` (the homepage, in the redesign): the band cuts itself on a
// diagonal at both ends, like the footer — it pulls up into How We Work's
// bottom and down into the next section's top (both leave room for it) and
// sits above them, so its grid, glows and bars fill the slanted parts, with
// the green and silver lines just inside each cut. Behind: a green grid top
// right, green glows in two corners, a lime glow and lime bars top right.
// Its padding clears the cuts, and the next section carries the gap.
export default function Contact({ heading, decorated = false }) {
  return (
    <EstimateSection
      id="contact"
      dark
      heading={heading}
      className={
        decorated
          ? `z-10 ${PULL_UP} ${PULL_DOWN} ${CUT_BOTH} pt-[112px] 700:pt-[144px] 1080:pt-[200px] pb-[112px] 700:pb-[144px] 1080:pb-[200px]`
          : "py-16 1080:py-20 mb-[100px] 1080:mb-[120px]"
      }
      decoration={
        decorated && (
          <>
            <Grid tone="dark" mask="45% 45% at 85% 15%" />
            <Glow
              alpha={0.45}
              className="w-[620px] h-[620px] -left-[300px] -top-[172px] 1080:w-[1000px] 1080:h-[800px] 1080:-left-[320px] 1080:-top-[140px]"
            />
            <Glow
              alpha={0.3}
              className="w-[560px] h-[500px] -right-[280px] -bottom-[212px] 1080:w-[900px] 1080:h-[700px] 1080:-right-[300px] 1080:-bottom-[200px]"
            />
            <Glow
              color="lime"
              alpha={0.32}
              className="w-[380px] h-[200px] -right-[170px] top-[48px] 700:top-[80px] 1080:w-[660px] 1080:h-[300px] 1080:-right-[230px] 1080:top-[97px]"
            />
            <Bars
              tone="lime"
              widths={[320, 200, 110]}
              height={10}
              className="-right-[40px] top-[88px] 700:top-[120px] 1080:top-[216px] max-1080:scale-[0.6] max-1080:origin-top-right"
            />
            <CutLines at="top" />
            <CutLines at="bottom" />
          </>
        )
      }
    />
  );
}
