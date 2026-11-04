"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { GA_ID, LIVE_HOST, trackEvent } from "@/lib/analytics";

// Loads Google Analytics on the live site. Page views, including the
// client-side page changes, come from GA's enhanced measurement; this adds
// taps on the phone number and the email address, wherever they appear.
// Sent estimate requests are tracked in hooks/useContactForm.
export default function Analytics() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (window.location.hostname !== LIVE_HOST) return;
    setLive(true);

    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="tel:"], a[href^="mailto:"]');
      if (link) trackEvent(link.protocol === "tel:" ? "call_click" : "email_click");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!live) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${GA_ID}",{allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  );
}
