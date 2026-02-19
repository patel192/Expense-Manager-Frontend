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
  const { user } = useAuth();

  const userId = useMemo(() => user?._id, [user]);

  const [activeTab, setActiveTab] = useState("overview");
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#a855f7"];

  // --------------------------
  // Fetch Data ONLY when userId exists
  // --------------------------
  useEffect(() => {
    if (!userId) return;

    fetchCategories();
    fetchBudgetData();
  }, [userId]);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data.data || []);
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
      return ["Add a budget to start tracking insights."];

    const tips = [];

    summary.forEach((s) => {
      if (s.spent > s.allocated)
        tips.push(`Overspending in ${s.category}.`);
      else if (s.remaining < s.allocated * 0.15)
        tips.push(`${s.category} budget nearly exhausted.`);
      else if (s.remaining > s.allocated * 0.5)
        tips.push(`${s.category} has a healthy surplus.`);
    });

    return tips.length ? tips : ["All budgets are on track."];
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

      setIsModalOpen(false);
      fetchBudgetData(); // refresh all tabs
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
      setConfirmDeleteOpen(false);
      fetchBudgetData(); // IMPORTANT
    } catch (error) {
      alert(error.message);
    }
  };

  // ==========================
  // UI
  // ==========================
  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budget Center</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-xl"
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
                ? "border-b-2 border-emerald-400"
                : "text-gray-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid md:grid-cols-2 gap-6">
          {summary.length === 0 ? (
            <p className="text-gray-400">No budgets yet.</p>
          ) : (
            summary.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-xl bg-[#111318] border border-white/10"
              >
                <h3 className="text-lg font-semibold">{item.category}</h3>
                <p>Allocated: ₹{item.allocated}</p>
                <p>Spent: ₹{item.spent}</p>
                <p>Remaining: ₹{item.remaining}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ANALYTICS */}
      {activeTab === "analytics" && (
        <div>
          {summary.length === 0 ? (
            <p className="text-gray-400">No data for analytics.</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <Pie
                    data={summary.map((s) => ({
                      name: s.category,
                      value: s.spent,
                    }))}
                    dataKey="value"
                    outerRadius={120}
                  >
                    {summary.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              <ul className="mt-4 text-sm">
                {generateInsights().map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* MANAGE */}
      {activeTab === "manage" && (
        <div className="grid md:grid-cols-2 gap-6">
          {budgets.map((b) => (
            <div
              key={b._id}
              className="p-5 rounded-xl bg-gray-800 border border-white/10"
            >
              <h3 className="font-semibold">{b.description || "Budget"}</h3>
              <p>₹{b.amount}</p>

              <button
                onClick={() => {
                  setSelectedBudget(b);
                  setConfirmDeleteOpen(true);
                }}
                className="mt-3 text-red-400"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADD MODAL + DELETE MODAL */}
      {/* (Your modal code can remain unchanged) */}
    </div>
  );
};
