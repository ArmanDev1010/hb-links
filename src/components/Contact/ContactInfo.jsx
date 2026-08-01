import { contactInfo } from "@/data/contact";
import Link from "next/link";

export default function ContactInfo() {
  return (
    <ul className="flex flex-wrap justify-center gap-6">
      {[contactInfo[1], contactInfo[2], contactInfo[3]].map(
        ({ icon, label, href }, key) => (
          <li
            key={key}
            className="group flex-grow 700:max-w-[400px] border-t border-l transition-colors border-black/25 hover:border-third"
          >
            <Link href={href} className="p-5 flex items-center justify-between gap-5">
              <p className="w-9 h-9 flex items-center justify-center border border-black/15 rounded-md text-lg">
                {icon}
              </p>
              <p
                className="pointer-events-none font-bold 
          700:text-2xl text-xl transition-colors group-hover:text-third"
              >
                {label}
              </p>
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
