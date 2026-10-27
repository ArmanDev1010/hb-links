"use client";

import { useModal } from "@/context/ModalContext";

// An FAQ answer's words, with its estimate links (`{{...}}` in the data,
// split by lib/seo answerParts) as buttons that open the estimate form.
export default function FAQAnswer({ parts }) {
  const { toggleModal } = useModal();

  return parts.map((part, i) =>
    part.link ? (
      <button
        key={i}
        type="button"
        onClick={toggleModal}
        aria-haspopup="dialog"
        className="inline font-semibold text-third underline decoration-third/40 underline-offset-4 transition-colors duration-200 hover:decoration-third cursor-pointer"
      >
        {part.link}
      </button>
    ) : (
      <span key={i}>{part.text}</span>
    ),
  );
}
