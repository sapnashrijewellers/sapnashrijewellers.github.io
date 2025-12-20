"use client";

import { Funnel, ArrowUpDown } from "lucide-react";
import { FilterPanel } from "@/components/common/FilterPanel";
import { SortPanel } from "@/components/common/SortPanel";
import { SearchFilters } from "@/types/catalog";
import { useRef } from "react";
export interface FilterNSortProps {
    filters: SearchFilters;
    onFilterChange: <K extends keyof SearchFilters>(
        key: K,
        value: SearchFilters[K]
    ) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
}
export default function SearchBar({
    filters,
    onFilterChange,
    sortBy,
    onSortChange
}: FilterNSortProps) {
    const filterBtnRef = useRef<HTMLButtonElement>(null);
    const sortBtnRef = useRef<HTMLButtonElement>(null);
    return (
        <div className="relative ">
            <div className="flex items-center rounded-xl  w-full gap-2">
                <div className="relative">
                    <button ref={filterBtnRef}
                        className="ssj-btn bg-accent shrink-0 flex items-center justify-center
           w-10 h-10 sm:w-9 sm:h-9"
                        title="Filter results">
                        <Funnel size={16} />
                    </button>
                    <FilterPanel
                        filters={filters}
                        onChange={onFilterChange}
                        triggerRef={filterBtnRef}
                    />
                </div>

                <div className="relative">
                    <button ref={sortBtnRef}
                        className="ssj-btn bg-accent shrink-0 flex items-center justify-center
           w-10 h-10 sm:w-9 sm:h-9"
                        title="Sort results">
                        <ArrowUpDown size={16} />
                    </button>
                    <SortPanel
                        sortBy={sortBy}
                        onSortChange={onSortChange}
                        triggerRef={sortBtnRef}
                    />
                </div>
            </div>
        </div>
    );
}
