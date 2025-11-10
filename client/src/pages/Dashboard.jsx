import React, { useContext, useMemo } from "react";
import { CategoryContext } from "../context/CategoryContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Folder, Layers, PlusCircle } from "lucide-react";

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"];

const Dashboard = () => {
  const { categories } = useContext(CategoryContext);

  const totalCategories = categories.length;
  const totalSubcategories = categories.reduce(
    (acc, cat) => acc + cat.subcategories.length,
    0
  );

  const data = useMemo(
    () =>
      categories.map((cat) => ({
        name: cat.name,
        value: cat.subcategories.length || 1,
      })),
    [categories]
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 mb-6">
          Overview of categories and subcategories across the platform.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Folder size={28} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Categories</div>
                <div className="text-2xl font-semibold text-gray-800">
                  {totalCategories}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <Layers size={28} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Subcategories</div>
                <div className="text-2xl font-semibold text-gray-800">
                  {totalSubcategories}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <PlusCircle size={28} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Avg Sub per Cat</div>
                <div className="text-2xl font-semibold text-gray-800">
                  {(totalSubcategories / totalCategories || 0).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Category Distribution
          </h2>
          {data.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-10">
              No category data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
