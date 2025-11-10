import React, { useState, useEffect } from "react";
import api from "../api/api";

const CategoryForm = ({ editingCategory, onSuccess, onCancel }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize form if editing
  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setSubcategories(editingCategory.subcategories || []);
      setPreview(editingCategory.image_url);
    } else {
      resetForm();
    }
  }, [editingCategory]);

  const resetForm = () => {
    setName("");
    setImage(null);
    setPreview(null);
    setSubcategories([]);
  };

  // Add a blank subcategory
  const handleAddSubcategory = () => {
    setSubcategories([
      ...subcategories,
      { name: "", image: null, preview: null },
    ]);
  };

  // Update subcategory field
  const handleSubcategoryChange = (index, field, value) => {
    const updated = [...subcategories];
    updated[index][field] = value;
    setSubcategories(updated);
  };

  // Handle file input preview
  const handleImageChange = (e, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    if (index === null) {
      setImage(file);
      setPreview(url);
    } else {
      const updated = [...subcategories];
      updated[index].image = file;
      updated[index].preview = url;
      setSubcategories(updated);
    }
  };

  // Remove a subcategory
  const removeSubcategory = (index) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      if (image) formData.append("categoryImage", image);

      // Append subcategories as JSON string WITHOUT images
      const subcategoriesData = subcategories.map(({ name, preview }) => ({
        name,
        preview,
      }));
      formData.append("subcategories", JSON.stringify(subcategoriesData));

      // Append each subcategory image separately
      subcategories.forEach((sub, index) => {
        if (sub.image) {
          formData.append("subcategoryImages", sub.image);
        }
      });

      if (editingCategory) {
        // First, update the category itself
        await api.updateCategory(editingCategory._id, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Then, update each subcategory
        for (const sub of subcategories) {
          const payload = new FormData();
          if (sub.name) payload.append("name", sub.name);
          if (sub.image) payload.append("subcategoryImage", sub.image);

          await api.updateSubcategory(editingCategory._id, sub._id, payload);
        }
      } else {
        await api.createCategory(formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert(
        editingCategory
          ? "Category updated successfully!"
          : "Category created successfully!"
      );
      resetForm();
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {editingCategory ? "Edit Category" : "Add New Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category Name */}
        <div>
          <label className="block text-gray-700 mb-1">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
          />
        </div>

        {/* Category Image */}
        <div>
          <label className="block text-gray-700 mb-1">Category Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-gray-700"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg mt-2 border"
            />
          )}
        </div>

        {/* Subcategories */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-700 font-medium">Subcategories</label>
            <button
              type="button"
              onClick={handleAddSubcategory}
              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
            >
              + Add Subcategory
            </button>
          </div>

          {subcategories.map((sub, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 mb-3 bg-gray-50 space-y-2"
            >
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={sub.name}
                  onChange={(e) =>
                    handleSubcategoryChange(index, "name", e.target.value)
                  }
                  placeholder="Subcategory Name"
                  className="w-2/3 border px-3 py-2 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeSubcategory(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
              />
              {sub.preview && (
                <img
                  src={sub.preview}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg border mt-2 object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {editingCategory && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                onCancel();
              }}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Saving..."
              : editingCategory
              ? "Update Category"
              : "Add Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
