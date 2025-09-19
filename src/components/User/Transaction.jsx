import React, { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";

export const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });

  const tabTypes = { All: null, Expenses: "Expense", Incomes: "Income" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("id");

        const [expenseRes, incomeRes, budgetRes] = await Promise.all([
          axiosInstance.get(`/expensesbyUserID/${userId}`),
          axiosInstance.get(`/incomesbyUserID/${userId}`),
          axiosInstance.get(`/budgetsbyUserID/${userId}`),
        ]);

        const expenses = expenseRes.data.data.map((e) => ({ ...e, type: "Expense" }));
        const incomes = incomeRes.data.data.map((i) => ({ ...i, type: "Income" }));
        const budgets = budgetRes.data.data;

        const merged = [...expenses, ...incomes].map((t) => {
          if (t.type === "Expense") {
            const hasBudget = budgets.some((b) => b.categoryID._id === t.categoryID?._id);
            return { ...t, hasBudget };
          }
          return t;
        });

        setTransactions(merged);

        // Calculate summary
        const totalIncome = incomes.reduce((acc, i) => acc + i.amount, 0);
        const totalExpense = expenses.reduce((acc, e) => acc + e.amount, 0);
        setSummary({ totalIncome, totalExpense, balance: totalIncome - totalExpense });
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    fetchData();
  }, []);

  const filtered = tabTypes[activeTab]
    ? transactions.filter((t) => t.type === tabTypes[activeTab])
    : transactions;

  const filteredSorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Transactions</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-green-100 rounded-2xl p-4 shadow-md text-center"
        >
          <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
          <p className="text-2xl font-bold">₹{summary.totalIncome.toLocaleString()}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-red-100 rounded-2xl p-4 shadow-md text-center"
        >
          <h3 className="text-lg font-semibold text-red-800">Total Expense</h3>
          <p className="text-2xl font-bold">₹{summary.totalExpense.toLocaleString()}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-blue-100 rounded-2xl p-4 shadow-md text-center"
        >
          <h3 className="text-lg font-semibold text-blue-800">Balance</h3>
          <p className="text-2xl font-bold">₹{summary.balance.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        {Object.keys(tabTypes).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg font-medium ${
              activeTab === tab ? "bg-blue-500 text-white" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl shadow-md p-4">
        {filteredSorted.length > 0 ? (
          <ul className="divide-y">
            {filteredSorted.map((t) => (
              <motion.li
                key={t._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
                transition={{ duration: 0.2 }}
                className="flex justify-between items-center py-3 px-2 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {t.description || t.source || "No description"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.categoryID?.name || "Uncategorized"} •{" "}
                    {new Date(t.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${t.type === "Expense" ? "text-red-600" : "text-green-600"}`}>
                    {t.type === "Expense" ? "-" : "+"}₹{t.amount.toLocaleString()}
                  </p>
                  {t.type === "Expense" && !t.hasBudget && (
                    <button className="mt-1 px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600">
                      Plan Budget
                    </button>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-center py-6">
            No {activeTab.toLowerCase()} transactions found
          </p>
        )}
      </div>
    </div>
  );
};
