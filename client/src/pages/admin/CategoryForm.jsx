import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCategory, editCategory } from "../../redux/slices/categorySlice";
import ImageUpload from "../../components/ImageUpload";
import { v4 as uuidv4 } from "uuid";

// Recursive Subcategory Form
const SubcategoryForm = ({
  subcategory,
  handleSubcategoryChange,
  handleAddNested,
  handleRemoveSubcategory,
}) => {
  return (
    <div className="border p-2 rounded space-y-2 ml-4">
      <input
        type="text"
        value={subcategory.name}
        onChange={(e) =>
          handleSubcategoryChange(subcategory.id, "name", e.target.value)
        }
        placeholder="Subcategory Name"
        className="w-full border p-2 rounded"
      />
      <ImageUpload
        image={subcategory.image}
        setImage={(img) =>
          handleSubcategoryChange(subcategory.id, "image", img)
        }
      />
      <div className="flex gap-2">
        <button
          type="button"
          className="text-blue-500"
          onClick={() => handleAddNested(subcategory.id)}
        >
          Add Nested
        </button>
        <button
          type="button"
          className="text-red-500"
          onClick={() => handleRemoveSubcategory(subcategory.id)}
        >
          Remove
        </button>
      </div>

      {/* Render nested subcategories recursively */}
      {subcategory.subcategories?.map((sub) => (
        <SubcategoryForm
          key={sub.id}
          subcategory={sub}
          handleSubcategoryChange={handleSubcategoryChange}
          handleAddNested={handleAddNested}
          handleRemoveSubcategory={handleRemoveSubcategory}
        />
      ))}
    </div>
  );
};

// Main Category Form
export default function CategoryForm({ category: initialCategory }) {
  const dispatch = useDispatch();
  const [category, setCategory] = useState({
    name: initialCategory?.name || "",
    image: initialCategory?.image || null,
    subcategories: initialCategory?.subcategories || [],
    id: initialCategory?.id || null,
  });

  // Recursive update for nested subcategories
  const updateSubcategoryById = (nodes, id, field, value) =>
    nodes.map((node) => {
      if (node.id === id) return { ...node, [field]: value };
      if (node.subcategories?.length > 0) {
        return {
          ...node,
          subcategories: updateSubcategoryById(
            node.subcategories,
            id,
            field,
            value
          ),
        };
      }
      return node;
    });

  const handleSubcategoryChange = (id, field, value) => {
    const updatedSubcategories = updateSubcategoryById(
      category.subcategories,
      id,
      field,
      value
    );
    setCategory({ ...category, subcategories: updatedSubcategories });
  };

  const addNestedSubcategory = (nodes, parentId) =>
    nodes.map((node) => {
      if (node.id === parentId) {
        const newSub = {
          id: uuidv4(),
          name: "",
          image: null,
          subcategories: [],
        };
        return { ...node, subcategories: [...node.subcategories, newSub] };
      }
      if (node.subcategories?.length > 0) {
        return {
          ...node,
          subcategories: addNestedSubcategory(node.subcategories, parentId),
        };
      }
      return node;
    });

  const handleAddNested = (parentId) => {
    setCategory({
      ...category,
      subcategories: addNestedSubcategory(category.subcategories, parentId),
    });
  };

  const handleAddSubcategory = () => {
    const newSub = { id: uuidv4(), name: "", image: null, subcategories: [] };
    setCategory({
      ...category,
      subcategories: [...category.subcategories, newSub],
    });
  };

  const removeSubcategoryById = (nodes, id) =>
    nodes
      .filter((node) => node.id !== id)
      .map((node) => ({
        ...node,
        subcategories: node.subcategories
          ? removeSubcategoryById(node.subcategories, id)
          : [],
      }));

  const handleRemoveSubcategory = (id) => {
    setCategory({
      ...category,
      subcategories: removeSubcategoryById(category.subcategories, id),
    });
  };

  // Handle submit with recursive image uploads
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", category.name);
    if (category.image) formData.append("image", category.image);

    const appendSubcatImages = (subs) => {
      subs.forEach((sub) => {
        if (sub.image instanceof File)
          formData.append("subcat_images", sub.image, sub.image.name);
        if (sub.subcategories?.length > 0)
          appendSubcatImages(sub.subcategories);
      });
    };
    appendSubcatImages(category.subcategories);

    const serializeSubcats = (subs) =>
      subs.map((sub) => ({
        ...sub,
        temp_filename:
          sub.image instanceof File ? sub.image.name : sub.image || "",
        subcategories: sub.subcategories
          ? serializeSubcats(sub.subcategories)
          : [],
      }));

    formData.append(
      "subcategories",
      JSON.stringify(serializeSubcats(category.subcategories))
    );

    if (category.id)
      dispatch(editCategory({ id: category.id, data: formData }));
    else dispatch(addCategory(formData));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow-md"
    >
      <input
        type="text"
        value={category.name}
        onChange={(e) => setCategory({ ...category, name: e.target.value })}
        placeholder="Category Name"
        className="w-full border p-2 rounded"
      />
      <ImageUpload
        image={category.image}
        setImage={(img) => setCategory({ ...category, image: img })}
      />

      <div className="space-y-2">
        <h2 className="font-semibold">Subcategories</h2>
        {category.subcategories.map((sub) => (
          <SubcategoryForm
            key={sub.id}
            subcategory={sub}
            handleSubcategoryChange={handleSubcategoryChange}
            handleAddNested={handleAddNested}
            handleRemoveSubcategory={handleRemoveSubcategory}
          />
        ))}
        <button
          type="button"
          className="text-blue-500"
          onClick={handleAddSubcategory}
        >
          Add Subcategory
        </button>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {category.id ? "Update" : "Create"}
      </button>
    </form>
  );
}
