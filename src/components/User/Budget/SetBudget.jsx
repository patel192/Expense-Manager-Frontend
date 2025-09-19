import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../Utils/axiosInstance";

export const SetBudget = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
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
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">➕ Add Budget</h2>

      <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-5">
        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            {...register("categoryID", { required: "Please select Budget category" })}
          >
            <option value="">Select a category</option>
            <option value="67ece00cbeaf3d07e559ccef">Rent</option>
            <option value="67ece01bbeaf3d07e559ccf1">Marketing</option>
            <option value="67ece027beaf3d07e559ccf3">Insurance</option>
            <option value="67ece033beaf3d07e559ccf5">Utilities</option>
            <option value="67ece056beaf3d07e559ccf7">Professional fees</option>
            <option value="67ece061beaf3d07e559ccf9">Maintenance</option>
            <option value="67ece068beaf3d07e559ccfb">Travel</option>
            <option value="67ece073beaf3d07e559ccfd">Wages</option>
            <option value="67ece08cbeaf3d07e559ccff">Supplies & Materials</option>
          </select>
          {errors.categoryID && <p className="text-red-500 text-sm mt-1">{errors.categoryID.message}</p>}
        </div>

        {/* Amount */}
        <div>
          <label className="block font-medium mb-1">Amount</label>
          <input
            type="number"
            placeholder="Enter budget amount"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            {...register("amount", { required: "Amount is required" })}
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        {/* Start Date */}
        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            {...register("start_date", { required: "Start Date is required" })}
          />
          {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>}
        </div>

        {/* End Date */}
        <div>
          <label className="block font-medium mb-1">End Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            {...register("end_date", {
              required: "End Date is required",
              validate: (value) => !startDate || value >= startDate || "End Date must be after Start Date",
            })}
          />
          {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Budget"}
        </button>
      </form>
    </div>
  );
};
