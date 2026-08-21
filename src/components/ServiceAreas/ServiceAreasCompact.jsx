import { counties } from "@/data/citys/counties";
import { cities } from "@/data/citys/cities";

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
                <span
                  key={city}
                  className="px-3 py-1 bg-[#f5f4f1] border border-[#e5e1db] rounded-full text-xs 700:text-sm text-[#4a3f36]"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
