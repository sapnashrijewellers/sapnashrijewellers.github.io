"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";

import { addToCart } from "@/utils/cart/cart";
import type { Product } from "@/types/catalog";

interface BuyNowButtonProps {
  product: Product;
  className?: string;
}

export default function BuyNowButton({
  product,
  className = "",
}: BuyNowButtonProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuyNow = useCallback(() => {
    if (isProcessing) {
      return;
    }

    try {
      setIsProcessing(true);

     
      addToCart({
        productId: product.id,
        qty: 1,
        product,
      });

      router.push("/cart/");
    } catch (error) {
      console.error("Failed to initialize Buy Now:", error);
      setIsProcessing(false);
    }
  }, [isProcessing, product, router]);

  const accessibleLabel = `अभी खरीदें: ${product.name} (Buy ${product.name} now and proceed to checkout)`;

  return (
    <button
      type="button"
      onClick={handleBuyNow}
      disabled={isProcessing}
      aria-label={accessibleLabel}
      aria-busy={isProcessing}
      className={`
        inline-flex items-center justify-center gap-2.5
        px-6 py-3 rounded-xl
        bg-accent text-accent-foreground
        font-bold text-base sm:text-lg
        shadow-md
        transition-[transform,opacity,background-color]
        duration-150 ease-out
        will-change-[transform]
        hover:bg-accent/90 hover:scale-[1.02]
        active:scale-95
        focus:outline-none
        focus:ring-2
        focus:ring-primary
        focus:ring-offset-2
        focus:ring-offset-background
        disabled:opacity-60
        disabled:pointer-events-none
        cursor-pointer
        ${className}
      `}
    >
      {isProcessing ? (
        <Loader2
          className="w-5 h-5 shrink-0 animate-spin"
          aria-hidden="true"
        />
      ) : (
        <ShoppingCart
          className="w-5 h-5 shrink-0"
          aria-hidden="true"
        />
      )}

      <span>
        {isProcessing
          ? "Processing..."
          : "अभी खरीदें (Buy Now)"}
      </span>

      <span className="sr-only">
        for {product.name}
      </span>
    </button>
  );
}
