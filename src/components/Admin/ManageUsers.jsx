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
  const usersPerPage = 5;
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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = displayedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(displayedUsers.length / usersPerPage);

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await axiosInstance.delete(`/user/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("✅ User deleted", { autoClose: 3000, style: { backgroundColor: "#16a34a", color: "white" } });
    } catch {
      toast.error("❌ Error deleting user", { autoClose: 3000, style: { backgroundColor: "#dc2626", color: "white" } });
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
      <ToastContainer theme="colored" transition={Bounce} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 md:p-6 shadow-xl bg-white/10 backdrop-blur-md border border-white/20"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Manage Users
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <IoSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              className="pl-10 pr-4 py-2 w-full rounded-lg bg-white/5 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="p-2 rounded-lg bg-white/5 backdrop-blur-md border border-white/20 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-400">Loading users...</p>
        ) : displayedUsers.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No users found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/20 bg-white/5 backdrop-blur-md shadow-lg">
            <table className="min-w-full text-white text-sm md:text-base">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-xs md:text-sm uppercase">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Age</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <motion.tr
                    key={user._id}
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="border-t border-white/10"
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.age || "N/A"}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                          user.role === "Admin"
                            ? "bg-purple-400/20 text-purple-300"
                            : user.role === "Manager"
                            ? "bg-blue-400/20 text-blue-300"
                            : "bg-green-400/20 text-green-300"
                        }`}
                      >
                        {user.role || "N/A"}
                      </span>
                    </td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/user/${user._id}`)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full shadow-md"
                        title="View Details"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 bg-red-500 hover:bg-red-600 rounded-full shadow-md"
                        title="Delete User"
                      >
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded-lg font-medium transition text-sm md:text-base ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-white/5 text-gray-300 hover:bg-white/10"
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
