import React from "react";
import { useCategories } from "../../hooks/useCategories";
import CoverflowManager from "../../components/CoverflowManager";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function CategoryCoverflow() {
  const { categories, loading, error } = useCategories();

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const dummyCategories = [
    {
      id: 1,
      name: "Electronics",
      image: "https://via.placeholder.com/150",
      subcategories: [],
    },
    {
      id: 2,
      name: "Clothing",
      image: "https://via.placeholder.com/150",
      subcategories: [],
    },
  ];
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <CoverflowManager categories={dummyCategories} />
    </div>
  );
}
