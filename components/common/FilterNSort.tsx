'use client';

import { useRef } from 'react';
import { Funnel, ArrowUpDown } from 'lucide-react';
import { FilterPanel } from '@/components/common/FilterPanel';
import { SortPanel } from '@/components/common/SortPanel';
import type { SearchFilters } from '@/types/catalog';

type Material = 'Gold' | 'Silver';

export interface FilterNSortProps {
  filters: SearchFilters;
  onFilterChange: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function FilterNSort({ filters, onFilterChange, sortBy, onSortChange }: FilterNSortProps) {
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);

  const materials: Material[] = ['Silver', 'Gold'];

  return (
    <div
      role="toolbar"
      aria-label="Jewellery filter and sort controls"
      className="relative flex flex-nowrap items-center gap-2"
    >
      {/* Material Quick-Filter Toggles */}
      <div role="group" aria-label="Filter by material" className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {materials.map((m) => {
          const isSelected = filters.material?.toLowerCase() === m.toLowerCase();

          return (
            <button
              key={m}
              type="button"
              role="button"
              aria-pressed={isSelected}
              onClick={() => onFilterChange('material', m)}
              aria-label={`Filter by ${m} jewellery`}
              className={`btn focus:ring-primary flex min-h-[40px] shrink-0 items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none sm:px-6 ${
                isSelected ? 'ssj-btn ssj-btn' : 'ssj-btn-outline'
              } `}
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
          aria-label="Open detailed filter options (price, metal, collection)"
          title="Filter results"
          className="ssj-btn bg-accent text-accent-foreground focus:ring-primary hover:bg-accent/80 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none"
        >
          <Funnel size={16} aria-hidden="true" />
        </button>

        <FilterPanel filters={filters} onChange={onFilterChange} triggerRef={filterBtnRef} />
      </div>

      {/* Sort Options Panel Trigger */}
      <div className="relative shrink-0">
        <button
          ref={sortBtnRef}
          type="button"
          aria-haspopup="listbox"
          aria-label="Open sort options (by name, weight, or relevance)"
          title="Sort results"
          className="ssj-btn bg-accent text-accent-foreground focus:ring-primary hover:bg-accent/80 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none"
        >
          <ArrowUpDown size={16} aria-hidden="true" />
        </button>

        <SortPanel sortBy={sortBy} onSortChange={onSortChange} triggerRef={sortBtnRef} />
      </div>
    </div>
  );
}
