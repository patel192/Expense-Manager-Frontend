import React, { useState, useEffect, Fragment, useMemo } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaChartPie,
  FaPlus,
  FaCalendarAlt,
  FaRupeeSign,
  FaTags,
  FaTrashAlt,
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
export const UserBudget = () => {
  const {user} = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const userId = useMemo(() => user?._id, [user]);

  // --------------------------
  // Fetch Data
  // --------------------------
  useEffect(() => {
    fetchCategories();
    fetchBudgetData();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBudgetData = async () => {
    try {
      const [bRes, eRes] = await Promise.all([
        axiosInstance.get(`/budgetsbyUserID/${userId}`),
        axiosInstance.get(`/expensesbyUserID/${userId}`),
      ]);

      const bArr = bRes.data.data || [];
      const eArr = eRes.data.data || [];

      setBudgets(bArr);
      setExpenses(eArr);

      generateSummary(bArr, eArr);
    } catch (error) {
      console.error(error);
    }
  };

  // --------------------------
  // Build Summary
  // --------------------------
  const generateSummary = (budgetsArr, expensesArr) => {
    const processed = budgetsArr.map((b) => {
      const catId =
        typeof b.categoryID === "object"
          ? b.categoryID._id || b.categoryID.id
          : b.categoryID;

      const catName =
        typeof b.categoryID === "object" ? b.categoryID.name : "Unknown";

      const spent = expensesArr
        .filter((e) => {
          const eCat =
            typeof e.categoryID === "object"
              ? e.categoryID._id || e.categoryID.id
              : e.categoryID;
          return eCat === catId;
        })
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);

      return {
        id: b._id,
        category: catName,
        allocated: Number(b.amount) || 0,
        spent,
        remaining: Number(b.amount) - spent,
        start: b.start_date,
        end: b.end_date,
      };
    });

    setSummary(processed);
  };

  // --------------------------
  // Insights
  // --------------------------
  const generateInsights = () => {
    if (!summary.length)
      return ["Set your first budget to take control of your money!"];

    const tips = [];

    summary.forEach((s) => {
      if (s.spent > s.allocated)
        tips.push(`⚠️ Overspending detected in ${s.category}. Reduce expenses.`);
      else if (s.remaining < s.allocated * 0.15)
        tips.push(`⚡ ${s.category} budget is nearly exhausted.`);
      else if (s.remaining > s.allocated * 0.5)
        tips.push(`💡 ${s.category} has a healthy surplus.`);
    });

    return tips.length ? tips : ["All budgets are on track — great job!"];
  };

  // --------------------------
  // Add Budget
  // --------------------------
  const handleAddBudget = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const payload = {
      userID: userId,
      categoryID: formData.get("categoryID"),
      amount: formData.get("amount"),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
    };

    try {
      setLoadingAdd(true);
      await axiosInstance.post("/budget", payload);

      alert("Budget added!");
      setIsModalOpen(false);

      fetchBudgetData();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoadingAdd(false);
    }
  };

  // --------------------------
  // Delete Budget
  // --------------------------
  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/budget/${selectedBudget._id}`);
      setBudgets((b) => b.filter((x) => x._id !== selectedBudget._id));
      setConfirmDeleteOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#a855f7"];

  // --------------------------
  // UI STARTS HERE
  // --------------------------
  return (
    <div className="space-y-8 text-white">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budget Center</h1>
          <p className="text-gray-400 text-sm mt-1">
            Plan your spending, avoid overspending, and stay financially healthy.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-xl"
        >
          <FaPlus /> Add Budget
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 flex gap-6">
        {["overview", "analytics", "manage"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-2 capitalize ${
              activeTab === t
                ? "border-b-2 border-emerald-400 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ------------------------
          OVERVIEW TAB
      ------------------------ */}
      {activeTab === "overview" && (
        <div className="grid md:grid-cols-2 gap-6">
          {summary.map((item, i) => {
            const spentRatio =
              (item.spent / Math.max(item.allocated, 1)) * 100;
            const over = item.spent > item.allocated;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-[#111318]/80 border border-white/10 shadow-md"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{item.category}</h3>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      over
                        ? "bg-red-500/20 text-red-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {over ? "Over" : "On Track"}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mt-1">
                  {new Date(item.start).toLocaleDateString()} →{" "}
                  {new Date(item.end).toLocaleDateString()}
                </p>

                <div className="mt-4 text-sm space-y-1">
                  <p>Allocated: ₹{item.allocated.toLocaleString()}</p>
                  <p>Spent: ₹{item.spent.toLocaleString()}</p>
                  <p
                    className={`font-medium ${
                      item.remaining < 0
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    Remaining: ₹{item.remaining.toLocaleString()}
                  </p>
                </div>

                <div className="mt-3 w-full h-3 rounded-full bg-gray-700/40 overflow-hidden">
                  <div
                    style={{ width: `${Math.min(spentRatio, 100)}%` }}
                    className={`h-3 rounded-full ${
                      over ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ------------------------
          ANALYTICS TAB
      ------------------------ */}
      {activeTab === "analytics" && summary.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#111318]/80 p-6 rounded-2xl border border-white/10 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
            <FaChartPie className="text-emerald-400" /> Budget Distribution
          </h3>

          <ResponsiveContainer width="100%" height={360}>
            <PieChart>
              <Pie
                data={summary.map((s) => ({
                  name: s.category,
                  value: s.spent,
                }))}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
                dataKey="value"
              >
                {summary.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Insights */}
          <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <h4 className="font-semibold text-yellow-300 mb-2">Insights</h4>
            <ul className="space-y-1 text-sm">
              {generateInsights().map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* ------------------------
          MANAGE TAB
      ------------------------ */}
      {activeTab === "manage" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-xl bg-gradient-to-br from-gray-800/90 to-black border border-white/10 shadow-lg"
            >
              <h3 className="text-lg font-semibold">{b.description || "Budget"}</h3>

              <p className="text-sm text-gray-400 mt-1">
                {new Date(b.start_date).toLocaleDateString()} →{" "}
                {new Date(b.end_date).toLocaleDateString()}
              </p>

              <div className="mt-3 text-xl font-bold text-emerald-400">
                ₹{b.amount.toLocaleString()}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedBudget(b);
                    setConfirmDeleteOpen(true);
                  }}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500 transition"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ------------------------
          ADD BUDGET MODAL
      ------------------------ */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" onClose={() => setIsModalOpen(false)} className="relative z-50">
          {/* Backdrop */}
          <Transition.Child
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-200"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-150"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md bg-[#111318] rounded-2xl p-6 border border-white/10 shadow-2xl">

                <Dialog.Title className="text-xl font-semibold text-white mb-4">
                  Add Budget
                </Dialog.Title>

                <form onSubmit={handleAddBudget} className="space-y-4">
                  {/* Category */}
                  <div className="flex items-center bg-black/40 p-3 rounded-lg border border-gray-700">
                    <FaTags className="text-gray-400 mr-3" />
                    <select
                      name="categoryID"
                      className="w-full bg-transparent text-gray-200 outline-none"
                      required
                    >
                      <option value="">Select Category</option>
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
                      name="amount"
                      placeholder="Amount"
                      required
                      className="w-full bg-transparent text-gray-200 outline-none"
                    />
                  </div>

                  {/* Start */}
                  <div className="flex items-center bg-black/40 p-3 rounded-lg border border-gray-700">
                    <FaCalendarAlt className="text-gray-400 mr-3" />
                    <input
                      type="date"
                      name="start_date"
                      required
                      className="w-full bg-transparent text-gray-200 outline-none"
                    />
                  </div>

                  {/* End */}
                  <div className="flex items-center bg-black/40 p-3 rounded-lg border border-gray-700">
                    <FaCalendarAlt className="text-gray-400 mr-3" />
                    <input
                      type="date"
                      name="end_date"
                      required
                      className="w-full bg-transparent text-gray-200 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingAdd}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    {loadingAdd ? "Adding..." : "Add Budget"}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* ------------------------
          DELETE CONFIRM MODAL
      ------------------------ */}
      <Transition appear show={confirmDeleteOpen} as={Fragment}>
        <Dialog onClose={() => setConfirmDeleteOpen(false)} className="relative z-50">
          <Transition.Child>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-xl p-6 max-w-sm w-full">
              <Dialog.Title className="text-lg font-semibold text-gray-800">
                Delete Budget?
              </Dialog.Title>

              <p className="text-gray-600 mt-2 text-sm">
                This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDeleteOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
