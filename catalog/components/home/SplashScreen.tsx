"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [exit, setExit] = useState(false);
  const finalizeSplash = () => {
  document.body.classList.add("splash-done");
  document.documentElement.classList.remove("splash-lock");
  document.body.classList.remove("splash-lock");
  setVisible(false);
};

  useEffect(() => {
    const hasShownSplash = sessionStorage.getItem("splashShown");

    // If splash already shown in this session → skip
    if (hasShownSplash) {
      finalizeSplash();
      return;
    }

    // Mark splash as shown for this session
    sessionStorage.setItem("splashShown", "true");

    document.documentElement.classList.add("splash-lock");
    document.body.classList.add("splash-lock");

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    // ALWAYS show splash in dev & prod (for now)
    // We will optimize later

    const exitTimer = setTimeout(() => {
      setExit(true);
    }, 3800); // visible pause

    const removeTimer = setTimeout(() => {
      finalizeSplash();
    }, 4600);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div id="splash-root" className={`splash-root ${exit ? "splash-exit" : ""}`}>
      <div className="splash-center">
        <div className="splash-logo">
          <Image
            src="/splash/ss-logo.png"
            alt="SapnaShri Jewellers"
            fill
            priority
            sizes="(max-width: 768px) 200px, 360px"
            className="object-contain"
          />
        </div>

        <div className="splash-text">
          <h1 className="font-yatra">SapnaShri</h1>
          <span className="">JEWELLERS</span>
        </div>
      </div>
    </div>
  );
}
