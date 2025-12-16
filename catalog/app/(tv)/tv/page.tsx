"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/catalog";
import products from "@/data/products.json";
import categories from "@/data/categories.json";


const baseURL = process.env.BASE_URL;
const driveURL = `${baseURL}/img/products/optimized/`;

export default function TV() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);

      // delay before switching image
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % categories.length);
        setFade(true);
      }, 1000);
    }, 10000); // switch every 10s

    return () => clearInterval(interval);
  }, []);

  const subCategory = categories[currentIndex];
  const productList = products.filter(p=> p.category==subCategory.name);
  const product: Product = productList ? productList[0] : ({} as Product);

  if (!product) return <div>Loading product...</div>;

  return (
    <div
      className={`transition-opacity duration-1000 ${
        fade ? "opacity-100" : "opacity-0"
      } flex flex-col md:grid md:grid-cols-2 gap-2 w-full h-full p-2 overflow-hidden`}
    >
      {/* Image panel */}
      <div className="w-full h-full flex justify-start items-start">
        {product.images?.[0] && (
          <Image
            src={`${driveURL}${product.images[0]}`}
            alt={product.name}
            width={800}
            height={800}
            className="w-full h-auto object-contain rounded-2xl"
            priority
          />
        )}
      </div>

      {/* Details panel */}
      <div className="flex flex-col gap-3 p-2 text-2xl leading-tight overflow-hidden">
        <div>
          <h1 className="mb-2">{product.name}</h1>
          <p>
            <b>शुद्धता:</b> {product.purity}
          </p>
          <p>
            <b>वज़न:</b> {product.weight} g
          </p>
        </div>
      </div>
    </div>
  );
}
