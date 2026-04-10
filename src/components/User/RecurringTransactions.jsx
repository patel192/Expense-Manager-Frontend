import  { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiRepeat, FiEdit2, FiTrash2, FiPause, FiPlay,
  FiPlus, FiCheck, FiX, FiCalendar, FiTag,
  FiDollarSign, FiClock, FiRefreshCw, FiActivity,
} from "react-icons/fi";

/* ─── Shimmer ─── */
const Shimmer = ({ className = "" }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]
                    bg-gradient-to-r from-transparent via-white/8 to-transparent" />
  </div>
);

/* ─── Field wrapper ─── */
const Field = ({ label, icon, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-400 tracking-wide">{label}</label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10">
          {icon}
        </span>
      )}
      {children}
    </div>
  </div>
);

const inputCls = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-gray-100 placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 hover:border-white/20 transition-all duration-200";
const selectCls = "w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-gray-100 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 hover:border-white/20 transition-all duration-200 appearance-none";

/* ─── Frequency badge colors ─── */
const freqConfig = {
  daily:   { color: "text-rose-400",   bg: "bg-rose-500/10 border-rose-500/20" },
  weekly:  { color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/20" },
  monthly: { color: "text-cyan-400",   bg: "bg-cyan-500/10 border-cyan-500/20" },
  yearly:  { color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
};

export const RecurringTransactions = () => {
  const { user } = useAuth();
  const userId = user?._id;

  /* ── ALL ORIGINAL STATE — UNTOUCHED ── */
  const [recurringList, setRecurringList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "", amount: "", category: "", frequency: "monthly", nextDate: "",
  });

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED ── */
  const fetchRecurring = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/recurring/${userId}`);
      setRecurringList(res.data.data || []);
    } catch (error) {
      console.error("Error fetching recurring transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecurring = async (id) => {
    try {
      await axiosInstance.delete(`/recurring/${id}`);
      fetchRecurring();
    } catch (error) { console.error("Error Deleting recurring:", error); }
  };

  const toggleRecurring = async (id) => {
    try {
      await axiosInstance.patch(`/recurring/toggle/${id}`);
      fetchRecurring();
    } catch (error) { console.error("Error toggling recurring", error); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { ...formData, amount: Number(formData.amount), userId };
      let res;
      if (editingId) {
        res = await axiosInstance.put(`/recurring/${editingId}`, payload);
      } else {
        res = await axiosInstance.post("/recurring", payload);
      }
      await fetchRecurring();
      console.log(editingId ? "Recurring updated" : "Recurring created", res.data);
      setFormData({ title: "", amount: "", category: "", frequency: "monthly", nextDate: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving recurring transaction:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title, amount: item.amount, category: item.category,
      frequency: item.frequency, nextDate: item.nextDate.slice(0, 10),
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setFormData({ title: "", amount: "", category: "", frequency: "monthly", nextDate: "" });
    setEditingId(null);
  };

  useEffect(() => {
    if (!userId) return;
    fetchRecurring();
  }, [userId]);

  /* ── Derived stats ── */
  const activeCount   = recurringList.filter(r => r.isActive !== false).length;
  const pausedCount   = recurringList.filter(r => r.isActive === false).length;
  const monthlyTotal  = recurringList
    .filter(r => r.isActive !== false)
    .reduce((sum, r) => {
      if (r.frequency === "monthly") return sum + r.amount;
      if (r.frequency === "yearly")  return sum + r.amount / 12;
      if (r.frequency === "weekly")  return sum + r.amount * 4.33;
      if (r.frequency === "daily")   return sum + r.amount * 30;
      return sum;
    }, 0);
  const nextDue = recurringList
    .filter(r => r.isActive !== false && r.nextDate)
    .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))[0];

  return (
    <div className="space-y-6 text-white">

      {/* ══ HEADER ══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recurring Transactions</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your scheduled payments and subscriptions.</p>
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium self-start
          ${activeCount > 0 ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" : "bg-white/5 border-white/10 text-gray-500"}`}>
          <FiActivity size={12} />
          {activeCount} active · {pausedCount} paused
        </div>
      </motion.div>

      {/* ══ STAT CARDS ══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Recurring",   value: recurringList.length,                    suffix: "entries",  color: "text-cyan-400",   bg: "bg-cyan-500/5",   border: "border-cyan-500/20",   glow: "bg-cyan-400",   icon: <FiRepeat size={17} /> },
          { label: "Active",             value: activeCount,                              suffix: "running",  color: "text-emerald-400", bg: "bg-emerald-500/5",border: "border-emerald-500/20",glow: "bg-emerald-400",icon: <FiPlay size={17} /> },
          { label: "Monthly Cost",       value: `₹${Math.round(monthlyTotal).toLocaleString("en-IN")}`, suffix: "/mo", color: "text-rose-400", bg: "bg-rose-500/5", border: "border-rose-500/20", glow: "bg-rose-400", icon: <FiDollarSign size={17} /> },
          { label: "Next Due",           value: nextDue ? new Date(nextDue.nextDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—", suffix: nextDue?.title || "", color: "text-amber-400", bg: "bg-amber-500/5", border: "border-amber-500/20", glow: "bg-amber-400", icon: <FiCalendar size={17} /> },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.07 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 ${card.bg} ${card.border} backdrop-blur-sm`}
          >
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-15 ${card.glow}`} />
            <div className="relative">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center mb-3 ${card.bg} border ${card.border}`}>
                <span className={card.color}>{card.icon}</span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-widest mb-1">{card.label}</p>
              <p className={`text-lg sm:text-xl font-bold tracking-tight truncate ${card.color}`}>{card.value}</p>
              {card.suffix && <p className="text-[10px] text-gray-600 mt-0.5 truncate">{card.suffix}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ══ FORM ══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm overflow-hidden"
      >
        {/* Form header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border
              ${editingId
                ? "bg-amber-500/15 border-amber-500/25"
                : "bg-cyan-500/15 border-cyan-500/25"}`}>
              {editingId
                ? <FiEdit2 size={14} className="text-amber-400" />
                : <FiPlus size={14} className="text-cyan-400" />}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                {editingId ? "Edit Recurring Payment" : "Add New Recurring Payment"}
              </h2>
              {editingId && (
                <p className="text-xs text-amber-400 mt-0.5">Editing — changes will update this entry</p>
              )}
            </div>
          </div>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
            >
              <FiX size={12} /> Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Field label="Title" icon={<FiRepeat size={14} />}>
              <input type="text" name="title" value={formData.title}
                onChange={handleChange} placeholder="Netflix Subscription"
                className={inputCls} />
            </Field>

            <Field label="Amount (₹)" icon={<FiDollarSign size={14} />}>
              <input type="number" name="amount" value={formData.amount}
                onChange={handleChange} placeholder="499"
                className={inputCls} />
            </Field>

            <Field label="Category" icon={<FiTag size={14} />}>
              <input type="text" name="category" value={formData.category}
                onChange={handleChange} placeholder="Subscription"
                className={inputCls} />
            </Field>

            <Field label="Frequency" icon={<FiRefreshCw size={14} />}>
              <select name="frequency" value={formData.frequency}
                onChange={handleChange} className={selectCls}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </Field>

            <Field label="Next Payment Date" icon={<FiCalendar size={14} />}>
              <input type="date" name="nextDate" value={formData.nextDate}
                onChange={handleChange} className={inputCls} />
            </Field>

            {/* Submit spans remaining column on lg */}
            <div className="flex items-end">
              <button type="submit" disabled={submitting}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm text-white
                            flex items-center justify-center gap-2 transition-all duration-200
                            shadow-lg hover:opacity-90 hover:-translate-y-0.5
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
                            ${editingId
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/20"
                              : "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/20"
                            }`}>
                {submitting
                  ? <><FiRefreshCw size={13} className="animate-spin" /> Saving...</>
                  : editingId
                    ? <><FiCheck size={14} /> Update Payment</>
                    : <><FiPlus size={14} /> Add Recurring</>
                }
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* ══ RECURRING LIST ══ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
              <FiRepeat size={13} className="text-cyan-400" />
            </div>
            <h2 className="text-sm font-semibold text-white">Your Recurring Payments</h2>
          </div>
          <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">
            {recurringList.length} total
          </span>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1,2,3].map(i => <Shimmer key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : recurringList.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <FiRepeat size={22} className="text-cyan-400" />
            </div>
            <p className="text-sm text-gray-500">No recurring transactions yet.</p>
            <p className="text-xs text-gray-600">Fill the form above to add your first one.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    {["Title", "Amount", "Frequency", "Next Date", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-medium text-gray-600 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {recurringList.map((item, i) => {
                      const freq = freqConfig[item.frequency] || freqConfig.monthly;
                      const isActive = item.isActive !== false;
                      const isEditing = editingId === item._id;
                      return (
                        <motion.tr
                          key={item._id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 12 }}
                          transition={{ delay: i * 0.04 }}
                          className={`border-b border-white/5 transition-colors
                            ${isEditing ? "bg-amber-500/5" : "hover:bg-white/3"}
                            ${!isActive ? "opacity-60" : ""}`}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                                ${isActive ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-white/5 border border-white/10"}`}>
                                <FiRepeat size={12} className={isActive ? "text-cyan-400" : "text-gray-600"} />
                              </div>
                              <span className="font-medium text-gray-200">{item.title}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-emerald-400">
                            ₹{Number(item.amount).toLocaleString("en-IN")}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${freq.bg} ${freq.color}`}>
                              {item.frequency}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <FiClock size={11} className="text-gray-600" />
                              {new Date(item.nextDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium
                              ${isActive
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-gray-500/10 border-gray-500/20 text-gray-500"
                              }`}>
                              {isActive ? "Active" : "Paused"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleEdit(item)} title="Edit"
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-amber-500/15 hover:text-amber-400 transition-all">
                                <FiEdit2 size={13} />
                              </button>
                              <button onClick={() => toggleRecurring(item._id)} title={isActive ? "Pause" : "Resume"}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all
                                  ${isActive
                                    ? "text-gray-600 hover:bg-amber-500/15 hover:text-amber-400"
                                    : "text-gray-600 hover:bg-emerald-500/15 hover:text-emerald-400"
                                  }`}>
                                {isActive ? <FiPause size={13} /> : <FiPlay size={13} />}
                              </button>
                              <button onClick={() => deleteRecurring(item._id)} title="Delete"
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 hover:bg-rose-500/15 hover:text-rose-400 transition-all">
                                <FiTrash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-white/5">
              {recurringList.map((item) => {
                const freq = freqConfig[item.frequency] || freqConfig.monthly;
                const isActive = item.isActive !== false;
                return (
                  <div key={item._id} className={`px-4 py-4 ${!isActive ? "opacity-60" : ""}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                          ${isActive ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-white/5 border border-white/10"}`}>
                          <FiRepeat size={15} className={isActive ? "text-cyan-400" : "text-gray-600"} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-200 truncate">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-emerald-400 text-xs font-bold">₹{Number(item.amount).toLocaleString("en-IN")}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${freq.bg} ${freq.color}`}>
                              {item.frequency}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border
                              ${isActive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-gray-500/10 border-gray-500/20 text-gray-500"}`}>
                              {isActive ? "Active" : "Paused"}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1 flex items-center gap-1">
                            <FiClock size={10} />
                            {new Date(item.nextDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => handleEdit(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-amber-500/15 hover:text-amber-400 transition-all">
                          <FiEdit2 size={14} />
                        </button>
                        <button onClick={() => toggleRecurring(item._id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                            ${isActive ? "text-gray-600 hover:bg-amber-500/15 hover:text-amber-400" : "text-gray-600 hover:bg-emerald-500/15 hover:text-emerald-400"}`}>
                          {isActive ? <FiPause size={14} /> : <FiPlay size={14} />}
                        </button>
                        <button onClick={() => deleteRecurring(item._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 hover:bg-rose-500/15 hover:text-rose-400 transition-all">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};