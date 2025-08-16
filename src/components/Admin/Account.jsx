import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
export const Account = () => {
    const { userId } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    profilePic: "", // profile picture URL
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/user/${userId}`);
        setUser(res.data.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle profile pic selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Save updates (including profile pic)
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("bio", user.bio);

      if (selectedFile) {
        formData.append("profilePic", selectedFile);
      }

      await axios.put(`http://localhost:3001/api/user/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>

      {/* Profile Picture Section */}
      <div className="flex justify-center mb-6 relative">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
        ) : (
          <FaUserCircle className="w-24 h-24 text-gray-400" />
        )}

        {/* Upload button overlay */}
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

      {/* Profile Details */}
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

      {/* Action Buttons */}
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
              onClick={() => setIsEditing(false)}
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
