import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {loginSuccess} from "./redux/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./components/Utils/axiosInstance";
import { motion } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import {
  FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight,
  FiTrendingUp, FiPieChart, FiShield, FiCheckCircle,
  FiBarChart2,
} from "react-icons/fi";

/* ── reusable field wrapper ── */
const Field = ({ label, icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-400 tracking-wide">{label}</label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
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

export const Login = () => {
  const { login } = useAuth();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED ── */
  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/user/login", data);
      if (res.status === 200) {
        toast.success("Login successful!", { position: "top-center", autoClose: 2000 });
        dispatch(
          loginSuccess({
            user:res.data.user,
            token:res.data.token,
            role:res.data.role
          })
        )
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        position: "top-center", autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10
                    bg-gradient-to-b from-[#0c0e12] via-[#0f1115] to-[#0b0c10]
                    text-white relative overflow-hidden">

      <ToastContainer transition={Bounce} />

      {/* Static glow orbs — no animation cost */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden
                      border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.7)]">

        {/* ══ LEFT PANEL — static, no motion, lg only ══ */}
        <div className="hidden lg:flex flex-col justify-between
                        bg-gradient-to-br from-[#0d1f2d] via-[#0a1628] to-[#091020]
                        border-r border-white/10 p-10">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600
                            flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <FiTrendingUp size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FinTrack
            </span>
          </div>

          {/* Content — purely static, zero framer-motion on left panel */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white leading-tight">
                Good to have you back
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your financial dashboard is waiting. Pick up right where you left off.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: <FiBarChart2 size={15} />, text: "Your spending summary is ready to view",  color: "text-cyan-400",    bg: "bg-cyan-500/10 border-cyan-500/20" },
                { icon: <FiPieChart size={15} />,  text: "Budget progress updated in real-time",    color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                { icon: <FiShield size={15} />,    text: "Secure login with encrypted sessions",    color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${item.bg} ${item.color}`}>
                    {item.icon}
                  </div>
                  <p className="text-sm text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "₹2.4L+", label: "tracked monthly" },
                { value: "99.9%",  label: "uptime" },
                { value: "100%",   label: "free forever" },
              ].map((s, i) => (
                <div key={i} className="bg-white/4 border border-white/8 rounded-xl px-3 py-3 text-center">
                  <p className="text-white font-bold text-sm">{s.value}</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-600">© 2025 FinTrack. All rights reserved.</p>
        </div>

        {/* ══ RIGHT: Form — single fast fade-in only ══ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-[#111318] px-6 sm:px-8 py-10 flex flex-col justify-center"
        >
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <FiTrendingUp size={14} className="text-white" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FinTrack
            </span>
          </div>

          {/* Header */}
          <div className="mb-7 space-y-1">
            <h2 className="text-xl font-bold text-white">Welcome back</h2>
            <p className="text-sm text-gray-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

            <Field label="Email Address" icon={<FiMail size={15} />} error={errors.email?.message}>
              <input
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                {...register("email", { required: "Email is required" })}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10
                           text-gray-100 placeholder-gray-600 text-sm
                           focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40
                           hover:border-white/20 transition-colors duration-150"
              />
            </Field>

            <Field label="Password" icon={<FiLock size={15} />} error={errors.password?.message}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                autoComplete="current-password"
                {...register("password", { required: "Password is required" })}
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/40 border border-white/10
                           text-gray-100 placeholder-gray-600 text-sm
                           focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40
                           hover:border-white/20 transition-colors duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500
                           hover:text-gray-300 transition-colors p-0.5"
              >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-white text-sm mt-2
                          flex items-center justify-center gap-2 transition-all duration-200
                          ${loading
                            ? "bg-cyan-500/30 cursor-not-allowed"
                            : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5"
                          }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>Sign In <FiArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-gray-600">secure login</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <div className="flex items-center justify-center gap-4 mb-5">
            {[
              { icon: <FiShield size={12} />,      text: "Encrypted" },
              { icon: <FiCheckCircle size={12} />, text: "Private" },
              { icon: <FiLock size={12} />,        text: "Secure session" },
            ].map((b, i) => (
              <span key={i} className="flex items-center gap-1 text-[11px] text-gray-600">
                {b.icon}{b.text}
              </span>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};