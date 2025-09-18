import React, { useEffect, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaEye } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
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
      } catch (error) {
        toast.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Search & filter logic
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

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = displayedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(displayedUsers.length / usersPerPage);

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      await axiosInstance.delete(`/user/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("✅ User deleted", {
        autoClose: 3000,
        style: { backgroundColor: "#16a34a", color: "white" },
      });
    } catch (error) {
      toast.error("❌ Error deleting user", {
        autoClose: 3000,
        style: { backgroundColor: "#dc2626", color: "white" },
      });
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <ToastContainer theme="colored" transition={Bounce} />

      <div className="bg-gray-800 rounded-xl shadow-lg p-5 border border-gray-700">
        <h2 className="text-white text-2xl font-semibold mb-5">Manage Users</h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div className="relative">
            <IoSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="bg-gray-700 text-white p-2 rounded-lg border border-gray-600"
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
          <div className="text-center text-gray-400 py-10">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full text-white">
              <thead>
                <tr className="bg-gray-700 text-sm uppercase">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Age</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.age || "N/A"}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role || "N/A"}</td>
                    <td className="p-3 flex justify-center gap-2">
                      {/* View Details Button */}
                      <button
                        onClick={() => navigate(`/admin/user/${user._id}`)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full"
                        title="View Details"
                      >
                        <FaEye size={14} />
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded-full"
                        title="Delete User"
                      >
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
