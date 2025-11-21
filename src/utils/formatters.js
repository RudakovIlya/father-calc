export const toNumber = (value) => {
  const numericValue = parseFloat(value);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

export const formatDecimalInput = (value) => {
  const formatted = value.replace(/[^0-9.]/g, "");
  const [integerPart, ...decimalParts] = formatted.split(".");

  if (!decimalParts.length) {
    return integerPart;
  }

  return `${integerPart}.${decimalParts.join("")}`;
};

export const formatNumber = (num) =>
  Number.isFinite(num) ? Number(num.toFixed(2)) : 0;

export const numberUtils = {
  toNumber,
  formatDecimalInput,
  formatNumber,
};

export default numberUtils;
