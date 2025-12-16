"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import { SearchFilters } from "@/types/catalog";

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (key: keyof SearchFilters, value: any) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export function FilterPanel({ filters, onChange, triggerRef }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  /** Toggle panel on trigger click */
  useEffect(() => {
    const btn = triggerRef.current;
    if (!btn) return;

    const toggle = () => setOpen((o) => !o);
    btn.addEventListener("click", toggle);

    return () => btn.removeEventListener("click", toggle);
  }, [triggerRef]);

  /** Outside click + ESC */
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

  
  return (
    <div
      ref={panelRef}
      className={`
        absolute right-0 top-full mt-4 w-72 bg-surface border border-theme 
        rounded-xl shadow-lg z-50 p-4 transition-all duration-150
        ${open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"}
      `}
    >
      <h3 className="font-semibold mb-3 text-primary">Filters</h3>

      <div className="grid grid-cols-1 gap-3">
        <input
          type="number"
          placeholder="Min Weight (g)"
          value={filters.minWeight ?? ""}
          onChange={(e) =>
            onChange("minWeight", e.target.value ? parseFloat(e.target.value) : undefined)
          }
          className="p-2 border border-theme rounded"
        />

        <input
          type="number"
          placeholder="Max Weight (g)"
          value={filters.maxWeight ?? ""}
          onChange={(e) =>
            onChange("maxWeight", e.target.value ? parseFloat(e.target.value) : undefined)
          }
          className="p-2 border border-theme rounded "
        />

        <select
          value={filters.forWhom ?? ""}
          onChange={(e) => onChange("forWhom", e.target.value || undefined)}
          className="p-2 border border-theme rounded "
        >
          <option value="">For Everyone</option>
          <option value="her">For Her</option>
          <option value="him">For Him</option>
          <option value="kids">For Kids</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>
    </div>
  );
}
