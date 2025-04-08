import React from "react";
import { motion } from "framer-motion";

const Card = ({ title, value }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        background: "#fdfdfd",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        width: "200px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
        cursor: "pointer",
        transition: "0.3s",
      }}
    >
      <div style={{ fontSize: "14px", color: "#555", marginBottom: "8px" }}>
        {title}
      </div>
      <div style={{ fontSize: "22px", fontWeight: "bold", color: "#2e7d32" }}>
        {value}
      </div>
    </motion.div>
  );
};

export default Card;
