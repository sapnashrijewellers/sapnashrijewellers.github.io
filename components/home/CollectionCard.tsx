import type { Collection } from "@/types/catalog";
import Link from "next/link";
import Image from "next/image";

interface CollectionCardProps {
  collection: Collection;
  priority?: boolean;
}

export default function CollectionCard({ collection, priority = false }: CollectionCardProps) {
  return (
    <article className="w-full flex">
      <Link
        href={`/c/${collection.id}/`}
        prefetch={false}
        title={`${collection.name} Collection`}
        aria-label={`Explore ${collection.name} jewellery collection`}
        className="group relative flex flex-col w-full h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary will-change-[transform,box-shadow]"
      >
        {/* Aspect Ratio Container */}
        <div className="relative w-full aspect-square bg-muted/20 overflow-hidden shrink-0">
          <Image
            src={`/collection-cards/${collection.id}.webp`}
            alt={`${collection.name} jewellery collection`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105 will-change-transform"
          />
          
          {/* Collection Name Bar with 60% Black Opacity */}
          <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-center pointer-events-none">
            <h4 className="font-yatra text-base md:text-lg text-white tracking-wide truncate">
              {collection.name}
            </h4>
          </div>
        </div>

        <span className="sr-only">
          Browse {collection.name} collection products
        </span>
      </Link>
    </article>
  );
}