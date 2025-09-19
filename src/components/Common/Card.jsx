import React from "react";
import { motion } from "framer-motion";

const Card = ({ title, value }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 
                 rounded-2xl shadow-lg p-6 w-52 text-center cursor-pointer 
                 transition duration-300"
    >
      <div className="text-sm text-gray-300 mb-2">{title}</div>
      <div className="text-2xl font-bold text-green-400">{value}</div>
    </motion.div>
  );
};

export default Card;
