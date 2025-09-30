import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import IndianRupeeRate from '../components/IndianRupeeRate';
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";


export default function TV() {
  const { products, rates } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!products || products.length === 0) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
        setFade(true);
      }, 1000);
    }, 10000);
    return () => clearInterval(interval);
  }, [products]);

  if (!products || products.length === 0 || !rates) return <p>Loading...</p>;

  const product = products[currentIndex];
  const whatsappUrl = `https://wa.me/918234042231?text=${encodeURIComponent(
    `Hi, I want more details on https://sapnashrijewellers.github.io/#/product/${product.id}`
  )}`;

  return (
    <div
      className={`transition-opacity duration-1000 fade-in flex flex-col md:grid md:grid-cols-2 gap-2 w-full h-full p-2 overflow-hidden`}
    >
      {/* Image - top aligned */}
      <div className="w-full h-full flex justify-start items-start">
        <img
          src={`./images/${product.images[0]}`}
          alt={product.name}
          className="w-full h-auto object-contain rounded-2xl"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 p-2 text-[2vw] md:text-[1.5vw] leading-tight overflow-hidden">
        {/* Basic details */}
        <div>
          <h1 className="font-extrabold mb-2 text-[3vw] md:text-[2.5vw]">{product.name}</h1>
          <p><b>शुद्धता:</b> {product.purity}</p>
          <p><b>वज़न:</b> {product.weight} g</p>
        </div>

        {/* WhatsApp/contact info (above highlights) */}
        <div className="flex items-center gap-4 mt-2">
          <FaWhatsapp
            className="text-[4vw] text-green-500 hover:text-green-600 cursor-pointer transition-transform transform hover:scale-110"
            onClick={() => window.open(whatsappUrl, "_blank")}
          />
          <span className="text-[1.5vw] text-gray-400">
            अधिक जानकारी के लिए <a className="text-[2vw]" href="tel:8234042231">8234042231</a> पर संपर्क करें...
          </span>
        </div>

        {/* Highlights */}
        <div className="highlights overflow-hidden mt-2">
          <ul className="p-1 list-disc list-inside text-[1.5vw] max-h-[50vh] overflow-hidden">
            {product.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>


  );
}

