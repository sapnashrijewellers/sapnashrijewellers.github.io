import React from 'react';
import { Calculator } from 'lucide-react';
import { Product } from "@/types/catalog";

const CalculatePrice = ({ product }: { product: Product }) => {  
  
  return (
    <a
      href={`/calculator/?pid=${product.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-white px-5 py-2 m-2 rounded-full shadow-lg  hover:shadow-xl transition-all"
    >     

      <Calculator className="text-4xl" />


      {/* Text Block */}
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-black text-lg">Calculate Price</span>
        <span className="text-black font-medium text-sm -mt-0.5">
          Click To Get Final Price
        </span>
      </div>
    </a>
  );
};

export default CalculatePrice;