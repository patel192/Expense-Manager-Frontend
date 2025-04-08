import React from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
export const AdminDashboard = () => {
  const usersData = [
    { name: "January", users: 3 },
    { name: "February", users: 5 },
    { name: "March", users: 2 },
  ];
  
  const roleData = [
    { name: "Admins", value: 1 },
    { name: "Users", value: 3 },
  ];
  
  const recentUsers = [
    { name: "Muhammad", email: "muhammad@example.com", role: "Admin", isActive: true },
    { name: "Asad", email: "asad@example.com", role: "User", isActive: true },
    { name: "Arin", email: "arin@example.com", role: "User", isActive: false },
  ];
  
  const COLORS = ["#0088FE", "#00C49F"];
  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-xl shadow-md">👥 Total Users: <strong>4</strong></div>
        <div className="bg-green-100 p-4 rounded-xl shadow-md">🧑‍💼 Total Admins: <strong>1</strong></div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow-md">📊 Transactions: <strong>12</strong></div>
        <div className="bg-purple-100 p-4 rounded-xl shadow-md">✅ Active Users: <strong>3</strong></div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">📈 Users per Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={usersData}>
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
              <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                <td className="p-2 border">{user.role}</td>
                <td className="p-2 border">{user.isActive ? "Yes ✅" : "No ❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
