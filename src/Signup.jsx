import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";

export const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post("/user", { ...data, role: "User" });
      console.log(data);

      if (res.status === 201) {
        toast.success("User Created Successfully", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        alert("User not created");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(
        "Signup Failed: " + (error.response?.data?.message || "Server error"),
        {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        }
      );
    }
  };

  const ErrorHandler = {
    NameHandler: { required: { value: true, message: "The name is required" } },
    AgeHandler: {
      required: { value: true, message: "The age is required" },
      min: { value: 18, message: "Minimum age is 18" },
    },
    EmailHandler: {
      required: { value: true, message: "The email is required" },
      pattern: {
        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Enter a valid email",
      },
    },
    PasswordHandler: {
      required: { value: true, message: "The password is required" },
      minLength: { value: 8, message: "Minimum length is 8" },
      maxLength: { value: 20, message: "Maximum length is 20" },
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message: "Use a strong password",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <ToastContainer transition={Bounce} />

      <motion.div
        className="bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Left side */}
        <motion.div
          className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-1/2 p-10"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FaUserPlus className="text-6xl mb-4 drop-shadow-lg" />
          <h2 className="text-3xl font-bold mb-2">Join Our Platform</h2>
          <p className="text-center text-purple-100">
            Unlock exclusive features and connect with amazing people.
          </p>
        </motion.div>

        {/* Right side */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Create Account
          </h2>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name", ErrorHandler.NameHandler)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-600 mb-1">Age</label>
              <input
                type="number"
                placeholder="Enter your age"
                {...register("age", ErrorHandler.AgeHandler)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="text"
                placeholder="Enter your email"
                {...register("email", ErrorHandler.EmailHandler)}
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
                {...register("password", ErrorHandler.PasswordHandler)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Submit */}
            <motion.button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-purple-700 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Sign Up
            </motion.button>

            {/* Link */}
            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-purple-500 hover:underline">
                Log in
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
