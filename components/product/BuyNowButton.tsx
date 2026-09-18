'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Loader2 } from 'lucide-react';

import { addToCart } from '@/utils/cart/cart';
import type { Product } from '@/types/catalog';

interface BuyNowButtonProps {
  product: Product;
  className?: string;
}

export default function BuyNowButton({ product, className = '' }: BuyNowButtonProps) {
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

      router.push('/cart/');
    } catch (error) {
      console.error('Failed to initialize Buy Now:', error);
      setIsProcessing(false);
    }
  }, [isProcessing, product, router]);

  const accessibleLabel = `Buy ${product.name} now and proceed to checkout)`;

  return (
    <button
      type="button"
      onClick={handleBuyNow}
      disabled={isProcessing}
      aria-label={accessibleLabel}
      aria-busy={isProcessing}
      className={`bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-primary focus:ring-offset-background inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-base font-bold shadow-md transition-[transform,opacity,background-color] duration-150 ease-out will-change-[transform] hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-60 sm:text-lg ${className} `}
    >
      {isProcessing ? (
        <Loader2 className="h-5 w-5 shrink-0 animate-spin" aria-hidden="true" />
      ) : (
        <ShoppingCart className="h-5 w-5 shrink-0" aria-hidden="true" />
      )}

      <span>{isProcessing ? 'Processing...' : 'Buy Now'}</span>

      <span className="sr-only">for {product.name}</span>
    </button>
  );
}
