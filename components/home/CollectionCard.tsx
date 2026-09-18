import type { Collection } from '@/types/catalog';
import Link from 'next/link';
import Image from 'next/image';

interface CollectionCardProps {
  collection: Collection;
  priority?: boolean;
}

export default function CollectionCard({ collection, priority = false }: CollectionCardProps) {
  return (
    <article className="flex w-full">
      <Link
        href={`/c/${collection.id}/`}
        prefetch={false}
        title={`${collection.name} Collection`}
        aria-label={`Explore ${collection.name} jewellery collection`}
        className="group focus:ring-primary relative flex h-full w-full flex-col overflow-hidden rounded-2xl shadow-sm transition-[transform,box-shadow] duration-200 ease-out will-change-[transform,box-shadow] hover:-translate-y-1 hover:shadow-xl focus:ring-2 focus:outline-none"
      >
        {/* Aspect Ratio Container */}
        <div className="bg-muted/20 relative aspect-square w-full shrink-0 overflow-hidden">
          <Image
            src={`/collection-cards/${collection.id}.webp`}
            alt={`${collection.name} jewellery collection`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="object-cover object-center transition-transform duration-300 ease-out will-change-transform group-hover:scale-105"
          />

          {/* Collection Name Bar with 60% Black Opacity */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2 text-center">
            <h4 className="truncate text-base md:text-lg">{collection.name}</h4>
          </div>
        </div>

        <span className="sr-only">Browse {collection.name} collection products</span>
      </Link>
    </article>
  );
}
