import React from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import axios from "axios";
export const AddIncome = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      setValue("userID", storedUserId);
    } else {
      console.warn("No userId found in localStorage");
    }
  }, [setValue]);

  const SubmitHandler = async (data) => {
    const finalData = {
      userID: data.userID, // Explicitly place userId first
      amount: data.amount,
      source: data.source,
      date: data.date,
    };
    try {
      console.log("Final Form Data Submitted:", finalData);
      const res = await axios.post("/income", finalData);
      if (res.status == 201) {
        alert("income added successfully");
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
          <label>Source Of Income</label>
          <input
            type="text"
            className="form-control"
            {...register("source", { required: "source is required" })}
          />
          {errors.source && (
            <p style={{ color: "red" }}>{errors.source.message}</p>
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

        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
    </div>
  );
};
