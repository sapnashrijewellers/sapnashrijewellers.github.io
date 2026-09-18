import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import JsonLd from '../common/JsonLd';

interface BreadcrumbItem {
  name: string;
  href?: string;
  hindiName?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/+$/, '');

  // Structured Data Schema for Search Engines and LLM scrapers
  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.href && {
        item: item.href.startsWith('http')
          ? item.href
          : `${baseUrl}${item.href.startsWith('/') ? '' : '/'}${item.href}`,
      }),
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={`text-muted-foreground relative flex w-full flex-wrap items-center gap-x-1.5 gap-y-1 px-2 py-1.5 text-xs sm:text-sm ${className}`}
    >
      <JsonLd json={breadcrumbListSchema} />

      {/* Semantic Ordered List */}
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-1.5 gap-y-1 p-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const displayLabel = item.hindiName ? `${item.name} (${item.hindiName})` : item.name;

          return (
            <li key={`${item.name}-${i}`} className="inline-flex items-center whitespace-nowrap">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  title={`Navigate to ${item.name}`}
                  aria-label={`Go to ${item.name} page`}
                  className="text-muted-foreground focus:ring-primary rounded transition-colors duration-150 focus:ring-1 focus:outline-none"
                >
                  <span>{item.name}</span>
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="text-foreground font-medium">
                  {item.name}
                  <span className="sr-only"> (Current page: {displayLabel})</span>
                </span>
              )}

              {!isLast && (
                <ChevronRight
                  className="text-muted-foreground/50 mx-1 h-3.5 w-3.5 shrink-0 select-none"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
