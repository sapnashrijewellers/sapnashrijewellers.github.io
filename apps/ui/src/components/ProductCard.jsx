import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const driveURL = "https://sapnashrijewellers.github.io/static/img/thumbnail/";

  const cardHighlightClass = product.newArrival
    ? "border-2 border-accent shadow-md hover:shadow-xl bg-accent text-accent-foreground"
    : "border border-border shadow hover:shadow-lg bg-card text-card-foreground";

  return (
    <Link
      to={`/product/${product.sub_category}/${product.id}`}
      className="block transition-transform duration-300 hover:scale-105"
    >
      <div className={`rounded-2xl overflow-hidden ${cardHighlightClass}`}>
        {/* Image Section */}
        <div
          className="relative w-full flex items-center justify-center overflow-hidden rounded-t-2xl bg-muted"
          style={{ maxHeight: "220px", minHeight: "180px" }}
        >
          {product.newArrival && (
            <div
              className="
                absolute top-2 left-2 z-10
                bg-accent text-accent-foreground
                text-xs font-bold px-2 py-1 rounded-full shadow-lg
                transform -rotate-3
              "
            >
              ✨ NEW ARRIVAL
            </div>
          )}

          <img
            src={`${driveURL}${product.images[0]}`}
            loading="lazy"
            alt={product.name}
            className="w-full h-full object-cover rounded-t-2xl"
          />
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h2 className="">
            {product.name}
          </h2>
          <div className="flex justify-between font-medium mt-1">
            <span>{product.purity}</span>
            <span>{product.weight} gm</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
