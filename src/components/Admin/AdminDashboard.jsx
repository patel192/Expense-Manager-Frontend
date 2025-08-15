import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LineChart, Line
} from "recharts";
import { Users, UserCog, CreditCard, Activity, PlusCircle, DollarSign, TrendingUp, Clock } from "lucide-react";

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userCountsPerMonth, setUserCountsPerMonth] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [topActive, setTopActive] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Users
        const res = await axios.get("/users");
        const allUsers = res.data.data || res.data.users || res.data || [];

        setUsers(allUsers);

        const monthlyCounts = {};
        const roleCount = { Admins: 0, Users: 0 };

        allUsers.forEach((user) => {
          const month = new Date(user.createdAt).toLocaleString("default", { month: "short" });
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
          if (user.roleId?.name === "Admin") roleCount.Admins++;
          else roleCount.Users++;
        });

        const monthsOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const monthlyData = monthsOrder.map((m) => ({
          name: m,
          users: monthlyCounts[m] || 0,
        }));

        const roleData = [
          { name: "Admins", value: roleCount.Admins },
          { name: "Users", value: roleCount.Users },
        ];

        const recent = [...allUsers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        // Fake transactions (replace with API)
        const fakeTransactions = [
          { id: 1, name: "John Doe", amount: 120, date: "2025-08-10" },
          { id: 2, name: "Jane Smith", amount: 250, date: "2025-08-09" },
          { id: 3, name: "Alex Carter", amount: 75, date: "2025-08-08" },
          { id: 4, name: "Sarah Lee", amount: 400, date: "2025-08-07" },
        ];

        // Fake top active users
        const fakeTopActive = [
          { name: "John Doe", actions: 56 },
          { name: "Jane Smith", actions: 43 },
          { name: "Alex Carter", actions: 35 },
        ];

        setUserCountsPerMonth(monthlyData);
        setRoleDistribution(roleData);
        setRecentUsers(recent);
        setTransactions(fakeTransactions);
        setTopActive(fakeTopActive);
      } catch (error) {
        console.error("Failed to load admin dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ["#4F46E5", "#10B981"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            <PlusCircle size={18} /> Add User
          </button>
          <button className="px-4 py-2 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
            <DollarSign size={18} /> Add Expense
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Users", value: users.length, color: "from-blue-500 to-indigo-500", icon: <Users size={36} /> },
          { title: "Total Admins", value: roleDistribution[0]?.value || 0, color: "from-green-500 to-emerald-500", icon: <UserCog size={36} /> },
          { title: "Transactions", value: transactions.length, color: "from-yellow-400 to-orange-500", icon: <CreditCard size={36} /> },
          { title: "Active Users", value: users.filter((u) => u.is_active).length, color: "from-purple-500 to-pink-500", icon: <Activity size={36} /> },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl shadow-lg text-white bg-gradient-to-r ${card.color} hover:scale-105 transition-transform`}
          >
            <div className="mb-2">{card.icon}</div>
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Users per Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userCountsPerMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
              <Legend />
              <Bar dataKey="users" fill="#4F46E5" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Role Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roleDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Users</h3>
          {recentUsers.length > 0 ? (
            <table className="w-full border-collapse rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.roleId?.name === "Admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {user.roleId?.name || "N/A"}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3">{tx.name}</td>
                    <td className="p-3 font-semibold text-green-600">${tx.amount}</td>
                    <td className="p-3">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
