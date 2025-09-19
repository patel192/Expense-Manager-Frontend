import React, { useEffect, useState } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";

export const AllExpenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axiosInstance.get(`/expensesbyUserID/${localStorage.getItem("id")}`);
        setExpenses(res.data.data || []);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await axiosInstance.delete(`/expense/${id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center text-white">💸 All Expenses</h2>

      {expenses.length > 0 ? (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="flex justify-between items-center bg-gray-800 rounded-xl p-4 shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-900/20 p-3 rounded-full">
                  <MdOutlineAttachMoney size={28} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">{expense.description}</h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-red-400 font-semibold text-lg">
                  ₹{Number(expense.amount).toLocaleString("en-IN")}
                </span>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="bg-red-500/20 hover:bg-red-500 p-2 rounded-lg transition-colors"
                >
                  <FaTrashAlt className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-lg">No expenses found...</p>
        </div>
      )}
    </div>
  );
};
