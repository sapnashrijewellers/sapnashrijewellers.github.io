import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Ticker = () => {
  const [messages, setMessages] = useState([]);
  const [current, setCurrent] = useState(0);

  // Fetch messages from JSON file
  useEffect(() => {
    fetch("/data/tickerData.json")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error loading ticker data:", err));
  }, []);

  // Cycle through messages
  useEffect(() => {
    if (messages.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 4000); // change every 4s
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <div className="overflow-hidden w-full bg-gray-900 text-white py-2 px-4 flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-medium whitespace-nowrap"
        >
          {messages[current]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Ticker;
