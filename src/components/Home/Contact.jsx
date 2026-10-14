import EstimateSection from "@/components/Contact/Estimate/EstimateSection";

// The homepage's contact section: the estimate section (shared with
// /contact) on the footer's dark background. Service pages reuse it with
// their own `heading` ("Ready to Build Your ADU?").
export default function Contact({ heading }) {
  return (
    <EstimateSection
      id="contact"
      dark
      heading={heading}
      className="py-16 1080:py-20"
    />
  );
}
