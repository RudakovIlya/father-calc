import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

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
  const { createdAt } = entry;
  const dateLabel = formatDate(createdAt);

  return (
    <div className="bg-gray-800 rounded-2xl p-5 shadow-xl border border-gray-700">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
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
            Открыть
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
    </div>
  );
};

export default React.memo(HistoryCard);
