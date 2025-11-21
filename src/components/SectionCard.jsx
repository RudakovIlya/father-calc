import React from "react";

const SectionCard = ({ title, children, className = "" }) => {
  return (
    <section
      className={`bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-700 ${className}`.trim()}
    >
      {title ? (
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white tracking-wide">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
};

export default React.memo(SectionCard);
