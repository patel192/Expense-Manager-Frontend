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
      const res = await axios.post("/user", data);

      if (res.status === 201) {
        toast.success("User Created Successfully", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        alert("User not created");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Signup Failed: " + (error.response?.data?.message || "Server error"), {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const ErrorHandler = {
    NameHandler: {
      required: { value: true, message: "The name is required" },
    },
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
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message: "Use a strong password",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-200">
      <ToastContainer transition={Bounce} />

      <motion.div
        className="bg-white shadow-lg rounded-xl overflow-hidden flex w-full max-w-5xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left side */}
        <div className="hidden md:flex flex-col justify-center items-center bg-purple-600 text-white w-1/2 p-10">
          <FaUserPlus className="text-6xl mb-4" />
          <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
          <p className="text-center text-purple-100">
            Join our community and get access to exclusive features and tools.
          </p>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h2>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name", ErrorHandler.NameHandler)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-600 mb-1">Age</label>
              <input
                type="number"
                placeholder="Enter your age"
                {...register("age", ErrorHandler.AgeHandler)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
              />
              {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="text"
                placeholder="Enter your email"
                {...register("email", ErrorHandler.EmailHandler)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register("password", ErrorHandler.PasswordHandler)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* Role */}
            <div>
              <span className="block text-gray-600 mb-1">Role</span>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="67da4c20d58329a643242b24"
                    {...register("roleId", { required: "Role selection is required" })}
                  />
                  User
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="67da4c13d58329a643242b22"
                    {...register("roleId", { required: "Role selection is required" })}
                  />
                  Admin
                </label>
              </div>
              {errors.roleId && <p className="text-sm text-red-500">{errors.roleId.message}</p>}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-purple-700 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </motion.button>

            {/* Login Link */}
            <p className="text-center text-gray-600 text-sm mt-4">
              Already a member?{" "}
              <a href="/login" className="text-purple-500 hover:underline">
                Login now
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
