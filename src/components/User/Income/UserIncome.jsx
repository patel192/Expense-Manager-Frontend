import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../Utils/axiosInstance";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { PlusIcon, XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  FaSyncAlt,
  FaPlusCircle,
  FaPauseCircle,
  FaTrashAlt,
} from "react-icons/fa";
export const UserIncome = () => {
  const [activeTab, setActiveTab] = useState("summary"); // 'summary' | 'analytics' | 'records'
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netSavings: 0,
    savingsRate: 0,
  });
  const [tips, setTips] = useState([]);
  const [monthlyIncomeExpense, setMonthlyIncomeExpense] = useState([]);
  const [monthlyIncomeTrend, setMonthlyIncomeTrend] = useState([]);
  const [avgIncome, setAvgIncome] = useState(0);
  const [loading, setLoading] = useState(false);

  // Add-income modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const userId = localStorage.getItem("id");
  const COLORS = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  // ---------- Helper: build stats, charts & tips ----------
  const computeAnalytics = (incomesData, expensesData) => {
    const totalIncome = incomesData.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expensesData.reduce((sum, e) => sum + e.amount, 0);
    const netSavings = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(2) : 0;

    setStats({
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
    });

    // 12 months buckets
    const months = Array.from({ length: 12 }, () => ({
      income: 0,
      expense: 0,
    }));

    incomesData.forEach((inc) => {
      const m = new Date(inc.date).getMonth();
      months[m].income += inc.amount;
    });

    expensesData.forEach((exp) => {
      const m = new Date(exp.date).getMonth();
      months[m].expense += exp.amount;
    });

    const monthly = months.map((m, idx) => ({
      month: new Date(0, idx).toLocaleString("default", {
        month: "short",
      }),
      income: m.income,
      expense: m.expense,
    }));

    setMonthlyIncomeExpense(monthly);
    setMonthlyIncomeTrend(
      monthly.map((m) => ({
        month: m.month,
        amount: m.income,
      }))
    );

    const yearlySum = months.reduce((a, b) => a + b.income, 0);
    const yearlyAvg = yearlySum / 12;
    setAvgIncome(yearlyAvg);

    // tips based on savings
    let suggestedTips = [];
    if (savingsRate < 20) {
      suggestedTips = [
        "Track your expenses closely — small leaks sink big ships.",
        "Avoid impulse spending; wait a day before non-essential buys.",
        "Plan home-cooked meals to reduce daily spending.",
      ];
    } else if (savingsRate < 40) {
      suggestedTips = [
        "Good job! Start building a 6-month emergency fund.",
        "Automate savings or SIPs to stay consistent.",
        "Review recurring subscriptions and cancel unused ones.",
      ];
    } else {
      suggestedTips = [
        "Great savings! Consider diversifying investments.",
        "Focus on long-term growth via index funds or ETFs.",
        "Explore low-effort passive income opportunities.",
      ];
    }
    setTips(suggestedTips);
  };

  // ---------- Fetch incomes & expenses ----------
  const fetchData = async () => {
    try {
      setLoading(true);
      const [incomeRes, expenseRes] = await Promise.all([
        axiosInstance.get(`/incomesbyUserId/${userId}`),
        axiosInstance.get(`/expensesbyUserId/${userId}`),
      ]);

      const incomesData = incomeRes.data.data || [];
      const expensesData = expenseRes.data.data || [];

      setIncomes(incomesData);
      setExpenses(expensesData);
      computeAnalytics(incomesData, expensesData);
    } catch (error) {
      console.error("Error fetching incomes/expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Initial setup ----------
  useEffect(() => {
    if (userId) setValue("userID", userId);
    fetchData();
    fetchRecurring();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ---------- Add income handler ----------
  const onSubmitIncome = async (data) => {
    const payload = {
      userID: data.userID,
      amount: Number(data.amount),
      source: data.source,
      date: data.date,
    };

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/income", payload);
      if (res.status === 201) {
        alert("✅ Income added successfully!");
        setIsModalOpen(false);
        reset();
        fetchData();
      } else {
        alert("❌ Something went wrong.");
      }
    } catch (error) {
      console.error("Error adding income:", error);
      alert("⚠️ " + (error.message || "Failed to add income"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Delete income handler ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      await axiosInstance.delete(`/incomes/${id}`);
      await fetchData();
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income.");
    }
  };

  const tabs = [
    { id: "summary", label: "Summary" },
    { id: "analytics", label: "Analytics" },
    { id: "records", label: "Records" },
    { id: "recurring", label: "Recurring" },
  ];

  const [recurringPayments, setRecurringPayments] = useState([]);
  const [recurringForm, setRecurringForm] = useState({
    name: "",
    amount: "",
    frequency: "Monthly",
    startDate: "",
    category: "",
  });
  const [recurringLoading, setRecurringLoading] = useState(false);
  const fetchRecurring = async () => {
    try {
      const res = await axiosInstance.get(`/recurring/${userId}`);
      setRecurringPayments(res.data.data || []);
    } catch (error) {
      console.error("Failed to load recurring payments", error);
    }
  };

  const handleRecurringChange = (e) => {
    setRecurringForm({ ...recurringForm, [e.target.name]: e.target.value });
  };

  const handleRecurringSubmit = async (e) => {
    e.preventDefault();
    if (
      !recurringForm.name ||
      !recurringForm.amount ||
      !recurringForm.startDate
    )
      return alert("Please fill all required fields");

    try {
      setRecurringLoading(true);
      await axiosInstance.post("/recurring", { ...recurringForm, userId });

      setRecurringForm({
        name: "",
        amount: "",
        frequency: "Monthly",
        startDate: "",
        category: "",
      });

      fetchRecurring();
    } catch (error) {
      console.error("Failed to add recurring payment", error);
    } finally {
      setRecurringLoading(false);
    }
  };

  const handleRecurringDelete = async (id) => {
    if (!window.confirm("Delete this recurring payment?")) return;

    try {
      await axiosInstance.delete(`/recurring/${id}`);
      fetchRecurring();
    } catch (error) {
      console.error("Failed to delete recurring payment", error);
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* ========== HEADER ========== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Income Center</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Add income, analyze trends, and manage all your records in one
            place.
          </p>
        </div>

        {/* Add Income button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-medium shadow-lg hover:opacity-90 transition"
        >
          <PlusIcon className="h-5 w-5" />
          Add Income
        </button>
      </div>

      {/* ========== TABS ========== */}
      <div className="border-b border-white/10">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-sm md:text-base border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-gray-400 hover:text-white hover:border-white/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ========== TAB PANELS ========== */}
      {loading && (
        <p className="text-gray-400 text-sm">Loading income data...</p>
      )}

      {!loading && (
        <>
          {/* ---------- SUMMARY TAB ---------- */}
          {activeTab === "summary" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Stats cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: "Total Income",
                    value: stats.totalIncome,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Total Expenses",
                    value: stats.totalExpense,
                    color: "text-rose-400",
                  },
                  {
                    label: "Net Savings",
                    value: stats.netSavings,
                    color: "text-cyan-400",
                  },
                  {
                    label: "Savings Rate",
                    value: `${stats.savingsRate}%`,
                    color: "text-amber-300",
                  },
                ].map((card, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-2xl bg-[#111318]/80 border border-white/10 p-6 shadow-xl"
                  >
                    <h3 className="text-xs uppercase tracking-wide text-gray-400">
                      {card.label}
                    </h3>
                    <p
                      className={`mt-3 text-2xl md:text-3xl font-semibold ${card.color}`}
                    >
                      {typeof card.value === "number"
                        ? `₹${card.value.toLocaleString()}`
                        : card.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-yellow-400/15 to-amber-500/10 border border-yellow-400/20 rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-yellow-200 mb-3">
                  Smart Finance Insights
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-100/90">
                  {tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}

          {/* ---------- ANALYTICS TAB ---------- */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 xl:grid-cols-2 gap-8"
            >
              {/* Monthly Income vs Expense */}
              <div className="rounded-3xl bg-[#111318]/80 border border-white/10 p-6 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">
                  Monthly Income vs Expenses
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyIncomeExpense}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <XAxis dataKey="month" stroke="#e5e7eb" fontSize={12} />
                    <YAxis stroke="#e5e7eb" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111318",
                        border: "1px solid #2a2d34",
                        borderRadius: "8px",
                        color: "#f9fafb",
                      }}
                    />
                    <Legend wrapperStyle={{ color: "#e5e7eb", fontSize: 12 }} />
                    <Bar
                      dataKey="income"
                      fill="#22c55e"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="expense"
                      fill="#ef4444"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Income trend with average */}
              <div className="rounded-3xl bg-[#111318]/80 border border-white/10 p-6 shadow-xl">
                <h3 className="text-lg font-semibold mb-4">
                  Income Trend & Average
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={monthlyIncomeTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <XAxis dataKey="month" stroke="#e5e7eb" fontSize={12} />
                    <YAxis stroke="#e5e7eb" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111318",
                        border: "1px solid #2a2d34",
                        borderRadius: "8px",
                        color: "#f9fafb",
                      }}
                    />
                    <ReferenceLine
                      y={avgIncome}
                      stroke="#3b82f6"
                      strokeDasharray="3 3"
                      label={{
                        value: "Avg",
                        position: "right",
                        fill: "#3b82f6",
                        fontSize: 11,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#22c55e" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* ---------- RECORDS TAB ---------- */}
          {activeTab === "records" && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">All Income Records</h3>
                  <p className="text-gray-400 text-sm">
                    View and manage every income entry you’ve added.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-sm hover:bg-white/15 transition"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Income
                </button>
              </div>

              {incomes.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No income records yet. Start by adding your first income.
                </p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {incomes.map((income, idx) => (
                    <motion.div
                      key={income._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                      className="rounded-2xl bg-gradient-to-br from-blue-600/80 to-indigo-700/80 border border-white/10 shadow-lg p-5 flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="text-lg font-semibold">
                          {income.source}
                        </h4>
                        <p className="text-xs text-gray-200 mt-1">
                          {new Date(income.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <span className="text-2xl font-bold">
                          ₹{income.amount}
                        </span>
                        <button
                          onClick={() => handleDelete(income._id)}
                          className="p-2 rounded-full bg-red-500/80 hover:bg-red-600 transition"
                        >
                          <TrashIcon className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </>
      )}
      {/* ---------- RECURRING EXPENSES TAB ---------- */}
      {activeTab === "recurring" && (
        <motion.div
          key="recurring"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <FaSyncAlt /> Recurring Payments
          </h1>

          {/* Add New Recurring Payment */}
          <motion.form
            onSubmit={handleRecurringSubmit}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8 
                 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <input
              type="text"
              name="name"
              placeholder="Payment Name"
              value={recurringForm.name}
              onChange={handleRecurringChange}
              className="p-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={recurringForm.amount}
              onChange={handleRecurringChange}
              className="p-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
            />

            <select
              name="frequency"
              value={recurringForm.frequency}
              onChange={handleRecurringChange}
              className="p-2 rounded bg-white/20 text-white focus:outline-none"
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>

            <input
              type="date"
              name="startDate"
              value={recurringForm.startDate}
              onChange={handleRecurringChange}
              className="p-2 rounded bg-white/20 text-white focus:outline-none"
            />

            <input
              type="text"
              name="category"
              placeholder="Category (Optional)"
              value={recurringForm.category}
              onChange={handleRecurringChange}
              className="p-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
            />

            <button
              type="submit"
              disabled={recurringLoading}
              className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded flex items-center 
                   justify-center gap-2 hover:scale-105 transition-transform shadow-lg"
            >
              <FaPlusCircle /> {recurringLoading ? "Adding..." : "Add Payment"}
            </button>
          </motion.form>

          {/* Existing Recurring Payments */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-4">
              Your Recurring Payments
            </h2>

            {recurringPayments.length === 0 ? (
              <p className="text-white/70">No recurring payments added yet.</p>
            ) : (
              <table className="w-full text-left text-white/90">
                <thead>
                  <tr className="border-b border-white/30">
                    <th className="py-2">Name</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Frequency</th>
                    <th className="py-2">Start Date</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {recurringPayments.map((pay) => (
                    <motion.tr
                      key={pay._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border-b border-white/20"
                    >
                      <td className="py-2">{pay.name}</td>
                      <td className="py-2 text-green-400">₹{pay.amount}</td>
                      <td className="py-2">{pay.frequency}</td>
                      <td className="py-2">
                        {new Date(pay.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-2">{pay.category || "-"}</td>

                      <td className="py-2 flex gap-3">
                        <button
                          onClick={() => alert("Pause feature coming soon")}
                          className="text-yellow-400 hover:text-yellow-500"
                        >
                          <FaPauseCircle size={18} />
                        </button>

                        <button
                          onClick={() => handleRecurringDelete(pay._id)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      )}

      {/* ========== ADD INCOME MODAL ========== */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsModalOpen(false)}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          {/* Panel */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-[#111318] border border-white/10 p-6 sm:p-7 shadow-2xl">
                {/* Modal header */}
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <Dialog.Title className="text-lg font-semibold">
                    Add New Income
                  </Dialog.Title>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmitIncome)}
                  className="space-y-4"
                >
                  {/* Amount */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("amount", {
                        required: "Amount is required",
                      })}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    {errors.amount && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Source
                    </label>
                    <select
                      {...register("source", {
                        required: "Source is required",
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select income source</option>
                      <option value="Salary">Salary</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Investments">Investments</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.source && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.source.message}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      {...register("date", {
                        required: "Date is required",
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    {errors.date && (
                      <p className="text-xs text-red-400 mt-1">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  {/* Hidden userID */}
                  <input type="hidden" {...register("userID")} />

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-medium text-white shadow-lg hover:opacity-90 transition disabled:opacity-60"
                  >
                    {isSubmitting ? "Adding..." : "Add Income"}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
