import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../Utils/axiosInstance";

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
    if (storedUserId) {
      setValue("userID", storedUserId); // Pre-fill userId
    } else {
      console.warn("No userId found in localStorage");
    }
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
    <div className="max-w-md mx-auto bg-white p-6 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Budget</h2>
      <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block font-medium">Category</label>
          <select
            className="w-full border p-2 rounded"
            {...register("categoryID", {
              required: "Please select Budget category",
            })}
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
          {errors.categoryID && (
            <p className="text-red-500 text-sm">{errors.categoryID.message}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block font-medium">Amount</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            {...register("amount", { required: "Amount is required" })}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block font-medium">Start Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            {...register("start_date", { required: "Start Date is required" })}
          />
          {errors.start_date && (
            <p className="text-red-500 text-sm">{errors.start_date.message}</p>
          )}
        </div>

        {/* End Date */}
        <div>
          <label className="block font-medium">End Date</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            {...register("end_date", {
              required: "End Date is required",
              validate: (value) =>
                !startDate || value >= startDate || "End Date must be after Start Date",
            })}
          />
          {errors.end_date && (
            <p className="text-red-500 text-sm">{errors.end_date.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Budget"}
        </button>
      </form>
    </div>
  );
};
