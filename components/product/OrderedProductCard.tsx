import Link from 'next/link';
import Image from 'next/image';
import type { OrderedProduct } from '@/types/catalog';

interface ProductCardProps {
  product: OrderedProduct;
  className?: string;
}

const baseImageURL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL!;

export default function OrderedProductCard({ product, className = '' }: ProductCardProps) {
  return (
    <article
      aria-label={`${product.name} jewellery item`}
      className={`group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl shadow-sm transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-1 hover:shadow-lg ${className} `}
    >
      <Link
        href={`/p/${product.productId}/`}
        title={`${product.name}`}
        aria-label={`View full details for ${product.name}`}
        className="flex h-full w-full grow flex-col rounded-2xl focus:outline-none"
      >
        {/* Product image */}
        <div className="bg-muted/20 relative aspect-square w-full shrink-0 overflow-hidden">
          {/* Primary image */}
          <Image
            src={`${baseImageURL}/products/thumbnail/${product.image}`}
            alt={`${product.name} - Sapna Shri Jewellers`}
            fill

            loading={'lazy'}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105`}
          />
        </div>

        {/* Product information */}
        <div className="flex w-full grow flex-col justify-between p-3">
          <span className="line-clamp-1 leading-snug transition-colors duration-150">{product.name}</span>

          <div className="mt-2">
            <span>Price:</span>
            <span>{product.price}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
