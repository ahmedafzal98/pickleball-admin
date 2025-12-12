import React, { useState, useEffect } from "react";

const CategoryForm = ({ category = {}, onSave, categories }) => {
  const [name, setName] = useState(category?.name || "");
  const [parent, setParent] = useState(category?.parent ?? "");

  useEffect(() => {
    setName(category?.name || "");
    setParent(category?.parent ?? "");
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, parent: parent === "" ? null : Number(parent) });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-6 bg-white shadow-lg rounded-xl max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-700 border-b pb-2 mb-4">
        {category?.id ? "Edit Category" : "Add Category"}
      </h2>

      {/* Name Input */}
      <div className="relative">
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        />
        <label
          htmlFor="name"
          className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-600 peer-focus:text-sm"
        >
          Category Name
        </label>
      </div>

      {/* Parent Dropdown */}
      <div className="relative">
        <select
          value={parent ?? ""}
          onChange={(e) => setParent(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        >
          <option value="">No Parent</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Save Button */}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold shadow hover:bg-green-700 hover:shadow-lg transition"
      >
        {category?.id ? "Update Category" : "Add Category"}
      </button>
    </form>
  );
};

export default CategoryForm;
