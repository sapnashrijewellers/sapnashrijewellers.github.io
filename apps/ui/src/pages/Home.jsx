import { useData } from "../context/DataContext";
import CategoryCard from "../components/CategoryCard";

export default function Home() {
  const { sub_categories, categorizedProducts } = useData();

  if (!sub_categories || !categorizedProducts) return <p>Loading...</p>;  

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {sub_categories.map(categoryName => {
          const productsForCategory = categorizedProducts[categoryName] || [];
          if (productsForCategory.length === 0) {
            return null;
          }

          return (
            <CategoryCard
              key={categoryName}
              category={categoryName}
              products={productsForCategory}
            />
          );
        })}
      </div>
    </div>
  );
}