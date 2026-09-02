"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import { useState, useRef, useId, useCallback, useEffect } from "react";

interface TooltipProps {
  text: string;
  href?: string;
  className?: string;
  label?: string;
}

export default function Tooltip({
  text,
  href = "/policies/disclaimer/",
  className = "",
  label = "Important disclaimer and policy information",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [positionClass, setPositionClass] = useState<"left-0" | "right-0">("left-0");

  const tooltipId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      const tooltipWidth = 256; // Tailwind w-64 = 16rem = 256px
      const viewportPadding = 8;
      const wouldOverflowRight =
        rect.left + tooltipWidth > window.innerWidth - viewportPadding;

      setPositionClass(wouldOverflowRight ? "right-0" : "left-0");
    }
  }, []);

  const showTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    calculatePosition();
    setOpen(true);
  }, [calculatePosition]);

  // Grace period debounce (200ms) allows cursor to travel across the gap without unmounting
  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  }, []);

  const toggleTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!open) {
      calculatePosition();
    }
    setOpen((prev) => !prev);
  }, [open, calculatePosition]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center align-middle ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {/* Accessible Interactive Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        className="inline-flex items-center justify-center p-0.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-150 cursor-pointer"
      >
        <Info className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      {/* Floating Popup (with hover bridge & safe hit-area) */}
      <div
        id={tooltipId}
        role="tooltip"
        aria-hidden={!open}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className={`
          absolute z-50 top-[calc(100%+0.5rem)] ${positionClass}
          w-64 max-w-[calc(100vw-1rem)]
          rounded-xl border border-theme bg-surface shadow-xl p-3
          text-sm text-foreground font-normal not-italic antialiased
          whitespace-normal wrap-break-word text-left
          before:absolute before:-top-2.5 before:left-0 before:w-full before:h-3 before:content-['']
          transition-[opacity,transform] duration-150 ease-out will-change-[transform,opacity]
          ${
            open
              ? "opacity-100 scale-100 pointer-events-auto visible"
              : "opacity-0 scale-95 pointer-events-none hidden"
          }
        `}
      >
        <p className="leading-snug m-0 text-xs sm:text-sm text-foreground/90 font-normal">
          {text}
        </p>

        <div className="mt-2 pt-2 border-t border-theme/20">
          <Link
            href={href}
            tabIndex={open ? 0 : -1}
            aria-label={`Read full policy details at ${href}`}
            className="inline-flex items-center text-xs font-semibold hover:underline focus:outline-none focus:ring-1 focus:ring-primary rounded"
          >
            Read full policy &rarr;
          </Link>
        </div>
      </div>
    </span>
  );
}