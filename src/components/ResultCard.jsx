import React from "react";
import { formatNumber } from "../utils/formatters";

const ResultCard = ({
  label,
  value,
  unit,
  description,
  valueClassName = "",
  id,
}) => {
  const appliedColor = valueClassName || "text-white";

  return (
    <div id={id} className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="text-lg font-semibold text-gray-100">{label}</span>
        <span className={`text-2xl font-bold ${appliedColor}`.trim()}>
          {formatNumber(value)} {unit}
        </span>
      </div>
      {description ? (
        <div className="text-base text-gray-400 mt-2">{description}</div>
      ) : null}
    </div>
  );
};

export default React.memo(ResultCard);
