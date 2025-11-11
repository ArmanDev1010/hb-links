import Link from "next/link";

export default function SocialLinks() {
  return (
    <ul className="pl-8 flex gap-5 max-1440:hidden">
      <li className="capitalize cursor-pointer transition-opacity duration-200 hover:opacity-70">
        <Link href="https://www.instagram.com/">In</Link>
      </li>
    </ul>
  );
}
