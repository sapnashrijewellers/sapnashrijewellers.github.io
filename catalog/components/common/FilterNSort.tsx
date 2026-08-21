"use client";

import { useRef } from "react";
import { Funnel, ArrowUpDown } from "lucide-react";
import { FilterPanel } from "@/components/common/FilterPanel";
import { SortPanel } from "@/components/common/SortPanel";
import type { SearchFilters } from "@/types/catalog";

type Material = "Gold" | "Silver";

export interface FilterNSortProps {
  filters: SearchFilters;
  onFilterChange: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function FilterNSort({
  filters,
  onFilterChange,
  sortBy,
  onSortChange,
}: FilterNSortProps) {
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);

  const materials: Material[] = ["Silver", "Gold"];

  return (
    <div
      role="toolbar"
      aria-label="Jewellery filter and sort controls"
      className="relative flex items-center gap-2 flex-nowrap"
    >
      {/* Material Quick-Filter Toggles */}
      <div
        role="group"
        aria-label="Filter by material"
        className="flex items-center gap-1.5 sm:gap-2 shrink-0"
      >
        {materials.map((m) => {
          const isSelected =
            filters.material?.toLowerCase() === m.toLowerCase();

          return (
            <button
              key={m}
              type="button"
              role="button"
              aria-pressed={isSelected}
              onClick={() => onFilterChange("material", m)}
              aria-label={`Filter by ${m} jewellery`}
              className={`
                ssj-btn border px-4 sm:px-6 py-2 text-sm font-medium transition-colors shrink-0 flex items-center justify-center min-h-[40px] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                ${
                  isSelected
                    ? "bg-accent font-bold text-accent-foreground border-theme"
                    : "bg-surface text-primary-dark hover:bg-primary/10 cursor-pointer border-theme/40"
                }
              `}
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Modal/Panel Trigger */}
      <div className="relative shrink-0">
        <button
          ref={filterBtnRef}
          type="button"
          aria-haspopup="dialog"
          aria-label="Open detailed filter options (price, purity, category)"
          title="Filter results"
          className="ssj-btn bg-accent text-accent-foreground shrink-0 flex items-center justify-center w-10 h-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-colors hover:bg-accent/80"
        >
          <Funnel size={16} aria-hidden="true" />
        </button>

        <FilterPanel
          filters={filters}
          onChange={onFilterChange}
          triggerRef={filterBtnRef}
        />
      </div>

      {/* Sort Options Panel Trigger */}
      <div className="relative shrink-0">
        <button
          ref={sortBtnRef}
          type="button"
          aria-haspopup="listbox"
          aria-label="Open sort options (by name, weight, or relevance)"
          title="Sort results"
          className="ssj-btn bg-accent text-accent-foreground shrink-0 flex items-center justify-center w-10 h-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-colors hover:bg-accent/80"
        >
          <ArrowUpDown size={16} aria-hidden="true" />
        </button>

        <SortPanel
          sortBy={sortBy}
          onSortChange={onSortChange}
          triggerRef={sortBtnRef}
        />
      </div>
    </div>
  );
}