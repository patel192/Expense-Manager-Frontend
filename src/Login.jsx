import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./components/Utils/axiosInstance";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiTrendingUp,
  FiPieChart,
  FiShield,
  FiCheckCircle,
  FiBarChart2,
  FiRefreshCw
} from "react-icons/fi";

/* ── REUSABLE FIELD WRAPPER ── */
const Field = ({ label, icon, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
      {label}
    </label>
    <div className="relative group">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-cyan-500 transition-colors pointer-events-none">
        {icon}
      </span>
      {children}
    </div>
    {error && (
      <motion.p 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-1.5 text-rose-500 text-xs mt-1.5 font-medium"
      >
        <span className="w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
        {error}
      </motion.p>
    )}
  </div>
);

export const Login = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ── ALL ORIGINAL LOGIC — UNTOUCHED ── */
  const submitHandler = async (data) => {
    setLoading(true);
    let wakingUpToast = null;
    
    const wakingUpTimer = setTimeout(() => {
      wakingUpToast = toast.info("Backend is waking up... this might take a minute.", {
        position: "top-center",
        autoClose: false,
      });
    }, 10000);

    try {
      const res = await axiosInstance.post("/user/login", data);
      clearTimeout(wakingUpTimer);
      if (wakingUpToast) toast.dismiss(wakingUpToast);

      if (res.status === 200) {
        const user = res.data.data && res.data.data._id ? res.data.data : (res.data.user || null);
        const token = res.data.token || (res.data.data && res.data.data.token);
        const role = user?.role || res.data.role;

        const loginData = { user, token, role };
        
        if (!loginData.user || !loginData.user._id) {
          console.error("User details missing or invalid in API response:", res.data);
          toast.error("Login failed: User details not found in response.", {
            position: "top-center",
            autoClose: 3000,
          });
          return;
        }

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 2000,
        });

        dispatch(loginSuccess(loginData));
        
        if (role === "Admin") {
          navigate("/admin/admindashboard");
        } else {
          navigate("/private/userdashboard");
        }
      }
    } catch (error) {
      clearTimeout(wakingUpTimer);
      if (wakingUpToast) toast.dismiss(wakingUpToast);

      const errorMessage = error.response?.data?.message || 
                          (error.code === "ECONNABORTED" ? "Login timed out. Please try again." : "Login failed");
      
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8 bg-[var(--bg)] text-[var(--text-primary)] relative overflow-hidden transition-colors duration-300"
    >
      <ToastContainer transition={Bounce} theme="dark" />

      {/* Dynamic ambient lights */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2.5rem] overflow-hidden border border-[var(--border)] shadow-[0_32px_80px_rgba(0,0,0,0.15)] bg-[var(--surface-primary)]"
      >
        {/* ══ LEFT PANEL ══ */}
        <div
          className="hidden lg:flex flex-col justify-between bg-[var(--surface-secondary)] border-r border-[var(--border)] p-12 relative overflow-hidden"
        >
          {/* Subtle pattern or gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-600/5 pointer-events-none" />
          
          {/* Brand */}
          <div className="flex items-center gap-3.5 relative z-10">
            <div
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20"
            >
              <FiTrendingUp size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent tracking-tight">
              FinTrack
            </span>
          </div>

          {/* Content */}
          <div className="space-y-10 relative z-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">
                Master Your <br /> 
                <span className="text-cyan-500">Financial Future.</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-sm">
                Join thousands of users tracking their wealth with precision and style.
              </p>
            </div>

            <div className="space-y-5">
              {[
                {
                  icon: <FiBarChart2 size={16} />,
                  text: "Real-time spending analytics",
                  color: "text-cyan-500",
                  bg: "bg-cyan-500/10 border-cyan-500/20",
                },
                {
                  icon: <FiPieChart size={16} />,
                  text: "Smart budget management",
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10 border-emerald-500/20",
                },
                {
                  icon: <FiShield size={16} />,
                  text: "Bank-grade security standards",
                  color: "text-blue-500",
                  bg: "bg-blue-500/10 border-blue-500/20",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.bg} ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  >
                    {item.icon}
                  </div>
                  <p className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "₹2.5L+", label: "Avg. Savings" },
                { value: "99.9%", label: "Accuracy" },
                { value: "Secure", label: "Encryption" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-[var(--surface-primary)] border border-[var(--border)] rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-default"
                >
                  <p className="text-[var(--text-primary)] font-bold text-base tracking-tight">{s.value}</p>
                  <p className="text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs font-medium text-[var(--text-muted)] relative z-10 flex items-center gap-2">
            <FiCheckCircle className="text-emerald-500" />
            © 2025 FinTrack. Trusted globally.
          </p>
        </div>

        {/* ══ RIGHT: Form ══ */}
        <div className="px-8 sm:px-12 py-14 flex flex-col justify-center bg-[var(--surface-primary)]">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <FiTrendingUp size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              FinTrack
            </span>
          </div>

          {/* Header */}
          <div className="mb-10 space-y-2">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Welcome back</h2>
            <p className="text-[var(--text-secondary)] font-medium">
              Enter your details to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            <Field
              label="Email Address"
              icon={<FiMail size={16} />}
              error={errors.email?.message}
            >
              <input
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)]
                           text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm
                           focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10
                           hover:border-[var(--text-secondary)] transition-all duration-200 shadow-inner"
              />
            </Field>

            <Field
              label="Password"
              icon={<FiLock size={16} />}
              error={errors.password?.message}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password", { required: "Password is required" })}
                className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)]
                           text-[var(--text-primary)] placeholder-[var(--text-muted)] text-sm
                           focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10
                           hover:border-[var(--text-secondary)] transition-all duration-200 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]
                           hover:text-cyan-500 transition-colors p-1"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </Field>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-[var(--border)] text-cyan-500 focus:ring-cyan-500 bg-[var(--surface-secondary)]" />
                <span className="text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" size={14} className="text-xs font-semibold text-cyan-500 hover:text-cyan-600 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white text-sm mt-2
                          flex items-center justify-center gap-3 transition-all duration-300 shadow-xl
                          ${
                            loading
                              ? "bg-cyan-500/50 cursor-not-allowed"
                              : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] hover:shadow-cyan-500/25 active:scale-[0.98]"
                          }`}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="animate-spin" size={18} />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Secure Access</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <p className="text-center text-sm font-medium text-[var(--text-muted)]">
            New to FinTrack?{" "}
            <Link
              to="/signup"
              className="text-cyan-500 hover:text-cyan-600 font-bold transition-colors ml-1"
            >
              Create Your free account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
