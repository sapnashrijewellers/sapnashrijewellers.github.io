import { Metadata } from "next";
import type { Product, Category } from "@/types/catalog";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import ProductCard from "@/components/product/ProductCard";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";


const baseURL = process.env.BASE_URL;
const driveURL = `${baseURL}/static/img/products/thumbnail/`;


let ldjson = {};
export async function generateStaticParams() {
    return categories
        .filter((c: Category) => c.active)
        .flatMap((cat: Category) => {
            const nameSlug = encodeURIComponent(
                cat.name.replace(/\s+/g, "-")
            );

            return [
                { slug: cat.slug },   // /category/rings
                { slug: nameSlug },   // /category/सोने-की-चूड़ी
            ];
        });
}

// ---- METADATA ----
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const category = categories.find(
        (cat: Category) => cat.slug === slug
    );
    if (!category) return {};

    const filtered = products.filter((p: Product) =>
        p.category === category.name &&
        p.active
        && p.weight > 0
        && p.name.length > 4);

    const title = `${category.name} | ${category.englishName} by Sapna Shri Jewellers`;
    const description = category.description;

    const imageUrl =
        filtered.length > 0
            ? `${driveURL}${filtered[0].images[0]}`
            : `${baseURL}/logo.png`;

    const keywords = category.keywords;

    ldjson = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category.name} | ${category.englishName} `,
        description,
        url: `${baseURL}/category/${slug}`,
        mainEntity: filtered.map((p: Product) => ({
            "@type": "Product",
            name: p.name,
            image: `${driveURL}${p.images[0]}`,
            url: `${baseURL}/product/${p.slug}}`,
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
export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    let category = categories.find(
        (cat: Category) => cat.slug === slug && cat.active
    );

    if (!category) {
        category = categories.find(
            (c: Category) =>
                c.active &&
                c.name === decodeURIComponent(slug).replace(/-/g, " ")
        );
    }
    if (!category) notFound();

    const filtered = products.filter((p: Product) => p.category === category.name && p.active)
        .sort((a: Product, b: Product) => {
            // If 'a' is available and 'b' is not, 'a' comes first (negative number)
            if (a.available && !b.available) {
                return -1;
            }
            // If 'b' is available and 'a' is not, 'b' comes first (positive number)
            if (!a.available && b.available) {
                return 1;
            }
            // Otherwise, maintain relative order or treat them as equal
            return 0;
        });

    return (
        <div className="container mx-auto">
            <Breadcrumb items={[{ name: "Home", href: "/" }, { name: category.name }]} />
            {/* ✅ JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
            />
            <div className="pl-4 border-l-4 border-primary/70 mb-4">
                <h1 className="text-2xl md:text-3xl font-yatra font-bold text-primary-dark">
                    {category.name} | {category.englishName}
                </h1>
                <p className="mt-1 text-sm md:text-base text-muted-foreground/90 leading-relaxed font-playfair">
                    {category.description}
                </p>
            </div>
            {filtered.length === 0 ? (
                <p>इस श्रेणी में कोई उत्पाद नहीं मिला.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((p: Product) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}