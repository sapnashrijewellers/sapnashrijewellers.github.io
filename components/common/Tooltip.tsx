'use client';

import Link from 'next/link';
import { Info } from 'lucide-react';
import { useState, useRef, useId, useCallback, useEffect } from 'react';

interface TooltipProps {
  text: string;
  href?: string;
  className?: string;
  label?: string;
}

export default function Tooltip({
  text,
  href = '/policies/disclaimer/',
  className = '',
  label = 'Important disclaimer and policy information',
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [positionClass, setPositionClass] = useState<'left-0' | 'right-0'>('left-0');

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
      const wouldOverflowRight = rect.left + tooltipWidth > window.innerWidth - viewportPadding;

      setPositionClass(wouldOverflowRight ? 'right-0' : 'left-0');
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
        className="focus:ring-primary inline-flex cursor-pointer items-center justify-center rounded-full p-0.5 transition-colors duration-150 focus:ring-2 focus:outline-none"
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      {/* Floating Popup (with hover bridge & safe hit-area) */}
      <div
        id={tooltipId}
        role="tooltip"
        aria-hidden={!open}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className={`absolute top-[calc(100%+0.5rem)] z-50 ${positionClass} border-theme bg-surface text-foreground w-64 max-w-[calc(100vw-1rem)] rounded-xl border p-3 text-left text-sm font-normal wrap-break-word whitespace-normal not-italic shadow-xl transition-[opacity,transform] duration-150 ease-out will-change-[transform,opacity] before:absolute before:-top-2.5 before:left-0 before:h-3 before:w-full before:content-[''] ${
          open ? 'pointer-events-auto visible scale-100 opacity-100' : 'pointer-events-none hidden scale-95 opacity-0'
        } `}
      >
        <p className="text-foreground/90 m-0 text-xs leading-snug font-normal sm:text-sm">{text}</p>

        <div className="border-theme/20 mt-2 border-t pt-2">
          <Link
            href={href}
            tabIndex={open ? 0 : -1}
            aria-label={`Read full policy details at ${href}`}
            className="focus:ring-primary inline-flex items-center rounded text-xs font-semibold hover:underline focus:ring-1 focus:outline-none"
          >
            Read full policy &rarr;
          </Link>
        </div>
      </div>
    </span>
  );
}
