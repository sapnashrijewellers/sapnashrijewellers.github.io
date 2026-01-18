"use client";

import { useState, useMemo } from "react";

type ProductSizeSelectorProps = {
  size?: string | null;
  onChange?: (size: string) => void;
};

export default function ProductSizeSelector({
  size,
  onChange,
}: ProductSizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");

  const sizes = useMemo(() => {
    if (!size) return [];
    return size
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [size]);

  // 🔕 No size → render nothing
  if (sizes.length === 0) return null;

  const handleSelect = (value: string) => {
    setSelectedSize(value);
    onChange?.(value);
  };

  return (
    <div className="mt-6">
      <p className="labelClasses mb-2">Select Size</p>

      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const active = selectedSize === s;

          return (
            <button
              key={s}
              type="button"
              onClick={() => handleSelect(s)}
              className={`
                px-4 py-2 rounded-md border text-sm
                transition-all
                ${
                  active
                    ? "ssj-btn bg-accent"
                    : "hover:border-primary"
                }
              `}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
