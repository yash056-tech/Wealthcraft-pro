/**
 * Currency and financial number formatters for Indian Rupee (INR ₹)
 * Supports Indian numbering system: Crores, Lakhs, Thousands
 */

export function formatINR(value: number, options?: { compact?: boolean; hideSymbol?: boolean; decimals?: number }): string {
  if (value === undefined || value === null || isNaN(value)) return "₹0";

  const isNegative = value < 0;
  const absValue = Math.abs(value);
  const symbol = options?.hideSymbol ? "" : "₹ ";

  if (options?.compact) {
    if (absValue >= 10000000) {
      // Crores (1 Cr = 1,00,00,000)
      const cr = absValue / 10000000;
      return `${isNegative ? "-" : ""}${symbol}${cr.toFixed(cr >= 100 ? 1 : 2)} Cr`;
    }
    if (absValue >= 100000) {
      // Lakhs (1 Lakh = 1,00,000)
      const l = absValue / 100000;
      return `${isNegative ? "-" : ""}${symbol}${l.toFixed(l >= 100 ? 1 : 2)} L`;
    }
    if (absValue >= 1000) {
      // Thousands (1k = 1,000)
      const k = absValue / 1000;
      return `${isNegative ? "-" : ""}${symbol}${k.toFixed(1)}k`;
    }
  }

  // Exact Indian Currency formatting (e.g., 12,34,567)
  const decimals = options?.decimals !== undefined ? options?.decimals : 0;
  const parts = absValue.toFixed(decimals).split(".");
  let intPart = parts[0];
  const decPart = parts[1] ? `.${parts[1]}` : "";

  // Indian comma logic: last 3 digits, then every 2 digits
  let lastThree = intPart.substring(intPart.length - 3);
  const otherNumbers = intPart.substring(0, intPart.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formattedInt = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return `${isNegative ? "-" : ""}${symbol}${formattedInt}${decPart}`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (value === undefined || value === null || isNaN(value)) return "0%";
  return `${value.toFixed(decimals)}%`;
}

export function formatYears(years: number): string {
  const wholeYears = Math.floor(years);
  const months = Math.round((years - wholeYears) * 12);
  if (months === 0) return `${wholeYears} yrs`;
  if (wholeYears === 0) return `${months} mos`;
  return `${wholeYears} yrs ${months} mos`;
}
