import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import Button from "../components/Button";
import ResultCard from "../components/ResultCard";
import { formatNumber } from "../utils/formatters";
import useCalculationHistory from "../hooks/useCalculationHistory";

const inputLabels = [
  { key: "sandWithContainer", label: "Вес песка с тарой (кг)" },
  { key: "containerWeight", label: "Вес тары (кг)" },
  { key: "targetDrySand", label: "Целевой вес сухого песка (кг)" },
  { key: "moisture", label: "Влажность (%)" },
  { key: "waterCementRatio", label: "Водоцементное соотношение (литры)" },
];

const resultDescriptions = [
  {
    key: "sandWithoutContainer",
    label: "Песок без тары (кг)",
    explanation:
      "Это фактическое количество песка, оставшееся после вычитания веса тары.",
  },
  {
    key: "targetWetSand",
    label: "Целевой вес влажного песка (кг)",
    explanation:
      "Вес песка с учетом требуемой влажности. Служит целевым ориентиром.",
  },
  {
    key: "waterInTargetSand",
    label: "Объем воды в оставшемся песке (кг)",
    explanation:
      "Количество воды, которое уже находится в песке при заданной влажности.",
  },
  {
    key: "additionalWaterNeeded",
    label: "Необходимо добавить воды (литры)",
    explanation:
      "Сколько воды нужно долить в бетономешалку, чтобы достичь В/Ц.",
  },
  {
    key: "sandToRemove",
    label: "Необходимо удалить песка (кг)",
    explanation:
      "Лишний песок, который стоит убрать, чтобы получить целевой вес.",
  },
];

const CalculationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { calculations, loading, error, deleteCalculation } =
    useCalculationHistory();
  const [isDeleting, setIsDeleting] = useState(false);

  const entry = useMemo(
    () => calculations.find((item) => item.id === id),
    [calculations, id]
  );

  const handleDelete = async () => {
    if (!entry) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteCalculation(entry.id);
      navigate("/");
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <p className="text-2xl text-gray-200">Загружаем данные расчета...</p>
    );
  }

  if (error) {
    return (
      <p className="text-2xl text-red-400">
        Не удалось загрузить расчет: {error}
      </p>
    );
  }

  if (!entry) {
    return (
      <div className="space-y-4">
        <p className="text-3xl text-red-400">Расчет не найден</p>
        <Button variant="secondary" onClick={() => navigate("/")}>
          Вернуться назад
        </Button>
      </div>
    );
  }

  const { createdAt, inputs, results } = entry;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
            Детальный расчет
          </h1>
          <p className="text-2xl text-gray-300">
            Дата расчета: {new Date(createdAt).toLocaleString("ru-RU")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={() => navigate("/")}>
            Назад к списку
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Удаление..." : "Удалить запись"}
          </Button>
        </div>
      </div>

      <SectionCard title="Входные данные">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-2xl text-gray-100">
          {inputLabels.map((item) => (
            <div
              key={item.key}
              className="flex flex-col bg-gray-900/60 rounded-xl p-4 border border-gray-700"
            >
              <span className="font-semibold text-blue-300">{item.label}</span>
              <span className="text-3xl mt-2">{inputs[item.key] ?? "—"}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Результаты с пояснениями">
        <div className="space-y-5">
          {resultDescriptions.map((item) => (
            <div
              key={item.key}
              className="bg-gray-900/60 rounded-2xl border border-gray-700 p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <p className="text-2xl font-semibold text-white">
                    {item.label}
                  </p>
                  <p className="text-lg text-gray-400">{item.explanation}</p>
                </div>
                <span className="text-4xl font-bold text-green-300">
                  {formatNumber(results[item.key] ?? 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Итоговые карточки">
        <div className="space-y-4">
          {resultDescriptions.map((item) => (
            <ResultCard
              key={item.key}
              label={item.label}
              value={results[item.key] ?? 0}
              unit={item.key === "additionalWaterNeeded" ? "литров" : "кг"}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default CalculationDetail;
