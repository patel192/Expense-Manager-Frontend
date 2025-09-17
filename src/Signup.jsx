import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("/user", { ...data, role: "User" });

      if (res.status === 201) {
        toast.success("User created successfully!", { position: "top-center", autoClose: 3000 });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <ToastContainer transition={Bounce} />
      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            {...register("name", { required: "Name is required" })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input
            type="number"
            placeholder="Age"
            {...register("age", { required: "Age is required", min: 18 })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}

          <input
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required", minLength: 8 })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button type="submit" disabled={loading} className={`w-full py-3 text-white rounded-lg font-semibold shadow-md transition-all ${loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};
