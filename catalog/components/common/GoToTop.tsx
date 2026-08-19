"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";

export default function GoToTop() {
  const [visible, setVisible] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(window.scrollY > 600);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top of page"
      tabIndex={visible ? 0 : -1}
      className={`
        fixed bottom-31 right-5 z-40
        p-3 rounded-full border border-theme
        bg-accent text-accent-foreground shadow-lg
        transition-[opacity,transform] duration-200 ease-out will-change-[transform,opacity]
        hover:scale-105 hover:bg-accent/90
        focus:outline-none focus:ring-2 focus:ring-primary
        ${
          visible
            ? "opacity-100 scale-100 pointer-events-auto visible"
            : "opacity-0 scale-90 pointer-events-none hidden"
        }
      `}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
}