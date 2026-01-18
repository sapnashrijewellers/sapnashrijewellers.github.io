"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const ldjson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href,
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="
        flex flex-wrap items-center
        gap-x-1 gap-y-1 px-2
        text-sm text-muted-foreground mb-4
      "
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
      />

      {items.map((item, i) => (
        <span
          key={i}
          className="inline-flex items-center whitespace-nowrap"
        >
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-accent transition-colors"
            >
              {item.name}
            </Link>
          ) : (
            <span className="text-accent font-medium">
              {item.name}
            </span>
          )}

          {i < items.length - 1 && (
            <ChevronRight
              size={14}
              className="mx-1 text-gray-400 shrink-0"
            />
          )}
        </span>
      ))}
    </nav>
  );
}
