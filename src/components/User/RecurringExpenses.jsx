import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";
import {
  FaSyncAlt,
  FaTrashAlt,
  FaPlusCircle,
  FaPauseCircle,
} from "react-icons/fa";

export const RecurringExpenses = () => {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    frequency: "Monthly",
    startDate: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axiosInstance.get(`/recurring/${userId}`);
      setPayments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching recurring payments:", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.startDate) {
      return alert("Please fill required fields");
    }
    try {
      setLoading(true);
      await axiosInstance.post(`/recurring`, { ...form, userId });
      setForm({
        name: "",
        amount: "",
        frequency: "Monthly",
        startDate: "",
        category: "",
      });
      fetchPayments();
    } catch (err) {
      console.error("Error adding recurring payment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recurring payment?")) return;
    try {
      await axiosInstance.delete(`/recurring/${id}`);
      fetchPayments();
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaSyncAlt /> Recurring Payments
      </h1>

      {/* Add New Recurring Payment */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="text"
          name="name"
          placeholder="Payment Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="p-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
        />
        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
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
          value={form.startDate}
          onChange={handleChange}
          className="p-2 rounded bg-white/20 text-white focus:outline-none"
        />
        <input
          type="text"
          name="category"
          placeholder="Category (Optional)"
          value={form.category}
          onChange={handleChange}
          className="p-2 rounded bg-white/20 text-white placeholder-white/70 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-lg"
        >
          <FaPlusCircle /> {loading ? "Adding..." : "Add Payment"}
        </button>
      </motion.form>

      {/* Existing Recurring Payments */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Your Recurring Payments</h2>
        {payments.length === 0 ? (
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
              {payments.map((pay) => (
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
                      onClick={() => handleDelete(pay._id)}
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
    </div>
  );
};
