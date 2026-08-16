import ProductPrice from './ProductPrice';
import { Product } from "@/types/catalog"
import Image from 'next/image';


export default function ProductSelection({ product }: { product: Product }) {  
  const isHallmarked = (product.purity?.toLowerCase().startsWith("gold") && product.weight > 2) || !!product.HUID;

  return (
    <>
      <ProductPrice product={product}  />
      
      {/* Specs + Hallmark */}
      <div className="flex items-center justify-between border-t border-theme pt-3">
        <div className="text-sm space-y-1">         

          {product.brandText && product.brandText.length > 2 && (
            <p>
              {/* <span className="font-medium">Brand:</span> */}
               {product.brandText}
            </p>
          )}
        </div>
        {isHallmarked && (
          <div className="flex flex-col items-center w-28">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/static/img/hallmark.png`}
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