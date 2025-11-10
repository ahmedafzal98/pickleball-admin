import React, { useState } from "react";
import Header from "../components/Header";
import CategoryCard from "../components/CategoryCard";
import CategoryDrawer from "../components/Drawer/CategoryDrawer";
import SubcategoryDrawer from "../components/Drawer/SubcategoryDrawer";
import Toast from "../components/Toast";

function sampleData() {
  return [
    {
      id: "c-1",
      title: "Rackets",
      description: "All rackets",
      image: null,
      subcategories: [
        { id: "s-1", title: "Beginner Rackets", image: null },
        { id: "s-2", title: "Pro Rackets", image: null },
      ],
    },
    {
      id: "c-2",
      title: "Balls",
      description: "Pickleball balls",
      image: null,
      subcategories: [
        { id: "s-3", title: "Indoor Balls", image: null },
        { id: "s-4", title: "Outdoor Balls", image: null },
      ],
    },
  ];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(sampleData());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [subOpen, setSubOpen] = useState(false);
  const [subParent, setSubParent] = useState(null);
  const [toast, setToast] = useState(null);

  function handleAddCategory() {
    setEditing(null);
    setDrawerOpen(true);
  }
  function handleEditCategory(cat) {
    setEditing(cat);
    setDrawerOpen(true);
  }

  function handleSaveCategory(payload) {
    if (editing) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                title: payload.title,
                description: payload.description,
                image: payload.image,
              }
            : c
        )
      );
      setToast("Category updated");
    } else {
      const newCat = {
        id: `c-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        image: payload.image,
        subcategories: [],
      };
      setCategories((prev) => [newCat, ...prev]);
      setToast("Category created");
    }
    setDrawerOpen(false);
  }

  function handleDeleteCategory(id) {
    if (!window.confirm("Delete this category?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setToast("Category deleted");
  }

  function handleAddSub(parent) {
    setSubParent(parent);
    setSubOpen(true);
  }
  function handleSaveSub(payload) {
    const newSub = {
      id: `s-${Date.now()}`,
      title: payload.title,
      image: payload.image,
    };
    setCategories((prev) =>
      prev.map((c) =>
        c.id === subParent.id
          ? { ...c, subcategories: [...c.subcategories, newSub] }
          : c
      )
    );
    setSubOpen(false);
    setToast("Subcategory added");
  }

  function handleDeleteSub(catId, subId) {
    if (!window.confirm("Delete this subcategory?")) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId
          ? {
              ...c,
              subcategories: c.subcategories.filter((s) => s.id !== subId),
            }
          : c
      )
    );
    setToast("Subcategory deleted");
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Manage Categories" onAdd={handleAddCategory} />
      <main className="flex-1 overflow-auto p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No categories yet. Click Add to create one.
            </div>
          )}
          {categories.map((cat) => (
            <div key={cat.id}>
              <CategoryCard
                category={cat}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onAddSub={(c) => handleAddSub(c)}
              />
              <div className="mt-2 text-sm text-gray-500">
                {cat.subcategories.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-2 py-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                        {s.image ? (
                          <img
                            src={s.image}
                            alt={s.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-xs text-gray-400">No image</div>
                        )}
                      </div>
                      <div>{s.title}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteSub(cat.id, s.id)}
                      className="text-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <CategoryDrawer
        isOpen={drawerOpen}
        initial={editing}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSaveCategory}
      />
      <SubcategoryDrawer
        isOpen={subOpen}
        parent={subParent}
        onClose={() => setSubOpen(false)}
        onSave={handleSaveSub}
      />
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
