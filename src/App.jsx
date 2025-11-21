import React from "react";
import { Routes, Route } from "react-router-dom";
import CalculatorDashboard from "./pages/CalculatorDashboard";
import CalculationDetail from "./pages/CalculationDetail";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 text-lg leading-relaxed">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <Routes>
          <Route path="/" element={<CalculatorDashboard />} />
          <Route path="/calculation/:id" element={<CalculationDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
