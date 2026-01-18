"use client";

import { useState } from "react";
import CategoryCard from "./CategoryCard";

type Material = "Gold" | "Silver";

interface Props {
  categories: any[];
  products: any[];
}

export default function SignatureCollections({
  categories,
  products,
}: Props) {
  const [material, setMaterial] = useState<Material>("Silver");

  const filteredCategories = categories
    .filter(
      (c) =>
        c.active &&
        c.material === material
    )
    .sort((a, b) => a.rank - b.rank);

  return (
    <section>
      <h2 className="au-h2">Our Signature Collections</h2>

      {/* 🔘 Material Latch */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-full border border-primary overflow-hidden">
          {(["Silver", "Gold"] as Material[]).map((m) => (
            <button
              key={m}
              onClick={() => setMaterial(m)}
              className={`
                px-6 py-2 text-sm font-medium transition 
                ${
                  material === m
                    ? "bg-accent  font-bold"
                    : "bg-surface text-primary-dark hover:bg-primary/10 cursor-pointer"
                }
              `}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* 📦 Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map((cat) => {
          const productsForCategory =
            products.filter((p) => p.category === cat.name) || [];

          if (productsForCategory.length === 0) return null;

          return (
            <CategoryCard
              key={cat.name}
              category={cat}
              products={productsForCategory}
            />
          );
        })}
      </div>
    </section>
  );
}
