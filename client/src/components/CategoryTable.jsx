import React, { useState, useMemo } from "react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");
  const [parentFilter, setParentFilter] = useState("");

  // Map id -> category for easy lookup
  const idToCategory = useMemo(() => {
    const map = {};
    categories.forEach((cat) => (map[cat.id] = cat));
    return map;
  }, [categories]);

  // Build tree recursively
  const buildTree = (parentId = null) =>
    categories
      .filter((cat) => cat.parent === parentId)
      .map((cat) => ({
        ...cat,
        children: buildTree(cat.id),
      }));

  const categoryTree = useMemo(() => buildTree(), [categories]);

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const newExpanded = {};
    categories.forEach((cat) => (newExpanded[cat.id] = true));
    setExpanded(newExpanded);
  };

  const collapseAll = () => setExpanded({});

  // Filter tree by search or parent
  const filteredTree = useMemo(() => {
    const filterNodes = (nodes) => {
      return nodes
        .map((node) => {
          const children = filterNodes(node.children || []);
          const matchesSearch = node.name
            .toLowerCase()
            .includes(search.toLowerCase());
          const matchesParent =
            !parentFilter ||
            (node.parent && idToCategory[node.parent]?.name === parentFilter);
          if (matchesSearch && matchesParent) return { ...node, children };
          if (children.length > 0) return { ...node, children };
          return null;
        })
        .filter(Boolean);
    };
    return filterNodes(categoryTree);
  }, [categoryTree, search, parentFilter, idToCategory]);

  // Get full path for tooltip
  const getFullPath = (cat) => {
    const path = [];
    let current = cat;
    while (current) {
      path.unshift(current.name);
      current = current.parent ? idToCategory[current.parent] : null;
    }
    return path.join(" → ");
  };

  // Recursive row renderer
  const renderRows = (nodes, level = 0) =>
    nodes.flatMap((node) => {
      const hasChildren = node.children && node.children.length > 0;
      return [
        <tr
          key={node.id}
          className={`border-b odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors`}
        >
          <td className="py-2 px-4">{node.id}</td>
          <td
            className="py-2 px-4 flex items-center"
            style={{
              paddingLeft: `${level * 25}px`,
              backgroundColor: level % 2 === 0 ? "white" : "#f9fafb",
            }}
          >
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(node.id)}
                className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none transition-transform"
              >
                {expanded[node.id] ? (
                  <ChevronDownIcon className="w-4 h-4 inline transform transition-transform" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 inline transform transition-transform" />
                )}
              </button>
            ) : (
              <span className="w-4 inline-block mr-2" />
            )}
            {node.name}
          </td>
          <td title={getFullPath(node)} className="py-2 px-4 text-gray-600">
            {node.parent ? idToCategory[node.parent]?.name : "-"}
          </td>
          <td className="py-2 px-4 space-x-2 flex">
            <button onClick={() => onEdit(node)} title="Edit">
              <PencilIcon className="w-5 h-5 text-yellow-500 hover:text-yellow-600" />
            </button>
            <button onClick={() => onDelete(node.id)} title="Delete">
              <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-600" />
            </button>
          </td>
        </tr>,
        hasChildren && expanded[node.id]
          ? renderRows(node.children, level + 1)
          : [],
      ];
    });

  // Parent options for filter dropdown
  const parentOptions = useMemo(() => {
    const parents = categories.filter((c) =>
      categories.some((child) => child.parent === c.id)
    );
    return parents.map((c) => c.name);
  }, [categories]);

  return (
    <div className="p-4">
      {/* Actions & Filters */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex space-x-2">
          <button
            onClick={expandAll}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Collapse All
          </button>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded"
          />
          <select
            value={parentFilter}
            onChange={(e) => setParentFilter(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="">Filter by parent</option>
            {parentOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="overflow-auto max-h-[600px] border rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Parent</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>{renderRows(filteredTree)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
