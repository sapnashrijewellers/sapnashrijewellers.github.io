"use client";

import { useEffect, useMemo, useState } from "react";
import labels from "@/data/labels.json";
import { AppIconMap } from "@/utils/appIcons";
import ProductCard from "@/components/product/ProductCard";
import { Label, Product } from "@/types/catalog";

const merchandisingLabels = labels as Label[];

export default function FeaturedJewellery() {
    const [activeKey, setActiveKey] = useState(
        merchandisingLabels[0]?.key ?? ""
    );

    const [productsByLabel, setProductsByLabel] = useState<
        Record<string, Product[]>
    >({});

    const activeLabel = useMemo(
        () => merchandisingLabels.find((label) => label.key === activeKey),
        [activeKey]
    );

    const activeProducts = productsByLabel[activeKey] ?? [];

    const loadProducts = async (label: Label) => {
        // Already loaded
        if (productsByLabel[label.key]) {
            return;
        }

        try {
            const response = await fetch(`/data/${label.key}.json`);

            if (!response.ok) {
                throw new Error(
                    `Failed to load ${label.key}.json`
                );
            }

            const data = await response.json();

            setProductsByLabel((previous) => ({
                ...previous,
                [label.key]: Array.isArray(data) ? data : [],
            }));
        } catch (error) {
            console.error(
                `Unable to load products for ${label.name}`,
                error
            );

            setProductsByLabel((previous) => ({
                ...previous,
                [label.key]: [],
            }));
        }
    };

    // Load products whenever the active tab changes.
    // This also loads the first tab automatically on initial render.
    useEffect(() => {
        if (activeLabel) {
            loadProducts(activeLabel);
        }
    }, [activeKey]);

    return (
        <section
            aria-labelledby="merchandising-heading"
            className="w-full"
        >
            {/* Section heading */}
            <div className="mb-4">
                <h2
                    id="merchandising-heading"
                    className="text-xl sm:text-2xl font-semibold tracking-tight"
                >
                    Featured Jewellery
                </h2>
            </div>

            {/* Tabs */}
            <div
                role="tablist"
                aria-label="Jewellery collections"
                className="
                    flex gap-2
                    overflow-x-auto
                    scrollbar-hide
                    pb-2
                    snap-x snap-mandatory
                "
            >
                {merchandisingLabels.map((label) => {
                    const Icon = AppIconMap[label.icon];
                    const isActive = label.key === activeKey;

                    return (
                        <button
                            key={label.key}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`panel-${label.key}`}
                            id={`tab-${label.key}`}
                            onClick={() => setActiveKey(label.key)}
                            className={`
                                shrink-0
                                snap-start
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                whitespace-nowrap
                                transition-all
                                duration-200
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-primary/40

                                ${
                                    isActive
                                        ? "bg-accent shadow-sm"
                                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                                }
                            `}
                        >
                            {Icon && (
                                <Icon
                                    size={16}
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                />
                            )}

                            <span>{label.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Active collection */}
            <div
                role="tabpanel"
                id={`panel-${activeKey}`}
                aria-labelledby={`tab-${activeKey}`}
                tabIndex={0}
                className="mt-3"
            >
                {/* Product carousel */}
                <div
                    role="region"
                    aria-label={`${activeLabel?.collectionName ?? ""} jewellery carousel`}
                    tabIndex={0}
                    className="
                        flex gap-3 sm:gap-4
                        overflow-x-auto
                        p-2
                        scrollbar-hide
                        snap-x snap-mandatory
                        focus:outline-none
                        focus:ring-1
                        focus:ring-primary/40
                        rounded-2xl
                    "
                >
                    {activeProducts.map((product, index) => (
                        <ProductCard
                            product={product}
                            key={product.id}
                            priority={index < 4}
                            className="
                                shrink-0
                                w-[160px]
                                sm:w-[180px]
                                lg:w-[220px]
                                snap-start
                                transition-transform
                                duration-150
                                ease-out
                                will-change-transform
                            "
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
