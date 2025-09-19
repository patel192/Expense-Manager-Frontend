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

        // Process monthly income
        const months = Array(12).fill(0);
        data.forEach((income) => {
          const month = new Date(income.date).getMonth();
          months[month] += income.amount;
        });

        const yearlyAvg = months.reduce((a, b) => a + b, 0) / 12;

        const chart = months.map((amt, idx) => ({
          month: new Date(0, idx).toLocaleString("default", { month: "short" }),
          amount: amt,
          arrow: amt >= yearlyAvg ? "⬆️" : "⬇️",
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
      setIncomes((prev) => prev.filter((income) => income._id !== id));

      // Recalculate monthly chart after deletion
      const updatedIncomes = incomes.filter((income) => income._id !== id);
      const months = Array(12).fill(0);
      updatedIncomes.forEach((income) => {
        const month = new Date(income.date).getMonth();
        months[month] += income.amount;
      });
      const yearlyAvg = months.reduce((a, b) => a + b, 0) / 12;
      setAvg(yearlyAvg);
      setMonthlyData(
        months.map((amt, idx) => ({
          month: new Date(0, idx).toLocaleString("default", { month: "short" }),
          amount: amt,
          arrow: amt >= yearlyAvg ? "⬆️" : "⬇️",
          color: amt >= yearlyAvg ? "#22c55e" : "#ef4444",
        }))
      );
    } catch (error) {
      console.error("Error deleting income:", error);
      alert("Failed to delete income.");
    }
  };

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-center text-2xl font-bold">💰 All Incomes</h2>

      {/* Monthly Income Trend Chart */}
      <div className="w-full h-80 bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-center">
          📈 Monthly Income Trend
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <ReferenceLine y={avg} stroke="#3b82f6" strokeDasharray="3 3" label="Avg" />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-around mt-2">
          {monthlyData.map((d, idx) => (
            <span key={idx} style={{ color: d.color, fontSize: "18px" }}>
              {d.arrow}
            </span>
          ))}
        </div>
      </div>

      {/* Income Cards */}
      {loading ? (
        <p className="text-center text-gray-500">Loading incomes...</p>
      ) : incomes.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {incomes.map((income, idx) => (
            <motion.div
              key={income._id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-2xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 flex flex-col justify-between transform hover:scale-105 transition duration-300"
            >
              <div>
                <h3 className="text-xl font-bold">{income.source}</h3>
                <p className="text-sm opacity-80">
                  {new Date(income.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-between items-center mt-6">
                <span className="text-2xl font-extrabold">₹{income.amount}</span>
                <button
                  onClick={() => handleDelete(income._id)}
                  className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition"
                >
                  <TrashIcon className="h-5 w-5 text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No incomes found.</p>
      )}
    </div>
  );
};
