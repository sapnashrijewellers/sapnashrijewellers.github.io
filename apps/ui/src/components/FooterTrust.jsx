import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function FooterTrust() {
  const [isVisible, setIsVisible] = useState(false);
  const [years, setYears] = useState(0);
  const [customers, setCustomers] = useState(0);
  const footerRef = useRef(null);
  const animatingRef = useRef(false);

  // Detect visibility using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => setIsVisible(entries[0].isIntersecting),
      { threshold: 0.5 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate numbers each time footer comes into view
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

      // Reset animation flag
      setTimeout(() => {
        animatingRef.current = false;
      }, 2500);
    }
  }, [isVisible]);

  return (
    <footer
      ref={footerRef}
      className="
        bg-accent text-card-foreground
        py-16 flex flex-col md:flex-row items-center justify-center gap-16
        shadow-md transition-all duration-500
      "
    >
      {/* Years of Trust */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 30 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-7xl md:text-8xl font-extrabold text-primary drop-shadow-sm">
          {years}+
        </h2>
        <p className="mt-2 text-2xl md:text-3xl font-semibold tracking-wide text-muted-foreground">
          वर्षों का विश्वास
        </p>
      </motion.div>

      {/* Happy Customers */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 30 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-7xl md:text-8xl font-extrabold text-primary drop-shadow-sm">
          {customers}+
        </h2>
        <p className="mt-2 text-2xl md:text-3xl font-semibold tracking-wide text-muted-foreground">
          खुश ग्राहक
        </p>
      </motion.div>
    </footer>
  );
}
