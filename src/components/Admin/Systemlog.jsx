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
        setLogs(res.data || []);
      } catch (error) {
        console.error("Failed to fetch logs", error);
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

  // Badge Color System
  const getBadgeColor = (action) => {
    if (!action) return "bg-gray-500/20 text-gray-300";
    if (action.toLowerCase().includes("delete"))
      return "bg-red-500/20 text-red-400";
    if (action.toLowerCase().includes("update"))
      return "bg-blue-500/20 text-blue-400";
    if (action.toLowerCase().includes("create"))
      return "bg-green-500/20 text-green-400";
    return "bg-gray-500/20 text-gray-300";
  };

  return (
    <div className="p-6 sm:p-10 min-h-screen text-white bg-gradient-to-br from-gray-900 via-[#0c0e12] to-black">
      
      {/* HEADER */}
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
      >
        <FaClipboardList className="text-3xl text-indigo-400" />
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          System Logs
        </h1>
      </motion.div>

      {/* SEARCH BAR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center mb-10"
      >
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-5 py-3 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none shadow-lg"
        />
      </motion.div>

      {/* LOGS PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden"
      >
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No logs found.</div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-gray-300 uppercase text-xs tracking-wide border-b border-white/10">
                    <th className="p-4 text-left">Timestamp</th>
                    <th className="p-4 text-left">User</th>
                    <th className="p-4 text-left">Action</th>
                    <th className="p-4 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <motion.tr
                      key={log._id || index}
                      whileHover={{
                        scale: 1.01,
                        backgroundColor: "rgba(255,255,255,0.03)",
                      }}
                      transition={{ duration: 0.18 }}
                      className={`border-b border-white/10 ${
                        index % 2 === 0 ? "bg-white/5" : "bg-white/0"
                      }`}
                    >
                      <td className="p-4 text-gray-300">
                        {new Date(log.timestamp || log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 text-indigo-300">{log.user}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{log.description}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="sm:hidden p-5 space-y-4">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log._id || index}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg"
                >
                  <p className="text-xs text-gray-400">
                    {new Date(log.timestamp || log.createdAt).toLocaleString()}
                  </p>

                  <p className="font-semibold text-indigo-300 mt-1">{log.user}</p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>

                  <p className="mt-3 text-gray-300 text-sm">{log.description}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
