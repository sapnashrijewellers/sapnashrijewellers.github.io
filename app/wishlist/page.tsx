'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import products from '@/data/products.json';
import Breadcrumb from '@/components/navbar/BreadcrumbItem';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(stored);
    };

    load();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'wishlist') load();
    };

    const onCustom = () => load();

    window.addEventListener('storage', onStorage);
    window.addEventListener('wishlist-updated', onCustom);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('wishlist-updated', onCustom);
    };
  }, []);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id.toString()));

  return (
    <main className="container mx-auto max-w-7xl px-4 py-4">
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Wish-list' }]} />
      <h2 className="mb-4">My Wishlist ❤️</h2>

      {wishlistProducts.length === 0 ? (
        <p className="text-muted-foreground text-sm">Your wishlist is empty. Browse products and add some!</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
