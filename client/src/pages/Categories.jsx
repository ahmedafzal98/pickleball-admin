import React, { useContext, useState } from "react";
import { CategoryContext } from "../context/CategoryContext";
import CategoryTable from "../components/CategoryTable";
import CategoryModal from "../components/Modal";

const Categories = () => {
  const {
    categories,
    addCategory,
    editCategory,
    deleteCategory,
    addSubcategory,
    deleteSubcategory,
  } = useContext(CategoryContext);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [parentId, setParentId] = useState(null);

  const handleAdd = () => {
    setEditData(null);
    setParentId(null);
    setModalOpen(true);
  };

  const handleAddSub = (categoryId) => {
    setEditData(null);
    setParentId(categoryId);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setModalOpen(true);
  };

  const handleSave = (data) => {
    if (parentId) addSubcategory(parentId, data);
    else if (editData) editCategory(data);
    else addCategory(data);
    setModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Manage Categories
          </h1>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            + Add Category
          </button>
        </div>

        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={deleteCategory}
          onAddSub={handleAddSub}
          onDeleteSub={deleteSubcategory}
        />

        {modalOpen && (
          <CategoryModal
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
            editData={editData}
          />
        )}
      </div>
    </div>
  );
};

export default Categories;
