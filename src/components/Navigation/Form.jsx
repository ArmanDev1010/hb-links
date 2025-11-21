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
  ];

  const isDarkPage =
    ["/contact"].includes(pathname) || pathname.startsWith("/legal");
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

  const inputClass = `text-[2rem] outline-none bg-transparent relative z-10 w-full 
  max-1280:text-[1.5rem] max-900:text-[1.5rem] max-550:text-[1.25rem] ${
    isDarkPage ? "placeholder:text-white/40" : "placeholder:text-black/40"
  }`;

  return (
    <div
      className={`pb-10 max-900:pb-16 ${
        isDarkPage && isContactPage
          ? "w-full bg-transparent"
          : isDarkPage
          ? "w-full bg-primary text-white"
          : null
      }`}
    >
      <h3
        className={`capitalize text-7xl mb-[70px] pointer-events-none px-[3%] max-900:mb-[70px] max-900:text-[7.5vw] 
          max-700:mb-[50px] max-550:text-[9vw] max-400:text-[10vw] max-400:mb-[40px] ${
            isDarkPage ? "text-white/70" : "text-black/70"
          }`}
      >
        Request{" "}
        <span
          className={`font-semibold <span italic ${
            isDarkPage ? "!text-white" : "!text-black"
          }`}
        >
          Callback
        </span>
      </h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative h-full w-full"
      >
        <div className="mx-auto max-w-[1600px] flex gap-16 max-900:flex-col max-900:gap-0">
          {/* Two-column grid for normal fields */}
          <div className="flex-1 grid grid-cols-2 gap-x-6 max-550:flex max-550:flex-col">
            {fields.map(({ place, clean }, key) => (
              <div
                className="w-full pt-[15px] pb-[50px] font-medium border-t border-gray-200 max-1080:pb-[35px]"
                key={key}
              >
                <div className="relative w-full flex text-base">
                  <div className="w-full px-[10%] max-700:px-[7.5%]">
                    <input
                      {...register(clean)}
                      className={`${inputClass} max-700:w-full`}
                      required
                      placeholder={place}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Full-width Message field */}
            <div className="px-[5%] col-span-2 w-full pt-[15px] pb-[40px] font-medium border-t border-gray-200 max-700:pb-[35px] max-700:px-[3.5%] max-550:px-[7.5%] max-550:pb-[20px]">
              <div className="relative w-full flex text-base">
                <div className="w-full">
                  <textarea
                    {...register("message")}
                    className={`${inputClass} resize-none h-[125px] max-1080:h-[120px] max-900:h-[75px]`}
                    required
                    maxLength={5000}
                    placeholder="Message"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Captcha + Submit */}
          <div
            className="pr-[5%] w-[35%] flex flex-col items-end justify-center mx-auto max-1080:pr-[3%] 
          max-900:mx-0 max-900:px-[5%] max-900:w-full max-900:flex-row max-900:justify-between max-900:items-start max-900:gap-10
          max-700:flex-col max-700:gap-0"
          >
            <ReCAPTCHA
              sitekey="6LfqoQMsAAAAAC9Z0X-kEDdB5VNAZAcVB-pIMeMb"
              ref={recaptchaRef}
              size="normal"
              onChange={(token) => setCaptchaToken(token)}
            />
            <div
              className="flex flex-col-reverse items-end justify-center gap-8 mt-10 max-900:mt-0
              max-700:flex-col-reverse max-700:items-start max-700:mt-16 max-550:mt-10 max-400:gap-7"
            >
              <button
                className="group bg-third py-[12px] px-[60px] text-lg border rounded-full relative cursor-pointer overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed
                max-1080:text-base max-900:px-[50px] max-900:py-[10px]"
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
                className={`text-base max-w-[400px] pointer-events-none max-1080:text-sm max-900:max-w-[300px] ${
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
        </div>
      </form>
    </div>
  );
}
