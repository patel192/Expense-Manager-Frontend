import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaSignInAlt } from "react-icons/fa";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const Navigate = useNavigate();

 const SubmitHandler = async (data) => {
  try {
    const res = await axios.post("/user/login", data);

    if (res.status >= 200 && res.status < 300) {
      toast.success("Login Success");

      // ✅ Store token
      localStorage.setItem("token", res.data.token);

      // ✅ Store user details
      localStorage.setItem("id", res.data.data._id);
      localStorage.setItem("role", res.data.data.role);

      // Redirect based on role
      setTimeout(() => {
        if (res.data.data.role === "User") {
          Navigate("/private/userdashboard");
        } else if (res.data.data.role === "Admin") {
          Navigate("/admin/admindashboard");
        }
      }, 2000);
    }
  } catch (error) {
    toast.error(
      "Login Failed: " +
        (error.response?.data?.message || "Server is unreachable")
    );
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <ToastContainer transition={Bounce} />

      <motion.div
        className="bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Left Side */}
        <motion.div
          className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-1/2 p-10"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FaSignInAlt className="text-6xl mb-4 drop-shadow-lg" />
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-center text-purple-100">
            Log in to access your dashboard and manage your account.
          </p>
        </motion.div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Login
          </h2>

          <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="text"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email",
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum length is 8" },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-purple-700 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Log In
            </motion.button>

            {/* Signup Link */}
            <p className="text-center text-gray-600 text-sm mt-4">
              Don't have an account?{" "}
              <a href="/signup" className="text-purple-500 hover:underline">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
