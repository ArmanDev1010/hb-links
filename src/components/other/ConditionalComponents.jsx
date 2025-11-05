"use client";
import { usePathname } from "next/navigation";
import Form from "@/components/Navigation/Form";
import Footer from "@/components/Footer/Footer";

export default function ConditionalComponents() {
  const pathname = usePathname();

  const isContactPage = ["/contact"].includes(pathname);

  return !isContactPage ? (
    <>
      <Form /> <Footer />
    </>
  ) : null;
}
