import React, { useState } from "react";
import CategoryForm from "../components/CategoryForm";
import CategoryList from "../components/CategoryList";

const Home = () => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [reload, setReload] = useState(false);

  // Trigger reload for CategoryList
  const handleSuccess = () => {
    setReload(!reload);
    setEditingCategory(null);
  };

  console.log(editingCategory);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          🛍️ Category Management Panel
        </h1>

        {/* Form Section */}
        <CategoryForm
          editingCategory={editingCategory}
          onSuccess={handleSuccess}
          onCancel={() => setEditingCategory(null)}
        />

        {/* List Section */}
        <CategoryList
          key={reload} // Forces re-render on reload toggle
          onEdit={(category) => setEditingCategory(category)}
        />
      </div>
    </div>
  );
};

export default Home;
