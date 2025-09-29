import { Link } from "react-router-dom";

export default function ProductCard({ product }) { 
  return (
    
      <Link to={`/product/${product.id}`} className="transition-transform duration-300 hover:scale-105">
        <div className=" border rounded-2xl overflow-hidden shadow hover:shadow-lg">
          <div className=" w-full flex items-center justify-center overflow-hidden rounded-2xl">
            <img
              src={`./images/${product.images[0]}`}
              loading="lazy"
              alt={product.name}
              className="w-full object-cover rounded-2xl "
            />
          </div>
          <div className="p-3">
            <h2 className="font-semibold text-sm md:text-base line-clamp-1">{product.name}</h2>
            
            {/* Purity and Weight row */}
            <div className="flex justify-between text-xs ">
              <span>{product.purity}</span>
              <span>{product.weight} gm</span>
            </div>

            {/* <p className="mt-2 font-bold text-yellow-700 text-sm md:text-base">
              ₹ {Number(price).toLocaleString('en-IN')}
            </p> */}
          </div>
        </div>
      </Link>
    
  );
}
