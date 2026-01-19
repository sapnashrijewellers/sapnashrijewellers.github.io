"use client";

import { Funnel, ArrowUpDown } from "lucide-react";
import { FilterPanel } from "@/components/common/FilterPanel";
import { SortPanel } from "@/components/common/SortPanel";
import { SearchFilters } from "@/types/catalog";
import { useRef, useState } from "react";
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
export default function SearchBar({
    filters,
    onFilterChange,
    sortBy,
    onSortChange
}: FilterNSortProps) {
    const filterBtnRef = useRef<HTMLButtonElement>(null);
    const sortBtnRef = useRef<HTMLButtonElement>(null);
    const [material, setMaterial] = useState<Material>("Silver");
    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                {(["Silver", "Gold"] as Material[]).map((m) => (
                    <button
                        key={m}
                            onClick={() => { setMaterial(m); onFilterChange("material", m); }}
                            className={`
                border px-6 ssj-btn py-2 text-sm font-medium transition shrink-0 flex items-center justify-center
                ${material === m
                                    ? "bg-accent  font-bold"
                                    : "bg-surface text-normal hover:bg-primary/10 cursor-pointer"
                                }
              `}
                        >
                            {m}
                        </button>
                    ))}
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
