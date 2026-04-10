import  { useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";
import {
  FiDownload, FiFileText, FiTrendingUp, FiTrendingDown,
  FiPieChart, FiTarget, FiRepeat, FiBarChart2,
  FiShield, FiCheckCircle, FiRefreshCw, FiCalendar,
} from "react-icons/fi";

export const Reports = () => {
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED ── */
  const downloadReport = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/reports/${userId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "financial-report.pdf");
      document.body.appendChild(link);
      link.click();
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error) {
      console.error("Report download error:", error);
    } finally {
      setLoading(false);
    }
  };

  const reportSections = [
    { icon: <FiTrendingUp size={15} />,   label: "Income Summary",        desc: "All income sources & monthly trends",   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { icon: <FiTrendingDown size={15} />, label: "Expense Breakdown",     desc: "Category-wise spending analysis",        color: "text-rose-400",    bg: "bg-rose-500/10 border-rose-500/20" },
    { icon: <FiTarget size={15} />,       label: "Budget Performance",    desc: "Allocated vs actual spending per budget",color: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/20" },
    { icon: <FiPieChart size={15} />,     label: "Savings Analysis",      desc: "Net savings rate and growth over time",  color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
    { icon: <FiRepeat size={15} />,       label: "Recurring Payments",    desc: "All active subscriptions & schedules",   color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" },
    { icon: <FiBarChart2 size={15} />,    label: "Monthly Comparison",    desc: "Month-over-month financial performance", color: "text-violet-400",  bg: "bg-violet-500/10 border-violet-500/20" },
  ];

  return (
    <div className="space-y-6 text-white">

      {/* ══ HEADER ══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Reports & Insights</h1>
          <p className="text-gray-500 mt-1 text-sm">Download a comprehensive PDF of your complete financial history.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border
                        bg-violet-500/10 border-violet-500/20 text-violet-400 text-xs font-medium self-start">
          <FiFileText size={12} />
          PDF Report
        </div>
      </motion.div>

      {/* ══ MAIN DOWNLOAD CARD ══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br
                   from-violet-500/8 via-[#0d0f14]/80 to-blue-500/8
                   border border-violet-500/20 backdrop-blur-sm p-6 sm:p-8"
      >
        {/* Background glow orbs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* PDF icon */}
            <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/25
                            flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/10">
              <FiFileText size={26} className="text-violet-400" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white">Financial Report</h2>
              <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                A complete PDF export of your income, expenses, budgets, savings, and recurring payments — all in one document.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { icon: <FiCalendar size={11} />,    text: "Current period" },
                  { icon: <FiShield size={11} />,      text: "Secure export" },
                  { icon: <FiCheckCircle size={11} />, text: "Instant download" },
                ].map((badge, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium
                                           text-gray-500 bg-white/5 border border-white/8 px-2.5 py-1 rounded-full">
                    {badge.icon}{badge.text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Download button */}
          <motion.button
            onClick={downloadReport}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`flex-shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-xl
                        font-semibold text-sm text-white transition-all duration-200 shadow-lg
                        ${downloaded
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/25"
                          : loading
                            ? "bg-violet-500/40 cursor-not-allowed"
                            : "bg-gradient-to-r from-violet-500 to-blue-600 shadow-violet-500/25 hover:shadow-violet-500/40"
                        }`}
          >
            {loading ? (
              <><FiRefreshCw size={16} className="animate-spin" /> Generating...</>
            ) : downloaded ? (
              <><FiCheckCircle size={16} /> Downloaded!</>
            ) : (
              <><FiDownload size={16} /> Download PDF</>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ══ WHAT'S INCLUDED ══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-white/8">
          <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <FiFileText size={13} className="text-violet-400" />
          </div>
          <h3 className="text-sm font-semibold text-white">What's included in your report</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {reportSections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + i * 0.06 }}
              className="flex items-start gap-3 p-4 bg-[#0d0f14]/80 hover:bg-white/3 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${section.bg}`}>
                <span className={section.color}>{section.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">{section.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{section.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ══ HOW IT WORKS ══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl bg-[#0d0f14]/80 border border-white/10 backdrop-blur-sm p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">How it works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "01", title: "Click Download", desc: "Hit the download button above to trigger your report.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
            { step: "02", title: "AI Compiles Data", desc: "Your financial data is fetched and formatted into a clean PDF.", color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20" },
            { step: "03", title: "File Downloads",   desc: "Your browser saves the PDF automatically to your device.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 text-xs font-bold ${s.bg} ${s.color}`}>
                {s.step}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
};