import React from "react";
import CategoriesPage from "./pages/CategoriesPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-2xl font-bold">
        Category Management
      </header>
      <CategoriesPage />
    </div>
  );
}

export default App;
