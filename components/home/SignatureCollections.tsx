import CollectionCard from './CollectionCard';
import type { Collection } from '@/types/catalog';
import collections from '@/data/collections.json';
import SectionHeading from '../common/SectionHeading';

interface SignatureCollectionsProps {
  className?: string;
}

const filteredCollections = collections.filter((c) => c.active).sort((a: Collection, b: Collection) => a.rank - b.rank);

export default function SignatureCollections({ className = '' }: SignatureCollectionsProps) {
  return (
    <section
      id="shop-by-collection"
      aria-labelledby="Signature collections"
      className={`relative w-full py-4 ${className}`}
    >
      <SectionHeading
        heading="Our Signature Collections"
        punchline="Masterfully handcrafted creations that define our legacy and your personal elegance."
      />

      <div className="grid w-full grid-cols-1 items-stretch gap-3 p-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {filteredCollections.map((cat) => {
          return (
            <div key={cat.name} className="flex w-full">
              <CollectionCard collection={cat} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
