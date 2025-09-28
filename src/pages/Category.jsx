import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import ProductCard from "../components/ProductCard";
//import { calculatePrice } from "../utils/calrate";


export default function Category() {
  const { category } = useParams();
const { products, rates } = useData();

if (!products || !rates) return <p>Loading...</p>;
  
  const filtered = products.filter(
    p => p.category.toLowerCase() === category.toLowerCase()
  );  

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold capitalize">{category}</h1>

      {filtered.length === 0 ? (
        <p className="text-gray-500">इस श्रेणी में कोई उत्पाद नहीं मिला.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              //price={calculatePrice(p, rates)}              
            />
          ))}
        </div>
      )}
    </div>
  );
}
