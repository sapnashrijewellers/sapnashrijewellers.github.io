
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import products from "@/data/products.json";
import type { Product } from "@/types/catalog";

export default function WishlistPage() {

    const [wishlist, setWishlist] = useState<string[]>([]);


    useEffect(() => {
        const load = () => {
            const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
            setWishlist(stored);
        };

        load();

        const onStorage = (e: StorageEvent) => {
            if (e.key === "wishlist") load();
        };

        const onCustom = () => load();

        window.addEventListener("storage", onStorage);
        window.addEventListener("wishlist-updated", onCustom);

        return () => {
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("wishlist-updated", onCustom);
        };
    }, []);



    const wishlistProducts = products.filter((p) =>
        wishlist.includes(p.slug)
    );


    return (
        wishlistProducts.length > 0 ? (
            <div className="relative">
                <h2 className="text-2xl p-2">My Wish List</h2>
                <div className=" flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
                    {wishlistProducts.map((p: Product) => (
                        <div key={p.id} className="flex-shrink-0 w-[160px] sm:w-[200px] lg:w-[220px] snap-start">
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
            </div>) : <div></div>

    );
}
