"use client";

import { useEffect, useRef, useState, useId, useCallback, type RefObject } from "react";
import type { SearchFilters } from "@/types/catalog";
import { X, RotateCcw } from "lucide-react";

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

export function FilterPanel({ filters, onChange, triggerRef }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const panelId = useId();
  const titleId = useId();
  const minPriceId = useId();
  const maxPriceId = useId();
  const forWhomId = useId();

  const closePanel = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [triggerRef]);

  /** Synchronize trigger element attributes & toggle listener */
  useEffect(() => {
    const btn = triggerRef.current;
    if (!btn) return;

    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-controls", panelId);

    const toggle = () => setOpen((prev) => !prev);
    btn.addEventListener("click", toggle);

    return () => {
      btn.removeEventListener("click", toggle);
    };
  }, [triggerRef, open, panelId]);

  /** Outside click + ESC key handling */
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

  const hasActiveFilters = Boolean(
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.forWhom
  );

  const clearFilters = () => {
    onChange("minPrice", undefined);
    onChange("maxPrice", undefined);
    onChange("forWhom", undefined);
  };

  return (
    <div
      id={panelId}
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className={`
        absolute right-0 top-full mt-3 w-72 sm:w-80 bg-surface border border-theme 
        rounded-2xl shadow-xl z-50 p-4 transition-[opacity,transform] duration-150 ease-out will-change-[transform,opacity]
        ${
          open
            ? "opacity-100 scale-100 pointer-events-auto visible"
            : "opacity-0 scale-95 pointer-events-none hidden"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-theme/30">
        <h3 id={titleId} className="font-semibold text-base text-foreground">
          Filters
        </h3>

        <div className="flex items-center gap-1">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              aria-label="Reset all selected filters"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary rounded px-1.5 py-0.5"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={closePanel}
            aria-label="Close filter options dialog"
            className="p-1 text-muted-foreground hover:text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Structured Machine-Readable Filter Metadata for LLM Scraping */}
      <div className="sr-only" aria-hidden="true">
        <p>Available filters: Minimum Price, Maximum Price, Target Audience (For Whom).</p>
      </div>

      {/* Filter Form Controls */}
      <form onSubmit={(e) => { e.preventDefault(); closePanel(); }} className="space-y-3.5 text-sm">
        {/* Min Price Input */}
        <div>
          <label
            htmlFor={minPriceId}
            className="block text-xs font-medium text-muted-foreground mb-1"
          >
            Min Price
          </label>
          <input
            id={minPriceId}
            type="number"
            min="0"
            step="0.1"
            inputMode="decimal"
            placeholder="e.g. 500"
            value={filters.minPrice ?? ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChange("minPrice", Number.isNaN(val) ? undefined : (val as SearchFilters["minPrice"]));
            }}
            className="w-full p-2.5 bg-background border border-theme/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Max Price Input */}
        <div>
          <label
            htmlFor={maxPriceId}
            className="block text-xs font-medium text-muted-foreground mb-1"
          >
            Max Price
          </label>
          <input
            id={maxPriceId}
            type="number"
            min="0"
            step="0.1"
            inputMode="decimal"
            placeholder="e.g. 1000"
            value={filters.maxPrice ?? ""}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChange("maxPrice", Number.isNaN(val) ? undefined : (val as SearchFilters["maxPrice"]));
            }}
            className="w-full p-2.5 bg-background border border-theme/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Target Audience / For Whom Select */}
        <div>
          <label
            htmlFor={forWhomId}
            className="block text-xs font-medium text-muted-foreground mb-1"
          >
            For Whom
          </label>
          <select
            id={forWhomId}
            value={filters.forWhom ?? ""}
            onChange={(e) =>
              onChange(
                "forWhom",
                e.target.value ? (e.target.value as SearchFilters["forWhom"]) : undefined
              )
            }
            className="w-full p-2.5  border border-theme/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          >
            <option className="bg-surface text-primary-dark" value="">सभी के लिए (For Everyone)</option>
            <option className="bg-surface text-primary-dark" value="her">महिलाओं के लिए (For Her)</option>
            <option className="bg-surface text-primary-dark" value="him">पुरुषों के लिए (For Him)</option>
            <option className="bg-surface text-primary-dark" value="kids">बच्चों के लिए (For Kids)</option>
            <option className="bg-surface text-primary-dark" value="unisex">यूनिसेक्स (Unisex)</option>
          </select>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          aria-label="Apply chosen filters and close dialog"
          className="w-full mt-2 py-2 text-center text-xs font-semibold bg-accent text-accent-foreground rounded-xl hover:bg-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Apply Filters
        </button>
      </form>
    </div>
  );
}