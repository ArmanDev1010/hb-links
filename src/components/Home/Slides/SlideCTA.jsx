import Link from "next/link";
import { services } from "@/data/services";

export default function SlideCTA({ activeIndex }) {
  return (
    <div className="absolute left-[50%] bottom-0 max-1440:left-[60%] max-1080:bottom-[20%] max-700:left-[10%] max-400:bottom-[25%]">
      <Link
        href={`/services/${
          services[activeIndex]?.link
            ? services[activeIndex]?.link
            : services[activeIndex]?.title?.toLowerCase().replace(/\s+/g, "-")
        }`}
      >
        <div
          className="group absolute w-[384px] h-[384px] -bottom-12 flex justify-center items-center uppercase cursor-pointer rounded-full 
        max-1080:w-[320px] max-1080:h-[320px] max-800:w-[250px] max-800:h-[250px] max-400:w-[200px] max-400:h-[200px]"
        >
          <div className="absolute w-full h-full rounded-full border border-white/40 transition-transform duration-400 ease-in-out group-hover:scale-[1.05]" />
          <div className="pointer-events-none relative overflow-hidden text-center max-550:text-[15px]">
            <div className="transition duration-400 group-hover:-translate-y-full">
              Learn More
            </div>
            <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition duration-400">
              Learn More
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
