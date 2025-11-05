import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CategoryCard({ category, products }) {
  if (!products || products.length === 0) return null;

  const driveURL = "https://sapnashrijewellers.github.io/static/img/thumbnail/";
  const firstProduct = products[0]; // for SSG / SEO
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotate images client-side (only for UX)
  useEffect(() => {
    if (products.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [products.length]);

  const currentProduct = products[currentIndex];

  const cardHighlightClass = currentProduct.newArrival
    ? "border-2 border-destructive shadow-md hover:shadow-xl bg-accent text-primary-dark"
    : "border border-border shadow hover:shadow-lg";

  return (
    <Link
      to={`/category/${category}`}
      className="block transition-transform duration-300 hover:scale-105"
    >
      <div
        className={`rounded-2xl flex flex-col h-full bg-card text-card-foreground ${cardHighlightClass}`}
      >
        <h2 className="font-bold text-sm md:text-base p-3 text-center">
          {category}
        </h2>

        <div className="relative w-full overflow-hidden flex-grow pt-[100%]">
          {currentProduct.newArrival && (
            <div
              className="
                absolute top-2 left-2 z-10 bg-accent
                bg-destructive text-destructive-foreground
                text-xs font-bold px-2 py-1 rounded-full shadow-lg
                transform -rotate-3
              "
            >
              ✨ NEW ARRIVAL
            </div>
          )}

          {/* Use firstProduct image for SSG + SEO */}
          <img
            src={`${driveURL}${firstProduct.images[0]}`}
            alt={firstProduct.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />

          {/* Overlay rotated image client-side */}
          {products.length > 1 && currentIndex !== 0 && (
            <img
              src={`${driveURL}${currentProduct.images[0]}`}
              alt={currentProduct.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />
          )}

          {/* Preload next image */}
          <img
            src={`${driveURL}${products[(currentIndex + 1) % products.length].images[0]}`}
            alt={`Preloading ${products[(currentIndex + 1) % products.length].name}`}
            className="hidden"
            loading="lazy"
          />
        </div>

        <div className="p-3">
          <div className="flex justify-between font-medium">
            <span>{currentProduct.purity}</span>
            <span className="font-bold">{currentProduct.weight} gm</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
