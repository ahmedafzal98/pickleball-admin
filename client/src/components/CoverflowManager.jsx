import { useState } from "react";
import CategoryCard from "./CategoryCard";
import ProductLayer from "../pages/user/ProductLayer";

export default function CoverflowManager({ categories }) {
  const [currentLayer, setCurrentLayer] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryClick = (category) => {
    setSelectedCategories([...selectedCategories, category]);
    setCurrentLayer((prev) => prev + 1);
  };

  // Get the categories to display for the current layer
  const getCurrentLayerCategories = () => {
    if (currentLayer === 1) return categories;
    const parent = selectedCategories[currentLayer - 2]; // parent of current layer
    return parent?.subcategories || [];
  };

  return (
    <div className="space-y-6">
      {/* Layers 1-3: show categories */}
      {currentLayer <= 3 && (
        <div className="flex overflow-x-auto space-x-4">
          {getCurrentLayerCategories().map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      )}

      {/* Layer 4: Products */}
      {currentLayer === 4 && selectedCategories[2] && (
        <ProductLayer category={selectedCategories[2]} />
      )}
    </div>
  );
}
