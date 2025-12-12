import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  fetchCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categories";
import CategoryTable from "../components/CategoryTable";
import CategoryForm from "../components/CategoryForm";
import CategoryUpload from "../components/CategoryUpload";
import CategoryTree from "../components/CategoryTree";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [tree, setTree] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
    const treeData = await fetchCategoryTree();
    setTree(treeData);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async (cat) => {
    if (editing) {
      await updateCategory(editing.id, cat);
      setEditing(null);
    } else {
      await createCategory(cat);
    }
    loadCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* <CategoryUpload onSuccess={loadCategories} /> */}
      <CategoryForm
        category={editing}
        onSave={handleSave}
        categories={categories}
      />
      <h2 className="text-xl font-bold">Categories Table</h2>
      <CategoryTable
        categories={categories}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
      <h2 className="text-xl font-bold">Category Tree</h2>
      <CategoryTree tree={tree} />
    </div>
  );
};

export default CategoriesPage;
