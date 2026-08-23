import Link from "next/link";
import { counties } from "@/data/citys/counties";
import { cities } from "@/data/citys/cities";
import { isPriorityCity, cityHref } from "@/lib/cities";

// Priority cities link out to their page; the rest render as identical-
// looking plain text — no visual "highlight" distinguishing them, so the
// list doesn't read as if some areas are served less than others.
function CityPill({ city }) {
  const pillClasses =
    "px-3 py-1 bg-[#f5f4f1] border border-[#e5e1db] rounded-full text-xs 700:text-sm text-[#4a3f36]";

  if (isPriorityCity(city)) {
    return (
      <Link href={cityHref(city)} className={`pointer-events-auto ${pillClasses}`}>
        {city}
      </Link>
    );
  }

  return <span className={pillClasses}>{city}</span>;
}

export default function ServiceAreasCompact() {
  return (
    <div className="flex flex-col gap-6 pointer-events-none">
      {counties.map((county) => {
        const countyCities =
          cities.find((item) => item.county === county.fips)?.cities || [];

        return (
          <div key={county.fips}>
            <p className="font-bold text-sm uppercase tracking-wide mb-3 text-gray-500">
              {county.county}{" "}
              <span className="text-gray-400 font-normal normal-case">
                ({countyCities.length} cities)
              </span>
            </p>
            <div className="flex flex-wrap gap-2 border-t border-l p-5 border-black/25">
              {countyCities.map((city) => (
                <CityPill city={city} key={city} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
