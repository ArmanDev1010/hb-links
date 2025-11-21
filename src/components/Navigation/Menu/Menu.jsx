import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ContactButton from "../Nav/ContactButton";
import { usePathname } from "next/navigation";
import PhoneLink from "../Nav/PhoneLink";

export default function Menu({ showMenu, handleClose }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "About us", href: "/about" },
    { label: "Services", href: "/services" },
  ];

  return (
    <AnimatePresence>
      {showMenu && (
        <div className="1080:hidden fixed inset-0 z-[99] text-white">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit flex flex-col justify-center items-center z-[3] max-700:w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="flex flex-col gap-8 text-center max-700:gap-10 max-400:gap-7">
              {navItems.map(({ label, href }) => {
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <li key={label}>
                    <Link
                      href={href}
                      className={`text-[32px] font-semibold transition-opacity duration-300 hover:opacity-50 max-700:text-3xl max-550:text-2xl
                        max-400:text-xl ${
                          isActive ? "text-white" : "text-gray-400"
                        }`}
                      onClick={handleClose}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
              <div className="" onClick={handleClose}>
                <ContactButton menu={true} />
              </div>
            </ul>
          </motion.div>

          <motion.div
            className="absolute bottom-7 left-10 w-fit h-fit z-[3] flex justify-between max-700:w-full max-700:left-0 max-700:px-[5%] max-400:bottom-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PhoneLink menu={true} />
            <ul className="flex flex-wrap gap-x-16 gap-y-5 text-center max-700:flex-col max-700:text-right max-400:gap-y-3">
              {[
                {
                  label: "info@hb-links.com",
                  href: "mailto:info@hb-links.com",
                },
                { label: "California, USA" },
              ].map(({ label, href }, key) => {
                return (
                  <li key={key}>
                    <Link
                      href={href ? href : "/"}
                      className="text-lg font-[500] transition-opacity duration-300 hover:opacity-50 max-700:text-base max-550:text-[15px] max-400:text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-[rgba(26,27,32,.98)]  z-[1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="absolute top-5 right-5 w-[61px] h-[61px] p-5 cursor-pointer z-[1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
