import fs from "node:fs";
import path from "node:path";
import MiniSearch from "minisearch";

import {
  miniSearchIndexOptions,
  normalize,
} from "../../search/shared";

type Product = {
  id: string;
  name: string;
  highlights?: string[];
  category: string;
  description?: string;
  type?: string[];
  for?: string;
  weight: number;
  metal?: string;
  images?: string[];
  newArrival?: boolean;
  rating?: number;
  ratingCount?: number;
  MRP: number;
  price: number;
};

type SearchProduct = {
  id: string;
  name: string;
  highlights: string;
  category: string;
  description: string;
  type?: string;
  for?: string;
  weight: number;
  metal?: string;
  images?: string[];
  newArrival?: boolean;
  rating?: number;
  ratingCount?: number;
  MRP: number;
  price: number;
};

export default async function buildSearchIndex(): Promise<void> {
  const catalogPath = path.join(
    process.cwd(),
    "data",
    "products.json"
  );

  const catalog = JSON.parse(
    fs.readFileSync(catalogPath, "utf-8")
  ) as Product[];

  const productsForIndex: SearchProduct[] = catalog.map((product) => ({
    id: product.id,
    name: normalize(product.name),
    highlights: normalize(product.highlights?.join(" ")),
    category: normalize(product.category),
    description: normalize(product.description),
    type: product.type?.join(" "),
    for: product.for,
    weight: product.weight,
    metal: product.metal,
    images: product.images,
    newArrival: product.newArrival,
    rating: product.rating,
    ratingCount: product.ratingCount,
    MRP: product.MRP,
    price: product.price,
  }));

  const miniSearch = new MiniSearch<SearchProduct>(
    miniSearchIndexOptions
  );

  miniSearch.addAll(productsForIndex);

  const outputDir = path.join(
    process.cwd(),
    "public",
    "data"
  );

  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(
    outputDir,
    "search-index.json"
  );

  const indexJSON = JSON.stringify(miniSearch);

  fs.writeFileSync(outputPath, indexJSON);

  console.log("✅ Search index built");
  console.log(`📦 Products indexed: ${productsForIndex.length}`);
  console.log(
    `📊 Index size: ${(indexJSON.length / 1024).toFixed(2)} KB`
  );
}
