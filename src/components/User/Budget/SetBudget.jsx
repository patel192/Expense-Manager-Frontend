import React from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import axios from "axios";

export const SetBudget = () => {
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
      userID: data.userID,
      categoryID: data.categoryID,
      amount: data.amount,
      start_date: data.start_date,
      end_date: data.end_date,
    };
    try {
      console.log(finalData);
      const res = await axios.post(
        "http://localhost:3001/api/budget",
        finalData
      );
      if (res.status == 201) {
        alert("Budget added successfully");
        window.location.reload();
      }
    } catch(error) {
      alert(error.message);
    }
  };
  return (
    <div className="add-expense-container">
      <div className="add-expense-title">Add Budget</div>
      <form onSubmit={handleSubmit(SubmitHandler)}>
        <div className="form-group">
          <label>Category</label>
          <select
            className="form-select"
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
            <option value="67ece08cbeaf3d07e559ccff">
              Supplies and Materials
            </option>
          </select>
          {errors.categoryID && (
            <p style={{ color: "red" }}>{errors.categoryID.message}</p>
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
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            {...register("start_date", { required: "Start Date is required" })}
            />
            {errors.start_date && <p style={{ color: "red" }}>{errors.start_date.message}</p>}
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            {...register("end_date", { required: "End Date is required" })}
          />
           {errors.end_date && <p style={{ color: "red" }}>{errors.end_date.message}</p>}
           
        </div>
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
    </div>
  );
};
