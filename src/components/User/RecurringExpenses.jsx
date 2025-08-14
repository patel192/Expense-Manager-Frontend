import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSyncAlt, FaTrashAlt, FaPlusCircle, FaPauseCircle } from "react-icons/fa";
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

  // Fetch existing recurring payments
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/recurring/${userId}`);
      setPayments(res.data.data || []);
    } catch (err) {
      console.error("Error fetching recurring payments:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.startDate) return alert("Please fill required fields");

    try {
      setLoading(true);
      await axios.post(`http://localhost:3001/api/recurring`, { ...form, userId });
      setForm({ name: "", amount: "", frequency: "Monthly", startDate: "", category: "" });
      fetchPayments();
    } catch (err) {
      console.error("Error adding recurring payment:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/recurring/${id}`);
      fetchPayments();
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };
  return (
     <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaSyncAlt /> Recurring Payments
      </h1>

      {/* Add New Recurring Payment */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="text"
          name="name"
          placeholder="Payment Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 outline-none"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 outline-none"
        />
        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 outline-none"
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
          className="p-2 rounded bg-gray-700 outline-none"
        />
        <input
          type="text"
          name="category"
          placeholder="Category (Optional)"
          value={form.category}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 p-2 rounded flex items-center justify-center gap-2"
        >
          <FaPlusCircle /> {loading ? "Adding..." : "Add Payment"}
        </button>
      </motion.form>

      {/* Existing Recurring Payments */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Your Recurring Payments</h2>
        {payments.length === 0 ? (
          <p className="text-gray-400">No recurring payments added yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
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
                  className="border-b border-gray-700"
                >
                  <td className="py-2">{pay.name}</td>
                  <td className="py-2 text-green-400">₹{pay.amount}</td>
                  <td className="py-2">{pay.frequency}</td>
                  <td className="py-2">{new Date(pay.startDate).toLocaleDateString()}</td>
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
  )
}
