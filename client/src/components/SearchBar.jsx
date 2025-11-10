import React from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
      <input
        className="pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Search..."
      />
    </div>
  );
}
