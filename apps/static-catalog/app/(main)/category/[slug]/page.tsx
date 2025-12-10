import { Metadata } from "next";
import type { NewCatalog, Product, Category } from "@/types/catalog";
import dataRaw from "@/data/catalog.json";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

const data = dataRaw as NewCatalog;
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const driveURL = `${baseURL}/static/img/optimized/`;


let ldjson = {};
// ---- STATIC PARAM GENERATION ----
export async function generateStaticParams() {
    return data.categories.map((cat:Category) => ({
        slug: cat.slug,
    }));
}

// ---- METADATA ----
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;    
    const category = data.categories.find(
        (cat:Category) => cat.slug === slug
    );
    if (!category) return {};

    const filtered = data.products.filter((p:Product)=>p.category === category.name);

    const title = `${category.name} by Sapna Shri Jewellers`;
    const description = `Explore ${filtered.length} ${category} at Sapna Shri Jewellers Nagda Junction. High-quality gold & silver jewelry with BIS 916 certified gold.`;

    const imageUrl =
        filtered.length > 0
            ? `${driveURL}${filtered[0].images[0]}`
            : `${baseURL}/logo.png`;

    const keywords =
        filtered.length > 0
            ? [category.name, ...filtered.slice(0, 10).map((p: Product) => p.name)].join(", ")
            : category.name;

    ldjson = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category} by Sapna Shri Jewellers`,
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
export default async function CategoryPage( { params }: { params: { slug: string } }){
    const { slug } = await params;        
    console.log(slug);
    const category = data.categories.find(
        (cat:Category) => cat.slug === slug
    );
    if (!category) notFound();

    const filtered = data.products.filter((p:Product)=> p.category===category.name);

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* ✅ JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
            />
            <h1 className="text-xl md:text-2xl">{category.name}</h1>
            <p className="text-sm text-muted-foreground mb-4">
                Explore our exclusive collection of {category.name} at Sapna Shri Jewellers
                Nagda. High-quality gold & silver jewellery with BIS 916 certification.
            </p>

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