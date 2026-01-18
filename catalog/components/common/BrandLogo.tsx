"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

type BrandLogoProps = {
  href?: string;
  view?: "auto" | "mobile" | "lg";
  pulse?: boolean;
  className?: string;
};

export default function BrandLogo({
  href = "/",
  view = "auto",
  pulse = true,
  className = "",
}: BrandLogoProps) {
  /* Inject scoped animation once */
  useEffect(() => {
    if (document.getElementById("brand-logo-pulse")) return;

    const style = document.createElement("style");
    style.id = "brand-logo-pulse";
    style.innerHTML = `
      @keyframes brandPulse {
        0% { transform: scale(1); box-shadow: 0 0 0 rgba(163,127,44,0); }
        50% { transform: scale(1.015); box-shadow: 0 0 16px rgba(163,127,44,0.14); }
        100% { transform: scale(1); box-shadow: 0 0 0 rgba(163,127,44,0); }
      }
      .brand-pulse {
        animation: brandPulse 4.8s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const pulseClass = pulse ? "brand-pulse" : "";

  return (
    <div className={`flex items-center leading-none ${className}`}>
      <Link
        href={href}
        title="Go to Home Page of Sapna Shri Jewellers"
        className="inline-flex items-center"
        style={{ lineHeight: 0 }}
      >
        {/* AUTO MODE */}
        {view === "auto" && (
          <>
            <Image
              src="/icons/logo.png"
              alt="Sapna Shri Jewellers Nagda | सपना श्री ज्वैलर्स, नागदा"
              width={120}
              height={120}
              priority              
              className={`h-14 w-auto rounded-xl lg:hidden ${pulseClass}`}
            />

            <Image
              src="/icons/logo-wide.png"
              alt="Sapna Shri Jewellers Nagda | Wide Logo"
              width={320}
              height={120}
              priority              
              className={`hidden lg:block h-14 w-auto rounded-xl ${pulseClass}`}
            />
          </>
        )}

        {/* MOBILE ONLY */}
        {view === "mobile" && (
          <Image
            src="/icons/logo.png"
            alt="Sapna Shri Jewellers Nagda | सपना श्री ज्वैलर्स, नागदा"
            width={120}
            height={120}
            priority            
            className={`h-14 w-auto rounded-xl ${pulseClass}`}
          />
        )}

        {/* LG ONLY */}
        {view === "lg" && (
          <Image
            src="/icons/logo-wide.png"
            alt="Sapna Shri Jewellers Nagda | Wide Logo"
            width={320}
            height={120}
            priority            
            className={`h-14 w-auto rounded-xl ${pulseClass}`}
          />
        )}
      </Link>
    </div>
  );
}
