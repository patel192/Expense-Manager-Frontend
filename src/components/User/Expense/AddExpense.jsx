import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../Utils/axiosInstance";
import { FaPlus, FaTags, FaRupeeSign, FaCalendarAlt, FaRegStickyNote, FaReceipt } from "react-icons/fa";
import { motion } from "framer-motion";

export const AddExpense = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const userId = localStorage.getItem("id");

  useEffect(() => { if (userId) setValue("userID", userId); }, [setValue, userId]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.data);
      } catch (error) { console.error(error); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRecentExpenses = async () => {
      try {
        const res = await axiosInstance.get(`/recent-expense/${userId}`);
        setRecentExpenses(res.data.data || []);
      } catch (error) { console.error(error); }
    };
    fetchRecentExpenses();
  }, [userId]);

  const SubmitHandler = async (data) => {
    try {
      const res = await axiosInstance.post("/expense", {
        userID: data.userID,
        categoryID: data.categoryID,
        amount: data.amount,
        date: data.date,
        description: data.description,
      });
      if (res.status === 201) {
        alert("Expense added successfully");
        reset();
        setIsModalOpen(false);
        const updated = await axiosInstance.get(`/recent-expense/${userId}`);
        setRecentExpenses(updated.data.data || []);
      }
    } catch (error) { alert(error.message); }
  };

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl shadow-md p-4 max-h-96 overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaReceipt className="text-pink-600" /> Recent Expenses
        </h3>
        {recentExpenses.length === 0 ? (
          <p className="text-gray-500 italic">No expenses yet. Click the button to add one!</p>
        ) : (
          <ul className="divide-y">
            {recentExpenses.map((exp) => (
              <li key={exp._id} className="py-2 flex justify-between">
                <span className="text-gray-700">{exp.description}</span>
                <span className="text-pink-600 font-semibold">₹{exp.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Expense Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-4 shadow-lg transition flex items-center gap-2"
      >
        <FaPlus /> Add Expense
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Expense</h2>

            <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-4">

              {/* Category */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="bg-gray-100 p-3 text-gray-500"><FaTags /></span>
                <select
                  className="w-full p-3 outline-none"
                  {...register("categoryID", { required: "Select a category" })}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              {errors.categoryID && <p className="text-red-500 text-sm">{errors.categoryID.message}</p>}

              {/* Amount */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="bg-gray-100 p-3 text-gray-500"><FaRupeeSign /></span>
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full p-3 outline-none"
                  {...register("amount", { required: "Amount required" })}
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}

              {/* Date */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="bg-gray-100 p-3 text-gray-500"><FaCalendarAlt /></span>
                <input
                  type="date"
                  className="w-full p-3 outline-none"
                  {...register("date", { required: "Date required" })}
                />
              </div>
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}

              {/* Description */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="bg-gray-100 p-3 text-gray-500"><FaRegStickyNote /></span>
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full p-3 outline-none"
                  {...register("description", { required: "Description required" })}
                />
              </div>
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

              <button className="w-full bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-lg shadow transition">Save Expense</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
