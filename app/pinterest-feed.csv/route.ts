export const dynamic = "force-static";
export const revalidate = false;

import { NextResponse } from "next/server";
import products from "@/data/products.json";
import { Product } from "@/types/catalog";

const SITE_URL = "https://sapnashrijewellers.in";
const IMAGE_BASE_URL = `${SITE_URL}/static/img/products/optimized`;

function sanitizeText(str?: string): string {
    if (!str) return "";

    return str
        .replace(/<[^>]*>/g, "")
        .replace(/[\r\n\t]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function csvEscape(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    const text = String(value);

    if (/[",\r\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
}

function getAvailability(product: Product): string {
    return product.available && product.active
        ? "in stock"
        : "out of stock";
}

function getProductUrl(product: Product): string {
    return `${SITE_URL}/p/${product.id}/`;
}

function getImageUrl(filename: string): string {
    return `${IMAGE_BASE_URL}/${encodeURIComponent(filename)}`;
}

function getGender(product: Product): string {
    switch (product.for?.toLowerCase()) {
        case "him":
            return "male";

        case "her":
            return "female";

        default:
            return "unisex";
    }
}

function getMaterial(product: Product): string {
    switch (product.metal?.toLowerCase()) {
        case "gold":
            return "gold";

        case "silver":
            return "silver";

        default:
            return "";
    }
}

function getProductType(product: Product): string {
    const category = sanitizeText(product.category);

    if (!category) {
        return "Jewellery";
    }

    return `Jewellery > ${category}`;
}

export async function GET() {
    const activeProducts = (products as Product[]).filter(
        (product) => product.active === true
    );

    const headers = [
        "id",
        "title",
        "description",
        "link",
        "image_link",
        "price",
        "availability",
        "brand",
        "product_type",
        "additional_image_link",
        "condition",
        "gender",
        "material",
    ];

    const rows = activeProducts.map((product) => {
        const images = product.images ?? [];

        const primaryImage = images[0];

        const additionalImages = images
            .slice(1, 11)
            .map(getImageUrl)
            .join(",");

        return [
            product.id,
            sanitizeText(product.name),
            sanitizeText(product.description),
            getProductUrl(product),
            primaryImage ? getImageUrl(primaryImage) : "",
            `${product.price ?? 0} INR`,
            getAvailability(product),
            "Sapna Shri Jewellers",
            getProductType(product),
            additionalImages,
            "new",
            getGender(product),
            getMaterial(product),
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