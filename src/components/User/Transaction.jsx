import axiosInstance from "../Utils/axiosInstance";
import React, { useEffect, useState } from "react";

export const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("All"); // "All" | "Expenses" | "Incomes"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("id");

        const [expenseRes, incomeRes, budgetRes] = await Promise.all([
          axiosInstance.get(`/expensesbyUserID/${userId}`),
          axiosInstance.get(`/incomesbyUserID/${userId}`),
          axiosInstance.get(`/budgetsbyUserID/${userId}`),
        ]);

        const expenses = expenseRes.data.data.map((e) => ({
          ...e,
          type: "Expense",
        }));
        const incomes = incomeRes.data.data.map((i) => ({
          ...i,
          type: "Income",
        }));
        const budgets = budgetRes.data.data;

        const merged = [...expenses, ...incomes].map((t) => {
          if (t.type === "Expense") {
            const hasBudget = budgets.some(
              (b) => b.categoryID._id === t.categoryID._id
            );
            return { ...t, hasBudget };
          }
          return t;
        });

        setTransactions(merged);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    };

    fetchData();
  }, []);

  const filtered =
    activeTab === "All"
      ? transactions
      : transactions.filter((t) => t.type === activeTab.slice(0, -1));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Transactions</h2>

      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        {["All", "Expenses", "Incomes"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg font-medium ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl shadow-md p-4">
        {filtered.length > 0 ? (
          <ul className="divide-y">
            {filtered.map((t, i) => (
              <li
                key={i}
                className="flex justify-between items-center py-3 hover:bg-gray-50 px-2 rounded-lg"
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
                  <p
                    className={`font-semibold ${
                      t.type === "Expense" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {t.type === "Expense" ? "-" : "+"}₹{t.amount}
                  </p>
                  {t.type === "Expense" && !t.hasBudget && (
                    <button className="mt-1 px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600">
                      Plan Budget
                    </button>
                  )}
                </div>
              </li>
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
