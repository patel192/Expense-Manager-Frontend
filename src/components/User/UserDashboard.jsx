import React from "react";

export const UserDashboard = () => {
  const userName = "Muhammad"; // hardcoded username
  const income = 10000;
  const expense = 6000;
  const balance = income - expense;

  const recentTransactions = [
    { id: 1, type: "Income", description: "Freelance Work", amount: 3000, date: "2025-04-01" },
    { id: 2, type: "Expense", description: "Groceries", amount: 1000, date: "2025-04-02" },
    { id: 3, type: "Expense", description: "Rent", amount: 4000, date: "2025-04-03" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
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

      {/* Chart Placeholder */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8 shadow-md text-center text-gray-400">
        📊 Expense Overview Chart (Coming Soon)
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
            {recentTransactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-700">
                <td className="py-2">{tx.type}</td>
                <td className="py-2">{tx.description}</td>
                <td className={`py-2 ${tx.type === "Income" ? "text-green-400" : "text-red-400"}`}>
                  ₹{tx.amount}
                </td>
                <td className="py-2">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm">
          ➕ Add Income
        </button>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm">
          ➖ Add Expense
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm">
          📊 View Reports
        </button>
      </div>
    </div>
  );
};
