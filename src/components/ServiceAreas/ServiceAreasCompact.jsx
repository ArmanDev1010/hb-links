import { ALL_CITIES, FEATURED_CITIES } from "@/lib/seo";

export default function ServiceAreasCompact() {
  const remaining = ALL_CITIES.length - FEATURED_CITIES.length;

  return (
    <div className="flex flex-wrap gap-3 pointer-events-none">
      {FEATURED_CITIES.map((city) => (
        <div
          key={city}
          className="px-4 py-2 bg-[#f5f4f1] border border-[#e5e1db] rounded-full text-sm text-[#4a3f36]"
        >
          {city}
        </div>
      ))}
      {remaining > 0 && (
        <div className="px-4 py-2 bg-third/10 border border-third/30 rounded-full text-sm font-bold text-third">
          +{remaining} more cities across LA &amp; Ventura County
        </div>
      )}
    </div>
  );
}
