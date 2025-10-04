import React, { useEffect, useState } from "react";
import { FaBullhorn } from "react-icons/fa";
import { motion } from "framer-motion";

const Ticker = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("/data/tickerData.json")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error loading ticker data:", err));
  }, []);

  if (messages.length === 0) return null;

  // Join messages into one long string with separators
  const tickerText = messages.join("  •  ");

  return (
    <div className="relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2 overflow-hidden shadow-md">
      <div className="flex items-center gap-3 px-4">
        <FaBullhorn className="text-yellow-300 text-2xl animate-pulse flex-shrink-0" />
        <div className="w-full overflow-hidden">
          <motion.div
            className="text-2xl whitespace-nowrap  font-semibold tracking-wide"
            animate={{ x: ["100%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 18,
              ease: "linear",
            }}
          >
            {tickerText}
          </motion.div>
        </div>
      </div>

      {/* Optional subtle bottom glow */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 opacity-70" />
    </div>
  );
};

export default Ticker;
