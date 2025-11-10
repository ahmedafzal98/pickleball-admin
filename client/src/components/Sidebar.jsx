import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Folder, Settings } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Categories", path: "/categories", icon: <Folder size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-5 shadow-sm">
      <h1 className="text-xl font-semibold mb-8 text-gray-800 tracking-tight">
        Admin Panel
      </h1>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
