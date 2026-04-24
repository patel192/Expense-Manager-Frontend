import React from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";

const GlobalLoader = () => {
  const { isLoading, loadingText } = useSelector((state) => state.ui);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md"
        >
          <div className="relative">
            {/* Outer Glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-cyan-500 blur-2xl rounded-full"
            />
            
            {/* Spinner Container */}
            <div className="relative bg-slate-800 p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="text-cyan-400"
              >
                <FiRefreshCw size={48} />
              </motion.div>
              
              <div className="flex flex-col items-center gap-1">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white font-semibold text-lg"
                >
                  {loadingText || "Processing..."}
                </motion.h3>
                <p className="text-slate-400 text-sm">Please wait a moment</p>
              </div>

              {/* Progress bar animation */}
              <div className="w-32 h-1 bg-slate-700 rounded-full overflow-hidden mt-2">
                <motion.div
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
