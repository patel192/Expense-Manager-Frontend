import React from 'react'
import { motion } from "framer-motion";
const dummyLogs = [
  {
    timestamp: "2025-04-03 10:25 AM",
    user: "Patel Muhammad",
    action: "Logged in",
    description: "Admin logged into the system",
  },
  {
    timestamp: "2025-04-03 10:35 AM",
    user: "Muhammad",
    action: "Added Category",
    description: "Added new category: Marketing",
  },
  {
    timestamp: "2025-04-03 10:40 AM",
    user: "Arin",
    action: "Deactivated User",
    description: "User ID 67eb76... was deactivated",
  },
  {
    timestamp: "2025-04-03 11:10 AM",
    user: "Asad",
    action: "Added Expense",
    description: "Added ₹1200 under Rent",
  },
  {
    timestamp: "2025-04-03 11:25 AM",
    user: "Arin",
    action: "Updated Category",
    description: "Changed category name from 'Wages' to 'Payroll'",
  },
];
export const Systemlog = () => {
  return (
    <div style={{ padding: "30px" }}>
    <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
      🧾 System Logs
    </h2>

    <motion.table
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: "100%",
        borderCollapse: "collapse",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    >
      <thead>
        <tr style={{ background: "#f4f4f4" }}>
          <th style={thStyle}>Date & Time</th>
          <th style={thStyle}>User</th>
          <th style={thStyle}>Action</th>
          <th style={thStyle}>Description</th>
        </tr>
      </thead>
      <tbody>
        {dummyLogs.map((log, index) => (
          <motion.tr
            key={index}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            style={{
              background: index % 2 === 0 ? "#fff" : "#f9f9f9",
            }}
          >
            <td style={tdStyle}>{log.timestamp}</td>
            <td style={tdStyle}>{log.user}</td>
            <td style={tdStyle}>{log.action}</td>
            <td style={tdStyle}>{log.description}</td>
          </motion.tr>
        ))}
      </tbody>
    </motion.table>
  </div>
  )
}
const thStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};
