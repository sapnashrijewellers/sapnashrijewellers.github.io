"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { useState, useRef } from "react";

export default function Tooltip({
  text,
  href = "/policies/disclaimer/",
  className = "",
}: {
  text: string;
  href?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [positionClass, setPositionClass] = useState("left-0");

  const triggerRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    const trigger = triggerRef.current;

    if (trigger) {
      const rect = trigger.getBoundingClientRect();

      // Tailwind w-64 = 16rem = 256px
      const tooltipWidth = 256;

      // Keep a small margin from the viewport edge.
      const viewportPadding = 8;

      // If tooltip extending to the right would go outside
      // the viewport, align it to the right side instead.
      const wouldOverflowRight =
        rect.left + tooltipWidth > window.innerWidth - viewportPadding;

      setPositionClass(wouldOverflowRight ? "right-0" : "left-0");
    }

    setOpen(true);
  };

  return (
    <span
      ref={triggerRef}
      className={`relative inline-flex items-center align-middle ${className}`}
      onMouseEnter={handleMouseEnter}
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
            className={`absolute z-50 top-[calc(100%+0.5rem)] ${positionClass}
              w-64 max-w-[calc(100vw-1rem)]
              rounded-lg border border-theme bg-surface shadow-lg p-3
              text-sm text-normal font-normal not-italic antialiased
              whitespace-normal break-words text-left`}
          >
            <p className="leading-snug m-0 font-normal">
              {text}
            </p>

            <Link
              href={href}
              className="mt-2 inline-block text-xs text-primary font-normal hover:underline"
            >
              Read full policy
            </Link>
          </span>
        </>
      )}
    </span>
  );
}