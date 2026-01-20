
import RotatingBanner from "@/components/banners/RotatingBanner";
import JewelleryTypeBar from "@/components/home/JewelleryType"
import TestimonialScroller from "@/components/common/Testimonials"
import SignatureCollections from "@/components/home/SignatureCollections";
import NewArrivals from "@/components/product/NewArrivals";
import WishlistBar from "@/components/common/WishlistBar";

import categories from "@/data/categories.json";
import products from "@/data/products.json";


const title = `Sapna Shri Jewellers`;
const description = `Explore out latest products at Sapna Shri Jewellers Nagda. High-quality gold & silver jewellery with BIS 916 certification.`;
const baseURL = process.env.BASE_URL;
const imageUrl = `${baseURL}/android-chrome-512x512.png`;
const keywords = "Sapna Shri Jewellers Nagda. High-quality gold & silver jewellery with BIS 916 certification";


export async function generateMetadata() {


  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: baseURL,
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
      canonical: baseURL,
    },
  };

}

export default function Home() {
  return (
    <div className="container mx-auto">

      <RotatingBanner page="home" />

      <JewelleryTypeBar home={false} />

      <WishlistBar /> 

      <NewArrivals products={products} />

      <TestimonialScroller />
      
      <SignatureCollections categories={categories} products={products} />

    </div>
  );
}