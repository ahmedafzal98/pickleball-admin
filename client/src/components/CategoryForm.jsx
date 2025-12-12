import React, { useState, useEffect } from "react";

const CategoryForm = ({ category = {}, onSave, categories }) => {
  const [name, setName] = useState(category?.name || "");
  const [parent, setParent] = useState(category?.parent ?? "");

  // Update form state whenever category prop changes
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
      className="space-y-3 p-4 bg-white shadow rounded-lg"
    >
      <h2 className="text-lg font-bold">
        {category?.id ? "Edit Category" : "Add Category"}
      </h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full"
        required
      />
      <select
        value={parent ?? ""}
        onChange={(e) => setParent(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">No Parent</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Save
      </button>
    </form>
  );
};

export default CategoryForm;
