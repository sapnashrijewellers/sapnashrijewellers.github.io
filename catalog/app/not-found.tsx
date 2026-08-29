'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname) return;

    // Get the last non-empty URL segment
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments.at(-1);

    if (!lastSegment) {
      router.replace('/search');
      return;
    }

    // Convert URL segment into a human-readable search query
    const query = decodeURIComponent(lastSegment)
      .replace(/-/g, ' ')
      .trim();

    if (query) {
      router.replace(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.replace('/search');
    }
  }, [pathname, router]);

  return (
    <main>
      <h1>Page not found</h1>
      <p>Looking for something similar...</p>
    </main>
  );
}