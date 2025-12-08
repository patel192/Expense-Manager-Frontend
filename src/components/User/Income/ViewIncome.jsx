import React, { useState, useEffect } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";

export const ViewIncome = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem("id");
        const res = await axiosInstance.get(`/incomesbyUserId/${userId}`);
        const data = res.data.data || [];
        setIncomes(data);

        // Monthly aggregation
        const months = Array(12).fill(0);
        data.forEach((income) => {
          const month = new Date(income.date).getMonth();
          months[month] += income.amount;
        });

        const yearlyAvg = months.reduce((a, b) => a + b, 0) / 12;
        const chart = months.map((amt, idx) => ({
          month: new Date(0, idx).toLocaleString("default", { month: "short" }),
          amount: amt,
          color: amt >= yearlyAvg ? "#22c55e" : "#ef4444",
        }));

        setMonthlyData(chart);
        setAvg(yearlyAvg);
      } catch (error) {
        console.error("Error fetching incomes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;

    try {
      await axiosInstance.delete(`/incomes/${id}`);
      const updated = incomes.filter((income) => income._id !== id);
      setIncomes(updated);

      // Recalculate chart
      const months = Array(12).fill(0);
      updated.forEach((income) => {
        const month = new Date(income.date).getMonth();
        months[month] += income.amount;
      });
      const yearlyAvg = months.reduce((a, b) => a + b, 0) / 12;
      setAvg(yearlyAvg);
      setMonthlyData(
        months.map((amt, idx) => ({
          month: new Date(0, idx).toLocaleString("default", { month: "short" }),
          amount: amt,
          color: amt >= yearlyAvg ? "#22c55e" : "#ef4444",
        }))
      );
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income.");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Income Overview
        </h2>
        <p className="text-sm sm:text-base text-gray-400">
          Track your monthly growth and manage your income records
        </p>
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full h-80 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-4 sm:p-6"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-center text-gray-100 mb-4">
          Monthly Income Trend
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
            <XAxis dataKey="month" stroke="white" fontSize={12} />
            <YAxis stroke="white" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <ReferenceLine
              y={avg}
              stroke="#3b82f6"
              strokeDasharray="3 3"
              label={{
                value: "Avg",
                position: "right",
                fill: "#3b82f6",
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: "#60a5fa" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Income List */}
      {loading ? (
        <p className="text-center text-gray-400">Loading incomes...</p>
      ) : incomes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {incomes.map((income, idx) => (
            <motion.div
              key={income._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="rounded-2xl bg-gradient-to-br from-blue-600/80 to-indigo-700/80 border border-white/10 shadow-lg p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-300"
            >
              <div>
                <h3 className="text-lg font-semibold tracking-wide">
                  {income.source}
                </h3>
                <p className="text-sm text-gray-300 mt-1">
                  {new Date(income.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex justify-between items-center mt-6">
                <span className="text-2xl font-bold">₹{income.amount}</span>
                <button
                  onClick={() => handleDelete(income._id)}
                  className="p-2 rounded-full bg-red-500/80 hover:bg-red-600 transition-all"
                >
                  <TrashIcon className="h-5 w-5 text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No income records found.</p>
      )}
    </div>
  );
};
