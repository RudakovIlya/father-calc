import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { formatNumber } from "../utils/formatters";

const inputLabels = [
  { key: "sandWithContainer", label: "Вес песка с тарой (кг)" },
  { key: "containerWeight", label: "Вес тары (кг)" },
  { key: "targetDrySand", label: "Целевой вес сухого песка (кг)" },
  { key: "moisture", label: "Влажность (%)" },
  { key: "waterCementRatio", label: "Водоцементное соотношение (литры)" },
];

const resultLabels = [
  { key: "sandWithoutContainer", label: "Песок без тары (кг)" },
  { key: "targetWetSand", label: "Целевой вес влажного песка (кг)" },
  { key: "waterInTargetSand", label: "Объем воды в оставшемся песке (кг)" },
  { key: "additionalWaterNeeded", label: "Необходимо добавить воды (литры)" },
  { key: "sandToRemove", label: "Необходимо удалить песка (кг)" },
];

const formatDate = (isoString) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "Неизвестная дата";
  }

  return date.toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const HistoryCard = ({ entry, onDelete, isDeleting }) => {
  const { createdAt, inputs = {}, results = {} } = entry;
  const dateLabel = formatDate(createdAt);

  return (
    <div className="bg-gray-800 rounded-2xl p-5 shadow-xl border border-gray-700">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div className="space-y-1">
          <p className="text-2xl font-semibold text-white">
            Расчет от {dateLabel}
          </p>
          <p className="text-base text-gray-400">{createdAt}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/calculation/${entry.id}`}
            className="text-center px-5 py-2 rounded-xl border border-blue-400 text-blue-300 text-lg font-semibold hover:bg-blue-500/10 transition"
          >
            Подробнее
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
        <div>
          <p className="text-gray-200 font-semibold mb-3 text-xl">
            Входные данные
          </p>
          <ul className="space-y-2 text-gray-300">
            {inputLabels.map((item) => (
              <li key={item.key} className="flex justify-between gap-3">
                <span>{item.label}:</span>
                <span className="text-gray-100 text-xl">
                  {inputs[item.key] ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-gray-200 font-semibold mb-3 text-xl">Результаты</p>
          <ul className="space-y-2 text-gray-300">
            {resultLabels.map((item) => (
              <li key={item.key} className="flex justify-between gap-3">
                <span>{item.label}:</span>
                <span className="text-gray-100 text-xl">
                  {formatNumber(results[item.key] ?? 0)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HistoryCard);
