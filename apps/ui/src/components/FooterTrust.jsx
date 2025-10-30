import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function FooterTrust() {
  const [isVisible, setIsVisible] = useState(false);
  const [years, setYears] = useState(0);
  const [customers, setCustomers] = useState(0);
  const footerRef = useRef(null);
  const animatingRef = useRef(false); // to prevent overlapping animations

  // Detect visibility using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.5 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate numbers each time it becomes visible
  useEffect(() => {
    if (isVisible && !animatingRef.current) {
      animatingRef.current = true;
      setYears(0);
      setCustomers(0);

      let y = 0,
        c = 0;

      const yInterval = setInterval(() => {
        if (y < 35) {
          y++;
          setYears(y);
        } else clearInterval(yInterval);
      }, 60);

      const cInterval = setInterval(() => {
        if (c < 5000) {
          c += 50;
          setCustomers(c);
        } else clearInterval(cInterval);
      }, 10);

      // Reset the animation flag after finish
      setTimeout(() => {
        animatingRef.current = false;
      }, 2500);
    }
  }, [isVisible]);

  return (
    <footer
      ref={footerRef}
      className="bg-[#fff8e1] text-gray-900 py-16 flex flex-col md:flex-row items-center justify-center gap-16 border-t border-yellow-400 shadow-[0_-4px_15px_rgba(255,215,0,0.3)] transition-all duration-500"
    >
      {/* Years of Trust */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-7xl md:text-8xl font-extrabold text-yellow-600 drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]">
          {years}+
        </h2>
        <p className="mt-2 text-2xl md:text-3xl font-semibold tracking-wide text-gray-700">
          वर्षों का विश्वास
        </p>
      </motion.div>

      {/* Happy Customers */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 30 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-7xl md:text-8xl font-extrabold text-yellow-600 drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]">
          {customers}+
        </h2>
        <p className="mt-2 text-2xl md:text-3xl font-semibold tracking-wide text-gray-700">
          खुश ग्राहक
        </p>
      </motion.div>
    </footer>
  );
}
