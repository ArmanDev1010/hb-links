"use client";

import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { counties } from "@/data/citys/counties";

const US_COUNTIES_TOPOJSON =
  "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const SOCAL_FIPS = new Set(counties.map((area) => area.fips));

const MAP_CENTER = [-118.8, 34.15];
const MAP_ZOOM = 5.5;

export default function ServiceAreasMap({ activeCounty, onSelectCounty }) {
  const [geographies, setGeographies] = useState(null);

  useEffect(() => {
    fetch(US_COUNTIES_TOPOJSON)
      .then((res) => res.json())
      .then((topology) => setGeographies(topology))
      .catch((err) => console.error("Failed to load county map data:", err));
  }, []);

  if (!geographies) {
    return (
      <div className="w-full h-full 1080:min-h-[700px] min-h-[300px] flex items-center justify-center bg-[#3c4043]">
        <p className="text-white/60 text-sm">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full 1080:min-h-[700px] min-h-[300px] bg-[#3c4043] overflow-hidden">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 2200,
        }}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <ZoomableGroup
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          minZoom={MAP_ZOOM}
          maxZoom={MAP_ZOOM}
        >
          <Geographies geography={geographies}>
            {({ geographies }) =>
              geographies
                .filter((geo) => SOCAL_FIPS.has(geo.id))
                .map((geo) => {
                  const isServiceCounty = SOCAL_FIPS.has(geo.id);
                  const area = counties.find((a) => a.fips === geo.id);
                  const isActive =
                    isServiceCounty && activeCounty === area?.county;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() =>
                        isServiceCounty && onSelectCounty(area?.county)
                      }
                      style={{
                        default: {
                          fill: isServiceCounty
                            ? isActive
                              ? "#5a6166"
                              : "#3c4043"
                            : "#2a2d2f",
                          stroke: isServiceCounty ? "#8a8f94" : "#4a4d4f",
                          strokeWidth: isServiceCounty ? 0.5 : 0.3,
                          outline: "none",
                          transition: "fill 0.3s ease",
                          cursor: isServiceCounty ? "pointer" : "default",
                        },
                        hover: {
                          fill: isServiceCounty ? "#5a6166" : "#2a2d2f",
                          stroke: isServiceCounty ? "#8a8f94" : "#4a4d4f",
                          strokeWidth: isServiceCounty ? 0.5 : 0.3,
                          outline: "none",
                        },
                        pressed: {
                          fill: isServiceCounty ? "#5a6166" : "#2a2d2f",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
            }
          </Geographies>

          {counties.map((area) => {
            const isActive = activeCounty === area.county;
            const coords = area.coordinates;
            return (
              <Marker
                key={area.fips}
                coordinates={coords}
                onMouseEnter={() => onSelectCounty(area.county)}
                className="cursor-pointer"
              >
                <circle
                  r={isActive ? 5 : 4.5}
                  fill={isActive ? "#106b37" : "#106b37"}
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={0.6}
                  style={{ transition: "r 0.3s ease" }}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontWeight="700"
                  fontSize={isActive ? 4 : 3.5}
                  style={{
                    pointerEvents: "none",
                    transition: "font-size 0.3s ease",
                  }}
                >
                  {area.label}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
