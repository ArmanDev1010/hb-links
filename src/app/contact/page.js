"use client";

import React from "react";

import Form from "@/components/Navigation/Form";
import { motion } from "framer-motion";

import blackLine from "@/../public/patterns/line_black.png";
import Image from "next/image";

export default function ContactPage() {
  return (
    <motion.div
      className="relative w-full h-screen bg-white overflow-auto bg-white z-[1] flex flex-col justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-[50px]"></div>
      <div className="max-h-fit w-full flex flex-col justify-center items-center">
        <h2 className="capitalize text-4xl mb-[60px] pointer-events-none">
          Request <span className="font-semibold text-secondary">Callback</span>
        </h2>
        <Form />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-cover bg-no-repeat opacity-5 z-[0]">
          <Image
            src={blackLine}
            layout="fill"
            objectFit="cover"
            quality={100}
            alt=""
          />
        </div>
      </div>
    </motion.div>
  );
}
