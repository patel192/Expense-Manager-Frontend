import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../Utils/axiosInstance";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const AddIncome = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    if (storedUserId) setValue("userID", storedUserId);
  }, [setValue]);

  const SubmitHandler = async (data) => {
    const payload = { userID: data.userID, amount: data.amount, source: data.source, date: data.date };
    try {
      setLoading(true);
      const res = await axiosInstance.post("/income", payload);
      if (res.status === 201) {
        alert("✅ Income Added Successfully!");
        setIsOpen(false);
      } else {
        alert("❌ Something went wrong.");
      }
    } catch (error) {
      alert("⚠️ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-md bg-gray-900 text-white rounded-2xl p-6 shadow-2xl border border-white/20 backdrop-blur-sm">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-semibold">➕ Add Income</Dialog.Title>
                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Amount</label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus:ring focus:ring-blue-400"
                      placeholder="Enter amount"
                      {...register("amount", { required: "Amount is required" })}
                    />
                    {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Source</label>
                    <select
                      className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus:ring focus:ring-blue-400"
                      {...register("source", { required: "Source is required" })}
                    >
                      <option value="">Select income source</option>
                      <option value="Salary">Salary</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Investments">Investments</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.source && <p className="text-red-500 text-sm">{errors.source.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Date</label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 focus:ring focus:ring-blue-400"
                      {...register("date", { required: "Date is required" })}
                    />
                    {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-transform transform hover:scale-105"
                  >
                    {loading ? "Adding..." : "Add Income"}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
