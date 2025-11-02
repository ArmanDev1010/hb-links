"use client";

import React from "react";

import Form from "@/components/Form";
import { motion } from "framer-motion";

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
      </div>
    </motion.div>
  );
}
