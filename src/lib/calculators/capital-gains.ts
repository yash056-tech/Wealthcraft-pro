// Cost Inflation Index (CII) table for Indian Capital Gains (Selected years up to 2024-25)
export const CII_TABLE: Record<string, number> = {
  "2001-02": 100,
  "2002-03": 105,
  "2003-04": 109,
  "2004-05": 113,
  "2005-06": 117,
  "2006-07": 122,
  "2007-08": 129,
  "2008-09": 137,
  "2009-10": 148,
  "2010-11": 167,
  "2011-12": 184,
  "2012-13": 200,
  "2013-14": 220,
  "2014-15": 240,
  "2015-16": 254,
  "2016-17": 264,
  "2017-18": 272,
  "2018-19": 280,
  "2019-20": 289,
  "2020-21": 301,
  "2021-22": 317,
  "2022-23": 348,
  "2023-24": 348,
  "2024-25": 363,
  "2025-26": 377,
};

export type AssetCategory = "real_estate" | "equity_listed" | "debt_other";

export interface CapitalGainsInput {
  assetType: AssetCategory;
  purchasePrice: number;
  salePrice: number;
  purchaseYear: string; // e.g. "2015-16"
  saleYear: string; // e.g. "2024-25"
  holdingPeriodMonths: number;
  improvementExpenses?: number;
  transferExpenses?: number;
  // Exemptions
  section54Exemption?: number; // Residential property reinvestment
  section54EcExemption?: number; // REC/NHAI 54EC Bonds (max 50 Lakhs)
  applicableIncomeTaxSlabPercent?: number; // For STCG/Debt slab rates (e.g. 30%)
  purchasedBeforeJuly2024?: boolean; // For real estate choice
}

export interface CapitalGainsResult {
  assetType: AssetCategory;
  gainType: "LTCG" | "STCG";
  netSaleConsideration: number;
  costOfAcquisition: number;
  indexedCostOfAcquisition: number;
  grossCapitalGain: number;
  totalExemptions: number;
  netTaxableGain: number;
  taxRatePercent: number;
  baseTax: number;
  healthAndEducationCess: number;
  totalTaxPayable: number;
  effectiveTaxRate: number;
  netProceedsInHand: number;
  taxRuleNotes: string[];
}

