import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

export const Accesscontrol = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users");
        setUsers(res.data.data || []);
      } catch (error) {
        alert("Error fetching users");
      }
    };
    fetchUsers();
  }, []);

  // Role badge colors
  const roleColors = {
    Admin: "bg-yellow-400 text-gray-900",
    User: "bg-blue-400 text-white",
    Manager: "bg-purple-500 text-white",
  };

  // Filtering logic
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
    <div className="p-6 bg-gray-950 min-h-screen">
      <div className="bg-gray-900 rounded-xl shadow-xl p-5 border border-gray-800">
        <h2 className="text-gray-100 text-2xl font-bold mb-5">
          User Access Control
        </h2>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 pr-3 py-2 rounded-lg w-full bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="px-3 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700"
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
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="min-w-full text-gray-200">
            <thead>
              <tr className="bg-gray-800 text-sm uppercase text-gray-300">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Age</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Joined</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-800 hover:bg-gray-850 transition-colors"
                  >
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.age || "N/A"}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          roleColors[user.roleId?.name] ||
                          "bg-gray-500 text-white"
                        }`}
                      >
                        {user.roleId?.name || "N/A"}
                      </span>
                    </td>
                    <td className="p-3">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      {user.is_active ? (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-500 text-white rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white">
                        <FaEdit size={14} />
                      </button>
                      <button className="p-2 bg-red-500 hover:bg-red-600 rounded-full text-white">
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="p-4 text-center text-gray-500 italic"
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
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded font-semibold transition ${
                  currentPage === idx + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
