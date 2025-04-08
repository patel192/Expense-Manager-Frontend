import React from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { motion } from "framer-motion";
const data = {
  income: 45000,
  expense: 27000,
  balance: 18000,
};

const barData = [
  { name: "Income", amount: data.income },
  { name: "Expense", amount: data.expense },
];

const pieData = [
  { name: "Rent", value: 10000 },
  { name: "Groceries", value: 5000 },
  { name: "Travel", value: 4000 },
  { name: "Utilities", value: 3000 },
  { name: "Others", value: 3000 },
];

const lineData = [
  { month: "Jan", income: 12000, expense: 6000 },
  { month: "Feb", income: 15000, expense: 7000 },
  { month: "Mar", income: 18000, expense: 8000 },
  { month: "Apr", income: 12000, expense: 5000 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF5"];   
export const Reports = () => {
  return (
    <div className="p-6">
    <h2 className="text-center text-2xl font-bold mb-6">📊 Your Financial Report</h2>

    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <motion.div whileHover={{ scale: 1.05 }} className="bg-green-100 rounded-2xl p-4 shadow-md text-center">
        <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
        <p className="text-2xl font-bold">₹{data.income}</p>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} className="bg-red-100 rounded-2xl p-4 shadow-md text-center">
        <h3 className="text-lg font-semibold text-red-800">Total Expense</h3>
        <p className="text-2xl font-bold">₹{data.expense}</p>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} className="bg-blue-100 rounded-2xl p-4 shadow-md text-center">
        <h3 className="text-lg font-semibold text-blue-800">Remaining Balance</h3>
        <p className="text-2xl font-bold">₹{data.balance}</p>
      </motion.div>
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Bar Chart: Income vs Expense */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-center font-semibold mb-4">Income vs Expense</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart: Category Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="text-center font-semibold mb-4">Expenses by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart: Monthly Trend */}
      <div className="col-span-1 lg:col-span-2 bg-white rounded-xl shadow-md p-4">
        <h3 className="text-center font-semibold mb-4">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="income" stroke="#00C49F" />
            <Line type="monotone" dataKey="expense" stroke="#FF8042" />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
  )
}
