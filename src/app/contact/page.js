"use client";

import React from "react";

import Image from "next/image";

import greenLine from "@/../public/patterns/line_green.png";

import Form from "@/components/Navigation/Form";

export default function ContactPage() {
  return (
    <div className="relative w-full bg-primary text-white z-[1] flex flex-col justify-center items-center">
      <div className="h-[120px]"></div>
      <div className="max-h-fit w-full flex flex-col justify-center items-center">
        <h2 className="capitalize text-5xl mb-[60px] pointer-events-none text-white/70">
          Request <span className="font-semibold !text-white">Callback</span>
        </h2>
        <Form />
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat bg-center opacity-70 z-[-1]">
        <Image
          src={greenLine}
          layout="fill"
          objectFit="cover"
          quality={100}
          alt=""
        />
      </div>
    </div>
  );
}
