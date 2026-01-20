"use client";

import { useState, useMemo } from "react";
import {ProductVariant} from "@/types/catalog"

type ProductSizeSelectorProps = {
  variants: ProductVariant[];
  onChange?: (activeVariant: number) => void;
};

export default function ProductSizeSelector({
  variants,
  onChange,
}: ProductSizeSelectorProps) {
  const [selectedVariant, setSelectedSize] = useState<number>(0);  

  
  if (variants.length === 1) return null;

  const handleSelect = (value: number) => {
    setSelectedSize(value);
    onChange?.(value);
  };

  return (
    <div className="mt-6">
      <p className="labelClasses mb-2">Select Size</p>

      <div className="flex flex-wrap gap-2">
        {variants.map((s,index) => {
          const active = selectedVariant === index;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSelect(index)}
              className={`
                px-4 py-2 rounded-md border text-sm
                transition-all cursor-pointer
                ${
                  active
                    ? "ssj-btn bg-accent"
                    : "hover:border-primary"
                }
              `}
            >
              {s.size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
