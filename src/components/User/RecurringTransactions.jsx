import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export const RecurringTransactions = () => {
  const [recurringList, setRecurringList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuth();
  const userId = user?._id;

  const fetchRecurring = async () => {
    try {
      const res = await axiosInstance.get(`/recurring/${userId}`);
      setRecurringList(res.data.data || []);
    } catch (error) {
      console.error("Error fetching recurring transaction:", error);
    }
  };
  const deleteRecurring = async (id) => {
    try {
      await axiosInstance.delete(`/recurring/${id}`);
      fetchRecurring();
    } catch (error) {
      console.error("Error Deleting recurring:", error);
    }
  };

  const toggleRecurring = async (id) => {
    try {
      await axiosInstance.patch(`/recurring/toggle/${id}`);
      fetchRecurring();
    } catch (error) {
      console.error("Error toggling recurring", error);
    }
  };
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    frequency: "monthly",
    nextDate: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        userId: userId,
      };

      let res;

      if (editingId) {
        res = await axiosInstance.put(`/recurring/${editingId}`, payload);
      } else {
        res = await axiosInstance.post("/recurring", payload);
      }

      await fetchRecurring();

      console.log(
        editingId ? "Recurring updated" : "Recurring created",
        res.data,
      );

      setFormData({
        title: "",
        amount: "",
        category: "",
        frequency: "monthly",
        nextDate: "",
      });

      setEditingId(null);
    } catch (error) {
      console.error("Error saving recurring transaction:", error);
    }
  };
  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      amount: item.amount,
      category: item.category,
      frequency: item.frequency,
      nextDate: item.nextDate.slice(0, 10),
    });
    setEditingId(item._id);
  };

  useEffect(() => {
    if (!userId) return;
    fetchRecurring();
  }, [userId]);

  return (
    <div className="text-white space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Recurring Transactions</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#111318] p-6 rounded-xl border border-white/10 space-y-4"
      >
        {/* Title */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>

          <input
            type="text"
            value={formData.title}
            onChange={handleChange}
            name="title"
            placeholder="Netflix Subscription"
            className="w-full p-2 rounded bg-[#1a1d24] border border-gray-700"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Amount</label>

          <input
            type="number"
            value={formData.amount}
            onChange={handleChange}
            name="amount"
            placeholder="499"
            className="w-full p-2 rounded bg-[#1a1d24] border border-gray-700"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Category</label>

          <input
            type="text"
            value={formData.category}
            onChange={handleChange}
            name="category"
            placeholder="Subscription"
            className="w-full p-2 rounded bg-[#1a1d24] border border-gray-700"
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Frequency</label>

          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1a1d24] border border-gray-700"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Next Date */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Next Payment Date
          </label>

          <input
            type="date"
            value={formData.nextDate}
            onChange={handleChange}
            name="nextDate"
            className="w-full p-2 rounded bg-[#1a1d24] border border-gray-700"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-600"
        >
          {editingId ? "Update Recurring Expense" : "Add Recurring Expense"}
        </button>
      </form>

      <div className="bg-[#111318] p-6 rounded-xl border border-white/10">
        <h2 className="text-lg font-semibold mb-4">Recurring Expenses</h2>
        {recurringList.length === 0 ? (
          <p className="text-gray-400">No recurring transactions added yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="text-left py-2">Title</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Frequency</th>
                <th className="text-left py-2">Next Date</th>
              </tr>
            </thead>
            <tbody>
              {recurringList.map((item) => (
                <tr key={item._id} className="border-b border-gray-800">
                  <td className="py-2">{item.title}</td>
                  <td>{item.amount}</td>
                  <td>{item.frequency}</td>
                  <td>{new Date(item.nextDate).toLocaleDateString()}</td>
                  <td className="space-x-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteRecurring(item._id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => toggleRecurring(item._id)}
                      className="text-yellow-400 hover:text-yellow-600"
                    >
                      {item.isActive ? "Pause" : "Resume"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
