import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useData } from "../context/DataContext";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductDetail() {
  const { id, category } = useParams();
  const { categorizedProducts } = useData();
  const [activeImage, setActiveImage] = useState(null);

  const driveURL = "https://sapnashrijewellers.github.io/static/img/";
  const phone = "918234042231";
  const baseProductUrl = `https://sapnashrijewellers.github.io/#/product/${category}/${id}`;

  // Memoized product lookup
  const product = useMemo(() => {
    if (!categorizedProducts?.[category]) return null;
    return categorizedProducts[category].find(
      (p) => p.id.toString() === id.toString()
    );
  }, [categorizedProducts, category, id]);

  if (!categorizedProducts) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    `Hi, I want more details and discount on ${baseProductUrl}`
  )}`;

  const handleImageClick = (img) => setActiveImage(img);
  const closeImageModal = () => setActiveImage(null);

  return (
    <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-6 py-6 px-3">
      {/* Image Gallery */}
      <div className="relative w-full">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={10}
          slidesPerView={1}
          className="rounded-xl overflow-hidden"
        >
          {product.images.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={`${driveURL}${img}`}
                alt={`${product.name} ${i + 1}`}
                loading="lazy"
                onClick={() => handleImageClick(img)}
                className="w-full h-[350px] object-contain rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
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

        {product.highlights?.length > 0 && (
          <ul className="list-disc list-inside space-y-1 ">
            {product.highlights.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Fullscreen Image Modal */}
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
  );
}
