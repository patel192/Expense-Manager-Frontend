import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export const Systemlog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/logs");
        setLogs(res.data);
      } catch (error) {
        console.error("Failed to fetch system logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>🧾 System Logs</h2>

      {loading ? (
        <div className="text-center">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="text-center">No logs found.</div>
      ) : (
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
            {logs.map((log, index) => (
              <motion.tr
                key={log._id || index}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: index % 2 === 0 ? "#fff" : "#f9f9f9",
                }}
              >
                <td style={tdStyle}>
                  {new Date(log.timestamp || log.createdAt).toLocaleString()}
                </td>
                <td style={tdStyle}>{log.user}</td>
                <td style={tdStyle}>{log.action}</td>
                <td style={tdStyle}>{log.description}</td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      )}
    </div>
  );
};

const thStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};
