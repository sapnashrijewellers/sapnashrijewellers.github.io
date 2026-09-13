import CollectionCard from "./CollectionCard";
import type { Collection } from "@/types/catalog";
import collections from "@/data/collections.json"

type Material = "Gold" | "Silver";

interface SignatureCollectionsProps {  
  className?: string;
}

const filteredCollections = collections
  .filter(c => c.active)
  .sort((a: Collection, b: Collection) => b.rank - a.rank);

export default function SignatureCollections({
  className = ""
}: SignatureCollectionsProps) {

  return (
    <section
      id="shop-by-collection"
      aria-labelledby="Signature collections"
      className={`relative w-full ${className}`}
    >
      {/* Header */}
      <div className="flex items-baseline justify-between">
        <h2>
          Our Signature Collections
        </h2>
      </div>

      {/* Uniform Width Collection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 w-full items-stretch">
        {collections.map((cat, index) => {
          return (
            <div key={cat.name} className="w-full flex">
              <CollectionCard
                collection={cat}                
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}