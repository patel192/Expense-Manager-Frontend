import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#00C49F",
  "#FF8042",
  "#8884d8",
  "#FFBB28",
  "#FF4560",
  "#0088FE",
];

export const UserDashboard = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [expenseCategoryData, setExpenseCategoryData] = useState([]);
  const [incomeSourceData, setIncomeSourceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("id");
  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) {
        console.error("User ID not found in localStorage");
        setLoading(false);
        return;
      }

      try {
        const [incomeRes, expenseRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/incomesbyUserID/${userId}`),
          axios.get(`http://localhost:3001/api/expensesbyUserID/${userId}`),
        ]);

        const incomeData = incomeRes.data.data || [];
        const expenseData = expenseRes.data.data || [];

        // Totals
        const totalIncome = incomeData.reduce(
          (sum, item) => sum + item.amount,
          0
        );
        const totalExpense = expenseData.reduce(
          (sum, item) => sum + item.amount,
          0
        );

        setIncome(totalIncome);
        setExpense(totalExpense);

        // Transactions
        const formattedIncomes = incomeData.map((inc) => ({
          id: inc._id,
          type: "Income",
          description: inc.source,
          amount: inc.amount,
          date: inc.date,
        }));

        const formattedExpenses = expenseData.map((exp) => ({
          id: exp._id,
          type: "Expense",
          description: exp.description,
          amount: exp.amount,
          date: exp.date,
        }));

        const allTransactions = [
          ...formattedIncomes,
          ...formattedExpenses,
        ].sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(allTransactions.slice(0, 5));

        // Expense Category Chart
        const categoryMap = {};
        expenseData.forEach((exp) => {
          const category = exp.category || "Other";
          categoryMap[category] = (categoryMap[category] || 0) + exp.amount;
        });
        const categoryData = Object.keys(categoryMap).map((key) => ({
          name: key,
          value: categoryMap[key],
        }));
        setExpenseCategoryData(categoryData);

        // Income Source Chart
        const sourceMap = {};
        incomeData.forEach((inc) => {
          const source = inc.source || "Other";
          sourceMap[source] = (sourceMap[source] || 0) + inc.amount;
        });
        const sourceData = Object.keys(sourceMap).map((key) => ({
          name: key,
          value: sourceMap[key],
        }));
        setIncomeSourceData(sourceData);

        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  const balance = income - expense;

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen  p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userName} 👋</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-400">Total Income</h2>
          <p className="text-2xl font-bold text-green-400 mt-2">₹{income}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-400">Total Expense</h2>
          <p className="text-2xl font-bold text-red-400 mt-2">₹{expense}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-400">Balance</h2>
          <p className="text-2xl font-bold text-blue-400 mt-2">₹{balance}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseCategoryData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="value" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Income by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeSourceData}
                cx="50%"
                cy="50%"
                label
                outerRadius={100}
                fill="#00C49F"
                dataKey="value"
              >
                {incomeSourceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <table className="w-full text-sm text-gray-300">
          <thead>
            <tr className="text-left border-b border-gray-600">
              <th className="py-2">Type</th>
              <th className="py-2">Description</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-700">
                <td className="py-2">{tx.type}</td>
                <td className="py-2">{tx.description}</td>
                <td
                  className={`py-2 ${
                    tx.type === "Income" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ₹{tx.amount}
                </td>
                <td className="py-2">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm">
          <Link to="/private/addincome">➕ Add Income</Link>
        </button>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm">
          <Link to="/private/addexpense">➖ Add Expense</Link>
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm">
          <Link to="/private/reports">📊 View Reports</Link>
        </button>
      </div>
    </div>
  );
};
