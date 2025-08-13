import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";


export const AddExpense = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      setValue("userID", storedUserId);
    } else {
      console.warn("No userId found in localStorage");
    }
  }, [setValue]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories");
        setCategories(res.data.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
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
      } else {
        alert("Error");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="add-expense-container">
      <h2 className="add-expense-title">Add New Expense</h2>
      <form onSubmit={handleSubmit(SubmitHandler)} className="form">
        <div className="form-group">
          <label>Category</label>
          <select {...register("categoryID", { required: "Please select a category" })}>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryID && <p className="error-msg">{errors.categoryID.message}</p>}
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input type="number" {...register("amount", { required: "Amount is required" })} />
          {errors.amount && <p className="error-msg">{errors.amount.message}</p>}
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" {...register("date", { required: "Date is required" })} />
          {errors.date && <p className="error-msg">{errors.date.message}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="e.g., Grocery shopping"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <p className="error-msg">{errors.description.message}</p>}
        </div>

        <button type="submit" className="button">
          Add Expense
        </button>
      </form>
    </div>
  );
};
