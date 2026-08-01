"use client";

import { motion } from "framer-motion";

import ReCAPTCHA from "react-google-recaptcha";

import { useContactForm } from "@/hooks/useContactForm";

import { fields } from "@/data/fields";

export default function RequestModal({ handleClose }) {
  const {
    register,
    handleFormSubmit,
    setCaptchaToken,
    recaptchaRef,
    isSubmitting,
    formState: { errors },
    fieldStyle,
  } = useContactForm();

  return (
    <div className="modal fixed top-0 left-0 w-full h-full z-[1000] text-[#3a3e4b]">
      <motion.div
        className="absolute top-[75px] left-[197px] w-[calc(100%-394px)] h-[calc(100vh-150px)] py-[56px] px-[123px] overflow-auto bg-[#f2f2f2] shadow-[0_2px_24px_rgba(0,0,0,.04)] z-[1]
        max-1280:w-[calc(100%-216px)] max-1280:h-[calc(100vh-86px)] max-1280:top-[43px] max-1280:left-[105px] max-1280:p-[32px_50px]
        max-900:w-[calc(100%-48px)] max-900:h-[calc(100%-64px)] max-900:top-[90px] max-900:left-[24px] max-900:p-[0] max-900:bg-transparent max-900:pb-[64px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <form onSubmit={handleFormSubmit} noValidate>
          <div className="p-[44px_70px] pb-[43px] mb-[6px] bg-white border border-[rgba(0,0,0,.04)] max-1280:p-[46px_53px_42px_53px] max-550:p-[33px_30px]">
            <p className="text-[22px] font-[600] text-center mb-[25px] pointer-events-none uppercase">
              Schedule a Free Consultation
            </p>
            <div className="grid grid-cols-2 gap-x-[36px] gap-y-[26px] max-900:flex max-900:flex-col">
              {fields.map(({ place, clean }, key) => (
                <div
                  key={key}
                  className="w-full py-[7px] mb-[7px] text-[14px] font-semibold"
                  style={fieldStyle(clean)}
                >
                  <input
                    {...register(clean, {
                      required: `${place} is required.`,
                      pattern:
                        place === "Email"
                          ? {
                              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
                              message: "Please enter a valid email address.",
                            }
                          : place === "Phone Number"
                            ? {
                                value: /^[0-9+\-\s()]{7,}$/,
                                message: "Please enter a valid phone number.",
                              }
                            : undefined,
                    })}
                    type="text"
                    placeholder={place}
                    className="w-full outline-none"
                  />
                </div>
              ))}

              <div
                className="w-full py-[7px] mb-[7px] text-[14px] font-semibold col-span-2 h-[29px] !pt-[5px] !pb-0 !mb-0"
                style={{ borderBottom: "1px solid hsla(0, 0%, 83.9%, .3)" }}
              >
                <textarea
                  {...register("message")}
                  placeholder="Message"
                  className="w-full outline-none resize-none min-h-[28px]"
                />
              </div>
            </div>
          </div>

          <div className="py-[43px] px-[69px] bg-white border border-[rgba(0,0,0,.04)] max-1280:p-[46px_53px_42px_53px] max-550:p-[40px_31px]">
            <div className="flex flex-col items-center gap-8">
              <ReCAPTCHA
                sitekey="6LfqoQMsAAAAAC9Z0X-kEDdB5VNAZAcVB-pIMeMb"
                ref={recaptchaRef}
                size="normal"
                onChange={(token) => setCaptchaToken(token)}
              />

              <button
                disabled={isSubmitting}
                type="submit"
                className="group bg-secondary text-white border border-secondary px-[58px] py-3 transition duration-200 cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
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
            </div>
          </div>
        </form>
      </motion.div>

      <motion.div
        className="fixed inset-0 bg-[rgba(26,27,32,.85)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      />

      <motion.div
        className="request__close absolute top-[17px] right-[18px] w-[61px] h-[61px] p-5 cursor-pointer max-700:right-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      />
    </div>
  );
}
