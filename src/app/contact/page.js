"use client";

import React from "react";

import Image from "next/image";

import greenLine from "@/../public/patterns/line_green.png";

import Form from "@/components/Navigation/Form";

export default function ContactPage() {
  return (
    <div className="relative w-full bg-primary text-white z-[1] flex flex-col justify-center items-center">
      <div className="mb-20 max-400:mb-16"></div>
      <Form />
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat bg-center opacity-70 z-[-1]">
        <Image src={greenLine} layout="fill" objectFit="cover" alt="" />
      </div>
    </div>
  );
}
