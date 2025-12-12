import React, { useState } from "react";
import { uploadCategories } from "../api/categories";

const CategoryUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    setLoading(true);
    try {
      await uploadCategories(file);
      alert("Upload successful!");
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg space-y-3">
      <h2 className="text-xl font-bold">Upload Categories (CSV/XLSX)</h2>
      <input
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default CategoryUpload;
