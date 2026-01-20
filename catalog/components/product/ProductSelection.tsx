"use client";

import { useState } from 'react';
import ProductPrice from './ProductPrice';
import ProductSizeSelector from './ProductSizeSelector';
import {Product} from "@/types/catalog"

export default function ProductSelection({ product }: {product:Product}) {
  const [activeVariant, setActiveVariant] = useState(0);

  return (
    <>
      <ProductPrice product={product} activeVariant={activeVariant} />
      <ProductSizeSelector
        variants={product.variants}
        onChange={(index) => setActiveVariant(index)}
      />
    </>
  );
}