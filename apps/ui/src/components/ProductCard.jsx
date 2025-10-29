import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const driveURL = 'https://sapnashrijewellers.github.io/static/img/';

  
  const cardHighlightClass = product.newArraval
    ? 'border-2 border-red-500 shadow-md hover:shadow-xl' // Highlighted
    : 'border shadow hover:shadow-lg'; // Normal

  return (
    <Link
      to={`/product/${product.sub_category}/${product.id}`}
      className="transition-transform duration-300 hover:scale-105 block" // Added 'block' for full link coverage
    >      
      <div className={`rounded-2xl overflow-hidden ${cardHighlightClass}`}>
        <div 
             className="relative w-full flex items-center justify-center overflow-hidden rounded-t-2xl bg-gray-50" 
             style={{ maxHeight: "220px", minHeight: "180px" }}
        >         
          
          {product.newArrival && (
              <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg transform rotate-[-5deg]">
                  ✨ NEW ARRIVAL
              </div>
          )}

          <img
            src={`${driveURL}${product.images[0]}`}
            loading="lazy"
            alt={product.name}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h2 className="font-semibold text-sm md:text-base line-clamp-1">
            {product.name}
          </h2>

          <div className="flex justify-between text-xs">
            <span>{product.purity}</span>
            <span>{product.weight} gm</span>
          </div>
        </div>
      </div>
    </Link>
  );
}