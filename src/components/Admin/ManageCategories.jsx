import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

export const ManageCategories = ({config}) => {
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
      const res = await axios.get("/categories",config);
      setCategories(res.data.data || []);
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/category",config, data);
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
      await axios.delete(`/category/${id}`,config);
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
      await axios.put(`/category/${id}`,config, editedCategory);
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
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <p className="text-gray-500">Total</p>
          <h3 className="text-xl font-bold">{totalCount}</h3>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow border border-green-300">
          <p className="text-green-700">Income</p>
          <h3 className="text-xl font-bold text-green-800">{incomeCount}</h3>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow border border-red-300">
          <p className="text-red-700">Expense</p>
          <h3 className="text-xl font-bold text-red-800">{expenseCount}</h3>
        </div>
      </div>

      {/* Add Form */}
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 mb-8 bg-white p-4 rounded-lg shadow border">
        <div>
          <label className="block mb-1">Category Name:</label>
          <input
            className="border p-2 w-full rounded"
            {...register("name", { required: "Category name is required" })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Category Type:</label>
          <select
            className="border p-2 w-full rounded"
            {...register("type", { required: "Please select a type" })}
          >
            <option value="">Select Type</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
        </div>
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700">
          Add Category
        </button>
      </form>

      {/* Search & Filter */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-1/2 rounded"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : (
        <table className="w-full border bg-white rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat._id} className="border-t hover:bg-blue-50">
                <td className="px-4 py-2">
                  {editingId === cat._id ? (
                    <input
                      value={editedCategory.name}
                      onChange={(e) =>
                        setEditedCategory({ ...editedCategory, name: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingId === cat._id ? (
                    <select
                      value={editedCategory.type}
                      onChange={(e) =>
                        setEditedCategory({ ...editedCategory, type: e.target.value })
                      }
                      className="border p-1 rounded w-full"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        cat.type === "income"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cat.type}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  {editingId === cat._id ? (
                    <button
                      onClick={() => saveEdit(cat._id)}
                      className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(cat)}
                      className="bg-yellow-500 px-3 py-1 rounded text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
