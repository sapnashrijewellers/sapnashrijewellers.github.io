import { useParams } from "react-router-dom";
import { useState } from "react";
import { useData } from "../context/DataContext";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

export default function ProductDetail() {
  const { id } = useParams();
  const { category } = useParams();
  const { categorizedProducts } = useData();
  const [activeImage, setActiveImage] = useState(null);


  if (!categorizedProducts) return <p>Loading...</p>;

  const product = categorizedProducts[category].find(p => p.id.toString() === id);
  if (!product) return <p>Product not found</p>;

  const phone = "918234042231"; // India country code + number
  const message = encodeURIComponent(
    `Hi, I want more details and discount on https://sapnashrijewellers.github.io/#/product/${product.id}`
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
  const driveURL = 'https://sapnashrijewellers.github.io/static/img/';

  // Determine if we need to show the new arrival badge
  const isNewArrival = product.newArrival;

  return (

    <div className="space-y-6 max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-2 w-full max-w-full">
      {/* Images */}
      <div className="w-full relative"> {/* Added relative for potential future badge over image */}
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={10}
          slidesPerView={1}
          className="rounded-xl w-full max-w-full overflow-hidden"
          style={{ maxWidth: '95vw' }}
        >
          {product.images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="w-full max-w-full">
                <img
                  src={`${driveURL}${img}`}
                  alt={product.name}
                  className="w-full h-[350px] object-contain rounded-xl mx-auto cursor-pointer"
                  onClick={() => setActiveImage(img)}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Details */}
      <div className="p-2 w-full">
        <div className="mb-2">
          {isNewArrival && (
            <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md mb-2">
              ✨ NEW ARRIVAL
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
        </div>

        <p className=""><b>शुद्धता:</b> {product.purity}</p>
        <p><b>वज़न:</b> {product.weight} g</p>

        <div className="mt-4 flex items-center gap-4">
          <FaWhatsapp
            className="text-4xl md:text-5xl text-green-500 hover:text-green-600 cursor-pointer transition-transform transform hover:scale-110"
            onClick={() => window.open(whatsappUrl, "_blank")}
          />
          <span className="text-sm text-gray-300">
            अधिक जानकारी के लिए <a href="tel:8234042231"> 8234042231</a> पर संपर्क करें...
          </span>
        </div>
        <ul className="mt-4 list-disc list-inside">
          {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      </div>

      {/* Fullscreen image modal */}
      {activeImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setActiveImage(null)}
        >
          <img
            src={`${driveURL}${activeImage}`}
            alt="zoomed"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}