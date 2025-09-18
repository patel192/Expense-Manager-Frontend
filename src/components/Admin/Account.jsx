import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { Token } from "@mui/icons-material";

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

  // Save profile (upload to Cloudinary first if file selected)
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      {/* Profile Picture */}
      <div className="flex justify-center mb-6 relative">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-400"
          />
        ) : user.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
        ) : (
          <FaUserCircle className="w-24 h-24 text-gray-400" />
        )}

        {isEditing && (
          <label className="absolute bottom-0 right-10 bg-gray-700 text-white px-2 py-1 text-xs rounded cursor-pointer">
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
          <label className="block text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-2 border rounded-md ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        <div>
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-2 border rounded-md ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>

        <div>
          <label className="block text-gray-600">Bio</label>
          <textarea
            name="bio"
            value={user.bio}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-2 border rounded-md ${
              isEditing ? "bg-white" : "bg-gray-100"
            }`}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-6 space-x-3">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                setIsEditing(false);
                setPreview(null);
                setSelectedFile(null);
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
};
