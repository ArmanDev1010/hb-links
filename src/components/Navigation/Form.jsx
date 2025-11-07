"use client";

import React, { useRef, useState } from "react";

import ReCAPTCHA from "react-google-recaptcha";

import { usePathname } from "next/navigation";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import Link from "next/link";

export default function Form() {
  const recaptchaRef = useRef();
  const pathname = usePathname();

  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = [
    { place: "Full Name", clean: "name" },
    { place: "Phone Number", clean: "phone" },
    { place: "Email", clean: "mail" },
    { place: "Address", clean: "address" },
    { place: "Message", clean: "message" },
  ];

  const isDarkPage = ["/contact", "/services"].includes(pathname);
  const isContactPage = ["/contact"].includes(pathname);

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    if (!captchaToken) {
      toast.error("Please complete the CAPTCHA before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token: captchaToken }),
      });

      if (res.ok) {
        toast.success("Delivered successfully!");
        reset();
        setCaptchaToken(null);
        recaptchaRef.current.reset();
      } else {
        toast.error("Delivery failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("❌ Something went wrong. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`${
        isDarkPage && isContactPage
          ? "w-full bg-transparent"
          : isDarkPage
          ? "w-full bg-primary text-white"
          : null
      }`}
    >
      <h2
        className={`capitalize text-6xl mb-[60px] pointer-events-none px-[3%] ${
          isDarkPage ? "text-white/70" : "text-black/70"
        }`}
      >
        Request{" "}
        <span
          className={`font-semibold ${
            isDarkPage ? "!text-white" : "!text-black"
          }`}
        >
          Callback
        </span>
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative h-full w-full"
      >
        <div className="flex flex-col">
          {fields.map(({ place, clean }, key) => (
            <div
              className="w-full pt-[15px] pb-[10px] px-[5%] font-medium border-t border-gray-200"
              key={clean}
            >
              <div className="relative w-full grid grid-cols-8 text-base">
                <p className="[grid-area:_span_1_/_span_2_/_span_1_/_span_2] pointer-events-none">
                  0{key + 1}.
                </p>
                <p className="[grid-area:_span_1_/_span_2_/_span_1_/_span_2] pointer-events-none">
                  {place}
                </p>
                <div className="[grid-area:_span_1_/_span_4_/_span_1_/_span_4]">
                  {clean === "message" ? (
                    <textarea
                      {...register(clean)}
                      className={`text-[3rem] outline-none bg-transparent relative z-10 resize-none h-[100px] ${
                        isDarkPage
                          ? "placeholder:text-white/40"
                          : "placeholder:text-black/40"
                      }`}
                      required
                      maxLength={5000}
                      placeholder={`${place}*`}
                    />
                  ) : (
                    <input
                      {...register(clean)}
                      className={`text-[3rem] outline-none bg-transparent relative z-10 ${
                        isDarkPage
                          ? "placeholder:text-white/40"
                          : "placeholder:text-black/40"
                      }`}
                      required
                      placeholder={`${place}*`}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center w-fit mx-auto">
          <ReCAPTCHA
            sitekey="6LfqoQMsAAAAAC9Z0X-kEDdB5VNAZAcVB-pIMeMb"
            ref={recaptchaRef}
            size="normal"
            onChange={(token) => setCaptchaToken(token)}
          />
          <div className="flex items-center justify-center gap-10 mt-10 mb-20">
            <button
              className="group bg-third py-[12px] px-[60px] text-lg border rounded-full relative cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-white">Sending...</span>
                </div>
              ) : (
                <>
                  <p className="relative text-center text-white top-0 group-hover:top-[-40px] transition-[top] duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]">
                    Submit Request
                  </p>
                  <div className="w-full h-full absolute top-[110%] left-0 flex items-center justify-center group-hover:top-0 transition-[top] duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]">
                    <p
                      className={`absolute font-[500] ${
                        isDarkPage ? "text-black" : "text-white"
                      }`}
                    >
                      Submit Request
                    </p>
                    <div
                      className={`${
                        isDarkPage ? "bg-white" : "bg-primary"
                      } w-[60%] h-full rounded-[50%] group-hover:w-full group-hover:rounded-[100px] transition-all duration-[.4s] ease-[cubic-bezier(.33,1,.68,1)]`}
                    />
                  </div>
                </>
              )}
            </button>
            <p
              className={`text-base w-[400px] pointer-events-none ${
                isDarkPage ? "text-white/70" : "text-black/70"
              }`}
            >
              By clicking the button, you accept the{" "}
              <Link
                href="/legal/privacy-policy"
                className={`font-bold underline pointer-events-auto ${
                  isDarkPage ? "text-white" : "text-black"
                }`}
              >
                privacy policy
              </Link>{" "}
              and consent to the processing of personal data
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
