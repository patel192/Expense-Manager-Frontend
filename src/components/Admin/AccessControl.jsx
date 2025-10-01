import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";

export const AccessControl = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data.data || []);
      } catch (error) {
        alert("Error fetching users");
      }
    };
    fetchUsers();
  }, []);

  const roleColors = {
    Admin: "bg-yellow-400/80 text-gray-900",
    User: "bg-blue-500/80 text-white",
    Manager: "bg-purple-500/80 text-white",
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "All" || user.roleId?.name === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-black text-white">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-xl p-4 sm:p-6"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
          User Access Control
        </h2>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 mb-4 sm:mb-6 items-start md:items-center">
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 pr-3 py-2 rounded-lg w-full bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="w-full md:w-auto px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:ring-2 focus:ring-indigo-400"
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/20 backdrop-blur-lg">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-white/10 text-gray-300 uppercase text-xs">
                <th className="p-2 sm:p-3 text-left">Name</th>
                <th className="p-2 sm:p-3 text-left">Age</th>
                <th className="p-2 sm:p-3 text-left">Email</th>
                <th className="p-2 sm:p-3 text-left">Role</th>
                <th className="p-2 sm:p-3 text-left">Joined</th>
                <th className="p-2 sm:p-3 text-left">Status</th>
                <th className="p-2 sm:p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <motion.tr
                    key={user._id}
                    whileHover={{
                      scale: 1.01,
                      backgroundColor: "rgba(255,255,255,0.05)",
                    }}
                    className="border-b border-white/10 transition-colors"
                  >
                    <td className="p-2 sm:p-3">{user.name}</td>
                    <td className="p-2 sm:p-3">{user.age || "N/A"}</td>
                    <td className="p-2 sm:p-3">{user.email}</td>
                    <td className="p-2 sm:p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          roleColors[user.roleId?.name] ||
                          "bg-gray-500/70 text-white"
                        }`}
                      >
                        {user.roleId?.name || "N/A"}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2 sm:p-3">
                      {user.is_active ? (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-500/80 text-white rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold bg-red-500/80 text-white rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-center space-x-1 sm:space-x-2">
                      <button className="p-2 sm:p-2 bg-indigo-500/80 hover:bg-indigo-600 rounded-full text-white transition">
                        <FaEdit size={14} />
                      </button>
                      <button className="p-2 sm:p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition">
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="p-4 text-center text-gray-400 italic"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center mt-4 sm:mt-6 gap-1 sm:gap-2">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded font-semibold transition ${
                  currentPage === idx + 1
                    ? "bg-indigo-500 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
