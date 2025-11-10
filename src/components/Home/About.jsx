import React from "react";
import ParralaxImages from "../other/ParralaxImages";

export default function About() {
  return (
    <div>
      <div className="px-[5%] mt-10">
        <div className="mb-[7vw]">
          <h2 className="text-[3.5vw] tracking-[-0.035em] leading-[1.02] indent-[24vw] mb-16 pointer-events-none">
            We design and deliver low-voltage systems — from structured cabling
            and access control to surveillance, AV, and intercom integration.
            Every solution is tailored, every wire intentional, and every
            project backed by deep technical expertise and clean execution.
          </h2>
          <p className="text-center text-xl text-gray-500">
            Licensed. Insured. Ready to build. CSLB #1144057
          </p>
        </div>
        <ParralaxImages />
      </div>
    </div>
  );
}
