"use client";

import { Funnel, ArrowUpDown } from "lucide-react";
import { FilterPanel } from "@/components/common/FilterPanel";
import { SortPanel } from "@/components/common/SortPanel";
import { SearchFilters } from "@/types/catalog";
import { useRef } from "react";

interface FilterNSortProps {
    filters: SearchFilters;
    onFilterChange: (key: keyof SearchFilters, value: any) => void;
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
            <div className="flex items-center border-2 border-primary rounded-xl bg-highlight px-3 py-1 w-full gap-2">




                <div className="relative">
                    <button ref={filterBtnRef}
                        className="text-normal shrink-0 flex items-center justify-center"
                        title="Filter search results">
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
                        className="text-normal shrink-0 flex items-center justify-center"
                        title="Sort search results">
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
