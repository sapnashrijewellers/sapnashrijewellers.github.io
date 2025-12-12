import { Metadata } from "next";
import type { NewCatalog, Product } from "@/types/catalog";
import products from "@/data/catalog.json";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import NativeShare from "@/components/NativeShare";

import {
  FaWhatsapp,
  FaTelegramPlane,
  FaSnapchatGhost,
  FaInstagram,  
} from "react-icons/fa";


const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const driveURL = `${baseURL}/static/img/optimized/`;
const phone = "918234042231";


export async function generateStaticParams() {
  return products.map((p: Product) => ({
    slug: p.slug
  }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {    
  const  slug  = await params; 
  
  const product = products.find(
    (p:Product) => p.slug === slug.slug
  ); 

  if (!product) return {};

  const baseProductUrl =
    `${baseURL}/product/${product.slug}`;

  const driveURL = `${baseURL}/static/img/optimized/`;
  const title = `${product.name} | ${product.metaDescription} by Sapna Shri Jewellers`;
  const description = `${product.metaDescription}`;
  const imageUrl = `${driveURL}${product.images?.[0]}`;
  const keywords = product.keywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: baseProductUrl,
      type: "website",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: baseProductUrl,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(
    (p: Product) => p.slug === slug && p.active
  );

  if (!product) {    
    return notFound();
  }

  const baseProductUrl = `${baseURL}/product/${product.slug}`;

  const whatsappUrl = `https://wa.me/${phone}?text=${(
    `Hi, I want more details and discount on ${baseProductUrl}`
  )}`;
  const encodedUrl = (baseProductUrl);
  const encodedText = (`Check out this product: ${product.name}`);
  const whatsappShare = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  const telegramShare = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  const snapchatShare = `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`;
  const instagramShare = `https://www.instagram.com/?url=${encodedUrl}`;
  const ldjson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images[0],
    description: `${product.metaDescription}`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Sapna Shri Jewellers",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: 10,
      availability: "https://schema.org/InStock",
      url: baseProductUrl,
    },
  };

  return (

    <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-6 py-6 px-3">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
      />
      {/* ✅ Client-side gallery */}
      <ProductGallery product={product} driveURL={driveURL} />

      {/* ✅ Product Details */}
      <div className="p-2">
        <h1 className="text-2xl md:text-3xl mb-2">{product.name}</h1>

        <div className="space-y-1 mb-4">
          <p>
            <b>शुद्धता:</b> {product.purity}
          </p>
          <p>
            <b>वज़न:</b> {product.weight} g
          </p>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-4 mb-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-4xl md:text-5xl !text-green-500 hover:text-green-600 transition-transform hover:scale-110"
          >
            <FaWhatsapp />
          </a>
          <span>
            अधिक जानकारी के लिए{" "}
            <a href="tel:8234042231" className="underline font-medium">
              8234042231
            </a>{" "}
            पर संपर्क करें...
          </span>
        </div>

        {/* Highlights */}
        {product.highlights?.length > 0 && (
          <ul className="list-disc list-inside space-y-1 mb-4">
            {product.highlights.map((point: string, i: number) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        )}

        {/* Share */}
        <div className="border-t pt-4 mt-4">
          <h2 className="text-lg  mb-3">Share this product</h2>
          <div className="flex gap-5 items-center flex-wrap">
            <a
              href={whatsappShare}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl !text-green-500 hover:scale-110 transition-transform"
            >
              <FaWhatsapp />
            </a>
            <a
              href={telegramShare}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl !text-sky-500 hover:scale-110 transition-transform"
            >
              <FaTelegramPlane />
            </a>
            <a
              href={snapchatShare}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl !text-yellow-400 hover:scale-110 transition-transform"
            >
              <FaSnapchatGhost />
            </a>
            <a
              href={instagramShare}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl !text-pink-500 hover:scale-110 transition-transform"
            >
              <FaInstagram />
            </a>
            <NativeShare
              productName={product.name}
              productUrl={baseProductUrl}
              phone="8234042231" />
          </div>
        </div>
      </div>
    </div>
  );
}