export function calculateCapitalGains(input: CapitalGainsInput): CapitalGainsResult {
  const {
    assetType,
    purchasePrice,
    salePrice,
    purchaseYear = "2018-19",
    saleYear = "2024-25",
    holdingPeriodMonths,
    improvementExpenses = 0,
    transferExpenses = 0,
    section54Exemption = 0,
    section54EcExemption = 0,
    applicableIncomeTaxSlabPercent = 30,
    purchasedBeforeJuly2024 = true,
  } = input;

  const netSaleConsideration = Math.max(0, salePrice - transferExpenses);
  const totalCost = purchasePrice + improvementExpenses;

  // CII Indexation calculation
  const ciiPurchase = CII_TABLE[purchaseYear] || 100;
  const ciiSale = CII_TABLE[saleYear] || 363;
  const indexedCost = Math.round(totalCost * (ciiSale / ciiPurchase));

  let gainType: "LTCG" | "STCG" = "LTCG";
  let taxRatePercent = 0;
  let grossCapitalGain = 0;
  let indexedCostUsed = false;
  const notes: string[] = [];

  if (assetType === "real_estate") {
    // Real estate: > 24 months is LTCG
    if (holdingPeriodMonths > 24) {
      gainType = "LTCG";
      // Under Budget 2024 amendments, pre-July 2024 properties can opt for lower of 12.5% without indexation OR 20% with indexation
      const unindexedGain = Math.max(0, netSaleConsideration - totalCost);
      const indexedGain = Math.max(0, netSaleConsideration - indexedCost);

      const taxWithoutIndexation = unindexedGain * 0.125;
      const taxWithIndexation = indexedGain * 0.20;

      if (purchasedBeforeJuly2024 && taxWithIndexation < taxWithoutIndexation) {
        grossCapitalGain = indexedGain;
        taxRatePercent = 20;
        indexedCostUsed = true;
        notes.push("Beneficial Grandfathering Applied: 20% with CII indexation results in lower tax than 12.5% unindexed.");
      } else {
        grossCapitalGain = unindexedGain;
        taxRatePercent = 12.5;
        notes.push("Budget 2024 Rule Applied: 12.5% Long-Term Capital Gains tax without indexation.");
      }
    } else {
      gainType = "STCG";
      grossCapitalGain = Math.max(0, netSaleConsideration - totalCost);
      taxRatePercent = applicableIncomeTaxSlabPercent;
      notes.push(`Short-Term Capital Gain (< 24 months) taxed at your income slab rate (${applicableIncomeTaxSlabPercent}%).`);
    }
  } else if (assetType === "equity_listed") {
    // Equity: > 12 months is LTCG
    if (holdingPeriodMonths > 12) {
      gainType = "LTCG";
      const rawGain = Math.max(0, netSaleConsideration - totalCost);
      // Section 112A: Rs 1.25 Lakh exemption per year
      const exemption112A = 125000;
      grossCapitalGain = rawGain;
      taxRatePercent = 12.5;
      notes.push("Section 112A: 12.5% LTCG on gains exceeding annual ₹1,25,000 threshold.");
    } else {
      gainType = "STCG";
      grossCapitalGain = Math.max(0, netSaleConsideration - totalCost);
      taxRatePercent = 20; // Budget 2024 raised Section 111A STCG to 20%
      notes.push("Section 111A: Short-Term Capital Gains on listed equities taxed at 20% (Budget 2024).");
    }
  } else {
    // Debt & Other
    if (holdingPeriodMonths > 24) {
      gainType = "LTCG";
      grossCapitalGain = Math.max(0, netSaleConsideration - totalCost);
      taxRatePercent = 12.5;
      notes.push("Unlisted / other assets LTCG taxed at 12.5% without indexation.");
    } else {
      gainType = "STCG";
      grossCapitalGain = Math.max(0, netSaleConsideration - totalCost);
      taxRatePercent = applicableIncomeTaxSlabPercent;
      notes.push(`STCG taxed at applicable income tax slab rate (${applicableIncomeTaxSlabPercent}%).`);
    }
  }

  // Exemptions
  let capped54Ec = Math.min(5000000, section54EcExemption); // Max 50 Lakhs in 54EC bonds
  let totalExemptions = 0;

  if (gainType === "LTCG") {
    totalExemptions = Math.min(grossCapitalGain, section54Exemption + capped54Ec);
    if (assetType === "equity_listed") {
      // Apply 1.25L exemption
      totalExemptions += Math.min(grossCapitalGain - totalExemptions, 125000);
    }
  }

  const netTaxableGain = Math.max(0, grossCapitalGain - totalExemptions);
  const baseTax = Math.round(netTaxableGain * (taxRatePercent / 100));
  const healthAndEducationCess = Math.round(baseTax * 0.04);
  const totalTaxPayable = baseTax + healthAndEducationCess;
  const effectiveTaxRate = grossCapitalGain > 0 ? (totalTaxPayable / grossCapitalGain) * 100 : 0;
  const netProceedsInHand = netSaleConsideration - totalTaxPayable;

  return {
    assetType,
    gainType,
    netSaleConsideration: Math.round(netSaleConsideration),
    costOfAcquisition: Math.round(totalCost),
    indexedCostOfAcquisition: indexedCost,
    grossCapitalGain: Math.round(grossCapitalGain),
    totalExemptions: Math.round(totalExemptions),
    netTaxableGain: Math.round(netTaxableGain),
    taxRatePercent,
    baseTax,
    healthAndEducationCess,
    totalTaxPayable,
    effectiveTaxRate: Number(effectiveTaxRate.toFixed(2)),
    netProceedsInHand: Math.round(netProceedsInHand),
    taxRuleNotes: notes,
  };
}
