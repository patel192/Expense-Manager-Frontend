import React, { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaTrash, FaEye } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        const fetchedUsers = res.data.data || [];

        setUsers(fetchedUsers);
        setDisplayedUsers(fetchedUsers);
      } catch {
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // filter logic
  useEffect(() => {
    let filtered = [...users];

    if (search) {
      filtered = filtered.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    setDisplayedUsers(filtered);
    setCurrentPage(1);
  }, [search, roleFilter, users]);

  // pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = displayedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(displayedUsers.length / usersPerPage);

  // delete
  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      await axiosInstance.delete(`/user/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));

      toast.success("User deleted", {
        autoClose: 1800,
        style: { backgroundColor: "#16a34a", color: "white" },
      });
    } catch {
      toast.error("Error deleting user", {
        autoClose: 1800,
        style: { backgroundColor: "#dc2626", color: "white" },
      });
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-8 bg-gradient-to-b from-[#0c0e12] via-[#0f1115] to-[#0b0c10] text-white">
      <ToastContainer theme="colored" transition={Bounce} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* HEADER */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Manage Users
          </h1>
          <p className="text-gray-400 text-sm">
            View, filter, and manage all registered users.
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-lg shadow-lg">
          {/* search */}
          <div className="relative w-full sm:w-1/2">
            <IoSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              className="pl-10 pr-4 py-2 w-full rounded-lg bg-black/20 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* filter */}
          <select
            className="py-2 px-3 rounded-lg bg-black/20 border border-white/10 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
        </div>

        {/* TABLE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-white/5 backdrop-blur-xl"
        >
          {loading ? (
            <div className="p-10 text-center text-gray-400 animate-pulse">
              Loading users...
            </div>
          ) : displayedUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-lg">
              No users found.
            </div>
          ) : (
            <table className="min-w-full text-sm md:text-base">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-gray-200 uppercase text-xs md:text-sm tracking-wide">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Age</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      scale: 1.01,
                    }}
                    className="border-t border-white/10"
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.age || "N/A"}</td>
                    <td className="p-3">{user.email}</td>

                    {/* role */}
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "Admin"
                            ? "bg-purple-500/20 text-purple-300"
                            : user.role === "Manager"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* actions */}
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/user/${user._id}`)}
                        className="p-2 bg-cyan-600/80 hover:bg-cyan-600 rounded-full shadow-lg transition"
                        title="View"
                      >
                        <FaEye size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 bg-red-600/80 hover:bg-red-600 rounded-full shadow-lg transition"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                    : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
