import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import ProductCard from "../components/ProductCard";



export default function Category() {
  const { category } = useParams();
  const { categorizedProducts } = useData();

  if (!categorizedProducts) return <p>Loading...</p>;

  const filtered = categorizedProducts[category];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold capitalize">{category}</h1>

      {filtered.length === 0 ? (
        <p className="">इस श्रेणी में कोई उत्पाद नहीं मिला.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard
              key={p.id}              
              product={p}                          
            />
          ))}
        </div>
      )}
    </div>
  );
}
