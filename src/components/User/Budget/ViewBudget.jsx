import React, { useEffect, useState } from "react";
import axiosInstance from "../../Utils/axiosInstance";

export const ViewBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const userId = localStorage.getItem("id");

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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">💰 Budgets</h2>

      {budgets.length === 0 ? (
        <p className="text-center text-gray-500 italic">No budgets found</p>
      ) : (
        <div className="space-y-4">
          {budgets.map((budget) => (
            <div
              key={budget._id}
              className="flex justify-between items-center bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{budget.description || "Budget"}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(budget.start_date).toLocaleDateString()} -{" "}
                  {new Date(budget.end_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="text-xl font-bold text-blue-600">₹{budget.amount}</div>
                <button
                  onClick={() => handleDelete(budget._id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
