import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userCountsPerMonth, setUserCountsPerMonth] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("/users"); // Adjust API if needed
        const allUsers = res.data.data;
        console.log(res)

        setUsers(allUsers);

        // Group users by month (simplified - assuming `createdAt` exists)
        const monthlyCounts = {};
        const roleCount = { Admins: 0, Users: 0 };
        const recent = [];

        allUsers.forEach((user) => {
          const month = new Date(user.createdAt).toLocaleString("default", {
            month: "long",
          });

          // Monthly user counts
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;

          // Role distribution
          if (user.roleId.name === "Admin") roleCount.Admins++;
          else roleCount.Users++;

          // Recent users (latest 5)
          if (recent.length < 5) recent.push(user);
        });

        const monthlyData = Object.keys(monthlyCounts).map((month) => ({
          name: month,
          users: monthlyCounts[month],
        }));

        const roleData = [
          { name: "Admins", value: roleCount.Admins },
          { name: "Users", value: roleCount.Users },
        ];

        setUserCountsPerMonth(monthlyData);
        setRoleDistribution(roleData);
        setRecentUsers(recent);
      } catch (error) {
        console.error("Failed to load admin dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-xl shadow-md">
          👥 Total Users: <strong>{users.length}</strong>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow-md">
          🧑‍💼 Total Admins: <strong>{roleDistribution[0]?.value || 0}</strong>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow-md">
          📊 Transactions: <strong>12</strong>
        </div>
        <div className="bg-purple-100 p-4 rounded-xl shadow-md">
          ✅ Active Users:{" "}
          <strong>{users.filter((u) => u.isActive).length}</strong>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">📈 Users per Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userCountsPerMonth}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">🎯 User Role Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={roleDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {roleDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-2">🕵️ Recent Users</h3>
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Active</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((user, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.roleId.name}</td>
                <td className="p-2 border">
                  {user.is_active ? "Yes ✅" : "No ❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
