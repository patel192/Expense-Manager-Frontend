import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";

export const ManageCategories = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedCategory, setEditedCategory] = useState({ name: "", type: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data.data || []);
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (data) => {
    try {
      const res = await axiosInstance.post("/category", data);
      if (res.status === 201) {
        toast.success("Category added!");
        reset();
        fetchCategories();
      }
    } catch {
      toast.error("Error adding category");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await axiosInstance.delete(`/category/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const startEditing = (cat) => {
    setEditingId(cat._id);
    setEditedCategory({ name: cat.name, type: cat.type });
  };

  const saveEdit = async (id) => {
    try {
      await axiosInstance.put(`/category/${id}`, editedCategory);
      toast.success("Category updated");
      setEditingId(null);
      fetchCategories();
    } catch {
      toast.error("Failed to update category");
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? cat.type === filterType : true;
    return matchesSearch && matchesType;
  });

  const totalCount = categories.length;
  const incomeCount = categories.filter((c) => c.type === "income").length;
  const expenseCount = categories.filter((c) => c.type === "expense").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0c10] via-[#0e1014] to-[#090b0e] text-gray-100 p-8">
      <Toaster position="top-right" />

      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
      >
        Manage Categories
      </motion.h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total", value: totalCount, color: "from-blue-400 to-purple-500" },
          { label: "Income", value: incomeCount, color: "from-emerald-400 to-green-500" },
          { label: "Expense", value: expenseCount, color: "from-pink-400 to-red-500" },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg shadow-lg border border-white/10"
          >
            <p className="text-sm text-gray-400">{card.label}</p>
            <h3
              className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${card.color}`}
            >
              {card.value}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Add Category Form */}
      <motion.form
        onSubmit={handleSubmit(submitHandler)}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 mb-10 p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl"
      >
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-300">
            Category Name
          </label>
          <input
            {...register("name", { required: "Category name is required" })}
            className="w-full p-3 rounded-lg bg-black/20 text-white border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
            placeholder="Enter category name"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-300">
            Category Type
          </label>
          <select
            {...register("type", { required: "Please select a type" })}
            className="w-full p-3 rounded-lg bg-black/20 text-white border border-white/10 focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition"
        >
          Add Category
        </button>
      </motion.form>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 focus:ring-2 focus:ring-blue-400 outline-none placeholder-gray-500"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 focus:ring-2 focus:ring-purple-400 outline-none"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-2xl shadow-xl border border-white/10 bg-white/5 backdrop-blur-md">
            <table className="w-full text-left">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-sm text-gray-300">Name</th>
                  <th className="px-6 py-3 text-sm text-gray-300">Type</th>
                  <th className="px-6 py-3 text-sm text-center text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((cat) => (
                  <motion.tr
                    key={cat._id}
                    whileHover={{ scale: 1.005, backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="border-b border-white/10"
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      {editingId === cat._id ? (
                        <input
                          value={editedCategory.name}
                          onChange={(e) =>
                            setEditedCategory({ ...editedCategory, name: e.target.value })
                          }
                          className="w-full p-2 rounded-lg bg-black/30 border border-white/10 text-white outline-none"
                        />
                      ) : (
                        <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                          {cat.name}
                        </span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      {editingId === cat._id ? (
                        <select
                          value={editedCategory.type}
                          onChange={(e) =>
                            setEditedCategory({ ...editedCategory, type: e.target.value })
                          }
                          className="w-full p-2 rounded-lg bg-black/30 border border-white/10 text-white outline-none"
                        >
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            cat.type === "income"
                              ? "bg-green-400/20 text-green-300"
                              : "bg-red-400/20 text-red-300"
                          }`}
                        >
                          {cat.type}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 flex justify-center gap-2">
                      {editingId === cat._id ? (
                        <>
                          <button
                            onClick={() => saveEdit(cat._id)}
                            className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(cat)}
                            className="px-3 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCategory(cat._id)}
                            className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="block md:hidden space-y-4 mt-6">
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat._id}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-white/5 backdrop-blur-md shadow-md border border-white/10"
              >
                {editingId === cat._id ? (
                  <>
                    <input
                      value={editedCategory.name}
                      onChange={(e) =>
                        setEditedCategory({ ...editedCategory, name: e.target.value })
                      }
                      className="w-full p-2 rounded bg-black/20 text-white border border-white/10 outline-none mb-2"
                    />
                    <select
                      value={editedCategory.type}
                      onChange={(e) =>
                        setEditedCategory({ ...editedCategory, type: e.target.value })
                      }
                      className="w-full p-2 rounded bg-black/20 text-white border border-white/10 outline-none mb-3"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(cat._id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-lg text-white font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 py-2 rounded-lg text-white font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {cat.name}
                    </h4>
                    <p
                      className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        cat.type === "income"
                          ? "bg-green-400/20 text-green-300"
                          : "bg-red-400/20 text-red-300"
                      }`}
                    >
                      {cat.type}
                    </p>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => startEditing(cat)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-2 rounded-lg text-white font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(cat._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-lg text-white font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
