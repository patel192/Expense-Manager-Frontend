import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";

export const Login = () => {
  const Navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const SubmitHandler = async (data) => {
    try {
      const res = await axios.post("user/login", data);

      if (res.status >= 200 && res.status < 300) {
        toast.success("Login Success", {
          style: { backgroundColor: "#1e293b", color: "white" },
        });

        if (res.data?.data?._id && res.data?.data?.roleId?.name) {
          localStorage.setItem("id", res.data.data._id);
          localStorage.setItem("role", res.data.data.roleId.name);
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: res.data.data.name,
              email: res.data.data.email,
              role: res.data.data.roleId.name,
            })
          );

          setTimeout(() => {
            if (res.data.data.roleId.name === "User") {
              Navigate("/private/userdashboard");
            } else if (res.data.data.roleId.name === "Admin") {
              Navigate("/admin/admindashboard");
            }
          }, 2000);
        } else {
          alert("Login failed: Missing user details in response.");
        }
      }
    } catch (error) {
      toast.error(
        "Login Failed: " +
          (error.response?.data?.message || "Server is unreachable")
      );
    }
  };

  const ErrorHandler = {
    emailHandler: {
      required: { value: true, message: "The Email is required" },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Please Enter The Valid Email Address",
      },
    },
    passwordHandler: {
      required: { value: true, message: "The Password is required" },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <ToastContainer position="top-center" autoClose={5000} theme="colored" transition={Bounce} />

      <motion.div
        className="bg-white shadow-lg rounded-xl overflow-hidden flex w-full max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left side */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-600 text-white w-1/2 p-10">
          <FaLock className="text-6xl mb-4" />
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-center text-blue-100">
            Please login to continue accessing your dashboard and exclusive features.
          </p>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login to Your Account</h2>

          <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-600 mb-1">Email Address</label>
              <input
                type="text"
                {...register("email", ErrorHandler.emailHandler)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-600 mb-1">Password</label>
              <input
                type="password"
                {...register("password", ErrorHandler.passwordHandler)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="/forgotpassword" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>

            {/* Signup Link */}
            <p className="text-center text-gray-600 text-sm mt-4">
              Not a member?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Signup now
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
