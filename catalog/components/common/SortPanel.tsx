"use client";

import { useEffect, useRef, useState, useId, useCallback, type RefObject } from "react";
import { Check } from "lucide-react";

interface SortOption {
  value: string;
  label: string;  
}

interface SortPanelProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const SORT_OPTIONS: readonly SortOption[] = [
  { value: "best-match", label: "Best Match"},
  { value: "name-asc", label: "Product Name A–Z"},
  { value: "name-desc", label: "Product Name Z–A"},
  { value: "price-asc", label: "Price Low → High"}, 
  { value: "price-desc", label: "Price High → Low"}
] as const;

export function SortPanel({ sortBy, onSortChange, triggerRef }: SortPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const panelId = useId();
  const titleId = useId();

  const closePanel = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [triggerRef]);

  /** Synchronize trigger element attributes & toggle listener */
  useEffect(() => {
    const btn = triggerRef.current;
    if (!btn) return;

    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-controls", panelId);

    const toggle = (e: MouseEvent) => {
      e.stopPropagation();
      setOpen((prev) => !prev);
    };

    btn.addEventListener("click", toggle);
    return () => btn.removeEventListener("click", toggle);
  }, [triggerRef, open, panelId]);

  /** Outside click + ESC key dismissal */
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closePanel();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, closePanel, triggerRef]);

  const handleSelect = (val: string) => {
    onSortChange(val);
    closePanel();
  };

  return (
    <div
      id={panelId}
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className={`
        absolute right-0 top-full mt-3 w-64 sm:w-72 bg-surface border border-theme 
        rounded-2xl shadow-xl z-50 p-3 transition-[opacity,transform] duration-150 ease-out will-change-[transform,opacity]
        ${
          open
            ? "opacity-100 scale-100 pointer-events-auto visible"
            : "opacity-0 scale-95 pointer-events-none hidden"
        }
      `}
    >
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-theme/30">
        <h3 id={titleId} className="font-semibold text-sm text-foreground">
          Sort By
        </h3>
      </div>

      {/* Screen-reader descriptive context */}
      <div className="sr-only">
        Current sort selection: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label || sortBy}
      </div>

      {/* Sort Options Listbox */}
      <div
        role="listbox"
        aria-label="Sort product catalog by criteria"
        className="grid grid-cols-1 gap-1"
      >
        {SORT_OPTIONS.map((opt) => {
          const isSelected = sortBy === opt.value;

          return (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-label={`Sort by ${opt.label}`}
              onClick={() => handleSelect(opt.value)}
              className={`
                flex items-center justify-between w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-xl
                transition-[background-color,color] duration-150 ease-out text-left
                focus:outline-none focus:ring-2 focus:ring-primary
                ${
                  isSelected
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "bg-surface text-foreground/80 hover:bg-theme/10 hover:text-foreground"
                }
              `}
            >
              <span>{opt.label}</span>
              {isSelected && (
                <Check className="w-4 h-4 shrink-0 text-current" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}