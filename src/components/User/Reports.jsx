import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF5", "#FF66CC"];

export const Reports = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("id");

    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          axios.get(`/incomesbyUserID/${userId}`),
          axios.get(`/expensesbyUserID/${userId}`),
        ]);

        setIncomeData(incomeRes.data.data || []);
        setExpenseData(expenseRes.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch report data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center">Loading report...</p>;
  }

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpense;

  // Bar Chart Data
  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Expense", amount: totalExpense },
  ];

  // Pie Chart Data - Category Distribution
  const categoryMap = {};
  expenseData.forEach((item) => {
    const categoryName = item.categoryID?.name || "Uncategorized";
    if (!categoryMap[categoryName]) {
      categoryMap[categoryName] = 0;
    }
    categoryMap[categoryName] += item.amount;
  });

  const pieData = Object.entries(categoryMap).map(([category, value]) => ({
    category,
    value,
  }));

  // Line Chart Data - Monthly Trend
  const monthMap = {};

  // Income
  incomeData.forEach((item) => {
    const date = new Date(item.date);
    const month = date.toLocaleString("default", { month: "short" });
    if (!monthMap[month]) monthMap[month] = { month, income: 0, expense: 0 };
    monthMap[month].income += item.amount;
  });

  // Expense
  expenseData.forEach((item) => {
    const date = new Date(item.date);
    const month = date.toLocaleString("default", { month: "short" });
    if (!monthMap[month]) monthMap[month] = { month, income: 0, expense: 0 };
    monthMap[month].expense += item.amount;
  });

  const lineData = Object.values(monthMap).sort(
    (a, b) => new Date(`1 ${a.month} 2025`) - new Date(`1 ${b.month} 2025`)
  );

  // -------- Export PDF --------
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Report", 14, 16);

    // Summary
    doc.autoTable({
      head: [["Summary", "Amount"]],
      body: [
        ["Total Income", `₹${totalIncome}`],
        ["Total Expense", `₹${totalExpense}`],
        ["Remaining Balance", `₹${balance}`],
      ],
      startY: 25,
    });

    // Transactions
    const allTransactions = [
      ...incomeData.map((t) => [
        "Income",
        t.categoryID?.name || "General",
        t.source || t.description || "N/A",
        `₹${t.amount}`,
        new Date(t.date).toLocaleDateString(),
        new Date(t.date).toLocaleTimeString(),
      ]),
      ...expenseData.map((t) => [
        "Expense",
        t.categoryID?.name || "General",
        t.description || "N/A",
        `₹${t.amount}`,
        new Date(t.date).toLocaleDateString(),
        new Date(t.date).toLocaleTimeString(),
      ]),
    ];

    doc.autoTable({
      head: [["Type", "Category", "Description", "Amount", "Date", "Time"]],
      body: allTransactions,
      startY: doc.lastAutoTable.finalY + 10,
    });

    doc.save("Financial_Report.pdf");
  };

  // -------- Export Excel --------
  const exportExcel = () => {
    // Summary Sheet
    const summarySheet = XLSX.utils.json_to_sheet([
      { Summary: "Total Income", Amount: totalIncome },
      { Summary: "Total Expense", Amount: totalExpense },
      { Summary: "Remaining Balance", Amount: balance },
    ]);

    // Transactions Sheet
    const transactions = [
      ...incomeData.map((t) => ({
        Type: "Income",
        Category: t.categoryID?.name || "General",
        Description: t.source || t.description || "N/A",
        Amount: t.amount,
        Date: new Date(t.date).toLocaleDateString(),
        Time: new Date(t.date).toLocaleTimeString(),
      })),
      ...expenseData.map((t) => ({
        Type: "Expense",
        Category: t.categoryID?.name || "General",
        Description: t.description || "N/A",
        Amount: t.amount,
        Date: new Date(t.date).toLocaleDateString(),
        Time: new Date(t.date).toLocaleTimeString(),
      })),
    ];
    const transactionSheet = XLSX.utils.json_to_sheet(transactions);

    // Workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    XLSX.utils.book_append_sheet(workbook, transactionSheet, "Transactions");

    // Save File
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "Financial_Report.xlsx"
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-center text-2xl font-bold mb-6">
        📊 Your Financial Report
      </h2>

      {/* Export Buttons */}
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={exportPDF}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          Export PDF
        </button>
        <button
          onClick={exportExcel}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
        >
          Export Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-green-100 rounded-2xl p-4 shadow-md text-center"
        >
          <h3 className="text-lg font-semibold text-green-800">Total Income</h3>
          <p className="text-2xl font-bold">₹{totalIncome}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-red-100 rounded-2xl p-4 shadow-md text-center"
        >
          <h3 className="text-lg font-semibold text-red-800">Total Expense</h3>
          <p className="text-2xl font-bold">₹{totalExpense}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-blue-100 rounded-2xl p-4 shadow-md text-center"
        >
          <h3 className="text-lg font-semibold text-blue-800">
            Remaining Balance
          </h3>
          <p className="text-2xl font-bold">₹{balance}</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Bar Chart */}
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

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-center font-semibold mb-4">
            Expenses by Category
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
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
  );
};
