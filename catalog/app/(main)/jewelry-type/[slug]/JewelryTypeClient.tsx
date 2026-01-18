"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/catalog";
import { SearchFilters } from "@/types/catalog";
import FilterNSort from "@/components/common/FilterNSort";
import ProductCard from "@/components/product/ProductCard";

export default function JewelryTypeClient(
    { products }: { products: Product[] }
) {
    const [filters, setFilters] = useState<SearchFilters>({ material: "Silver",});
    const [sortBy, setSortBy] = useState("best-match");
    const visibleProducts = useMemo(() => {
        let items = [...products];

        if (filters.minWeight) items = items.filter(p => p.weight >= filters.minWeight!);
        if (filters.maxWeight) items = items.filter(p => p.weight <= filters.maxWeight!);
        if (filters.forWhom) items = items.filter(p => p.for === filters.forWhom);
        if (filters.material) items = items.filter(p => p.purity.startsWith(filters.material.toLowerCase()));

        /* sorting */
        switch (sortBy) {
            case "name-asc": items.sort((a, b) => a.name.localeCompare(b.name)); break;
            case "name-desc": items.sort((a, b) => b.name.localeCompare(a.name)); break;
            case "weight-asc": items.sort((a, b) => a.weight - b.weight); break;
            case "weight-desc": items.sort((a, b) => b.weight - a.weight); break;
        }
        items = items.filter(p => p.active
            && p.weight > 0
            && p.name.length > 4);
        return items;
    }, [products, filters, sortBy]);


    return (
        <>
            <div className="flex justify-end w-full m-2">
                <FilterNSort
                    filters={filters}
                    onFilterChange={(k, v) =>
                        setFilters(p => ({ ...p, [k]: v }))
                    }
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
            </div>

            {visibleProducts.length === 0 ? (
                <p>इस श्रेणी में कोई उत्पाद नहीं मिला.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {visibleProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </>
    );
}
