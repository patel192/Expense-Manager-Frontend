import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../Utils/axiosInstance";
import { motion } from "framer-motion";

export const SetBudget = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const startDate = watch("start_date");

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) setValue("userID", storedUserId);
  }, [setValue]);

  const SubmitHandler = async (data) => {
    const finalData = {
      userID: data.userID,
      categoryID: data.categoryID,
      amount: data.amount,
      start_date: data.start_date,
      end_date: data.end_date,
    };
    try {
      setLoading(true);
      const res = await axiosInstance.post("/budget", finalData);
      if (res.status === 201) {
        alert("✅ Budget added successfully!");
        window.location.reload();
      }
    } catch (error) {
      alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-lg mx-auto mt-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl"
    >
      <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
        Set Your Budget
      </h2>

      <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            className="w-full bg-white/5 border border-white/20 p-3 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            {...register("categoryID", { required: "Please select a category" })}
          >
            <option value="">Select a category</option>
            <option value="67ece00cbeaf3d07e559ccef">Rent</option>
            <option value="67ece01bbeaf3d07e559ccf1">Marketing</option>
            <option value="67ece027beaf3d07e559ccf3">Insurance</option>
            <option value="67ece033beaf3d07e559ccf5">Utilities</option>
            <option value="67ece056beaf3d07e559ccf7">Professional Fees</option>
            <option value="67ece061beaf3d07e559ccf9">Maintenance</option>
            <option value="67ece068beaf3d07e559ccfb">Travel</option>
            <option value="67ece073beaf3d07e559ccfd">Wages</option>
            <option value="67ece08cbeaf3d07e559ccff">Supplies & Materials</option>
          </select>
          {errors.categoryID && (
            <p className="text-red-400 text-sm mt-1">
              {errors.categoryID.message}
            </p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            placeholder="Enter budget amount"
            className="w-full bg-white/5 border border-white/20 p-3 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
            {...register("amount", { required: "Amount is required" })}
          />
          {errors.amount && (
            <p className="text-red-400 text-sm mt-1">
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            className="w-full bg-white/5 border border-white/20 p-3 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            {...register("start_date", { required: "Start Date is required" })}
          />
          {errors.start_date && (
            <p className="text-red-400 text-sm mt-1">
              {errors.start_date.message}
            </p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            className="w-full bg-white/5 border border-white/20 p-3 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            {...register("end_date", {
              required: "End Date is required",
              validate: (value) =>
                !startDate || value >= startDate || "End Date must be after Start Date",
            })}
          />
          {errors.end_date && (
            <p className="text-red-400 text-sm mt-1">
              {errors.end_date.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          type="submit"
          className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? "Processing..." : "Add Budget"}
        </motion.button>
      </form>
    </motion.div>
  );
};
