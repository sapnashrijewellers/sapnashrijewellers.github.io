import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import data from "../data/data.json";
import { renderSEOTags } from "../utils/SEO";


export default function Category() {
  const { category } = useParams();
  const filtered = data.categorizedProducts[category];
  // ✅ Dynamic Open Graph + Twitter meta tags

  const title = `${category} by Sapna Shri Jewellers`;
  const description = `Explore ${filtered.length} ${category} at Sapna Shri Jewellers Nagda. High-quality gold & silver jewellery with BIS 916 certification.`;
  const baseURL = "https://sapnashrijewellers.github.io";
  const driveURL = `${baseURL}/static/img/optimized/`;
  const imageUrl = filtered.length ? `${driveURL}${filtered[0].images[0]}` : `${baseURL}/logo.png`;
  const keywords = filtered.length > 0
  ? [category, ...filtered.slice(0, 10).map(p => p.name)].join(", ")
  : category;
  const ldjson = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category} by Sapna Shri Jewellers`,
    "description": `Explore ${filtered.length} ${category} at Sapna Shri Jewellers Nagda. High-quality gold & silver jewellery with BIS 916 certification.`,
    "url": `${baseURL}/category/${category}`,
    "mainEntity": filtered.map((p) => ({
      "@type": "Product",
      "name": p.name,
      "image": `${driveURL}${p.images[0]}`,
      "url": `${baseURL}/product/${p.id}`
    }))
  };
  return (
    <>
      {renderSEOTags(
        title,
        description,
        imageUrl,
        `${baseURL}/category/${category}`,
        keywords,
        ldjson
      )}
      <div className="space-y-6 max-w-6xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold capitalize">{category}</h1>
<p className="text-sm text-muted-foreground mb-4">
    Explore our exclusive collection of {category} at Sapna Shri Jewellers Nagda. 
    High-quality gold & silver jewellery with BIS 916 certification.
  </p>
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
    </>
  );
}
