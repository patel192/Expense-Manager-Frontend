import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import axiosInstance from "../../Utils/axiosInstance";

export const ViewBudget = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await axiosInstance.get(`/budgetsbyUserID/${userId}`);
        setBudgets(res.data.data || []);
      } catch (error) {
        alert("Failed to fetch budgets: " + error.message);
      }
    };
    fetchBudgets();
  }, [userId]);

  const openConfirm = (budget) => {
    setSelectedBudget(budget);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBudget) return;
    try {
      await axiosInstance.delete(`/budget/${selectedBudget._id}`);
      setBudgets((prev) => prev.filter((b) => b._id !== selectedBudget._id));
    } catch (error) {
      alert("Error deleting budget: " + error.message);
    } finally {
      setIsConfirmOpen(false);
      setSelectedBudget(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-white border-b pb-3">
        Budget Overview
      </h2>

      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg font-medium">No budgets found</p>
          <p className="text-sm text-gray-400">
            Add your first budget to start tracking your expenses.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <div
              key={budget._id}
              className="bg-white/90 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  {budget.description || "Budget"}
                </h3>
                <button
                  onClick={() => openConfirm(budget)}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="text-sm text-gray-500 mb-2">
                {new Date(budget.start_date).toLocaleDateString()} —{" "}
                {new Date(budget.end_date).toLocaleDateString()}
              </div>

              <div className="text-xl font-bold text-blue-600">
                ₹{budget.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsConfirmOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
                <Dialog.Title className="text-lg font-semibold text-gray-800">
                  Confirm Deletion
                </Dialog.Title>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-gray-700">
                    {selectedBudget?.description || "this budget"}
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsConfirmOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
