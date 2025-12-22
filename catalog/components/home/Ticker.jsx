import { FaBullhorn } from "react-icons/fa";
import data from "@/data/ticker.json";

export default function Ticker() {
  if (!data?.length) return null;

  const tickerText = data.join("  •  ");

  return (
    <div className="relative w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-2 overflow-hidden shadow-md">
  <div className="flex items-center gap-3 px-4">
    <FaBullhorn className="text-2xl animate-pulse flex-shrink-0" />

    <div className="ticker-container w-full overflow-hidden relative">
      <div className="ticker-content">
        <span>{tickerText}</span>
        <span>{tickerText}</span>
      </div>
    </div>
  </div>

  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] opacity-70" />
</div>

  );
}
