import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useParams } from "react-router-dom";
import { FaCamera, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export const Account = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    profilePic: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const CLOUD_NAME = "dfaou6haj";
  const UPLOAD_PRESET = "My_Images";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(`/user/${userId}`);
        setUser(res.data.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
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
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e12] via-[#0f1115] to-[#0b0c10] text-white px-4 py-8 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-10"
      >
        {/* HEADER */}
        <h2 className="text-3xl font-semibold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent text-center">
          Account Settings
        </h2>
        <p className="text-gray-400 text-center mt-1 mb-10">
          Update your profile, personal info, and account details.
        </p>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* LEFT SIDE — PROFILE CARD */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg"
          >
            {/* Avatar */}
            <div className="relative group">
              {preview ? (
                <img
                  src={preview}
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-xl"
                  alt="Preview"
                />
              ) : user.profilePic ? (
                <img
                  src={user.profilePic}
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-xl"
                  alt="Profile"
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-gray-500" />
              )}

              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 shadow-lg transition-all">
                  <FaCamera size={18} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>

            {/* Name + Email */}
            <h3 className="text-xl font-semibold mt-4">{user.name}</h3>
            <p className="text-gray-400 text-sm">{user.email}</p>

            <div className="mt-4 flex flex-col gap-3 w-full">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-md hover:opacity-90 transition-all"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 shadow-md hover:opacity-90 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setPreview(null);
                      setSelectedFile(null);
                    }}
                    className="w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* RIGHT SIDE — FORM */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6 text-purple-300">Personal Information</h3>

            {/* Fields */}
            <div className="space-y-6">
              {["name", "email"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 text-gray-300 capitalize">{field}</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    disabled={!isEditing}
                    value={user[field]}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg text-sm border ${
                      isEditing
                        ? "bg-white text-gray-900 border-purple-400 focus:ring-2 focus:ring-purple-500"
                        : "bg-white/5 text-gray-300 border-white/10"
                    }`}
                  />
                </div>
              ))}

              {/* Bio */}
              <div>
                <label className="block mb-1 text-gray-300">Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  disabled={!isEditing}
                  value={user.bio}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg text-sm border resize-none ${
                    isEditing
                      ? "bg-white text-gray-900 border-purple-400 focus:ring-2 focus:ring-purple-500"
                      : "bg-white/5 text-gray-300 border-white/10"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
