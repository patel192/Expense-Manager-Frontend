import React from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../Utils/axiosInstance";
export const Reports = () => {
  const { user } = useAuth();
  const userId = user?._id;
  const downloadReport = async () => {
    const response = await axiosInstance.get(`/reports/${userId}`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "financial-report.pdf");
    document.body.appendChild(link);
    link.click();
  };
  return (
    <div>
      <button
        onClick={downloadReport}
        className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600"
      >
        Download Financial Report
      </button>
    </div>
  );
};
