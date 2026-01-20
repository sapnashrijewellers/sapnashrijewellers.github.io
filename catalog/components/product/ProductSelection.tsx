"use client";

import { useState } from 'react';
import ProductPrice from './ProductPrice';
import ProductSizeSelector from './ProductSizeSelector';
import { Product } from "@/types/catalog"
import Image from 'next/image';
import formatPurity from "@/utils/utils.js";

export default function ProductSelection({ product }: { product: Product }) {
  const [activeVariant, setActiveVariant] = useState(0);
  const isHallmarked = (product.purity?.toLowerCase().startsWith("gold") && product.weight > 2) || !!product.HUID;

  return (
    <>
      <ProductPrice product={product} activeVariant={activeVariant} />
      <ProductSizeSelector
        variants={product.variants}
        onChange={(index) => setActiveVariant(index)}
      />
      {/* Specs + Hallmark */}
      <div className="flex items-center justify-between border-t border-theme pt-3">
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Purity:</span>{" "}
            {formatPurity(product.purity)}
          </p>

          <div className="flex items-center gap-1">
            <span className="font-medium">Weight:</span>
            <span>{product.variants[activeVariant].weight} g</span>


          </div>

          {product.brandText && product.brandText.length > 2 && (
            <p>
              <span className="font-medium">Brand:</span> {product.brandText}
            </p>
          )}
        </div>
        {isHallmarked && (
          <div className="flex flex-col items-center w-28">
            <Image
              src={`${process.env.BASE_URL}/static/img/hallmark.png`}
              height={56}
              width={56}
              alt="BIS Hallmark"
            />
            <span className="text-xs mt-1 text-center">BIS Hallmark</span>
          </div>
        )}
      </div>
    </>
  );
}