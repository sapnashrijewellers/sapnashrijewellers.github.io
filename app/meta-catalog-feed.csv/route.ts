import { NextResponse } from "next/server";
import products from "@/data/products.json";
import { Product } from "@/types/catalog";

export const dynamic = "force-static";
export const revalidate = false;

const SITE_URL = "https://sapnashrijewellers.in";
const IMAGE_BASE_URL = `${SITE_URL}/static/img/products/optimized`;

function sanitizeText(str?: string): string {
    if (!str) return "";

    return str
        .replace(/<[^>]*>/g, "")   // Remove HTML markup
        .replace(/[\r\n\t]+/g, " ") // Normalize whitespace
        .replace(/\s+/g, " ")
        .trim();
}

function csvEscape(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    const text = String(value);

    // CSV escaping:
    // - double quotes become ""
    // - values containing comma, quote or newline are wrapped in quotes
    if (/[",\r\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
}

function cleanDescription(product: Product): string {
    return (product.description)
        .replace(/\s+/g, " ")
        .trim();
}

function getAvailability(product: Product): string {
    return product.available && product.active ? "in stock" : "out of stock";
}

function getProductUrl(product: Product): string {
    return `${SITE_URL}/p/${product.id}/`;
}

function getImageUrl(filename: string): string {
    return `${IMAGE_BASE_URL}/${encodeURIComponent(filename)}`;
}

export async function GET() {
    const activeProducts = (products as Product[]).filter(
        (product) => product.active === true
    );

    const headers = [
        "id",
        "title",
        "description",
        "availability",
        "condition",
        "price",
        "link",
        "image_link",
        "brand",
        "product_type",
    ];

    const rows = activeProducts.map((product) => {
        const primaryImage = product.images?.[0];

        return [
            product.id,
            product.name,
            cleanDescription(product),
            getAvailability(product),
            "new",
            `${product.price ?? 0} INR`,
            getProductUrl(product),
            primaryImage ? getImageUrl(primaryImage) : "",
            product.brandText,
            product.category,
        ]
            .map(csvEscape)
            .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\r\n");

    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}