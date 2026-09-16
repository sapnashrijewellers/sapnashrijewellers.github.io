"use client";

import { useEffect } from "react";
import { recordProductView } from "@/utils/recentlyViewed";

interface ProductViewTrackerProps {
  productId: string | number;
}

export default function ProductViewTracker({ productId }: ProductViewTrackerProps) {
  useEffect(() => {
    recordProductView(productId);
  }, [productId]);

  return null;
}