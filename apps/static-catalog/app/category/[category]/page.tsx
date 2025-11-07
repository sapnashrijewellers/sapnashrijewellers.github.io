import ProductCard from "../../../components/ProductCard";
import data from "../../../data/data.json";
import { renderSEOTags } from "../../../utils/SEO";
import { toSlug } from "../../../utils/slug";
import { notFound } from "next/navigation";

// ---- STATIC PARAM GENERATION ----
export async function generateStaticParams() {
    // make it sync (no await needed)
    return data.sub_categories.map((cat) => ({
        category: toSlug(cat),
    }));
}

// ---- METADATA ----
export async function generateMetadata({ params }) {
    const { category: slug } = await params; // ✅ no await needed here, params already resolved
    const decodedSlug = decodeURIComponent(slug);
    const category = data.sub_categories.find(
        (cat) => toSlug(cat) === decodedSlug
    );
    if (!category) return {};

    const filtered = data.categorizedProducts[category] || [];

    const title = `${category} by Sapna Shri Jewellers`;
    const description = `Explore ${filtered.length} ${category} at Sapna Shri Jewellers Nagda. High-quality gold & silver jewellery with BIS 916 certification.`;
    const baseURL = "https://sapnashrijewellers.github.io";
    const driveURL = `${baseURL}/static/img/optimized/`;
    const imageUrl =
        filtered.length > 0
            ? `${driveURL}${filtered[0].images[0]}`
            : `${baseURL}/logo.png`;

    const keywords =
        filtered.length > 0
            ? [category, ...filtered.slice(0, 10).map((p) => p.name)].join(", ")
            : category;

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
    };
}

// ---- MAIN PAGE ----
export default async function CategoryPage({ params }) { // ✅ make it async
    const { category: slug } = await params; // ✅ no await needed here either
    const decodedSlug = decodeURIComponent(slug);
    const category = data.sub_categories.find(
        (cat) => toSlug(cat) === decodedSlug
    );

    if (!category) notFound();

    const filtered = data.categorizedProducts[category] || [];

    const title = `${category} by Sapna Shri Jewellers`;
    const description = `Explore ${filtered.length} ${category} at Sapna Shri Jewellers Nagda. High-quality gold & silver jewellery with BIS 916 certification.`;
    const baseURL = "https://sapnashrijewellers.github.io";
    const driveURL = `${baseURL}/static/img/optimized/`;
    const imageUrl =
        filtered.length > 0
            ? `${driveURL}${filtered[0].images[0]}`
            : `${baseURL}/logo.png`;
    const keywords =
        filtered.length > 0
            ? [category, ...filtered.slice(0, 10).map((p) => p.name)].join(", ")
            : category;

    const ldjson = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category} by Sapna Shri Jewellers`,
        description,
        url: `${baseURL}/category/${slug}`,
        mainEntity: filtered.map((p) => ({
            "@type": "Product",
            name: p.name,
            image: `${driveURL}${p.images[0]}`,
            url: `${baseURL}/product/${p.id}`,
        })),
    };

    return (
        <>
            {renderSEOTags(
                title,
                description,
                imageUrl,
                `${baseURL}/category/${slug}`,
                keywords,
                ldjson
            )}

            <div className="space-y-6 max-w-6xl mx-auto">
                <h1 className="text-xl md:text-2xl">{category}</h1>
                <p className="text-sm text-muted-foreground mb-4">
                    Explore our exclusive collection of {category} at Sapna Shri Jewellers
                    Nagda. High-quality gold & silver jewellery with BIS 916 certification.
                </p>

                {filtered.length === 0 ? (
                    <p>इस श्रेणी में कोई उत्पाद नहीं मिला.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filtered.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
