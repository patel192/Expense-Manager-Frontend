import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./components/Utils/axiosInstance";
import { motion } from "framer-motion";
import { useAuth } from "./context/AuthContext";

export const Login = () => {
const {login} = useAuth();
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (data) => {
    setLoading(true);

    try {
      const res = await axiosInstance.post("/user/login", data);

      if (res.status === 200) {

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 2000,
        });
        login(res.data)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#0c0e12] via-[#0f1115] to-[#0b0c10] text-white">
      <ToastContainer transition={Bounce} />

      {/* Login Window Box */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md rounded-3xl bg-[#111318] border border-white/10 shadow-[0_18px_55px_rgba(0,0,0,0.7)] overflow-hidden"
      >
        {/* CLEAN TOP BAR */}
        <div className="px-5 py-4 border-b border-white/10 bg-[#181b22] text-center">
          <h2 className="text-lg font-semibold text-gray-200">Welcome Back</h2>
          <p className="text-xs text-gray-400">Log into your FinTrack account</p>
        </div>

        {/* Body */}
        <div className="px-6 py-8">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10
                           text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10
                           text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-md
                          transition border border-white/10
                ${
                  loading
                    ? "bg-cyan-500/30 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
                }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Redirect to signup */}
          <p className="mt-5 text-center text-gray-400 text-sm">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
