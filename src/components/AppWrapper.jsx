"use client";
import { useState, useEffect } from "react";
import Navbar from "./Navigation/Navbar";
import LoadingScreen from "./Home/LoadingScreen";
import Consultation from "./Navigation/Consultation_button";
import Footer from "./Footer/Footer";

export default function AppWrapper({ children, fontClass }) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("hasVisitedSite")) {
      setShowLoading(true);
    }
  }, []);

  const handleLoadingFinish = () => {
    localStorage.setItem("hasVisitedSite", "true");
    setShowLoading(false);
  };

  return (
    <body className={fontClass}>
      {showLoading && <LoadingScreen onFinish={handleLoadingFinish} />}
      <Navbar />
      <Consultation />
      {children}
      <Footer />
    </body>
  );
}
