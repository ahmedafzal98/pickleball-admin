import React from "react";
import { Toaster } from "react-hot-toast";
import CategoriesPage from "./pages/CategoriesPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 text-2xl font-bold">
        Category Management
      </header>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            fontWeight: "500",
          },
        }}
      />

      <CategoriesPage />
    </div>
  );
}

export default App;
