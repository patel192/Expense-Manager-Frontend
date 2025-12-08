import React, { useState, useEffect } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
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
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-wide">
            Account Settings
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Manage your personal information and profile photo.
          </p>
        </div>

        {/* Profile Picture */}
        <div className="flex justify-center mb-8 relative">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-cyan-400 shadow-lg"
            />
          ) : user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-purple-400 shadow-lg"
            />
          ) : (
            <FaUserCircle className="w-28 h-28 sm:w-32 sm:h-32 text-gray-500" />
          )}

          {isEditing && (
            <label className="absolute bottom-2 right-10 sm:right-16 bg-cyan-600/80 hover:bg-cyan-700 text-white px-3 py-1.5 text-xs rounded-lg cursor-pointer shadow-md transition-all">
              Change
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-5">
          {["name", "email", "bio"].map((field) => (
            <div key={field}>
              <label className="block text-gray-300 mb-1 text-sm capitalize">
                {field === "bio" ? "Bio" : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {field === "bio" ? (
                <textarea
                  name="bio"
                  value={user.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border resize-none text-sm ${
                    isEditing
                      ? "bg-white/90 text-gray-900 border-cyan-400 focus:ring-2 focus:ring-cyan-500"
                      : "bg-white/10 text-gray-200 border-gray-600"
                  }`}
                />
              ) : (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={user[field]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isEditing
                      ? "bg-white/90 text-gray-900 border-cyan-400 focus:ring-2 focus:ring-cyan-500"
                      : "bg-white/10 text-gray-200 border-gray-600"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end mt-8 gap-3 sm:gap-4">
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg shadow-md hover:shadow-cyan-500/30 transition-all"
            >
              Edit Profile
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setIsEditing(false);
                  setPreview(null);
                  setSelectedFile(null);
                }}
                className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-green-500/30 transition-all"
              >
                Save Changes
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
