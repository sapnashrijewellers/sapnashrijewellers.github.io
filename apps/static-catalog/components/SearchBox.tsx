import React, { FC } from "react"; 
import { motion, AnimatePresence } from "framer-motion";

// Reusable Search Box Component
export const MobileSearchBox: FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-start justify-center p-4 md:hidden"
          onClick={onClose}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Search jewellery..."
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
