import React, { useEffect, useState } from "react";
import axiosInstance from "../../Utils/axiosInstance";

export const ViewBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const userId = localStorage.getItem("id");

  // Fetch budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await axiosInstance.get(`/budgetsbyUserID/${userId}`);
        setBudgets(res.data.data || []);
      } catch (error) {
        alert(error.message);
      }
    };
    fetchBudgets();
  }, [userId]);

  // Delete budget
  const handleDelete = async (budgetId) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    try {
      await axiosInstance.delete(`/budget/${budgetId}`);
      setBudgets((prev) => prev.filter((b) => b._id !== budgetId));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">Budgets</h2>

      {budgets.length === 0 ? (
        <p className="text-center text-gray-600">No Budget Found</p>
      ) : (
        budgets.map((budget) => (
          <div
            key={budget._id}
            className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-lg shadow-md"
          >
            <div>
              <h3 className="font-semibold">{budget.description || "Budget"}</h3>
              <p className="text-sm">
                {new Date(budget.start_date).toLocaleDateString()} -{" "}
                {new Date(budget.end_date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">₹{budget.amount}</div>
              <button
                onClick={() => handleDelete(budget._id)}
                className="mt-2 px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
