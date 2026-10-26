export type GstCalculationMode = "add_gst" | "remove_gst";
export type GstSupplyType = "intrastate" | "interstate";

export interface GstInput {
  amount: number;
  ratePercent: number; // 5, 12, 18, 28, or custom
  mode: GstCalculationMode;
  supplyType: GstSupplyType;
}

export interface GstResult {
  mode: GstCalculationMode;
  supplyType: GstSupplyType;
  ratePercent: number;
  netBaseAmount: number;
  totalGstAmount: number;
  grossAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cgstRatePercent: number;
  sgstRatePercent: number;
  igstRatePercent: number;
  effectiveTaxMultiplier: number;
}

export function calculateGst(input: GstInput): GstResult {
  const { amount, ratePercent, mode, supplyType } = input;

  let netBaseAmount = 0;
  let totalGstAmount = 0;
  let grossAmount = 0;

  if (mode === "add_gst") {
    // Amount is base price (excluding GST)
    netBaseAmount = amount;
    totalGstAmount = (netBaseAmount * ratePercent) / 100;
    grossAmount = netBaseAmount + totalGstAmount;
  } else {
    // Amount is gross price (inclusive of GST)
    grossAmount = amount;
    netBaseAmount = grossAmount / (1 + ratePercent / 100);
    totalGstAmount = grossAmount - netBaseAmount;
  }

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  let cgstRatePercent = 0;
  let sgstRatePercent = 0;
  let igstRatePercent = 0;

  if (supplyType === "intrastate") {
    cgstRatePercent = ratePercent / 2;
    sgstRatePercent = ratePercent / 2;
    cgstAmount = totalGstAmount / 2;
    sgstAmount = totalGstAmount / 2;
  } else {
    igstRatePercent = ratePercent;
    igstAmount = totalGstAmount;
  }

  return {
    mode,
    supplyType,
    ratePercent,
    netBaseAmount: Number(netBaseAmount.toFixed(2)),
    totalGstAmount: Number(totalGstAmount.toFixed(2)),
    grossAmount: Number(grossAmount.toFixed(2)),
    cgstAmount: Number(cgstAmount.toFixed(2)),
    sgstAmount: Number(sgstAmount.toFixed(2)),
    igstAmount: Number(igstAmount.toFixed(2)),
    cgstRatePercent,
    sgstRatePercent,
    igstRatePercent,
    effectiveTaxMultiplier: Number((1 + ratePercent / 100).toFixed(4)),
  };
}
