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

  // Cloudinary config
  const CLOUD_NAME = "dfaou6haj";
  const UPLOAD_PRESET = "My_Images";

  // Fetch user
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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
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
        transition={{ duration: 0.5 }}
        className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
          User Profile
        </h2>

        {/* Profile Picture */}
        <div className="flex justify-center mb-6 relative">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-blue-400 shadow-md"
            />
          ) : user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-gray-300 shadow-md"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 sm:w-28 sm:h-28 text-gray-500" />
          )}

          {isEditing && (
            <label className="absolute bottom-0 right-6 sm:right-10 bg-blue-600/80 hover:bg-blue-700 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg cursor-pointer shadow-md">
              Change
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1 text-sm sm:text-base">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-lg border text-sm sm:text-base ${
                isEditing
                  ? "bg-white/90 text-gray-900 border-blue-400 focus:ring-2 focus:ring-blue-500"
                  : "bg-white/20 text-gray-200 border-gray-500"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-lg border text-sm sm:text-base ${
                isEditing
                  ? "bg-white/90 text-gray-900 border-blue-400 focus:ring-2 focus:ring-blue-500"
                  : "bg-white/20 text-gray-200 border-gray-500"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1 text-sm sm:text-base">
              Bio
            </label>
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border resize-none text-sm sm:text-base ${
                isEditing
                  ? "bg-white/90 text-gray-900 border-blue-400 focus:ring-2 focus:ring-blue-500"
                  : "bg-white/20 text-gray-200 border-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end mt-6 gap-3">
          {!isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="px-4 sm:px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md text-sm sm:text-base"
            >
              Edit
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsEditing(false);
                  setPreview(null);
                  setSelectedFile(null);
                }}
                className="px-4 sm:px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-md text-sm sm:text-base"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="px-4 sm:px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md text-sm sm:text-base"
              >
                Save
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
