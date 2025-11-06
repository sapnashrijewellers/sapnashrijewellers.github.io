/**
 * ProductCard Component
 * Optimized for SSG, SEO, and accessibility.
 */
export default function ProductCard({ product }) {
  const driveURL = "https://sapnashrijewellers.github.io/static/img/thumbnail/";

  const cardHighlightClass = product.newArrival
    ? "border-2 border-accent shadow-md hover:shadow-xl bg-accent text-primary"
    : "border border-border shadow hover:shadow-lg bg-card text-primary-dark  ";

  return (
    <article
      className={`rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 ${cardHighlightClass}`}
      itemScope
      itemType="http://schema.org/Product"
      aria-label={`Product: ${product.name}`}
    >
      {/* Image Section */}
      <a
        href={`/product/${encodeURIComponent(product.sub_category)}/${product.id}`}
        className="block relative w-full flex items-center justify-center overflow-hidden rounded-t-2xl bg-muted"
        style={{ maxHeight: "220px", minHeight: "180px" }}
        itemProp="url"
      >
        {product.newArrival && (
          <span
            className="
              absolute top-2 left-2 z-10
              bg-accent text-accent-foreground
              text-xs font-bold px-2 py-1 rounded-full shadow-lg
              transform -rotate-3
            "
            aria-label="New Arrival"
          >
            ✨ NEW ARRIVAL
          </span>
        )}

        <img
          src={`${driveURL}${product.images[0]}`}
          loading="lazy"
          alt={product.name}
          className="w-full h-full object-cover rounded-t-2xl"
          width={220}
          height={180}
          itemProp="image"
        />
      </a>

      {/* Product Info */}
      <div className="p-3">
        <h2 className="text-lg font-semibold" itemProp="name">
          {product.name}
        </h2>
        <div className="flex justify-between font-medium mt-1">
          <span itemProp="material">{product.purity}</span>
          <span itemProp="weight">{product.weight} gm</span>
        </div>
      </div>      
    </article>
  );
}
