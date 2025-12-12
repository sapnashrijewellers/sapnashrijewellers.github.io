"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { NewCatalog, Category } from "@/types/catalog";
import products from "@/data/catalog.json";

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
        <section className="container mx-auto">
            <h1 className="text-2xl  mb-6">My Wishlist ❤️</h1>

            {wishlistProducts.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                    Your wishlist is empty. Browse products and add some!
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {wishlistProducts.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
}
