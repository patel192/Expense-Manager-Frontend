import React, { useEffect, useState, Fragment } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaTags,
  FaRupeeSign,
  FaCalendarAlt,
  FaRegStickyNote,
  FaReceipt,
  FaTrashAlt,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const UserExpenses = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [categories, setCategories] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userId = localStorage.getItem("id");
  const COLORS = ["#ef4444", "#06b6d4", "#10b981", "#f59e0b", "#6366f1"];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (userId) setValue("userID", userId);

    fetchCategories();
    fetchRecentExpenses();
    fetchAllExpenses();
  }, []);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Category fetch error:", error);
    }
  };

  // Fetch recent expenses
  const fetchRecentExpenses = async () => {
    try {
      const res = await axiosInstance.get(`/recent-expense/${userId}`);
      setRecentExpenses(res.data.data || []);
    } catch (error) {
      console.error("Recent expense fetch error:", error);
    }
  };

  // Fetch all expenses
  const fetchAllExpenses = async () => {
    try {
      const res = await axiosInstance.get(`/expensesbyUserID/${userId}`);
      const data = res.data.data || [];
      setExpenses(data);
      buildCharts(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Build charts
  const buildCharts = (data) => {
    const monthly = Array.from({ length: 12 }, () => 0);
    const categoryMap = {};

    data.forEach((exp) => {
      const m = new Date(exp.date).getMonth();
      monthly[m] += exp.amount;

      categoryMap[exp.categoryID?.name] =
        (categoryMap[exp.categoryID?.name] || 0) + exp.amount;
    });

    setChartData(
      monthly.map((amt, idx) => ({
        month: new Date(0, idx).toLocaleString("default", { month: "short" }),
        amount: amt,
      }))
    );

    setCategoryBreakdown(
      Object.entries(categoryMap).map(([category, value]) => ({
        name: category,
        value,
      }))
    );
  };

  const SubmitHandler = async (data) => {
    try {
      await axiosInstance.post("/expense", {
        userID: data.userID,
        categoryID: data.categoryID,
        amount: data.amount,
        date: data.date,
        description: data.description,
      });

      alert("Expense added successfully");
      reset();
      setIsModalOpen(false);
      fetchRecentExpenses();
      fetchAllExpenses();
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await axiosInstance.delete(`/expense/${id}`);
      fetchAllExpenses();
      fetchRecentExpenses();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // ---------------------------------------
  // RETURN UI START
  // ---------------------------------------

  return (
    <div className="space-y-8 text-white">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expense Center</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track expenses, analyze patterns, and manage your spending.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-600 px-4 py-2 rounded-xl"
        >
          <FaPlus /> Add Expense
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 flex gap-6">
        {["overview", "analytics", "records"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize text-sm ${
              activeTab === tab
                ? "border-b-2 border-pink-400 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ------- OVERVIEW TAB ------- */}
      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Recent expenses */}
          <div className="bg-[#111318]/80 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold flex items-center gap-3 mb-4">
              <FaReceipt className="text-pink-500" /> Recent Expenses
            </h3>

            {recentExpenses.length === 0 ? (
              <p className="text-gray-400 italic">No recent expenses.</p>
            ) : (
              <ul className="divide-y divide-white/10">
                {recentExpenses.map((exp) => (
                  <li className="flex justify-between py-3" key={exp._id}>
                    <span>{exp.description}</span>
                    <span className="text-pink-400 font-semibold">
                      ₹{exp.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      )}

      {/* ------- ANALYTICS TAB ------- */}
      {activeTab === "analytics" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 xl:grid-cols-2 gap-8"
        >
          {/* Monthly trend */}
          <div className="bg-[#111318]/80 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Monthly Expenses Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#e5e7eb" fontSize={12} />
                <YAxis stroke="#e5e7eb" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111318",
                    color: "white",
                    borderRadius: "8px",
                    border: "1px solid #333",
                  }}
                />
                <Legend />
                <Bar dataKey="amount" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category breakdown */}
          <div className="bg-[#111318]/80 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* ------- RECORDS TAB ------- */}
      {activeTab === "records" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6"
        >
          {expenses.length === 0 ? (
            <p className="text-gray-400 text-center">No expenses recorded.</p>
          ) : (
            expenses.map((expense) => (
              <motion.div
                key={expense._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-xl border border-white/10 flex justify-between items-center shadow-lg"
              >
                <div>
                  <h4 className="text-lg font-semibold">{expense.description}</h4>
                  <p className="text-sm text-gray-400">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-pink-400 font-bold text-lg">
                    ₹{expense.amount}
                  </span>
                  <button
                    onClick={() => deleteExpense(expense._id)}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500 transition"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* ---------- ADD EXPENSE MODAL ---------- */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" onClose={() => setIsModalOpen(false)} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-[#111318] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-xl">

                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-semibold">Add Expense</Dialog.Title>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-4">

                  {/* Category */}
                  <div className="flex items-center bg-black/40 p-3 rounded-lg border border-gray-700">
                    <FaTags className="text-gray-400 mr-3" />
                    <select
                      {...register("categoryID", { required: "Category required" })}
                      className="bg-transparent w-full text-gray-200 outline-none"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center bg-black/40 p-3 rounded-lg border border-gray-700">
                    <FaRupeeSign className="text-gray-400 mr-3" />
                    <input
                      type="number"
                      {...register("amount", { required: "Amount required" })}
                      placeholder="Amount"
                      className="bg-transparent w-full text-gray-200 outline-none"
                    />
                  </div>

                  {/* Date */}
                  <div className="flex items-center bg-black/40 p-3 rounded-lg border border-gray-700">
                    <FaCalendarAlt className="text-gray-400 mr-3" />
                    <input
                      type="date"
                      {...register("date", { required: "Date required" })}
                      className="bg-transparent w-full text-gray-200 outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex items-center bg-black/40 p-3 rounded-lg border border-gray-700">
                    <FaRegStickyNote className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      {...register("description", { required: "Description required" })}
                      placeholder="Description"
                      className="bg-transparent w-full text-gray-200 outline-none"
                    />
                  </div>

                  <button className="w-full bg-gradient-to-r from-pink-500 to-red-600 py-2 rounded-lg shadow-md">
                    Add Expense
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
