"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [menuActive, setMenuActive] = useState(false);

  const toggleModal = () => {
    setMenuActive(false);
    setShowModal((prev) => !prev);
  };

  return (
    <ModalContext.Provider
      value={{ showModal, toggleModal, menuActive, setMenuActive }}
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
