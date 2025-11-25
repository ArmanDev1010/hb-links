import Link from "next/link";

const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
];

export default function NavLinks() {
  return (
    <ul className="flex gap-[2.5rem] text-base ml-[7rem] font-[400] max-1440:ml-[5rem] max-1080:hidden">
      {NAV_LINKS.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="capitalize transition-opacity duration-200 hover:opacity-70"
            prefetch
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
