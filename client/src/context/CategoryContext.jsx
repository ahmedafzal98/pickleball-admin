import React, { createContext, useState } from "react";
import toast from "react-hot-toast";

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Technology",
      image: "https://via.placeholder.com/100",
      subcategories: [
        { id: 11, name: "AI Tools", image: "https://via.placeholder.com/80" },
        { id: 12, name: "Web Dev", image: "https://via.placeholder.com/80" },
      ],
    },
    {
      id: 2,
      name: "Health",
      image: "https://via.placeholder.com/100",
      subcategories: [
        { id: 21, name: "Nutrition", image: "https://via.placeholder.com/80" },
      ],
    },
  ]);

  // === CRUD OPERATIONS ===
  const addCategory = (newCat) => {
    setCategories((prev) => [
      ...prev,
      { ...newCat, id: Date.now(), subcategories: [] },
    ]);
    toast.success("Category added!");
  };

  const editCategory = (updatedCat) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updatedCat.id ? updatedCat : cat))
    );
    toast.success("Category updated!");
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    toast.success("Category deleted!");
  };

  const addSubcategory = (categoryId, sub) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: [...cat.subcategories, { ...sub, id: Date.now() }],
            }
          : cat
      )
    );
    toast.success("Subcategory added!");
  };

  const deleteSubcategory = (categoryId, subId) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.filter((s) => s.id !== subId),
            }
          : cat
      )
    );
    toast.success("Subcategory deleted!");
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        editCategory,
        deleteCategory,
        addSubcategory,
        deleteSubcategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
