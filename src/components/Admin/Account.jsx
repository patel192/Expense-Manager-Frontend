import  { useState, useEffect } from "react";
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
  FiRefreshCw
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
      showMsg("Profile updated successfully");
    } catch (err) {
      console.error("Error saving profile:", err);
      showMsg("Failed to save changes", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-[var(--border)] text-gray-200 placeholder-gray-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] mb-2">
            Identity <span className="text-cyan-400">Hub</span>
          </h1>
          <p className="text-[var(--muted)] text-sm max-w-md">
            Manage your personal credentials, profile aesthetics, and security protocols in a unified environment.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Authenticated Session
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT PANEL: PROFILE CARD */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-6"
        >
          <div className="relative p-8 rounded-[2rem] bg-[#0d0f14]/80 border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[80px]" />
            
            <div className="relative flex flex-col items-center text-center">
              {/* Avatar Container */}
              <div className="relative group mb-6">
                <div className="w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-2xl">
                  {preview ? (
                    <img src={preview} className="w-full h-full rounded-full object-cover border-4 border-[#0b0c10]" alt="Preview" />
                  ) : user.profilePic ? (
                    <img src={user.profilePic} className="w-full h-full rounded-full object-cover border-4 border-[#0b0c10]" alt="Profile" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-900 border-4 border-[#0b0c10] flex items-center justify-center">
                      <FiUser size={48} className="text-gray-700" />
                    </div>
                  )}
                </div>
                
                <AnimatePresence>
                  {isEditing && (
                    <motion.label 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-cyan-500 text-[var(--text)] rounded-xl shadow-xl flex items-center justify-center cursor-pointer hover:bg-cyan-600 transition-colors border border-[var(--border)]"
                    >
                      <FiCamera size={18} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </motion.label>
                  )}
                </AnimatePresence>
              </div>

              <h2 className="text-2xl font-bold text-[var(--text)] mb-1">{user.name || "System Identity"}</h2>
              <p className="text-[var(--muted)] text-sm mb-6 flex items-center gap-1.5 justify-center">
                <FiMail size={12} />
                {user.email}
              </p>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[var(--border)] mb-8">
                <FiShield size={10} className="text-cyan-400" />
                <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tighter">{user.role || "User"} Privilege</span>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3.5 rounded-2xl bg-white/5 border border-[var(--border)] text-[var(--text)] text-sm font-semibold hover:bg-white/10 hover:border-cyan-500/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <FiEdit2 size={16} className="text-[var(--muted)] group-hover:text-cyan-400" />
                  Edit Credentials
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="py-3.5 rounded-2xl bg-cyan-500 text-[var(--text)] text-sm font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <FiRefreshCw className="animate-spin" /> : <FiCheck />}
                    Save
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setPreview(null); }}
                    className="py-3.5 rounded-2xl bg-white/5 border border-[var(--border)] text-gray-300 text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                  >
                    <FiX />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 to-blue-600/5 border border-cyan-500/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <FiInfo size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[var(--text)] mb-1">Security Snapshot</h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">Your account uses enterprise-grade encryption. Ensure your password is updated every 90 cycles for maximum integrity.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT PANEL: DETAILS FORM */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 p-8 sm:p-10 rounded-[2rem] bg-[#0d0f14]/50 border border-white/5 shadow-2xl backdrop-blur-md relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          
          <h3 className="text-xl font-bold text-[var(--text)] mb-8 flex items-center gap-3">
            <FiUser className="text-cyan-400" />
            Core Attributes
          </h3>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest pl-1">Legal Name</label>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    disabled={!isEditing}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest pl-1">Primary Email</label>
                <div className="relative group">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    disabled={!isEditing}
                    onChange={handleChange}
                    placeholder="name@organization.com"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-widest pl-1">Personal Narrative</label>
              <textarea
                name="bio"
                rows={6}
                value={user.bio}
                disabled={!isEditing}
                onChange={handleChange}
                placeholder="Share a brief overview of your system role and objectives..."
                className="w-full px-5 py-4 rounded-3xl bg-white/5 border border-white/5 text-gray-200 placeholder-gray-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-all outline-none text-sm resize-none disabled:opacity-50"
              />
            </div>

            {isEditing && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-end gap-4 p-4 rounded-2xl bg-cyan-400/5 border border-cyan-400/10"
              >
                <p className="text-xs text-cyan-400/80 italic mr-auto">Pending changes detected in taxonomy cache</p>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 text-[var(--text)] text-xs font-bold hover:bg-cyan-600 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <FiSave />
                  COMMIT CHANGES
                </button>
              </motion.div>
            )}

            {/* MESSAGE TOAST */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`p-4 rounded-xl text-xs font-bold ${message.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}
                >
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Account;
