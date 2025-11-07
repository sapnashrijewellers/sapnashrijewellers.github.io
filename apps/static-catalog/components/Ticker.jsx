// components/Ticker.jsx
import { FaBullhorn } from "react-icons/fa";
import data from "../data/data.json";

export default function Ticker() {
  if (!data?.ticker?.length) return null;

  const tickerText = data.ticker.join("  •  ");

  return (
    <div className="relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2 overflow-hidden shadow-md">
      <div className="flex items-center gap-3 px-4">
        <FaBullhorn className="text-yellow-300 text-2xl animate-pulse flex-shrink-0" />

        <div className="ticker-container w-full overflow-hidden relative">
          <div className="ticker-content">
            <span>{tickerText}</span>
            <span>{tickerText}</span> {/* duplicate for seamless loop */}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 opacity-70" />
    </div>
  );
}
