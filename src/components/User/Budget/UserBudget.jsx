import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import axiosInstance from "../../Utils/axiosInstance";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";

export const UserBudget = () => {
  const { user } = useAuth();
  const userId = useMemo(() => user?._id, [user]);

  const [activeTab, setActiveTab] = useState("overview");

  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [categories, setCategories] = useState([]);

  const [budgetPlan, setBudgetPlan] = useState("");
  const [displayedPlan, setDisplayedPlan] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#a855f7"];

  // =========================
  // Typing Effect
  // =========================
  const typeWriterEffect = (text) => {
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedPlan((prev) => prev + text[index]);

      index++;

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 15);
  };

  // =========================
  // Fetch AI Budget Plan
  // =========================
  const fetchBudgetPlan = async () => {
    try {
      setLoadingPlan(true);
      setDisplayedPlan("");

      const res = await axiosInstance.get(`/ai/budget-plan/${userId}`);

      const plan = res.data.budgetPlan;

      setBudgetPlan(plan);

      typeWriterEffect(plan);
    } catch (error) {
      console.error("Budget plan error:", error);
    } finally {
      setLoadingPlan(false);
    }
  };

  // =========================
  // Fetch Data
  // =========================
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

  // =========================
  // Generate Budget Summary
  // =========================
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
      };
    });

    setSummary(processed);
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="space-y-8 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budget Center</h1>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-xl"
        >
          <FaPlus /> Add Budget
        </button>
      </div>

      {/* TABS */}
      <div className="border-b border-white/10 flex gap-6">
        {["overview", "analytics", "ai planner", "manage"].map((t) => (
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
          {summary.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xl bg-[#111318] border border-white/10"
            >
              <h3 className="text-lg font-semibold">{item.category}</h3>
              <p>Allocated: ₹{item.allocated}</p>
              <p>Spent: ₹{item.spent}</p>
              <p>Remaining: ₹{item.remaining}</p>
            </div>
          ))}
        </div>
      )}

      {/* ANALYTICS */}
      {activeTab === "analytics" && (
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
      )}

      {/* ===================== */}
      {/* AI PLANNER SECTION */}
      {/* ===================== */}

      {activeTab === "ai planner" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >

          <div className="flex justify-between items-center">

            <h2 className="text-xl font-semibold">
              AI Budget Planner
            </h2>

            <button
              onClick={fetchBudgetPlan}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2 rounded-xl font-medium hover:opacity-90"
            >
              Generate AI Plan
            </button>

          </div>

          {loadingPlan && (
            <p className="text-gray-400 animate-pulse">
              AI is analyzing your finances...
            </p>
          )}

          {displayedPlan && (

            <div className="bg-[#111318] border border-white/10 rounded-2xl p-6 space-y-4">

              {/* AI HEADER */}

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-sm font-bold">
                  AI
                </div>

                <p className="text-gray-300 text-sm">
                  Smart Budget Recommendation
                </p>

              </div>

              {/* AI RESPONSE */}

              <div className="bg-[#0d0f14] rounded-xl p-5 border border-white/5">

                <div
                  className="prose prose-invert max-w-none text-gray-300
                  prose-headings:text-white
                  prose-strong:text-cyan-400
                  prose-li:text-gray-300"
                >
                  <ReactMarkdown>{displayedPlan}</ReactMarkdown>
                </div>

              </div>

            </div>

          )}

        </motion.div>
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

    </div>
  );
};