import CategoryCard from "../components/CategoryCard";
import data from "../data/data.json";

export default function Home() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {data.sub_categories.map(categoryName => {
          const productsForCategory = data.categorizedProducts[categoryName] || [];
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