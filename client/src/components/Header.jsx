import React from "react";
import SearchBar from "./SearchBar";

export default function Header({ title, onAdd }) {
  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      <div className="flex items-center gap-3">
        <SearchBar />
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
          >
            + Add
          </button>
        )}
      </div>
    </header>
  );
}
