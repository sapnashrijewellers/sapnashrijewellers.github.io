import { useData } from "../context/DataContext";
import ProductCard from "../components/ProductCard";
//import { calculatePrice } from "../utils/calrate";
export default function Home() {

  const { products, rates } = useData();

  if (!products || !rates) return <p>Loading...</p>;

  const handpicked = products.filter(p => p.handpicked);
  const newArrivals = products.filter(p => p.newArrival);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold">✨ आपके लिए चुना गया...</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {handpicked.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            //price={calculatePrice(p, rates)}
          />
        ))}
      </div>
      <h1 className="text-xl md:text-2xl font-bold">हाल ही में आए हुए...</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {newArrivals.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            //price={calculatePrice(p, rates)}
          />
        ))}
      </div>
    </div>
  );
}
