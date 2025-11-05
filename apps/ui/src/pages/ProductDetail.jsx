import { useParams } from "react-router-dom";
import { useState } from "react";
import { renderSEOTags } from "../utils/SEO";
import data from "../data/data.json";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaSnapchatGhost,
  FaInstagram,
  FaShareAlt,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductDetail() {
  const { id, category } = useParams();
  const [activeImage, setActiveImage] = useState(null);
  const baseURL = "https://sapnashrijewellers.github.io";
  const driveURL = "https://sapnashrijewellers.github.io/static/img/optimized/";
  const phone = "918234042231";
  const baseProductUrl = `https://sapnashrijewellers.github.io/product/${encodeURIComponent(category)}/${encodeURIComponent(id)}`;



  const product = data.categorizedProducts?.[category]?.find(
    (p) => p.id.toString() === id.toString());

  if (!product) return <p>Product not found.</p>;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    `Hi, I want more details and discount on ${baseProductUrl}`
  )}`;

  const encodedUrl = encodeURIComponent(baseProductUrl);
  const encodedText = encodeURIComponent(`Check out this product: ${product.name}`);
  const whatsappShare = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  const telegramShare = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  const snapchatShare = `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`;
  const instagramShare = `https://www.instagram.com/?url=${encodedUrl}`;

  const handleImageClick = (img) => setActiveImage(img);
  const closeImageModal = () => setActiveImage(null);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product from Sapna Shri Jewellers`,
          url: baseProductUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert("Native sharing is not supported on this device.");
    }
  };

  // ✅ Dynamic Open Graph + Twitter meta tags

  const title = `${product.name} | Sapna Shri Jewellers`;
  const description = `Explore ${product.name} — pure ${product.purity}, weighing ${product.weight}g.`;
  const imageUrl = `${driveURL}${product.images?.[0]}`;
  
  injectProductLDJson(product, baseURL)
  return (
    <>
      {/* 👇 These tags will be statically embedded during SSG */}
      {renderSEOTags(title, description, imageUrl, baseProductUrl)}
      {renderSEOTags(title, description, imageUrl, baseProductUrl)}
    <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-6 py-6 px-3">
      {/* Image Gallery */}
      <div className="relative w-full overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={true}
          className="rounded-xl overflow-hidden"
          onResize={swiper => swiper.update()}
          observer={true}
          observeParents={true}
        >
          {product.images.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={`${driveURL}${img}`}
                alt={`${product.name} ${i + 1}`}
                loading="lazy"
                onClick={() => handleImageClick(img)}
                className="w-full h-[350px] object-contain rounded-xl cursor-pointer md:hover:scale-[1.02] transition-transform duration-300"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {product.newArrival && (
          <span className="absolute top-3 left-3 bg-accent font-bold text-sm px-3 py-1 rounded-full shadow-md rotate-[-5deg]">
            ✨ NEW ARRIVAL
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-2">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

        <div className="space-y-1 mb-4">
          <p>
            <b>शुद्धता:</b> {product.purity}
          </p>
          <p>
            <b>वज़न:</b> {product.weight} g
          </p>
        </div>

        {/* Contact Owner */}
        <div className="flex items-center gap-4 mb-4">
          <FaWhatsapp
            className="text-4xl md:text-5xl text-green-500 hover:text-green-600 cursor-pointer transition-transform hover:scale-110"
            onClick={() => window.open(whatsappUrl, "_blank")}
          />
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
            {product.highlights.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        )}

        {/* Share Section */}
        <div className="border-t pt-4 mt-4">
          <h2 className="text-lg font-semibold mb-3">Share this product</h2>
          <div className="flex gap-5 items-center flex-wrap">
            <FaWhatsapp
              onClick={() => window.open(whatsappShare, "_blank")}
              className="text-3xl text-green-500 cursor-pointer hover:scale-110 transition-transform"
              title="Share on WhatsApp"
            />
            <FaTelegramPlane
              onClick={() => window.open(telegramShare, "_blank")}
              className="text-3xl text-sky-500 cursor-pointer hover:scale-110 transition-transform"
              title="Share on Telegram"
            />
            <FaSnapchatGhost
              onClick={() => window.open(snapchatShare, "_blank")}
              className="text-3xl text-yellow-400 cursor-pointer hover:scale-110 transition-transform"
              title="Share on Snapchat"
            />
            <FaInstagram
              onClick={() => window.open(instagramShare, "_blank")}
              className="text-3xl text-pink-500 cursor-pointer hover:scale-110 transition-transform"
              title="Share on Instagram"
            />
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl transition"
            >
              <FaShareAlt /> <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={closeImageModal}
        >
          <img
            src={`${driveURL}${activeImage}`}
            alt="Zoomed view"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </div>
    </>
  );
}