import React from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { FaArrowUp, FaArrowDown, FaWallet, FaRupeeSign } from "react-icons/fa";


export const UserDashboard = () => {
   const summary = {
    balance: 45000,
    income: 80000,
    expenses: 35000,
    savingsGoal: 60000
  };

  const categoryData = [
    { name: "Food", value: 12000 },
    { name: "Transport", value: 5000 },
    { name: "Shopping", value: 8000 },
    { name: "Bills", value: 10000 },
  ];

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"];

  const monthlyTrends = [
    { month: "Jan", income: 70000, expenses: 30000 },
    { month: "Feb", income: 80000, expenses: 35000 },
    { month: "Mar", income: 75000, expenses: 40000 },
    { month: "Apr", income: 82000, expenses: 38000 },
  ];

  const transactions = [
    { id: 1, name: "Zomato Order", amount: -500, category: "Food" },
    { id: 2, name: "Salary Credit", amount: 80000, category: "Income" },
    { id: 3, name: "Uber Ride", amount: -250, category: "Transport" },
    { id: 4, name: "Electricity Bill", amount: -1500, category: "Bills" },
  ];

  const upcomingBills = [
    { id: 1, name: "Netflix", due: "2025-08-15", amount: 499 },
    { id: 2, name: "Rent", due: "2025-08-30", amount: 12000 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded-lg flex items-center gap-4">
          <FaWallet className="text-purple-500 text-3xl" />
          <div>
            <p className="text-gray-500">Total Balance</p>
            <h3 className="text-xl font-bold">₹{summary.balance.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg flex items-center gap-4">
          <FaArrowUp className="text-green-500 text-3xl" />
          <div>
            <p className="text-gray-500">Income</p>
            <h3 className="text-xl font-bold">₹{summary.income.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg flex items-center gap-4">
          <FaArrowDown className="text-red-500 text-3xl" />
          <div>
            <p className="text-gray-500">Expenses</p>
            <h3 className="text-xl font-bold">₹{summary.expenses.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <p className="text-gray-500">Savings Goal</p>
          <div className="w-full bg-gray-200 h-3 rounded-lg mt-2">
            <div
              className="bg-purple-500 h-3 rounded-lg"
              style={{ width: `${(summary.balance / summary.savingsGoal) * 100}%` }}
            ></div>
          </div>
          <p className="mt-1 text-sm">{Math.round((summary.balance / summary.savingsGoal) * 100)}% achieved</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Spending by Category */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-bold mb-4">Spending by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-bold mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#4CAF50" />
              <Line type="monotone" dataKey="expenses" stroke="#F44336" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
          <ul>
            {transactions.map((t) => (
              <li key={t.id} className="flex justify-between py-2 border-b">
                <span>{t.name}</span>
                <span className={t.amount < 0 ? "text-red-500" : "text-green-500"}>
                  ₹{t.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Bills */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-bold mb-4">Upcoming Bills</h3>
          <ul>
            {upcomingBills.map((b) => (
              <li key={b.id} className="flex justify-between py-2 border-b">
                <span>{b.name} - <small className="text-gray-500">{b.due}</small></span>
                <span className="text-red-500">₹{b.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
