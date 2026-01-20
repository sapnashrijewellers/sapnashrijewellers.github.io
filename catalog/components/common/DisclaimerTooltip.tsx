"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { useState, useRef, useLayoutEffect } from "react";

export default function DisclaimerTooltip({
  text,
  href = "/policies/disclaimer",
  className = "",
}: {
  text: string;
  href?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [positionClass, setPositionClass] = useState("left-0");
  
  // FIX: Explicitly type the ref as an HTMLSpanElement
  const tooltipRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (open && tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Logic: If the right edge goes off-screen, switch to right-aligned
      if (rect.right > viewportWidth) {
        setPositionClass("right-0");
      } else {
        // Reset to left-aligned if there is space
        setPositionClass("left-0");
      }
    }
  }, [open]); // Only run when the tooltip opens

  return (
    <span
      className={`relative inline-flex items-center align-middle ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Info
        size={14}
        className="cursor-pointer text-primary opacity-70 hover:opacity-100 transition"
      />

      {open && (
        <>
          <span className="absolute top-full left-0 h-2 w-full" />
          <span
            ref={tooltipRef}
            /* FIX 1: 'font-normal' and 'not-italic' prevents bold/italic inheritance.
              FIX 2: 'right-0' vs 'left-0' is now calculated before the browser paints.
            */
            className={`absolute z-50 top-[calc(100%+0.5rem)] ${positionClass} 
                       w-64 rounded-lg border border-theme bg-surface shadow-lg p-3 
                       text-sm text-normal font-normal not-italic antialiased
                       whitespace-normal break-words text-left`}
          >
            <p className="leading-snug m-0 font-normal">{text}</p>
            <Link 
              href={href} 
              className="mt-2 inline-block text-xs text-primary font-normal hover:underline"
            >
              Read full disclaimer
            </Link>
          </span>
        </>
      )}
    </span>
  );
}