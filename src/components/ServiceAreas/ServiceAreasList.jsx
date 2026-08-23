"use client";

import Link from "next/link";
import { counties } from "@/data/citys/counties";
import { cities } from "@/data/citys/cities";
import { isPriorityCity, cityHref } from "@/lib/cities";

function groupCitiesByLetter(cityList) {
  return cityList.reduce((acc, city) => {
    const letter = city.charAt(0).toUpperCase();

    if (!acc[letter]) {
      acc[letter] = [];
    }

    acc[letter].push(city);

    return acc;
  }, {});
}

// Priority cities link out to their page; the rest render as identical-
// looking plain text — no visual "highlight" distinguishing them, so the
// list doesn't read as if some areas are served less than others.
function CityPill({ city }) {
  const pillClasses =
    "px-3 py-1 bg-[#f5f4f1] border border-[#e5e1db] rounded-full text-base text-[#4a3f36]";

  if (isPriorityCity(city)) {
    return (
      <Link href={cityHref(city)} className={`pointer-events-auto ${pillClasses}`}>
        {city}
      </Link>
    );
  }

  return <div className={pillClasses}>{city}</div>;
}

export default function ServiceAreasList() {
  return (
    <div className="grid grid-cols-1 1080:grid-cols-2 gap-x-10 gap-y-6 pointer-events-none">
      {counties.map((county) => {
        const countyCities =
          cities.find((item) => item.county === county.fips)?.cities || [];

        const groupedCities = groupCitiesByLetter(countyCities);

        return (
          <div className="" key={county.fips}>
            <p className="font-bold 550:text-base text-sm uppercase tracking-wide mb-3 text-gray-500">
              {county.county}{" "}
              <span className="text-gray-400 font-normal normal-case">
                ({countyCities.length} cities)
              </span>
            </p>
            <div className="border-t border-l p-5 transition-opacity duration-300 border-black/25 hover:border-third">
              <div className="flex flex-col gap-5 pointer-events-none">
                {Object.entries(groupedCities).map(([letter, cities]) => (
                  <div key={letter}>
                    <h4 className="font-bold text-sm mb-2">{letter}</h4>

                    <div className="flex flex-wrap gap-3">
                      {cities.map((city) => (
                        <CityPill city={city} key={city} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
