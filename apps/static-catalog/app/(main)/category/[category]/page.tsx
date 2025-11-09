import type { CatalogData, Product } from "@/types/catalog";
import dataRaw from "@/data/data.json";
import ProductCard from "@/components/ProductCard";

import { toSlug } from "@/utils/slug";
import { notFound } from "next/navigation";

const data = dataRaw as CatalogData;

interface CategoryPageProps {
    params: {
        category: string;
    };
}

let ldjson = {};
// ---- STATIC PARAM GENERATION ----
export async function generateStaticParams() {
    return data.sub_categories.map((cat) => ({
        category: (toSlug(cat)),
    }));
}

// ---- METADATA ----
export async function generateMetadata({ params }: CategoryPageProps) {
    const { category: slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const category = data.sub_categories.find(
        (cat) => toSlug(cat) === decodedSlug
    );
    if (!category) return {};

    const filtered = data.categorizedProducts[category] || [];

    const title = `${category} by Sapna Shri Jewellers`;
    const description = `Explore ${filtered.length} ${category} at Sapna Shri Jewellers Nagda Junction. High-quality gold & silver jewelry with BIS 916 certified gold.`;
    const baseURL = "https://sapnashrijewellers.github.io";
    const driveURL = `${baseURL}/static/img/optimized/`;
    const imageUrl =
        filtered.length > 0
            ? `${driveURL}${filtered[0].images[0]}`
            : `${baseURL}/logo.png`;

    const keywords =
        filtered.length > 0
            ? [category, ...filtered.slice(0, 10).map((p: Product) => p.name)].join(", ")
            : category;

    ldjson = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category} by Sapna Shri Jewellers`,
        description,
        url: `${baseURL}/category/${slug}`,
        mainEntity: filtered.map((p:Product) => ({
            "@type": "Product",
            name: p.name,
            image: `${driveURL}${p.images[0]}`,
            url: `${baseURL}/product/${p.id}`,
        })),
    };

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            url: `${baseURL}/category/${slug}`,
            images: [{ url: imageUrl }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `${baseURL}/category/${slug}`,
        },
    };
}

// ---- MAIN PAGE ----
export default async function CategoryPage({ params }: CategoryPageProps) { // ✅ make it async
    const { category: slug } = await params; // ✅ no await needed here either
    const decodedSlug = decodeURIComponent(slug);
    console.log(decodedSlug);
    const category = data.sub_categories.find(
        (cat) => toSlug(cat) === decodedSlug
    );

    if (!category) notFound();

    const filtered = data.categorizedProducts[category] || [];

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* ✅ JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
            />
            <h1 className="text-xl md:text-2xl">{category}</h1>
            <p className="text-sm text-muted-foreground mb-4">
                Explore our exclusive collection of {category} at Sapna Shri Jewellers
                Nagda. High-quality gold & silver jewellery with BIS 916 certification.
            </p>

            {filtered.length === 0 ? (
                <p>इस श्रेणी में कोई उत्पाद नहीं मिला.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((p:Product) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}