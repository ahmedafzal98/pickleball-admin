import React, { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline"; // optional icon

const levelColors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
];

const CategoryTree = ({ tree, onCategoryClick }) => {
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTree = (nodes, level = 0) =>
    nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expanded[node.id];
      const badgeColor = levelColors[level % levelColors.length];

      return (
        <li key={node.id} className="relative">
          <div
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
            style={{ paddingLeft: `${level * 25}px` }}
          >
            {hasChildren ? (
              <span
                className={`text-gray-500 transition-transform duration-200`}
                onClick={() => toggleExpand(node.id)}
              >
                {isExpanded ? "▼" : "▶"}
              </span>
            ) : (
              <span className="w-4"></span>
            )}

            <span
              className={`px-2 py-0.5 text-sm font-semibold rounded ${badgeColor}`}
              onClick={() => onCategoryClick && onCategoryClick(node)}
            >
              {node.name}
            </span>

            {/* Info icon */}
            <InformationCircleIcon
              className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
              title={`Parent: ${node.parentName || "None"} | ID: ${node.id}`}
            />
          </div>

          {/* Children */}
          {hasChildren && (
            <div
              className="transition-max-height duration-300 overflow-hidden"
              style={{ maxHeight: isExpanded ? "1000px" : "0px" }}
            >
              <ul className="pl-2 space-y-1">
                {renderTree(node.children, level + 1)}
              </ul>
            </div>
          )}
        </li>
      );
    });

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg max-h-[600px] overflow-auto">
      {tree && tree.length > 0 ? (
        <ul>{renderTree(tree)}</ul>
      ) : (
        <p className="text-gray-500 text-sm">No categories found.</p>
      )}
    </div>
  );
};

export default CategoryTree;
