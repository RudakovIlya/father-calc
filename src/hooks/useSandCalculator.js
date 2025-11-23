import { useCallback, useMemo, useState } from "react";
import { formatDecimalInput, toNumber } from "../utils/formatters";

export const defaultInputs = {
  sandWithContainer: "110",
  containerWeight: "2.9",
  targetDrySand: "94",
  moisture: "6",
  waterCementRatio: "13.2",
};

const useSandCalculator = (initialState = defaultInputs) => {
  const [inputs, setInputs] = useState(initialState);

  const setField = useCallback((field, rawValue) => {
    setInputs((prev) => {
      const nextValue = formatDecimalInput(rawValue);
      if (prev[field] === nextValue) {
        return prev;
      }

      return {
        ...prev,
        [field]: nextValue,
      };
    });
  }, []);

  const clearFieldOnClick = useCallback((e) => {
    const name = e.target.name;

    setInputs((prev) => {
      return {
        ...prev,
        [name]: "",
      };
    });
  }, []);

  const numericInputs = useMemo(
    () => ({
      sandWithContainer: toNumber(inputs.sandWithContainer),
      containerWeight: toNumber(inputs.containerWeight),
      targetDrySand: toNumber(inputs.targetDrySand),
      moisture: toNumber(inputs.moisture),
      waterCementRatio: toNumber(inputs.waterCementRatio),
    }),
    [inputs]
  );

  const calculatedValues = useMemo(() => {
    const sandWithoutContainer =
      numericInputs.sandWithContainer - numericInputs.containerWeight;
    const targetWetSand =
      numericInputs.targetDrySand * (1 + numericInputs.moisture / 100);
    const waterInTargetSand = targetWetSand * (numericInputs.moisture / 100);
    const sandToRemove = sandWithoutContainer - targetWetSand;
    const additionalWaterNeeded =
      numericInputs.waterCementRatio - waterInTargetSand;

    return {
      sandWithoutContainer,
      targetWetSand,
      waterInTargetSand,
      sandToRemove,
      additionalWaterNeeded,
    };
  }, [numericInputs]);

  return {
    inputs,
    numericInputs,
    calculatedValues,
    setField,
    clearFieldOnClick,
  };
};

export default useSandCalculator;
