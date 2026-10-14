"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  // Name from the last successful form submission — non-null while the
  // thank-you modal is open.
  const [thanksName, setThanksName] = useState(null);

  const toggleModal = () => {
    setMenuActive(false);
    setShowModal((prev) => !prev);
  };

  // Closes the request modal (if that's where the form was sent from) and
  // opens the thank-you modal in its place.
  const openThanks = (name) => {
    setShowModal(false);
    setThanksName(name);
  };

  const closeThanks = () => setThanksName(null);

  return (
    <ModalContext.Provider
      value={{
        showModal,
        toggleModal,
        menuActive,
        setMenuActive,
        thanksName,
        openThanks,
        closeThanks,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}
