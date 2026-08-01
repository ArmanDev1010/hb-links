"use client";

import { counties } from "@/data/citys/counties";
import { cities } from "@/data/citys/cities";

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

export default function ServiceAreasList() {
  return (
    <div className="grid grid-cols-1 1080:grid-cols-2 gap-x-10 gap-y-6 pointer-events-none">
      {counties.map((county) => {
        const countyCities =
          cities.find((item) => item.county === county.fips)?.cities || [];

        const groupedCities = groupCitiesByLetter(countyCities);

        return (
          <div
            key={county.fips}
            className="border-t border-l p-5 transition-opacity duration-300 border-black/25 hover:border-third"
          >
            <h3 className="font-bold text-xl uppercase tracking-wide mb-6 pointer-events-none">
              {county.county}
            </h3>

            <div className="flex flex-col gap-5 pointer-events-none">
              {Object.entries(groupedCities).map(([letter, cities]) => (
                <div key={letter}>
                  <h4 className="font-bold text-sm mb-2">{letter}</h4>

                  <div
                    className="
                      grid 
                      grid-cols-1 
                      sm:grid-cols-2
                      gap-x-6 
                      gap-y-2
                    "
                  >
                    {cities.map((city) => (
                      <div
                        key={city}
                        className="flex items-center gap-2 text-gray-600 text-base"
                      >
                        <span
                          className="
                              w-1.5 
                              h-1.5 
                              bg-black/50 
                              rounded-[1px]
                              flex-shrink-0
                            "
                        />

                        {city}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
