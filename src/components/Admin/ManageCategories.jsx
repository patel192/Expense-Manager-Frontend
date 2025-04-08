import React from 'react'
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState,useEffect } from 'react';
export const ManageCategories = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories");
      setCategories(res.data.data); // Adjust if structure is different
    } catch (err) {
      alert("Failed to fetch categories.");
    }
  };
  const submitHandler = async (data) =>{
    try {
      const res = await axios.post("/category", data);
      if (res.status === 201) {
        alert("Category added!");
        reset(); // clear form
        fetchCategories(); // refresh list
      }
    } catch (err) {
      alert("Error adding category.");
    }
  }

  return (
    <div className="p-4">
    <h2 className="text-xl font-bold mb-4">Manage Categories</h2>

    {/* Form */}
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 mb-8">
      <div>
        <label className="block">Category Name:</label>
        <input
          className="border p-2 w-full"
          {...register("name", { required: "Category name is required" })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block">Category Type:</label>
        <select
          className="border p-2 w-full"
          {...register("type", { required: "Please select a type" })}
        >
          <option value="">Select Type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {errors.type && <p className="text-red-500">{errors.type.message}</p>}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Category
      </button>
    </form>

    {/* Display List */}
    <div>
      <h3 className="text-lg font-semibold mb-2">Existing Categories</h3>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Type</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td className="border px-4 py-2">{cat.name}</td>
              <td className="border px-4 py-2">{cat.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  )
}
