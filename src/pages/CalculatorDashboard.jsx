import React, { useCallback, useEffect, useMemo, useState } from "react";
import InputField from "../components/InputField";
import ResultCard from "../components/ResultCard";
import SectionCard from "../components/SectionCard";
import Button from "../components/Button";
import Tabs from "../components/Tabs";
import HistoryCard from "../components/HistoryCard";
import Pagination from "../components/Pagination";
import useSandCalculator from "../hooks/useSandCalculator";
import useCalculationHistory from "../hooks/useCalculationHistory";

const TABS = [
  { id: "calculator", label: "Калькулятор" },
  { id: "history", label: "Результаты расчетов" },
];

const PAGE_SIZE = 10;

const CalculatorDashboard = () => {
  const { inputs, calculatedValues, setField } = useSandCalculator();
  const {
    calculations,
    loading: historyLoading,
    error: historyError,
    addCalculation,
    deleteCalculation,
    clearAllCalculations,
  } = useCalculationHistory();

  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [latestCalculation, setLatestCalculation] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [needsComment, setNeedsComment] = useState(false);
  const [comment, setComment] = useState("");
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const changeHandlers = useMemo(
    () => ({
      sandWithContainer: (value) => setField("sandWithContainer", value),
      containerWeight: (value) => setField("containerWeight", value),
      targetDrySand: (value) => setField("targetDrySand", value),
      moisture: (value) => setField("moisture", value),
      waterCementRatio: (value) => setField("waterCementRatio", value),
    }),
    [setField]
  );

  const inputGroups = useMemo(
    () => [
      [
        {
          label: "Вес песка с тарой (кг)",
          value: inputs.sandWithContainer,
          placeholder: "110",
          onChange: changeHandlers.sandWithContainer,
        },
        {
          label: "Вес тары (кг)",
          value: inputs.containerWeight,
          placeholder: "2.9",
          onChange: changeHandlers.containerWeight,
        },
      ],
      [
        {
          label: "Целевой вес сухого песка (кг)",
          value: inputs.targetDrySand,
          placeholder: "94",
          onChange: changeHandlers.targetDrySand,
        },
        {
          label: "Влажность (%)",
          value: inputs.moisture,
          placeholder: "6",
          onChange: changeHandlers.moisture,
        },
        {
          label: "Водоцементное соотношение (В/Ц) (литры)",
          value: inputs.waterCementRatio,
          placeholder: "13.2",
          onChange: changeHandlers.waterCementRatio,
        },
      ],
    ],
    [changeHandlers, inputs]
  );

  const sortedHistory = useMemo(() => {
    const items = [...calculations];
    items.sort((a, b) => {
      const first = new Date(a.createdAt).getTime();
      const second = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? second - first : first - second;
    });
    return items;
  }, [calculations, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedHistory.length / PAGE_SIZE));
  const pagedHistory = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedHistory.slice(start, start + PAGE_SIZE);
  }, [currentPage, sortedHistory]);

  useEffect(() => {
    if (!sortedHistory.length) {
      setLatestCalculation(null);
      return;
    }

    const hasCurrent = sortedHistory.some(
      (record) => record.id === latestCalculation?.id
    );

    if (!latestCalculation || !hasCurrent) {
      setLatestCalculation(sortedHistory[0]);
    }
  }, [latestCalculation, sortedHistory]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeout = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timeout);
  }, [feedback]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(sortedHistory.length / PAGE_SIZE));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [currentPage, sortedHistory.length]);

  const displayedResults = latestCalculation?.results ?? null;

  const resultCards = useMemo(
    () => [
      {
        label: "Песок без тары:",
        value: displayedResults?.sandWithoutContainer ?? 0,
        unit: "кг",
        description: "= Вес песка с тарой - Вес тары",
      },
      {
        label: "Целевой вес влажного песка:",
        value: displayedResults?.targetWetSand ?? 0,
        unit: "кг",
        description: "= Целевой вес сухого песка × (1 + Влажность%)",
      },
      {
        label: "Объем воды в оставшемся песке:",
        value: displayedResults?.waterInTargetSand ?? 0,
        unit: "кг",
        description: "= Целевой вес влажного песка × Влажность%",
      },
      {
        label: "Необходимо добавить воды:",
        value: displayedResults?.additionalWaterNeeded ?? 0,
        unit: "литров",
        description:
          "= Водоцементное соотношение - Объем воды в оставшемся песке",
        valueClassName:
          (displayedResults?.additionalWaterNeeded ?? 0) >= 0
            ? "text-green-400"
            : "text-red-400",
      },
      {
        label: "Необходимо удалить песка:",
        value: displayedResults?.sandToRemove ?? 0,
        unit: "кг",
        description: "= Песок без тары - Целевой вес влажного песка",
        valueClassName:
          (displayedResults?.sandToRemove ?? 0) > 0
            ? "text-green-400"
            : "text-red-400",
      },
    ],
    [displayedResults]
  );

  const handleCalculate = useCallback(async () => {
    try {
      setIsSaving(true);
      const createdAt = new Date().toISOString();
      const record = {
        id: createdAt,
        createdAt,
        inputs: { ...inputs },
        results: { ...calculatedValues },
        comment: needsComment ? comment.trim() : "",
      };
      setLatestCalculation(record);
      await addCalculation(record);
      setFeedback({ type: "success", message: "Расчет сохранен" });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "Не удалось сохранить расчет. Проверьте IndexedDB.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [addCalculation, calculatedValues, needsComment, comment, inputs]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        setPendingDeleteId(id);
        await deleteCalculation(id);
        if (latestCalculation?.id === id) {
          setLatestCalculation(null);
        }
        setFeedback({ type: "success", message: "Расчет удален" });
      } catch (error) {
        console.error(error);
        setFeedback({
          type: "error",
          message: "Не удалось удалить расчет",
        });
      } finally {
        setPendingDeleteId(null);
      }
    },
    [deleteCalculation, latestCalculation]
  );

  const handleSortToggle = () =>
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "history") {
      setCurrentPage(1);
    }
  };

  const handleToggleComment = () => {
    setNeedsComment((prev) => {
      const next = !prev;
      if (!next) {
        setComment("");
      }
      return next;
    });
  };

  const handleClearAll = async () => {
    if (!sortedHistory.length || isClearing) {
      setFeedback({
        type: "error",
        message: "Нет записей для удаления",
      });
      return;
    }

    const allow = window.confirm(
      "Удалить все сохраненные расчеты? Это действие нельзя отменить."
    );
    if (!allow) {
      return;
    }

    try {
      setIsClearing(true);
      await clearAllCalculations();
      setLatestCalculation(null);
      setFeedback({ type: "success", message: "Все расчеты удалены" });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "Не удалось удалить все расчеты",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleExportJson = async () => {
    if (!calculations.length || isExporting) {
      setFeedback({
        type: "error",
        message: "Нет данных для экспорта",
      });
      return;
    }

    try {
      setIsExporting(true);
      const payload = JSON.stringify(calculations, null, 2);

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
        setFeedback({
          type: "success",
          message: "JSON скопирован в буфер обмена",
        });
      } else {
        const blob = new Blob([payload], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `calculations-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setFeedback({
          type: "success",
          message: "JSON файл сохранен",
        });
      }
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        message: "Не удалось выгрузить JSON",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const renderHistoryContent = () => {
    if (historyLoading) {
      return (
        <p className="text-gray-300 text-xl">
          Загрузка сохраненных расчетов...
        </p>
      );
    }

    if (sortedHistory.length === 0) {
      return (
        <p className="text-gray-300 text-xl">
          Пока нет сохраненных расчетов. Выполните расчет и сохраните его.
        </p>
      );
    }

    return (
      <>
        <div className="space-y-4">
          {pagedHistory.map((entry) => (
            <HistoryCard
              key={entry.id}
              entry={entry}
              onDelete={() => handleDelete(entry.id)}
              isDeleting={pendingDeleteId === entry.id}
            />
          ))}
        </div>
        {sortedHistory.length > PAGE_SIZE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </>
    );
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
          Калькулятор расчета массы песка
        </h1>
        <p className="text-gray-300 text-xl">
          Удобный помощник для точного и наглядного расчета песка и воды
        </p>
      </div>

      {feedback && (
        <div
          className={`mb-6 text-xl font-semibold text-center ${
            feedback.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === "calculator" ? (
        <>
          <SectionCard title="Входные данные" className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inputGroups.map((group) => {
                const key = group.map((input) => input.label).join("-");
                return (
                  <div className="space-y-5" key={key}>
                    {group.map((input) => (
                      <InputField
                        key={input.label}
                        label={input.label}
                        value={input.value}
                        placeholder={input.placeholder}
                        onChange={input.onChange}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 space-y-3">
              <label className="flex items-center gap-3 text-lg text-gray-200 font-semibold">
                <input
                  type="checkbox"
                  checked={needsComment}
                  onChange={handleToggleComment}
                  className="h-5 w-5 rounded border-gray-500 bg-gray-800 text-blue-500 focus:ring-blue-500"
                />
                Нужен комментарий
              </label>
              {needsComment ? (
                <textarea
                  className="w-full min-h-28 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-gray-100 text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent"
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Например: партия песка слишком влажная, добавили воду..."
                />
              ) : null}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
              <Button onClick={handleCalculate} disabled={isSaving}>
                {isSaving ? "Сохранение..." : "Рассчитать"}
              </Button>
              <p className="text-base text-gray-400">
                Нажмите кнопку, чтобы сохранить расчет и увидеть результаты
                ниже.
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Результаты расчета">
            {displayedResults ? (
              <div className="space-y-4">
                {resultCards.map((card) => (
                  <ResultCard key={card.label} {...card} />
                ))}
              </div>
            ) : (
              <p className="text-xl text-gray-300">
                Сначала заполните данные и нажмите «Рассчитать», чтобы увидеть
                подсчитанные значения.
              </p>
            )}
          </SectionCard>

          <SectionCard title="Формулы расчета" className="mt-8">
            <div className="space-y-4 text-xl text-gray-200">
              <p>1) Песок без тары = Вес песка с тарой − Вес тары</p>
              <p>
                2) Целевой вес влажного песка = Целевой вес сухого песка × (1 +
                Влажность%)
              </p>
              <p>
                3) Объем воды в песке = Целевой вес влажного песка × Влажность%
              </p>
              <p>
                4) Необходимо добавить воды = В/Ц − Объем воды в оставшемся
                песке
              </p>
              <p>
                5) Необходимо удалить песка = Песок без тары − Целевой вес
                влажного песка
              </p>
            </div>
          </SectionCard>
        </>
      ) : (
        <SectionCard title="Сохраненные расчеты">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <span className="text-xl text-gray-300">
              Найдено записей: {sortedHistory.length}
            </span>
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" size="sm" onClick={handleSortToggle}>
                Сортировка:{" "}
                {sortOrder === "desc"
                  ? "от новых к старым"
                  : "от старых к новым"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportJson}
                disabled={!calculations.length || isExporting}
              >
                {isExporting ? "Выгрузка..." : "Выгрузить JSON"}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleClearAll}
                disabled={!sortedHistory.length || isClearing}
              >
                {isClearing ? "Удаление..." : "Удалить все записи"}
              </Button>
            </div>
          </div>

          {renderHistoryContent()}

          {historyError ? (
            <p className="text-xl text-red-400 mt-6">{historyError}</p>
          ) : null}
        </SectionCard>
      )}
    </>
  );
};

export default CalculatorDashboard;
