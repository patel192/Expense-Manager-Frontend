import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClipboardList } from "react-icons/fa";
import axiosInstance from "../Utils/axiosInstance";

export const Systemlog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get("/logs");
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
    if (!action) return "bg-gray-700 text-gray-300";
    if (action.toLowerCase().includes("delete"))
      return "bg-red-500/20 text-red-400";
    if (action.toLowerCase().includes("update"))
      return "bg-blue-500/20 text-blue-400";
    if (action.toLowerCase().includes("create"))
      return "bg-green-500/20 text-green-400";
    return "bg-gray-500/20 text-gray-300";
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center gap-3 mb-8"
      >
        <FaClipboardList className="text-3xl text-indigo-400" />
        <h2 className="text-3xl font-bold text-indigo-400">System Logs</h2>
      </motion.div>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="🔍 Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 w-full max-w-md rounded-xl bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-x-auto border border-gray-700">
        {loading ? (
          <div className="text-center p-6 text-gray-400">Loading logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center p-6 text-gray-400">No logs found.</div>
        ) : (
          <motion.table
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-w-full text-sm"
          >
            <thead>
              <tr className="bg-gray-700 text-gray-300 uppercase text-xs tracking-wider">
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
                  whileHover={{ scale: 1.01, backgroundColor: "#374151" }}
                  transition={{ duration: 0.15 }}
                  className={`${
                    index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                  } border-b border-gray-700`}
                >
                  <td className="px-6 py-3 text-gray-300">
                    {new Date(log.timestamp || log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-gray-300">{log.user}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400">
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
