import React from "react";
import { useState } from "react";

export const RecurringTransactions = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Recurring transaction:", formData);
  };
  return (
    <div className="text-white space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Recurring Transactions</h1>
      <form
        action=""
        className="bg-[#111318] p-6 rounded-xl border border-white/10 space-y-4"
      >
        {/* Title */}
        <div>
          <label htmlFor="" className="block text-sm text-gray-400 mb-1">
            Title
          </label>
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
            value={FormData.amount}
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
            {/* Submit */}
            <button
              type="submit"
              className="bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-600"
            >
              Add Recurring Expense
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
