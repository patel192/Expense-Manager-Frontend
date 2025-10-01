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
    <div className="p-4 sm:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 sm:mb-8"
      >
        <FaClipboardList className="text-2xl sm:text-3xl text-indigo-400" />
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-400">
          System Logs
        </h2>
      </motion.div>

      {/* Search Bar */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <input
          type="text"
          placeholder="🔍 Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 sm:px-4 py-2 w-full max-w-md rounded-lg sm:rounded-xl bg-gray-800 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm text-sm sm:text-base"
        />
      </div>

      {/* Table / Logs */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="text-center p-6 text-gray-400">Loading logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center p-6 text-gray-400">No logs found.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
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
                      <td className="px-6 py-3 text-gray-300 whitespace-nowrap">
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
                      <td className="px-6 py-3 text-gray-400">{log.description}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </motion.table>
            </div>

            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4 p-4">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log._id || index}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-700 shadow-md"
                >
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(log.timestamp || log.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm font-semibold text-indigo-400">
                    {log.user || "Unknown User"}
                  </p>
                  <p
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </p>
                  <p className="mt-2 text-gray-300 text-sm">{log.description}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
