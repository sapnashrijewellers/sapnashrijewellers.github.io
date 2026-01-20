import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/catalog";

function groupByCategory<T extends { category: string }>(products: T[]) {
    return products.reduce<Record<string, T[]>>((acc, product) => {
        const key = product.category;
        if (!acc[key]) acc[key] = [];
        acc[key].push(product);
        return acc;
    }, {});
}

const NewArrivals = ({ products, product = undefined }: { products: Product[], product?: Product }) => {
    let newArrivals;
    if (product === undefined)
        newArrivals = Object.values(
            groupByCategory(
                products.filter(p => p.active && p.newArrival)))
            .map(categoryProducts =>
                categoryProducts
                    .sort((a, b) =>                        
                        Number(b.available) - Number(a.available) ||                        
                        a.weight - b.weight
                    )[0] 
            )
    else
        newArrivals = products
            .filter(p => p.active && p.newArrival && p.purity === product.purity)
            .sort((a, b) => Number(b.available) - Number(a.available))
            .slice(0, 15);

    if (newArrivals.length === 0) return null;

    return (
        <div className="relative">
            <h2 className={` ${!product ? "au-h2" : ""} text-2xl p-2 font-semibold`}>New Arrivals</h2>
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