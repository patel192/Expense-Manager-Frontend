import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const UserDashboard = ({token}) => {
  const [budget, setBudget] = useState([]);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [bills, setBills] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Colors for charts
  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];
  const userId = localStorage.getItem("id");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          budgetRes,
          incomeRes,
          expenseRes,
          billsRes,
          recurringRes,
          txnRes,
        ] = await Promise.all([
          axios.get(`http://localhost:3001/api/budgetsbyUserID/${userId}`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          }),
          axios.get(`http://localhost:3001/api/incomesbyUserID/${userId}`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          }),
          axios.get(`http://localhost:3001/api/expensesbyUserID/${userId}`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          }),
          axios.get(`http://localhost:3001/api/billByuserId/${userId}`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          }),
          axios.get(`http://localhost:3001/api/recurring/${userId}`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          }),
          axios.get(`http://localhost:3001/api/transactionsByUserID/${userId}`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          }),
        ]);

        setBudget(budgetRes.data.data);
        console.log(budgetRes.data.data)
        setIncome(incomeRes.data.data);
        console.log(incomeRes.data.data);
        setExpenses(expenseRes.data.data);
        console.log(expenseRes.data.data);
        setBills(billsRes.data.data);
        console.log(billsRes.data.data);
        setRecurring(recurringRes.data.data);
        console.log(recurringRes.data.data);
        setTransactions(txnRes.data.data);
        console.log(txnRes.data.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Dashboard</h1>

      {/* Budget Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Budget</h2>
          <p className="text-2xl font-bold text-indigo-600">
            ₹{budget.reduce((acc,i)=> acc+i.amount,0)}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Income
          </h2>
          <p className="text-2xl font-bold text-green-600">
            ₹{income.reduce((acc, i) => acc + i.amount, 0)}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Expenses
          </h2>
          <p className="text-2xl font-bold text-red-600">
            ₹{expenses.reduce((acc, e) => acc + e.amount, 0)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Income vs Expense Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Income vs Expenses
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: "Income",
                  amount: income.reduce((acc, i) => acc + i.amount, 0),
                },
                {
                  name: "Expenses",
                  amount: expenses.reduce((acc, e) => acc + e.amount, 0),
                },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Expense Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenses.map((e) => ({
                  name: e.category,
                  value: e.amount,
                }))}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {expenses.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bills & Recurring Expenses */}
      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Upcoming Bills
          </h2>
          <ul className="space-y-3">
            {bills.slice(0, 5).map((bill) => (
              <li
                key={bill._id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span>{bill.name}</span>
                <span className="font-semibold text-red-500">
                  ₹{bill.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recurring Expenses
          </h2>
          <ul className="space-y-3">
            {recurring.slice(0, 5).map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <span>{item.name}</span>
                <span className="font-semibold text-indigo-500">
                  ₹{item.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Recent Transactions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 6).map((txn) => (
                <tr key={txn._id} className="border-b">
                  <td className="p-3">{txn.description}</td>
                  <td className="p-3 capitalize">{txn.type}</td>
                  <td
                    className={`p-3 font-semibold ${
                      txn.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{txn.amount}
                  </td>
                  <td className="p-3">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
