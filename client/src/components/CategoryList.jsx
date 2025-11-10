import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Trash2, Edit3, PlusCircle } from "lucide-react";

const CategoryList = ({ onEdit }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.getCategories();
      setCategories(res);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Delete a category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting category");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="mt-6 bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">All Categories</h2>
        <button
          onClick={fetchCategories}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition"
        >
          <PlusCircle size={18} /> Refresh
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center">No categories found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition bg-gray-50"
            >
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {cat.name}
              </h3>

              {/* Subcategories */}
              {cat.subcategories && cat.subcategories.length > 0 ? (
                <div className="space-y-2 mb-3">
                  <p className="font-medium text-gray-600">Subcategories:</p>
                  {cat.subcategories.map((sub, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <img
                        src={sub.image_url}
                        alt={sub.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      <span>{sub.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic mb-3">No subcategories</p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-3">
                <button
                  onClick={() => onEdit(cat)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
