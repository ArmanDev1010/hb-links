"use client";

import { IoChevronDown } from "react-icons/io5";
import { IoIosArrowRoundForward } from "react-icons/io";

import { useContactForm } from "@/hooks/useContactForm";
import { FormLegalNote } from "@/components/UI/FormConsent";
import { fields } from "@/data/fields";
import { projectTypeOptions } from "@/data/services";

const inputClasses =
  "w-full bg-transparent outline-none text-[15px] py-2 border-b transition-colors duration-200 placeholder:text-black/30";

// The <label> wraps its input, tying the two together for screen readers.
function Field({ label, required, error, className = "", children }) {
  return (
    <label className={`flex flex-col gap-0 ${className}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-black/90">
        {label}
        {required && <span className="text-third ml-1">*</span>}
      </span>
      {children}
      {error && (
        <span className="text-xs text-red-600 mt-1">{error.message}</span>
      )}
    </label>
  );
}

// name / phone / mail / address, in that order — see data/fields.js. Each
// carries its own validation pattern, reused as-is so this doesn't duplicate
// (and risk drifting from) what /contact already validates. Email is
// registered separately below since it's optional here (see registerEmail).
const [nameField, phoneField, , addressField] = fields;

// The shared request form used by both the header/nav request modal and the
// homepage contact section — same fields, validation, copy, and button
// behavior everywhere it appears. Only the surrounding chrome (modal dialog
// vs. section card) differs between callers.
export default function ContactRequestForm() {
  const {
    register,
    handleFormSubmit,
    isSubmitting,
    formState: { errors },
  } = useContactForm();

  const borderClass = (name) =>
    errors[name] ? "border-red-400" : "border-black/15 focus:border-black";

  const registerField = ({ clean, place }) =>
    register(clean, {
      required: `${place} is required.`,
      pattern:
        clean === "phone"
          ? {
              value: /^[0-9+\-\s()]{7,}$/,
              message: "Please enter a valid phone number.",
            }
          : undefined,
    });

  const registerEmail = () =>
    register("mail", {
      validate: (value) =>
        !value ||
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value) ||
        "Please enter a valid email address.",
    });

  return (
    <form
      onSubmit={handleFormSubmit}
      noValidate
      className="550:mt-12 mt-10 flex flex-col gap-12"
    >
      <Field label="Full Name" required error={errors.name}>
        <input
          {...registerField(nameField)}
          type="text"
          className={`${inputClasses} ${borderClass("name")}`}
        />
      </Field>

      <div className="grid grid-cols-1 700:grid-cols-2 gap-x-7 gap-y-9">
        <Field label="Phone" required error={errors.phone}>
          <input
            {...registerField(phoneField)}
            type="text"
            className={`${inputClasses} ${borderClass("phone")}`}
          />
        </Field>
        <Field label="Email" error={errors.mail}>
          <input
            {...registerEmail()}
            type="text"
            className={`${inputClasses} ${borderClass("mail")}`}
          />
        </Field>
      </div>

      <Field
        label="Address / General Location"
        required
        error={errors.address}
      >
        <input
          {...registerField(addressField)}
          type="text"
          className={`${inputClasses} ${borderClass("address")}`}
        />
      </Field>

      <Field label="Project Type" required error={errors.service}>
        <div className="relative mt-2">
          <select
            {...register("service", {
              required: "Please select a project type.",
            })}
            defaultValue=""
            className={`${inputClasses} appearance-none cursor-pointer pr-6 ${borderClass("service")}`}
          >
            <option value="" disabled>
              Select project type
            </option>
            {projectTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <IoChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-black/40" />
        </div>
      </Field>

      <Field label="Project Details" error={errors.message}>
        <textarea
          {...register("message")}
          placeholder="Whatever you can share."
          rows={4}
          className="w-full bg-[#f7f6f4] mt-4 border border-black/10 outline-none text-[15px] p-4 resize-none placeholder:text-black/35 focus:border-black transition-colors duration-200"
        />
      </Field>

      <div className="border-t border-black/10 pt-6 flex max-700:flex-col items-center justify-between gap-4">
        <button
          disabled={isSubmitting}
          type="submit"
          className="group bg-third text-white flex items-center justify-center 550:px-8 max-550:w-full py-3 uppercase text-[13px] font-semibold tracking-[0.12em] transition-colors duration-200 cursor-pointer hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="relative overflow-hidden text-center">
            <div className="group-hover:-translate-y-[110%] flex items-center gap-2 transition duration-300">
              {isSubmitting ? "Sending..." : "Send Message"}
              <IoIosArrowRoundForward className="text-xl" />
            </div>
            <div className="translate-y-[110%] group-hover:translate-y-0 absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center gap-2 transition duration-300">
              {isSubmitting ? "Sending..." : "Send Message"}
              <IoIosArrowRoundForward className="text-xl" />
            </div>
          </div>
        </button>
        <FormLegalNote className="550:max-w-[260px] w-full 700:text-right text-center" />
      </div>
    </form>
  );
}
