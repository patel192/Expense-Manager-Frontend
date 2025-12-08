import React, { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
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
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { HiDocumentArrowDown, HiPrinter } from "react-icons/hi2";
import { FaChartPie, FaChartLine, FaChartBar } from "react-icons/fa6";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#A855F7", "#14B8A6"];

export const Reports = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // Fetch Data
  // ---------------------------
  useEffect(() => {
    const userId = localStorage.getItem("id");
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes] = await Promise.all([
          axiosInstance.get(`/incomesbyUserID/${userId}`),
          axiosInstance.get(`/expensesbyUserID/${userId}`),
        ]);

        setIncomeData(incomeRes.data.data || []);
        setExpenseData(expenseRes.data.data || []);
      } catch (err) {
        console.error("Failed fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-300 text-lg">
        Loading Report...
      </div>
    );

  // ---------------------------
  // Calculations
  // ---------------------------
  const totalIncome = incomeData.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenseData.reduce((s, e) => s + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Expense", amount: totalExpense },
  ];

  // Pie Chart Data → Expenses by Category
  const categoryMap = {};
  expenseData.forEach((item) => {
    const category = item.categoryID?.name || "General";
    categoryMap[category] = (categoryMap[category] || 0) + item.amount;
  });
  const pieData = Object.entries(categoryMap).map(([category, value]) => ({
    category,
    value,
  }));

  // Line Chart Monthly Data
  const monthMap = {};
  [...incomeData, ...expenseData].forEach((item) => {
    const date = new Date(item.date);
    const month = date.toLocaleString("default", { month: "short" });

    if (!monthMap[month]) monthMap[month] = { month, income: 0, expense: 0 };

    if (incomeData.includes(item)) monthMap[month].income += item.amount;
    else monthMap[month].expense += item.amount;
  });

  const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const lineData = Object.values(monthMap).sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  );

  // ---------------------------
  // EXPORT PDF
  // ---------------------------
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Financial Report", 14, 16);

    doc.autoTable({
      head: [["Summary", "Amount"]],
      body: [
        ["Total Income", `₹${totalIncome.toLocaleString()}`],
        ["Total Expense", `₹${totalExpense.toLocaleString()}`],
        ["Remaining Balance", `₹${balance.toLocaleString()}`],
      ],
      startY: 25,
    });

    const transactions = [
      ...incomeData.map((t) => [
        "Income",
        t.categoryID?.name || "General",
        t.source || "N/A",
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
      body: transactions,
      startY: doc.lastAutoTable.finalY + 10,
    });

    doc.save("Financial_Report.pdf");
  };

  // ---------------------------
  // EXPORT EXCEL
  // ---------------------------
  const exportExcel = () => {
    const summarySheet = XLSX.utils.json_to_sheet([
      { Summary: "Total Income", Amount: totalIncome },
      { Summary: "Total Expense", Amount: totalExpense },
      { Summary: "Remaining Balance", Amount: balance },
    ]);

    const transactionSheet = XLSX.utils.json_to_sheet([
      ...incomeData.map((t) => ({
        Type: "Income",
        Category: t.categoryID?.name || "General",
        Description: t.source || "N/A",
        Amount: t.amount,
        Date: new Date(t.date).toLocaleDateString(),
      })),
      ...expenseData.map((t) => ({
        Type: "Expense",
        Category: t.categoryID?.name || "General",
        Description: t.description || "N/A",
        Amount: t.amount,
        Date: new Date(t.date).toLocaleDateString(),
      })),
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    XLSX.utils.book_append_sheet(workbook, transactionSheet, "Transactions");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "Financial_Report.xlsx");
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <p className="text-gray-400 mt-2">
          A complete analytical breakdown of your financial data.
        </p>
      </motion.div>

      {/* Export Toolbar */}
      <div className="flex justify-end gap-4 mb-8">
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition"
        >
          <HiPrinter className="text-lg" /> PDF
        </button>

        <button
          onClick={exportExcel}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md transition"
        >
          <HiDocumentArrowDown className="text-lg" /> Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { title: "Total Income", value: totalIncome, color: "text-green-400" },
          { title: "Total Expense", value: totalExpense, color: "text-red-400" },
          { title: "Balance", value: balance, color: "text-blue-400" },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/10 border border-white/10 backdrop-blur-xl p-6 rounded-2xl text-center shadow-xl"
          >
            <h3 className="text-sm uppercase text-gray-300 tracking-wide">
              {card.title}
            </h3>
            <p className={`text-3xl font-semibold mt-2 ${card.color}`}>
              ₹{card.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Income vs Expense */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 rounded-xl border border-white/10 p-6 shadow-xl"
        >
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <FaChartBar className="text-indigo-400" /> Income vs Expense
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#d1d5db" />
              <YAxis stroke="#d1d5db" />
              <Tooltip />
              <Bar dataKey="amount" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expenses by Category */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 rounded-xl border border-white/10 p-6 shadow-xl"
        >
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <FaChartPie className="text-pink-400" /> Expense Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Trend Line Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 bg-white/10 rounded-xl border border-white/10 p-6 shadow-xl"
        >
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <FaChartLine className="text-emerald-400" /> Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
              <XAxis dataKey="month" stroke="#e5e7eb" />
              <YAxis stroke="#e5e7eb" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

      </div>
    </div>
  );
};
