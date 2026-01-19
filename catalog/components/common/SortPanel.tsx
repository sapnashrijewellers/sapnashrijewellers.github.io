"use client";

import { useEffect, useRef, useState, RefObject } from "react";

interface SortPanelProps {
  sortBy: string;
  onSortChange: (value: string) => void;   // FIXED NAME
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export function SortPanel({ sortBy, onSortChange, triggerRef }: SortPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  /** Toggle panel when clicking trigger */
  useEffect(() => {
    const btn = triggerRef.current;
    if (!btn) return;

    const toggle = (e: MouseEvent) => {
      e.stopPropagation();
      setOpen((o) => !o);
    };

    btn.addEventListener("click", toggle);
    return () => btn.removeEventListener("click", toggle);
  }, [triggerRef]);

  /** Outside click + ESC close */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [triggerRef]);

  const options = [
    { value: "best-match", label: "Best Match" },
    { value: "name-asc", label: "Product Name A–Z" },
    { value: "name-desc", label: "Product Name Z–A" },
    { value: "weight-asc", label: "Weight Low → High" },
    { value: "weight-desc", label: "Weight High → Low" },
  ];

  return (
    <div
      ref={panelRef}
      className={`absolute right-0 top-full mt-4 w-72 bg-surface border border-theme 
        rounded-xl shadow-lg z-50 p-4 transition-all duration-150        
        ${open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}
      `}
    >
      <h3 className="mb-3">Sort By</h3>

      <div className="grid grid-cols-1 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              onSortChange(opt.value);
              setOpen(false); // good UX
            }}
            className={`
              p-2 border border-theme rounded
              ${sortBy === opt.value ? "bg-accent" : "bg-surface text-normal"}
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
