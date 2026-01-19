"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function GoToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      aria-label="Go to top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      className="
        fixed bottom-31 right-5 z-40
        rounded-full
        bg-accent border
        p-3 shadow-lg
        transition-all duration-300
        hover:scale-105 hover:bg-accent
        focus:outline-none focus:ring-2 focus:ring-primary
        cursor-pointer
      "
    >
      <ArrowUp size={20} />
    </button>
  );
}
