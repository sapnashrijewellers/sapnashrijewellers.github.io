import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import IndianRupeeRate from '../components/IndianRupeeRate';
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

export default function ProductDetail() {
  const { products } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const { rates } = useData();
  
    if (!rates) return null;
  useEffect(() => {
    if (!products || products.length === 0) return;

    const interval = setInterval(() => {
      setFade(false); // start fade-out
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
        setFade(true); // fade-in new product
      }, 1000); // duration matches CSS transition
    }, 10000); // 5 seconds per product

    return () => clearInterval(interval);
  }, [products]);

  if (!products || products.length === 0) return <p>Loading...</p>;

  const product = products[currentIndex];
  const phone = "918234042231";
  const message = encodeURIComponent(
    `Hi, I want more details and discount on https://sapnashrijewellers.github.io/#/product/${product.id}`
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    
    <div
      className={`transition-opacity duration-1000 ${
        fade ? "opacity-100" : "opacity-0"
      } space-y-6 max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-6 w-full`}
    >        
      {/* Image */}
      <div className="w-full flex justify-center items-center rounded-2xl">
        <img
          src={`./images/${product.images[0]}`}
          alt={product.name}
          className="w-full h-[500px] object-contain mx-auto rounded-2xl"
        />
      </div>

      {/* Details */}
      <div className="p-6 w-full text-3xl md:text-4xl leading-relaxed">
        <h1 className="text-5xl font-extrabold mb-4">{product.name}</h1>
        <p><b>शुद्धता:</b> {product.purity}</p>
        <p><b>वज़न:</b> {product.weight} g</p>

        <div className="mt-6 flex items-center gap-6">
          <FaWhatsapp
            className="text-6xl text-green-500 hover:text-green-600 cursor-pointer transition-transform transform hover:scale-110"
            onClick={() => window.open(whatsappUrl, "_blank")}
          />
          <span className="text-2xl text-gray-400">
            अधिक जानकारी के लिए <a className="text-4xl" href="tel:7999215256">7999215256</a> पर संपर्क करें...
          </span>
        </div>

        <ul className="text-3xl mt-4 list-disc list-inside space-y-2">
          {product.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
