import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const SubmitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("/user/forgotpassword", data);

      if (res.status === 200) {
        toast.success("Reset link sent successfully!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      } else {
        toast.error(res.data.message || "Something went wrong", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send reset email",
        {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <ToastContainer transition={Bounce} />

      <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit(SubmitHandler)} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Enter your registered email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-semibold shadow-md transition-all ${
              loading
                ? "bg-purple-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};
