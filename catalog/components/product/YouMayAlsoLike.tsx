import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/catalog";

const NewArrivals = ({ product, products }: { product:Product, products: Product[] }) => {
      const youMayAlsoLike = products
        .filter(p => p.active && product.type.some(t => p.type.includes(t)) && p.for === product.for && !p.newArrival)
        .sort((a, b) => Number(b.available) - Number(a.available))
        .slice(0, 15);  
    if (youMayAlsoLike.length === 0) return null;

    return (
        <div className="relative">
            <h2 className="text-2xl p-2 font-semibold">You May Also Like</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
                {youMayAlsoLike.map((p: Product) => (
                    <div key={p.id} className="flex-shrink-0 w-[160px] sm:w-[200px] lg:w-[220px] snap-start">
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewArrivals;