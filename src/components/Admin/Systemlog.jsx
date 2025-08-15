import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaClipboardList } from "react-icons/fa"; // <-- New icon

export const Systemlog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filteredLogs = logs.filter(
    (log) =>
      log.user?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.description?.toLowerCase().includes(search.toLowerCase())
  );

  const getBadgeColor = (action) => {
    if (!action) return "bg-gray-300";
    if (action.toLowerCase().includes("delete"))
      return "bg-red-200 text-red-700";
    if (action.toLowerCase().includes("update"))
      return "bg-blue-200 text-blue-700";
    if (action.toLowerCase().includes("create"))
      return "bg-green-200 text-green-700";
    return "bg-gray-200 text-gray-700";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <FaClipboardList className="text-3xl text-blue-500" />
        <h2 className="text-3xl font-bold text-gray-800">System Logs</h2>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        {loading ? (
          <div className="text-center p-6 text-gray-500">Loading logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center p-6 text-gray-500">No logs found.</div>
        ) : (
          <motion.table
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-w-full text-sm"
          >
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
                <th className="px-6 py-3 text-left">Date & Time</th>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Action</th>
                <th className="px-6 py-3 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <motion.tr
                  key={log._id || index}
                  whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
                  transition={{ duration: 0.15 }}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-3 border-b text-gray-700">
                    {new Date(log.timestamp || log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 border-b text-gray-700">{log.user}</td>
                  <td className="px-6 py-3 border-b">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3 border-b text-gray-600">
                    {log.description}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        )}
      </div>
    </div>
  );
};
