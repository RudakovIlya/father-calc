import React from "react";

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex w-full border-b border-gray-700 mb-8 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            className={`px-5 sm:px-8 py-3 text-lg font-semibold whitespace-nowrap transition-colors duration-150 ${
              isActive
                ? "text-white border-b-4 border-blue-500"
                : "text-gray-400 hover:text-gray-100"
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default React.memo(Tabs);
