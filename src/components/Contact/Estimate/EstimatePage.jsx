import EstimateSection from "./EstimateSection";

// The /contact page: the estimate section (shared with the homepage) on the
// light background, with the page's h1, the Google-reviews / licence line,
// and room at the top for the fixed navbar.
export default function EstimatePage() {
  return (
    <EstimateSection
      headingAs="h1"
      showTrust
      className="pt-[145px] 550:pt-[160px] pb-16 700:pb-24"
    />
  );
}
