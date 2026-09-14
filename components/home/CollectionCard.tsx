import type { Collection } from "@/types/catalog";
import Link from "next/link";
import Image from "next/image";

interface CollectionCardProps {
  collection: Collection;
  priority?: boolean;
}

export default function CollectionCard({ collection }: CollectionCardProps) {    
  const baseImageURL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;    
    
  const imageUrl =  `${baseImageURL}/collection/optimized/${collection.image}`;   

  return (
    <article className="w-full flex">
      <Link
        href={`/c/${collection.id}/`}
        prefetch={false}
        title={`${collection.name} Collection`}
        aria-label={`Explore ${collection.name} jewellery collection`}
        className="group relative flex flex-col w-full h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary will-change-[transform,box-shadow]"
      >
        {/* Aspect Ratio Box (Width-Filling Responsive Container) */}
        <div className="relative w-full aspect-square bg-muted/20 overflow-hidden shrink-0">
          
          <Image
            src={`/collection-cards/${collection.id}.webp`}
            alt={`${collection.name} jewellery collection`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"            
            loading="lazy"
            fetchPriority= "auto"
            decoding= "async"
            className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105 will-change-transform"
          />
        </div>

        {/* Collection Label */}
        <div className="flex flex-col items-center justify-center p-3 grow">
          <h4 className="text-center font-yatra text-lg text-foreground transition-colors duration-150">
            {collection.name}
          </h4>
          <span className="sr-only">
            Browse {collection.name} collection products
          </span>
        </div>
      </Link>
    </article>
  );
}