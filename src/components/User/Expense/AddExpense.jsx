import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  FaPlus, FaTags, FaRupeeSign, FaCalendarAlt, FaRegStickyNote, FaReceipt
} from "react-icons/fa";

export const AddExpense = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentExpenses, setRecentExpenses] = useState([]);

  // Fetch userId
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) setValue("userID", storedUserId);
  }, [setValue]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("categories");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch recent expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`/recent-expense/${localStorage.getItem("id")}`); // API should return last 5 expenses for the user
        setRecentExpenses(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch expenses", error);
      }
    };
    fetchExpenses();
  }, []);

  const SubmitHandler = async (data) => {
    const finalData = {
      userID: data.userID,
      categoryID: data.categoryID,
      amount: data.amount,
      date: data.date,
      description: data.description,
    };
    try {
      const res = await axios.post("/expense", finalData);
      if (res.status === 201) {
        alert("Expense added successfully");
        reset();
        setIsModalOpen(false);
        // Refresh list after adding
        const updated = await axios.get(`/recent-expense/${localStorage.getItem("id")}`);
        setRecentExpenses(updated.data.data || []);
      } else {
        alert("Error");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Recent Expenses Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaReceipt className="text-pink-600" /> Recent Expenses
        </h3>
        {recentExpenses.length === 0 ? (
          <p className="text-gray-500 italic">No expenses added yet. Click the button to add one!</p>
        ) : (
          <ul className="divide-y">
            {recentExpenses.map((exp) => (
              <li key={exp._id} className="py-2 flex justify-between">
                <span>{exp.description}</span>
                <span className="text-pink-600 font-semibold">
                  ₹{exp.amount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-4 shadow-lg transition-all flex items-center gap-2"
      >
        <FaPlus /> Add Expense
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Expense</h2>

            <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-4">
              {/* Category */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="bg-gray-100 p-3 text-gray-500">
                  <FaTags />
                </span>
                <select
                  className="w-full p-3 outline-none"
                  {...register("categoryID", { required: "Please select a category" })}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.categoryID && <p className="text-red-500 text-sm">{errors.categoryID.message}</p>}

              {/* Amount */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="bg-gray-100 p-3 text-gray-500">
                  <FaRupeeSign />
                </span>
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full p-3 outline-none"
                  {...register("amount", { required: "Amount is required" })}
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}

              {/* Date */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="bg-gray-100 p-3 text-gray-500">
                  <FaCalendarAlt />
                </span>
                <input
                  type="date"
                  className="w-full p-3 outline-none"
                  {...register("date", { required: "Date is required" })}
                />
              </div>
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}

              {/* Description */}
              <div className="flex items-center border rounded-lg overflow-hidden">
                <span className="bg-gray-100 p-3 text-gray-500">
                  <FaRegStickyNote />
                </span>
                <input
                  type="text"
                  placeholder="e.g., Grocery shopping"
                  className="w-full p-3 outline-none"
                  {...register("description", { required: "Description is required" })}
                />
              </div>
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-lg shadow transition-all"
              >
                Save Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
