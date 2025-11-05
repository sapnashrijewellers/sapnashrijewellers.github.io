import React, { useRef, useEffect, useState } from "react";
import { FaBullhorn } from "react-icons/fa";
import data  from "../data/data.json";

const Ticker = () => {  
  if (data.ticker.length === 0) return null;

  const tickerText = data.ticker.join("  •  ");
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let reqId;

    const scroll = () => {
      if (!paused && textRef.current && containerRef.current) {
        const textWidth = textRef.current.offsetWidth;
        const containerWidth = containerRef.current.offsetWidth;
        let newOffset = offset - 1; // speed: 1px per frame
        if (Math.abs(newOffset) > textWidth) {
          newOffset = containerWidth; // reset when fully scrolled
        }
        setOffset(newOffset);
      }
      reqId = requestAnimationFrame(scroll);
    };

    reqId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(reqId);
  }, [offset, paused]);

  return (
    <div
      className="relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2 overflow-hidden shadow-md"
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="flex items-center gap-3 px-4">
        <FaBullhorn className="text-yellow-300 text-2xl animate-pulse flex-shrink-0" />
        <div className="w-full overflow-hidden relative">
          <div
            ref={textRef}
            style={{
              whiteSpace: "nowrap",
              transform: `translateX(${offset}px)`,
              display: "inline-block",
            }}
            className="text-2xl font-semibold tracking-wide"
          >
            {tickerText}
          </div>
        </div>
      </div>

      {/* Optional subtle bottom glow */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 opacity-70" />
    </div>
  );
};

export default Ticker;
