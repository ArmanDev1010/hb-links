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

  // How many estimate forms have their pinned "Request my estimate" bar on
  // screen (EstimateForm's last step). The phone's floating call/estimate
  // bar steps aside meanwhile, so it never covers that button.
  const [sendBarsInView, setSendBarsInView] = useState(0);
  const reportSendBar = (inView) =>
    setSendBarsInView((count) => Math.max(0, count + (inView ? 1 : -1)));

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
        sendBarsInView,
        reportSendBar,
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
