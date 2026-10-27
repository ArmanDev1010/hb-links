import EstimateSection from "@/components/Contact/Estimate/EstimateSection";

// The homepage's contact section: the estimate section (shared with
// /contact) on the footer's dark background. Service pages reuse it with
// their own `heading` ("Ready to Build Your ADU?"). Like every section it
// carries the gap to the next one below it — here as white space under the
// band (see Home/HomePage).
export default function Contact({ heading }) {
  return (
    <EstimateSection
      id="contact"
      dark
      heading={heading}
      className="py-16 1080:py-20 mb-[100px] 1080:mb-[120px]"
    />
  );
}
