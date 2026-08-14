"use client";

import { useContactForm } from "@/hooks/useContactForm";
import ContactInfo from "@/components/Contact/ContactInfo";
import ContactFormField from "@/components/Contact/ContactFormField";

import { BsChatLeftText } from "react-icons/bs";
import ReCAPTCHA from "react-google-recaptcha";

import { fields } from "@/data/fields";
import { span } from "framer-motion/client";

const inputClasses =
  "w-full bg-transparent outline-none text-base placeholder:text-gray-400";

export default function ContactSection({ tradesPage = false }) {
  const {
    register,
    handleFormSubmit,
    setCaptchaToken,
    recaptchaRef,
    isSubmitting,
    formState: { errors },
  } = useContactForm();

  return (
    <section className={`${tradesPage ? "pt-20 pb-[68px]" : "pt-40 pb-20"}`}>
      <div className="max-w-[1680px] mx-auto w-full 700:px-[1rem] px-[0.5rem]">
        <div className="mx-auto 1280:w-[83.33%] w-full">
          <div className="w-full px-2 pointer-events-none">
            <p className="text-sm uppercase font-xbold tracking-widest mb-4 text-gray-700">
              Contact us
            </p>
            <h3 className="pb-1 font-bold 1080:text-5xl text-4xl leading-none">
              {tradesPage ? (
                <span>
                  Got a Project in Mind <br></br> Let us Know
                </span>
              ) : (
                "Let's Get In Touch"
              )}
            </h3>
          </div>

          <div className="relative 900:pt-10 pt-12 px-[8px]">
            <ContactInfo />
          </div>

          <div className="h-px bg-black/10 my-10" />

          <h2 className="font-bold text-2xl mb-8 pointer-events-none">
            Or fill out the form below
          </h2>

          <form
            onSubmit={handleFormSubmit}
            noValidate
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 700:grid-cols-2 gap-6">
              {fields.map(({ place, clean, icon }) => (
                <ContactFormField
                  key={clean}
                  label={place}
                  required
                  icon={icon}
                  error={errors[clean]}
                >
                  <input
                    {...register(clean, {
                      required: `${place} is required.`,
                      pattern:
                        clean === "mail"
                          ? {
                              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                              message: "Please enter a valid email address.",
                            }
                          : clean === "phone"
                            ? {
                                value: /^[0-9+\-\s()]{7,}$/,
                                message: "Please enter a valid phone number.",
                              }
                            : undefined,
                    })}
                    type="text"
                    placeholder={`Enter your ${place.toLowerCase()}...`}
                    className={inputClasses}
                  />
                </ContactFormField>
              ))}
            </div>

            <ContactFormField
              label="Message"
              icon={<BsChatLeftText />}
              error={errors.message}
              alignTop
            >
              <textarea
                {...register("message")}
                placeholder="Enter your message here..."
                rows={2}
                className={`${inputClasses} resize-none`}
              />
            </ContactFormField>

            <div className="flex justify-center 700:justify-start">
              <ReCAPTCHA
                sitekey="6LfqoQMsAAAAAC9Z0X-kEDdB5VNAZAcVB-pIMeMb"
                ref={recaptchaRef}
                size="normal"
                onChange={(token) => setCaptchaToken(token)}
              />
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="group w-fit bg-secondary text-white border max-700:mx-auto border-secondary px-[58px] py-3 transition duration-200 cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative overflow-hidden text-[16px] font-[600] max-550:text-[15px]">
                <div className="group-hover:-translate-y-[110%] transition duration-300">
                  {isSubmitting ? "Sending..." : "Send Request"}
                </div>
                <div className="text-black translate-y-[110%] group-hover:translate-y-0 transition duration-300 absolute inset-0">
                  {isSubmitting ? "Sending..." : "Send Request"}
                </div>
              </div>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
