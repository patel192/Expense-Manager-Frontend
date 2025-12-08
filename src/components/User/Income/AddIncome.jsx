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
    const payload = {
      userID: data.userID,
      amount: data.amount,
      source: data.source,
      date: data.date,
    };
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
    <>
      {/* Floating Add Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-2xl transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                  <Dialog.Title className="text-xl font-semibold tracking-wide text-gray-100">
                    Add New Income
                  </Dialog.Title>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-5">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Enter amount"
                      {...register("amount", { required: "Amount is required" })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>
                    )}
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Source
                    </label>
                    <select
                      {...register("source", { required: "Source is required" })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="">Select income source</option>
                      <option value="Salary">Salary</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Investments">Investments</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.source && (
                      <p className="text-red-500 text-xs mt-1">{errors.source.message}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      {...register("date", { required: "Date is required" })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {errors.date && (
                      <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2.5 rounded-lg text-white font-medium tracking-wide shadow-md hover:shadow-blue-500/20 transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    {loading ? "Adding..." : "Add Income"}
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
