import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const driveURL = 'https://sapnashrijewellers.github.io/static/img/';
  return (
    <Link
      to={`/product/${product.id}`}
      className="transition-transform duration-300 hover:scale-105"
    >
      <div className="border rounded-2xl overflow-hidden shadow hover:shadow-lg">
        {/* Image Container with fixed height */}
        <div className="w-full flex items-center justify-center overflow-hidden rounded-t-2xl bg-gray-50" 
             style={{ maxHeight: "220px", minHeight: "180px" }}>
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
