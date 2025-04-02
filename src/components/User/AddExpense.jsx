import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect } from "react";

export const AddExpense = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      setValue("userID", storedUserId); // Pre-fill userId inside form data
    } else {
      console.warn("No userId found in localStorage");
    }
  }, [setValue]);

  const SubmitHandler = async (data) => {
    const finalData = {
      userId: data.userID, // Explicitly place userId first
      categoryId: data.categoryId,
      amount: data.amount,
      date: data.date,
      description: data.description,
    };
    try {
      console.log("Final Form Data Submitted:", finalData);
      const res = await axios.post("/expense", finalData);
      if (res.status == 201) {
        alert("expense added successfully");
        window.location.reload();
      } else {
        alert("Error");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <form onSubmit={handleSubmit(SubmitHandler)}>
        <div className="form-group">
          <label>Category</label>
          <select
            className="form-select"
            {...register("categoryId", {
              required: "Please select an expense category",
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
            <option value="67ece08cbeaf3d07e559ccff">
              Supplies and Materials
            </option>
          </select>
          {errors.categoryId && (
            <p style={{ color: "red" }}>{errors.categoryId.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            className="form-control"
            {...register("amount", { required: "Amount is required" })}
          />
          {errors.amount && (
            <p style={{ color: "red" }}>{errors.amount.message}</p>
          )}
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && <p style={{ color: "red" }}>{errors.date.message}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description.message}</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
    </div>
  );
};
