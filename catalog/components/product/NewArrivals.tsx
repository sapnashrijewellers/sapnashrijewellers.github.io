import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/catalog";

const NewArrivals = ({ products }: { products: Product[] }) => {
    const newArrivals = products
        .filter(p => p.active && p.newArrival)        
        .sort((a, b) => Number(b.available) - Number(a.available))         
        .slice(0, 15);    
    if (newArrivals.length === 0) return null;

    return (
        <div className="relative">
            <h2 className="text-2xl p-2 font-semibold">New Arrivals</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
                {newArrivals.map((p: Product) => (
                    <div key={p.id} className="flex-shrink-0 w-[160px] sm:w-[200px] lg:w-[220px] snap-start">
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewArrivals;