"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useContactForm() {
  const recaptchaRef = useRef();
  const [captchaToken, setCaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm();
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

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
        recaptchaRef.current?.reset();
      } else {
        toast.error("Delivery failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    toast.error(
      firstError?.message || "Please fill out all required fields correctly.",
    );
  };

  const fieldStyle = (clean) => ({
    borderBottom: errors[clean]
      ? "1px solid red"
      : "1px solid hsla(0, 0%, 83.9%, .3)",
  });

  return {
    ...form,
    recaptchaRef,
    setCaptchaToken,
    isSubmitting,
    handleFormSubmit: handleSubmit(onSubmit, onInvalid),
    fieldStyle,
  };
}
