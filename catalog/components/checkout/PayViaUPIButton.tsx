"use client";

import { useState, useRef, useEffect } from "react";
import UPIPaymentQR from "../UPIPaymentQR";

export default function PayViaUPIButton({ finalPrice }: { finalPrice: number }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorRef = useRef<HTMLDivElement | null>(null);

  function clearFallback() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function openUPI() {
    setErrorMessage(null);
    clearFallback();

    const amount = finalPrice.toFixed(2);
    const upiUrl = `upi://pay?pa=mab.037326019610011@axisbank&pn=Sapna%20Shri%20Jewellers&am=${amount}&cu=INR`;

    window.location.href = upiUrl;

    timeoutRef.current = setTimeout(() => {
      if (document.visibilityState === "visible") {
        setErrorMessage("No default UPI app found. Please scan the QR code below to complete your payment.");
      }
    }, 1800);
  }

  // Smooth-scroll and focus the error message as soon as it appears
  useEffect(() => {
    if (errorMessage && errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      errorRef.current.focus();
    }
  }, [errorMessage]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") clearFallback();
    };

    const handleWindowBlur = () => clearFallback();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      clearFallback();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);

  return (
    <div className="m-2 space-y-3">
      <button
        type="button"
        className="ssj-btn w-full"
        onClick={openUPI}
        aria-label="Pay via UPI"
      >
        Pay ₹{finalPrice} via UPI
      </button>

      {errorMessage && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="animate-bounce-short flex items-start gap-2.5 rounded-xl border border-amber-400 bg-amber-50 p-3.5 text-sm font-medium text-amber-900 shadow-md outline-none dark:border-amber-600 dark:bg-amber-950/60 dark:text-amber-200"
        >
          <svg
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-semibold text-amber-950 dark:text-amber-100">UPI App Not Detected</p>
            <p className="mt-0.5 text-xs sm:text-sm text-amber-800 dark:text-amber-300">{errorMessage}</p>
          </div>
        </div>
      )}

      <UPIPaymentQR amount={finalPrice} />
    </div>
  );
}