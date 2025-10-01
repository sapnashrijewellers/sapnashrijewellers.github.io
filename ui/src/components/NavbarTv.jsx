import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import IndianRupeeRate from './IndianRupeeRate';

export default function Navbar() {
  const { rates } = useData();

  if (!rates) return null;

  return (
    <nav className="text-white p-2 shadow-md w-full bg-black">
        
      {/* --------------------------------------------------
        SECTION 1: LOGO AND GOLDEN SHOP NAME
        --------------------------------------------------
      */}
      <div className="mx-auto w-full flex justify-between items-center pb-2"> 

        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Sapna Shri Jewellers Nagda | सपना श्री ज्वैलर्स, नागदा"
              className="h-36 auto logo"
            />
          </Link>
        </div>

        
{/* Right: Shop Name - APPLIED 3D STYLE WITH SHIMMER */}
<div 
  className="text-7xl ml-4 text-right font-semibold text-yellow-400 shimmer-gold" 
  style={{ 
    // Set the base text-shadow for initial load
    textShadow: `0 0 0.1rem #4a3400, 0.1rem 0.1rem 0.1rem #fff, 0 0 0.5rem rgba(255, 237, 74, 0.6)` 
  }}
> 
          <span>सपना श्री ज्वैलर्स</span>
        </div>

      </div>
      
      {/* --------------------------------------------------
        VISUAL SEPARATOR (Thin Gold Line)
        --------------------------------------------------
      */}
      <div className="mx-auto max-w-7xl border-t border-yellow-700 my-2"></div> 
      
      {/* --------------------------------------------------
        SECTION 2: LIVE RATES
        --------------------------------------------------
      */}
      <div className="mx-auto max-w-7xl flex justify-between items-start pt-2"> {/* Added pt-2 for padding below the line */}

        {/* Left: Gold Rates (24K & 22K) */}
        <div className="flex-shrink-0 flex items-center">
          <div className="flex flex-col justify-between w-full sm:w-auto ml-4">
            {/* 24K Gold Rate */}
            <div className="flex justify-start gap-4 text-3xl">
              <span className="flex items-center gap-1">
                <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                <span>सोना (24K): <IndianRupeeRate rate={rates.gold24K * 10} className="text-green-500" /></span>
              </span>
            </div>
            {/* 22K Gold Rate */}
            <div className="flex justify-start gap-4 text-3xl">
              <span className="flex items-center gap-1">
                <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                <span>सोना (22K): <IndianRupeeRate rate={rates.gold22K * 10} className="text-green-500" /></span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Silver Rates (99.9 & Jeweler) */}
        <div className="flex flex-col justify-between w-full sm:w-auto ml-4">
          {/* 99.9 Silver Rate */}
          <div className="flex justify-end gap-4 text-3xl">
            <span>
              <span className="flex items-center gap-1">
                <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                चाँदी (99.9): <IndianRupeeRate rate={rates.silver * 1000} className="text-green-500" />
              </span>
            </span>
          </div>
          {/* Jeweler Silver Rate */}
          <div className="flex justify-end gap-4 text-3xl">
            <span>
              <span className="flex items-center gap-1">
                <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                चाँदी(जेवर):
                <IndianRupeeRate rate={(rates.silver * 1000) * (0.92)} className="text-green-500" />
              </span>
            </span>
          </div>
        </div>

      </div>

    </nav>
  );
}