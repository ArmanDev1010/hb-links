import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

export default function DropdownMenu({
  dropdown,
  setActiveDropdown,
  active,
  pathname,
  setMenuActive,
  menuActive,
}) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  const isCurrentPage = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const getMenuActiveClasses = (active) =>
    menuActive
      ? active
        ? "max-1080:text-white max-1080:opacity-100"
        : "max-1080:text-[#f6f4ee99] max-1080:opacity-70"
      : "";

  useLayoutEffect(() => {
    if (!ref.current) return;

    setHeight(active ? ref.current.scrollHeight : 0);
  }, [active, dropdown]);

  const ITEMS_PER_COLUMN = 10;

  const columns = [];
  for (let i = 0; i < dropdown.length; i += ITEMS_PER_COLUMN) {
    columns.push(dropdown.slice(i, i + ITEMS_PER_COLUMN));
  }

  return (
    <div
      className={`overflow-hidden px-6 transition-[height] duration-300 ease-[cubic-bezier(0,0,0.2,1)]
        1080:px-0 1080:absolute 1080:top-0 1080:left-1/2 1080:-translate-x-1/2 1080:w-auto 1080:mt-[5.8rem] 1080:text-right
        ${active ? "pointer-event-auto" : "pointer-events-none"}`}
      style={{ height }}
    >
      <div
        className={`transition-opacity duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          active
            ? "opacity-100 pointer-event-auto"
            : "opacity-0 pointer-events-none"
        }`}
        ref={ref}
      >
        <ul className="max-1080:pt-5 max-700:pt-2">
          <div
            className="
    1080:flex
    1080:items-start
    1080:justify-center
    1080:gap-10
  "
          >
            {columns.map((column, columnIndex) => (
              <div key={columnIndex}>
                {column.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`block text-lg py-3 1080:py-2.5 1080:text-sm 1080:whitespace-nowrap max-700:text-base max-550:text-[15px] font-xbold transition-opacity duration-300 hover:opacity-70 ${getMenuActiveClasses(
                      isCurrentPage(href),
                    )}`}
                    prefetch
                    onClick={() => {
                      if (typeof menuActive !== "undefined") {
                        setMenuActive(false);
                      }
                      setActiveDropdown(null);
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
}
