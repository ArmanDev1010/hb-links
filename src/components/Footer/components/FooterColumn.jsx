import React from "react";
import Link from "next/link";

export default function FooterColumn({
  title,
  href,
  links,
  linkVariant = "default",
}) {
  return (
    <li className="px-2 w-full xl:w-1/6 grow">
      <div className="w-full h-full flex flex-col border-t border-l border-black pl-6 pt-3.5">
        {title && href && (
          <h3 className="mt-2.5 mb-5 uppercase font-semibold tracking-tight text-lg leading-tight block whitespace-nowrap">
            <Link
              href={href}
              className="leading-tight block has-hover:hover:opacity-70 transition-opacity no-child-pointers"
            >
              {title}
            </Link>
          </h3>
        )}

        <ul className="columns-1 max-550:!columns-1">
          {links.slice(0, 5).map(({ label, href }) => (
            <li
              className="max-w-full overflow-hidden leading-tight block has-hover:hover:opacity-70 transition-opacity [&:not(:first-child)]:mt-5"
              key={href}
            >
              {linkVariant === "title" ? (
                <h3 className="!pt-2.5 uppercase font-semibold tracking-tight text-lg leading-tight block whitespace-nowrap">
                  <Link
                    href={href}
                    className="leading-tight block has-hover:hover:opacity-70 transition-opacity no-child-pointers"
                  >
                    {label}
                  </Link>
                </h3>
              ) : (
                <Link
                  href={href}
                  className="text-base text-gray-600 no-child-pointers block max-w-full"
                >
                  {label}
                </Link>
              )}
            </li>
          ))}

          {links.length > 5 && (
            <li className="my-5">
              <Link
                href={href}
                className="uppercase font-semibold text-base has-hover:hover:opacity-70 transition-opacity"
              >
                See More →
              </Link>
            </li>
          )}
        </ul>
      </div>
    </li>
  );
}
