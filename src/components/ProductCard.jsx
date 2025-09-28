import { Link } from "react-router-dom";
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

export default function ProductCard({ product, price }) { 
  return (
    <Card>
      <Link to={`/product/${product.id}`}>
        <div className="border rounded-2xl overflow-hidden shadow hover:shadow-lg transition bg-white">
          <div className="w-full flex items-center justify-center bg-gray-50 overflow-hidden">
            <img
              src={`./images/${product.images[0]}`}
              loading="lazy"
              alt={product.name}
              className="h-[100px] object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="p-3">
            <h2 className="text-black font-semibold text-sm md:text-base line-clamp-1">{product.name}</h2>
            
            {/* Purity and Weight row */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{product.purity}</span>
              <span>{product.weight} gm</span>
            </div>

            {/* <p className="mt-2 font-bold text-yellow-700 text-sm md:text-base">
              ₹ {Number(price).toLocaleString('en-IN')}
            </p> */}
          </div>
        </div>
      </Link>
    </Card>
  );
}
