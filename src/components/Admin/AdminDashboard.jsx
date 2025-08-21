import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import { Users, UserCog, CreditCard } from "lucide-react";

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userCountsPerMonth, setUserCountsPerMonth] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const userRes = await axios.get("/users");
        const allUsers = userRes.data.data || [];

        setUsers(allUsers);

        // Count admins vs users
        const adminCount = allUsers.filter((u) => u.role === "Admin").length;
        const userCount = allUsers.length - adminCount;

        setRoleDistribution([
          { name: "Admins", value: adminCount },
          { name: "Users", value: userCount },
        ]);

        // Monthly user count
        const monthlyCounts = {};
        allUsers.forEach((user) => {
          const month = new Date(user.createdAt).toLocaleString("default", { month: "short" });
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });
        const monthsOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const monthlyData = monthsOrder.map((m) => ({
          name: m,
          users: monthlyCounts[m] || 0,
        }));
        setUserCountsPerMonth(monthlyData);

        // Recent users
        const recent = [...allUsers]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentUsers(recent);

        // Fetch transactions
        const txRes = await axios.get("/transactions");
        setTransactions(txRes.data.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const COLORS = ["#4F46E5", "#10B981"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-500 to-indigo-500">
          <Users size={36} className="mb-2" />
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-3xl font-bold">{users.length}</p>
        </div>
        <div className="p-5 rounded-xl shadow-lg text-white bg-gradient-to-r from-green-500 to-emerald-500">
          <UserCog size={36} className="mb-2" />
          <h2 className="text-xl font-semibold">Total Admins</h2>
          <p className="text-3xl font-bold">
            {users.filter((u) => u.role === "Admin").length}
          </p>
        </div>
        <div className="p-5 rounded-xl shadow-lg text-white bg-gradient-to-r from-yellow-400 to-orange-500">
          <CreditCard size={36} className="mb-2" />
          <h2 className="text-xl font-semibold">Transactions</h2>
          <p className="text-3xl font-bold">{transactions.length}</p>
        </div>
      </div>

      {/* Users per Month (Bar Chart) */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Users per Month</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userCountsPerMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#4F46E5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Role Distribution (Pie Chart) */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Role Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={roleDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {roleDistribution.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Users */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Users</h3>
        {recentUsers.length > 0 ? (
          <ul className="divide-y">
            {recentUsers.map((user, idx) => (
              <li key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === "Admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {user.role}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent users found.</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Transactions</h3>
        {transactions.length > 0 ? (
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((tx, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="p-3">{tx.user?.name || "Unknown"}</td>
                  <td className="p-3 font-semibold text-green-600">₹{tx.amount}</td>
                  <td className="p-3">{new Date(tx.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  );
};
