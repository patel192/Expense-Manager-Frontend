import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./components/Utils/axiosInstance";
import { motion } from "framer-motion";
import {
  FiUser, FiCalendar, FiMail, FiLock,
  FiEye, FiEyeOff, FiArrowRight, FiCheckCircle,
  FiShield, FiTrendingUp, FiPieChart,
} from "react-icons/fi";

/* ── reusable input wrapper ── */
const Field = ({ label, icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-[var(--muted)] tracking-wide">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none">
        {icon}
      </span>
      {children}
    </div>
    {error && (
      <p className="flex items-center gap-1.5 text-red-400 text-xs mt-1">
        <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

export const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ── all original logic untouched ── */
  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/user", { ...data, role: "User" });
      if (res.status === 201) {
        toast.success("User created successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Try again.",
        { position: "top-center", autoClose: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10
                    bg-gradient-to-b from-[#0c0e12] via-[#0f1115] to-[#0b0c10] text-[var(--text)] relative overflow-hidden">

      <ToastContainer transition={Bounce} />

      {/* Background glow orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/6 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-600/6 blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden
                      border border-[var(--border)] shadow-[0_32px_80px_rgba(0,0,0,0.8)]">

        {/* ── LEFT: Decorative Panel (desktop only) ── */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0d1f2d] via-[#0a1628] to-[#091020]
                        border-r border-[var(--border)] p-10">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <FiTrendingUp size={16} className="text-[var(--text)]" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FinTrack
            </span>
          </div>

          {/* Middle content */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[var(--text)] leading-tight">
                Start your financial journey today
              </h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                Join thousands of users who track income, expenses, and budgets — all in one clean dashboard.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { icon: <FiTrendingUp size={15} />, text: "Track income & expenses in real-time", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                { icon: <FiPieChart size={15} />, text: "Visualize budgets with smart reports", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
                { icon: <FiShield size={15} />, text: "Your data is private & secure", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${item.bg} ${item.color}`}>
                    {item.icon}
                  </div>
                  <p className="text-sm text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Mini stat pills */}
            <div className="flex gap-3">
              {[
                { label: "Free", sublabel: "Always" },
                { label: "Secure", sublabel: "& Private" },
              ].map((s, i) => (
                <div key={i} className="flex-1 bg-white/4 border border-[var(--border)] rounded-xl px-4 py-3 text-center">
                  <p className="text-[var(--text)] font-bold text-sm">{s.label}</p>
                  <p className="text-[var(--muted)] text-xs">{s.sublabel}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-600">
            © 2025 FinTrack. All rights reserved.
          </p>
        </div>

        {/* ── RIGHT: Form Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-[var(--card)] px-6 sm:px-8 py-10 flex flex-col justify-center"
        >
          {/* Mobile brand header */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <FiTrendingUp size={14} className="text-[var(--text)]" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FinTrack
            </span>
          </div>

          {/* Form header */}
          <div className="mb-7 space-y-1">
            <h2 className="text-xl font-bold text-[var(--text)]">Create your account</h2>
            <p className="text-sm text-[var(--muted)]">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

            {/* Full Name */}
            <Field label="Full Name" icon={<FiUser size={15} />} error={errors.name?.message}>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)]
                           text-gray-100 placeholder-gray-600 text-sm
                           focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40
                           hover:border-[var(--border)] transition-all duration-200"
              />
            </Field>

            {/* Age */}
            <Field label="Age" icon={<FiCalendar size={15} />} error={
              errors.age?.type === "min" ? "Age must be at least 18" : errors.age?.message
            }>
              <input
                type="number"
                placeholder="25"
                {...register("age", { required: "Age is required", min: 18 })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)]
                           text-gray-100 placeholder-gray-600 text-sm
                           focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40
                           hover:border-[var(--border)] transition-all duration-200"
              />
            </Field>

            {/* Email */}
            <Field label="Email Address" icon={<FiMail size={15} />} error={errors.email?.message}>
              <input
                type="email"
                placeholder="john@example.com"
                {...register("email", { required: "Email is required" })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)]
                           text-gray-100 placeholder-gray-600 text-sm
                           focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40
                           hover:border-[var(--border)] transition-all duration-200"
              />
            </Field>

            {/* Password */}
            <Field label="Password" icon={<FiLock size={15} />} error={errors.password?.message}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)]
                           text-gray-100 placeholder-gray-600 text-sm
                           focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40
                           hover:border-[var(--border)] transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-gray-300 transition-colors p-0.5"
              >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </Field>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-[var(--text)] text-sm
                          flex items-center justify-center gap-2 transition-all duration-200 mt-2
                          ${loading
                            ? "bg-cyan-500/30 cursor-not-allowed"
                            : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5"
                          }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-[var(--text)]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <FiArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mb-5">
            {[
              { icon: <FiShield size={12} />, text: "Secure" },
              { icon: <FiCheckCircle size={12} />, text: "Free forever" },
              { icon: <FiLock size={12} />, text: "Private" },
            ].map((b, i) => (
              <span key={i} className="flex items-center gap-1 text-[11px] text-gray-600">
                {b.icon}
                {b.text}
              </span>
            ))}
          </div>

          {/* Login redirect */}
          <p className="text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};