import React, { useState } from "react";
import { Edit2, Trash2, Upload, ChevronDown, ChevronUp } from "lucide-react";

export default function CategoryCard({
  category,
  onEdit,
  onDelete,
  onAddSub,
  onDeleteSub,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Category Header */}
      <div className="p-5 flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Category Image */}
          <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
            {category.image ? (
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400 font-medium">No Img</span>
            )}
          </div>

          {/* Category Info */}
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {category.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {category.description || "No description"}
            </p>

            {/* Subcategory Chips */}
            {category.subcategories.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {category.subcategories.slice(0, 4).map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-1 bg-gray-50 border border-gray-200 text-xs rounded-full text-gray-600"
                  >
                    {s.title}
                  </span>
                ))}
                {category.subcategories.length > 4 && (
                  <span className="px-2 py-1 bg-gray-50 border border-gray-200 text-xs rounded-full text-gray-500">
                    +{category.subcategories.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition"
          >
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            onClick={() => onEdit(category)}
            className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition"
          >
            <Edit2 size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 text-red-600 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Subcategories Section */}
      {open && (
        <div className="border-t border-gray-100 bg-gray-50 p-5 animate-slideDown">
          {category.subcategories.length === 0 ? (
            <p className="text-sm text-gray-500 mb-3">
              No subcategories added yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {category.subcategories.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                      {sub.image ? (
                        <img
                          src={sub.image}
                          alt={sub.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No Img</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800">
                        {sub.title}
                      </p>
                      <p className="text-xs text-gray-400">{sub.slug || ""}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteSub(category.id, sub.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => onAddSub(category)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              <Upload size={16} /> Add Subcategory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
