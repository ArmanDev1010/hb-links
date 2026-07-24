"use client";
import { usePathname } from "next/navigation";
import Form from "@/components/other/Form";

export default function ConditionalComponents() {
  const pathname = usePathname();

  const isContactPage = ["/contact"].includes(pathname);

  return !isContactPage ? (
    <>
      <Form />
    </>
  ) : null;
}
