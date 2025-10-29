import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CategoryCard({ category, products }) {  
  const [currentProductIndex, setCurrentProductIndex] = useState(0);  
  const [nextProductIndex, setNextProductIndex] = useState(1);   
  const [isReady, setIsReady] = useState(false);

  
  if (!products || products.length === 0) {
    return null; 
  }
  
  const driveURL = 'https://sapnashrijewellers.github.io/static/img/';    
  const currentProduct = products[currentProductIndex];
  const effectiveNextProductIndex = nextProductIndex % products.length;
  const nextProduct = products[effectiveNextProductIndex];
  
  useEffect(() => {    
    if (products.length <= 1) {
      return () => {};
    }

    const intervalId = setInterval(() => {      
      setCurrentProductIndex(prevIndex => (prevIndex + 1) % products.length);      
      setNextProductIndex(prevIndex => (prevIndex + 2) % products.length);      
      setIsReady(false); 
      
    }, 2000); 

    return () => clearInterval(intervalId);
  }, [products.length]);  
  
  useEffect(() => {    
    const image = new window.Image();
    image.src = `${driveURL}${currentProduct.images[0]}`;    
    
    image.onload = () => {
        setIsReady(true);
    };
    
    return () => {
        image.onload = null;
    };
  }, [currentProduct.name, driveURL, currentProduct.images]);

  const cardHighlightClass = currentProduct.newArraval
    ? 'border-2 border-red-500 shadow-md hover:shadow-xl' // Highlighted
    : 'border shadow hover:shadow-lg'; // Normal


  return (
    <Link
      to={`/category/${category}`}      
      className="block transition-transform duration-300 hover:scale-105"
    >
      <div className={`rounded-2xl flex flex-col h-full ${cardHighlightClass}`}>
        <h2 className="font-bold text-sm md:text-base p-3 text-center">
          {category}
        </h2>
        <div className="relative w-full overflow-hidden flex-grow pt-[100%]">
            {currentProduct.newArrival && (
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg transform rotate-[-5deg]">
                    ✨ NEW ARRIVAL
                </div>
            )}            
            <img
                key={currentProduct.name} 
                src={`${driveURL}${currentProduct.images[0]}`}
                alt={currentProduct.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isReady ? 'opacity-100' : 'opacity-0'}`}
                loading="eager"
            />
            <img
                src={`${driveURL}${nextProduct.images[0]}`}
                alt={`Preloading ${nextProduct.name}`}
                className="hidden" 
                loading="lazy"
            />
        </div>        
        <div className="p-3">                  
          <div className="flex justify-between text-xs font-medium ">
            <span>{currentProduct.purity}</span>
            <span className="font-bold">{currentProduct.weight} gm</span>
          </div>
        </div>
      </div>
    </Link>
  );
}