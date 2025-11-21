import { useCallback, useEffect, useState } from "react";
import {
  fetchCalculations,
  persistCalculation,
  removeCalculation,
} from "../storage/calculationStore";

const useCalculationHistory = () => {
  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const entries = await fetchCalculations();
      setCalculations(entries);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Неизвестная ошибка при чтении БД"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addCalculation = useCallback(
    async (record) => {
      try {
        await persistCalculation(record);
        await refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Не удалось сохранить расчет"
        );
        throw err;
      }
    },
    [refresh]
  );

  const deleteCalculation = useCallback(
    async (id) => {
      try {
        await removeCalculation(id);
        await refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Не удалось удалить расчет"
        );
        throw err;
      }
    },
    [refresh]
  );

  return {
    calculations,
    loading,
    error,
    addCalculation,
    deleteCalculation,
    refresh,
  };
};

export default useCalculationHistory;
