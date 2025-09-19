import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../Utils/axiosInstance";
import { motion } from "framer-motion";

export const ManageCategories = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-8">
      <Toaster position="top-right" />

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
      >
        Manage Categories
      </motion.h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total", value: totalCount, color: "from-blue-400 to-purple-500" },
          { label: "Income", value: incomeCount, color: "from-green-400 to-emerald-500" },
          { label: "Expense", value: expenseCount, color: "from-pink-400 to-red-500" },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className={`p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20`}
          >
            <p className="text-sm text-gray-300">{card.label}</p>
            <h3
              className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${card.color}`}
            >
              {card.value}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Add Form */}
      <motion.form
        onSubmit={handleSubmit(submitHandler)}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 mb-10 p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/20"
      >
        <div>
          <label className="block mb-2 text-sm font-medium">Category Name</label>
          <input
            className="border-none w-full p-3 rounded-lg bg-white/5 backdrop-blur-md focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400"
            placeholder="Enter category name"
            {...register("name", { required: "Category name is required" })}
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">Category Type</label>
          <select
            className="border-none w-full p-3 rounded-lg bg-white/5 backdrop-blur-md focus:ring-2 focus:ring-purple-500 outline-none text-white"
            {...register("type", { required: "Please select a type" })}
          >
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:opacity-90 transition"
        >
          Add Category
        </button>
      </motion.form>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/20 focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-gray-400"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/20 focus:ring-2 focus:ring-purple-500 outline-none text-white"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-400">Loading categories...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl shadow-lg border border-white/20 bg-white/5 backdrop-blur-md">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <motion.tr
                  key={cat._id}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="border-t border-white/10"
                >
                  <td className="px-6 py-3">
                    {editingId === cat._id ? (
                      <input
                        value={editedCategory.name}
                        onChange={(e) =>
                          setEditedCategory({ ...editedCategory, name: e.target.value })
                        }
                        className="w-full p-2 rounded bg-white/10 text-white border border-white/20 outline-none"
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {editingId === cat._id ? (
                      <select
                        value={editedCategory.type}
                        onChange={(e) =>
                          setEditedCategory({ ...editedCategory, type: e.target.value })
                        }
                        className="w-full p-2 rounded bg-white/10 text-white border border-white/20 outline-none"
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
                  <td className="px-6 py-3 flex gap-3 justify-center">
                    {editingId === cat._id ? (
                      <button
                        onClick={() => saveEdit(cat._id)}
                        className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-white font-medium"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(cat)}
                        className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-lg text-white font-medium"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-white font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-400">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
