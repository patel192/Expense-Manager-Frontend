import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";

export const AccessControl = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

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
    Admin: "from-yellow-400 to-orange-500 text-black",
    User: "from-blue-400 to-indigo-500 text-white",
    Manager: "from-purple-400 to-pink-500 text-white",
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
    <div className="p-6 min-h-screen bg-gradient-to-b from-[#0b0c10] via-[#0f1115] to-[#0c0e12] text-white">

      {/* ======= Header ======= */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent"
      >
        User Access Control
      </motion.h2>

      {/* ======= Filters Panel ======= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 mb-8 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Role Filter */}
        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/20 text-white focus:ring-2 focus:ring-pink-500 outline-none"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Manager">Manager</option>
        </select>
      </motion.div>

      {/* ======= User Cards Layout ======= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedUsers.length > 0 ? (
          paginatedUsers.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between"
            >
              {/* User Name */}
              <div>
                <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-300 to-pink-400 bg-clip-text text-transparent">
                  {user.name}
                </h3>
                <p className="text-gray-300 text-sm mt-1">{user.email}</p>

                {/* Role Badge */}
                <div
                  className={`mt-3 inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${
                    roleColors[user.roleId?.name] || "from-gray-500 to-gray-700"
                  }`}
                >
                  {user.roleId?.name || "N/A"}
                </div>

                {/* Meta Info */}
                <div className="mt-3 text-xs text-gray-400 space-y-1">
                  <p>
                    Age:{" "}
                    <span className="text-gray-300">{user.age || "N/A"}</span>
                  </p>
                  <p>
                    Joined:{" "}
                    <span className="text-gray-300">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    Status:{" "}
                    {user.is_active ? (
                      <span className="text-green-400 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-400 font-semibold">Inactive</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-5">
                <button className="flex-1 py-2 rounded-xl bg-indigo-500/80 hover:bg-indigo-600 transition text-white font-medium shadow">
                  <FaEdit size={14} className="inline mr-2" />
                  Edit
                </button>

                <button className="flex-1 py-2 rounded-xl bg-red-500/80 hover:bg-red-600 transition text-white font-medium shadow">
                  <FaTrash size={14} className="inline mr-2" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full py-10">
            No users found
          </p>
        )}
      </div>

      {/* ======= Pagination ======= */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 text-sm rounded-lg transition font-medium ${
                currentPage === i + 1
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
