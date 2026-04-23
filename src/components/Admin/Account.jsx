import { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCamera,
  FiUser,
  FiMail,
  FiEdit2,
  FiCheck,
  FiX,
  FiShield,
  FiInfo,
  FiSave,
  FiRefreshCw,
  FiSettings,
  FiMapPin,
  FiCpu,
} from "react-icons/fi";

export const Account = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    profilePic: "",
    role: "User"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const CLOUD_NAME = "dfaou6haj";
  const UPLOAD_PRESET = "My_Images";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/user/${userId}`);
        setUser(res.data.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const showMsg = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let uploadedImageUrl = user.profilePic;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        const uploadRes = await axiosInstance.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );
        uploadedImageUrl = uploadRes.data.secure_url;
      }

      const res = await axiosInstance.put(`/user/${userId}`, {
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePic: uploadedImageUrl,
      });

      setUser(res.data.data);
      setPreview(null);
      setSelectedFile(null);
      setIsEditing(false);
      showMsg("Protocol update successful");
    } catch (err) {
      console.error("Error saving profile:", err);
      showMsg("Vector update failure", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20 text-[var(--text-primary)]"
    >
      {/* ══ IDENTITY HEADER ══ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent uppercase tracking-tighter">
            System Identity
          </h1>
          <p className="text-sm font-bold text-[var(--text-muted)] mt-1 uppercase tracking-[0.2em]">
            Credential Management & Sector Configuration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse ring-4 ring-cyan-500/20" />
            OPERATIONAL SESSION
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── VECTOR CARD ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="relative p-10 rounded-[2.5rem] bg-[var(--surface-primary)] border border-[var(--border)] shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-700" />

            <div className="relative flex flex-col items-center text-center">
              {/* Profile Visual */}
              <div className="relative group mb-8">
                <div className="w-40 h-40 rounded-[3rem] p-1.5 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-700 shadow-2xl relative z-10">
                  {preview ? (
                    <img src={preview} className="w-full h-full rounded-[2.8rem] object-cover border-4 border-[var(--surface-primary)]" alt="Preview" />
                  ) : user.profilePic ? (
                    <img src={user.profilePic} className="w-full h-full rounded-[2.8rem] object-cover border-4 border-[var(--surface-primary)]" alt="Profile" />
                  ) : (
                    <div className="w-full h-full rounded-[2.8rem] bg-[var(--surface-secondary)] border-4 border-[var(--surface-primary)] flex items-center justify-center">
                      <FiUser size={56} className="text-[var(--text-muted)]" />
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.label
                      initial={{ scale: 0, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0, rotate: 45 }}
                      className="absolute -bottom-3 -right-3 w-12 h-12 bg-[var(--surface-primary)] border border-[var(--border)] text-cyan-500 rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer hover:bg-cyan-500 hover:text-white transition-all z-20 hover:scale-110"
                    >
                      <FiCamera size={20} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </motion.label>
                  )}
                </AnimatePresence>
                
                {/* Decorative Elements */}
                <div className="absolute -inset-4 border border-dashed border-cyan-500/20 rounded-[3.5rem] pointer-events-none group-hover:rotate-45 transition-transform duration-1000" />
              </div>

              <div className="space-y-2 mb-8">
                <h2 className="text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">{user.name || "UNIDENTIFIED"}</h2>
                <div className="flex items-center gap-2 justify-center text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                  <FiMail size={12} className="text-cyan-500" />
                  {user.email}
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[var(--surface-secondary)]/50 border border-[var(--border)] mb-10 shadow-inner">
                <FiShield size={12} className="text-cyan-500" />
                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">{user.role || "User"} NODE</span>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-4 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-black uppercase tracking-widest hover:bg-[var(--surface-tertiary)] hover:border-cyan-500/30 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                >
                  <FiEdit2 size={16} className="text-cyan-500 group-hover:rotate-12 transition-transform" />
                  Modify Credentials
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-cyan-500/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {loading ? <FiRefreshCw className="animate-spin" size={16} /> : <FiCheck size={16} />}
                    DEPLOY
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setPreview(null); }}
                    className="py-4 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-muted)] text-xs font-black uppercase tracking-widest hover:bg-[var(--surface-tertiary)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <FiX size={16} />
                    ABORT
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/10 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <FiCpu size={64} />
            </div>
            <div className="flex items-start gap-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 flex-shrink-0 shadow-inner">
                <FiInfo size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-widest mb-1.5">Encryption Protocol</h4>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest leading-loose">Credential matrix is secured via AES-256 protocols. Rotate access markers every 90 cycles for maximum system integrity.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── ATTRIBUTE FORMS ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 p-10 sm:p-12 rounded-[2.5rem] bg-[var(--surface-primary)] border border-[var(--border)] shadow-2xl backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-500/5 blur-[100px] pointer-events-none" />

          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] flex items-center justify-center shadow-inner">
              <FiSettings size={20} className="text-cyan-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest">Global Configurations</h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Core Data Matrix</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Legal Designation</label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-cyan-500 transition-colors z-10 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    disabled={!isEditing}
                    onChange={handleChange}
                    placeholder="Enter name..."
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Primary Comm Link</label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-cyan-500 transition-colors z-10 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    disabled={!isEditing}
                    onChange={handleChange}
                    placeholder="link@system.tech"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Personal Narrative Matrix</label>
              <div className="relative group">
                <textarea
                  name="bio"
                  rows={6}
                  value={user.bio}
                  disabled={!isEditing}
                  onChange={handleChange}
                  placeholder="Define your operational objectives and system role..."
                  className="w-full px-6 py-5 rounded-[2rem] bg-[var(--surface-secondary)]/50 border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-300 text-sm resize-none disabled:opacity-50"
                />
                <div className="absolute bottom-4 right-4 text-cyan-500/20 group-focus-within:text-cyan-500/40 pointer-events-none">
                  <FiMapPin size={24} />
                </div>
              </div>
            </div>

            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-cyan-500/5 border border-cyan-500/10 shadow-inner"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                    <FiRefreshCw className="animate-spin-slow" />
                  </div>
                  <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest italic animate-pulse">Pending sync sequence detected</p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <FiSave size={16} />
                  COMMIT CHANGES
                </button>
              </motion.div>
            )}

            {/* ALERT SYSTEM */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 border
                             ${message.type === 'error' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-xl shadow-rose-500/5' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-xl shadow-emerald-500/5'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${message.type === 'error' ? 'bg-rose-500/20 border-rose-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
                    {message.type === 'error' ? <FiX size={14} /> : <FiCheck size={14} />}
                  </div>
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};


