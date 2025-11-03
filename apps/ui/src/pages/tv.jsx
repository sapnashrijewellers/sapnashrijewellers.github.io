import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";

export default function TV() {
  const { categorizedProducts, sub_categories, rates } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!sub_categories || sub_categories.length === 0) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sub_categories.length);
        setFade(true);
      }, 1000);
    }, 10000);
    return () => clearInterval(interval);
  }, [sub_categories]);

  if (!categorizedProducts || !rates) return <p>Loading...</p>;

  const product = categorizedProducts[sub_categories[currentIndex]][0];
  const driveURL = 'https://sapnashrijewellers.github.io/static/img/';
  return (
    <div
      className={`transition-opacity duration-1000 fade-in flex flex-col md:grid md:grid-cols-2 gap-2 w-full h-full p-2 overflow-hidden`}
    >
      {/* Image panel */}
      <div className="w-full h-full flex justify-start items-start">
        <img
          src={`${driveURL}${product.images[0]}`}
          alt={product.name}
          className="w-full h-auto object-contain rounded-2xl"
        />
      </div>

      {/* Details panel */}
      <div className="flex flex-col gap-3 p-2 text-2xl leading-tight overflow-hidden">
        {/* Product details */}
        <div>
          <h1 className="font-extrabold mb-2">
            {product.name}
          </h1>
          <p>
            <b>शुद्धता:</b> {product.purity}
          </p>
          <p>
            <b>वज़न:</b> {product.weight} g
          </p>
        </div>


      </div>
    </div>
  );
}