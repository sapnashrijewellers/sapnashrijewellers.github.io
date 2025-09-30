import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useData } from "../context/DataContext";
import { FaWhatsapp } from "react-icons/fa";

export default function ProductDetail() {
    const { products } = useData();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeImage, setActiveImage] = useState(null);
    const location = useLocation();

    // Auto-rotate products every 5s
    useEffect(() => {
        if (!products || products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [products]);

    if (!products) return <p className="text-4xl text-center">Loading...</p>;

    const product = products[currentIndex];
    if (!product) return <p className="text-4xl text-center">Product not found</p>;

    const phone = "917999215256";
    const message = encodeURIComponent(
        `Hi, I want more details and discount on https://sapnashrijewellers.github.io/#/product/${product.id}`
    );
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

    // // 🚫 Hide footer for /tv route
    // useEffect(() => {
    //     const footer = document.querySelector("footer");

    //     footer.style.display = "none";

    // }, [location]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-6 w-full max-w-full p-4">
            {/* Image */}
            <div className="w-full flex items-center justify-center">
                <img
                    src={`./images/${product.images[0]}`}
                    alt={product.name}
                    className="w-full h-[500px] object-contain rounded-xl cursor-pointer"
                    onClick={() => setActiveImage(product.images[0])}
                />
            </div>

            {/* Details */}
            <div className="p-4 w-full text-3xl leading-relaxed">
                <h1 className="text-5xl font-extrabold mb-4">{product.name}</h1>
                <p><b>शुद्धता:</b> {product.purity}</p>
                <p><b>वज़न:</b> {product.weight} g</p>

                <div className="mt-6 flex items-center gap-6">
                    <FaWhatsapp
                        className="text-6xl text-green-500 hover:text-green-600 cursor-pointer transition-transform transform hover:scale-110"
                        onClick={() => window.open(whatsappUrl, "_blank")}
                    />
                    <span className="text-2xl text-gray-300">
                        अधिक जानकारी के लिए <a href="tel:7999215256">7999215256</a> पर संपर्क करें...
                    </span>
                </div>

                <ul className="mt-6 list-disc list-inside text-2xl space-y-2">
                    {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
            </div>

            {/* Fullscreen modal */}
            {activeImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    onClick={() => setActiveImage(null)}
                >
                    <img
                        src={`./images/${activeImage}`}
                        alt="zoomed"
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
            )}
        </div>
    );
}
