import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-left">
            <th className="p-3 w-12"></th>
            <th className="p-3 font-semibold">Image</th>
            <th className="p-3 font-semibold">Category</th>
            <th className="p-3 font-semibold">Subcategories</th>
            <th className="p-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <tr className="border-b hover:bg-gray-50 transition">
                <td className="p-3 text-gray-500">
                  <button onClick={() => toggleExpand(category.id)}>
                    {expandedRows[category.id] ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>
                </td>
                <td className="p-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-12 h-12 rounded-lg object-cover border"
                  />
                </td>
                <td className="p-3 font-medium text-gray-800">
                  {category.name}
                </td>
                <td className="p-3 text-gray-600">
                  {category.subcategories.length}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onEdit(category)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>

              <AnimatePresence>
                {expandedRows[category.id] && (
                  <motion.tr
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-gray-50"
                  >
                    <td></td>
                    <td colSpan="4" className="p-3">
                      <div className="pl-6">
                        {category.subcategories.length > 0 ? (
                          <table className="w-full border border-gray-200 rounded-md">
                            <thead>
                              <tr className="bg-gray-100 text-gray-600">
                                <th className="p-2 text-left">Subcategory</th>
                                <th className="p-2 text-left">Image</th>
                                <th className="p-2 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {category.subcategories.map((sub, index) => (
                                <tr
                                  key={index}
                                  className="border-b hover:bg-gray-50 transition"
                                >
                                  <td className="p-2 text-gray-700">
                                    {sub.name}
                                  </td>
                                  <td className="p-2">
                                    <img
                                      src={sub.image}
                                      alt={sub.name}
                                      className="w-10 h-10 rounded-md object-cover border"
                                    />
                                  </td>
                                  <td className="p-2 text-right">
                                    <button
                                      onClick={() => onEdit(sub, category.id)}
                                      className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        onDelete(sub.id, category.id)
                                      }
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-500 italic">
                            No subcategories found.
                          </p>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
