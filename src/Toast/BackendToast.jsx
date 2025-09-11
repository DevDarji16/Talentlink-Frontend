// components/BackendToast.jsx
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackendToast() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show toast after short delay (e.g., 1s)
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 50, y: 100 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 50, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-18 right-4 max-w-sm bg-white shadow-lg rounded-2xl p-4 border border-gray-200 flex items-start gap-3"
        >
          <div className="flex-1 text-sm text-gray-700">
            The backend is hosted on Render’s free tier.  
            Response times may be a little slow — thanks for your patience 🙏
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
