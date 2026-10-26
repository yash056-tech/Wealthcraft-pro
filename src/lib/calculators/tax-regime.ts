export interface TaxRegimeInput {
  annualGrossSalary: number;
  // Old Regime Deductions
  standardDeductionOld?: number; // default 50000
  section80C?: number; // max 1,50,000 (PF, ELSS, Life Insurance, PPF, Principal)
  section80D?: number; // Health Insurance (Self, Family & Senior Parents, max 1,00,000)
  section24bHomeLoanInterest?: number; // max 2,00,000 for self-occupied
  hraExemption?: number; // HRA exemption
  nps80CCD1B?: number; // max 50,000
  otherDeductions?: number; // Section 80E, 80G, 80TTA, etc.
}

export interface TaxRegimeResult {
  grossSalary: number;
  newRegime: {
    standardDeduction: number;
    taxableIncome: number;
    slabTax: number;
    rebate87A: number;
    surcharge: number;
    cess: number;
    totalTax: number;
    effectiveRate: number;
  };
  oldRegime: {
    standardDeduction: number;
    totalExemptionsDeductions: number;
    taxableIncome: number;
    slabTax: number;
    rebate87A: number;
    surcharge: number;
    cess: number;
    totalTax: number;
    effectiveRate: number;
  };
  recommendedRegime: "New Regime" | "Old Regime";
  taxSavings: number;
  breakEvenDeductionNeeded: number;
}

export function calculateTaxRegimes(input: TaxRegimeInput): TaxRegimeResult {
  const {
    annualGrossSalary,
    section80C = 150000,
    section80D = 25000,
    section24bHomeLoanInterest = 0,
    hraExemption = 0,
    nps80CCD1B = 0,
    otherDeductions = 0,
  } = input;

  // ================= NEW REGIME (FY 2024-25 / FY 2025-26) =================
  const newStandardDeduction = 75000; // Increased to 75k for salaried
  const newTaxableIncome = Math.max(0, annualGrossSalary - newStandardDeduction);

  let newSlabTax = 0;
  if (newTaxableIncome > 1500000) {
    newSlabTax += (newTaxableIncome - 1500000) * 0.30;
    newSlabTax += 300000 * 0.20; // 12L to 15L = 60,000
    newSlabTax += 200000 * 0.15; // 10L to 12L = 30,000
    newSlabTax += 300000 * 0.10; // 7L to 10L = 30,000
    newSlabTax += 400000 * 0.05; // 3L to 7L = 20,000
  } else if (newTaxableIncome > 1200000) {
    newSlabTax += (newTaxableIncome - 1200000) * 0.20;
    newSlabTax += 200000 * 0.15;
    newSlabTax += 300000 * 0.10;
    newSlabTax += 400000 * 0.05;
  } else if (newTaxableIncome > 1000000) {
    newSlabTax += (newTaxableIncome - 1000000) * 0.15;
    newSlabTax += 300000 * 0.10;
    newSlabTax += 400000 * 0.05;
  } else if (newTaxableIncome > 700000) {
    newSlabTax += (newTaxableIncome - 700000) * 0.10;
    newSlabTax += 400000 * 0.05;
  } else if (newTaxableIncome > 300000) {
    newSlabTax += (newTaxableIncome - 300000) * 0.05;
  }

  // 87A rebate for New Regime: full rebate if taxable income <= 7,00,000
  let newRebate87A = 0;
  if (newTaxableIncome <= 700000) {
    newRebate87A = newSlabTax;
  } else if (newTaxableIncome > 700000 && newTaxableIncome < 727777) {
    // Marginal relief under Section 87A for New Regime
    const excessIncome = newTaxableIncome - 700000;
    if (newSlabTax > excessIncome) {
      newRebate87A = newSlabTax - excessIncome;
    }
  }

  const newTaxAfterRebate = Math.max(0, newSlabTax - newRebate87A);
  // Surcharge for New Regime (max 25% for > 2 Cr)
  let newSurcharge = 0;
  if (newTaxableIncome > 20000000) newSurcharge = newTaxAfterRebate * 0.25;
  else if (newTaxableIncome > 10000000) newSurcharge = newTaxAfterRebate * 0.15;
  else if (newTaxableIncome > 5000000) newSurcharge = newTaxAfterRebate * 0.10;

  const newCess = (newTaxAfterRebate + newSurcharge) * 0.04;
  const newTotalTax = Math.round(newTaxAfterRebate + newSurcharge + newCess);

  // ================= OLD REGIME =================
  const oldStandardDeduction = 50000;
  const capped80C = Math.min(150000, Math.max(0, section80C));
  const capped80D = Math.min(100000, Math.max(0, section80D));
  const capped24b = Math.min(200000, Math.max(0, section24bHomeLoanInterest));
  const cappedNps = Math.min(50000, Math.max(0, nps80CCD1B));

  const totalOldDeductions =
    oldStandardDeduction +
    capped80C +
    capped80D +
    capped24b +
    cappedNps +
    Math.max(0, hraExemption) +
    Math.max(0, otherDeductions);

  const oldTaxableIncome = Math.max(0, annualGrossSalary - totalOldDeductions);

  let oldSlabTax = 0;
  if (oldTaxableIncome > 1000000) {
    oldSlabTax += (oldTaxableIncome - 1000000) * 0.30;
    oldSlabTax += 500000 * 0.20; // 5L to 10L = 1,00,000
    oldSlabTax += 250000 * 0.05; // 2.5L to 5L = 12,500
  } else if (oldTaxableIncome > 500000) {
    oldSlabTax += (oldTaxableIncome - 500000) * 0.20;
    oldSlabTax += 250000 * 0.05;
  } else if (oldTaxableIncome > 250000) {
    oldSlabTax += (oldTaxableIncome - 250000) * 0.05;
  }

  // 87A rebate for Old Regime: up to 12,500 if taxable income <= 5,00,000
  let oldRebate87A = 0;
  if (oldTaxableIncome <= 500000) {
    oldRebate87A = Math.min(oldSlabTax, 12500);
  }

  const oldTaxAfterRebate = Math.max(0, oldSlabTax - oldRebate87A);
  let oldSurcharge = 0;
  if (oldTaxableIncome > 50000000) oldSurcharge = oldTaxAfterRebate * 0.37;
  else if (oldTaxableIncome > 20000000) oldSurcharge = oldTaxAfterRebate * 0.25;
  else if (oldTaxableIncome > 10000000) oldSurcharge = oldTaxAfterRebate * 0.15;
  else if (oldTaxableIncome > 5000000) oldSurcharge = oldTaxAfterRebate * 0.10;

  const oldCess = (oldTaxAfterRebate + oldSurcharge) * 0.04;
  const oldTotalTax = Math.round(oldTaxAfterRebate + oldSurcharge + oldCess);

  const recommendedRegime = newTotalTax <= oldTotalTax ? "New Regime" : "Old Regime";
  const taxSavings = Math.abs(oldTotalTax - newTotalTax);

  // Calculate break-even deduction needed in Old Regime to match New Regime tax
  // Binary search or iterative estimation of deduction where oldTax == newTotalTax
  let breakEvenDeduction = 0;
  if (annualGrossSalary > 775000) {
    for (let d = 50000; d <= annualGrossSalary; d += 5000) {
      const simTaxable = Math.max(0, annualGrossSalary - d);
      let simTax = 0;
      if (simTaxable > 1000000) {
        simTax += (simTaxable - 1000000) * 0.30 + 112500;
      } else if (simTaxable > 500000) {
        simTax += (simTaxable - 500000) * 0.20 + 12500;
      } else if (simTaxable > 250000) {
        simTax += (simTaxable - 250000) * 0.05;
      }
      if (simTaxable <= 500000) simTax = 0;
      const simTotal = simTax * 1.04;
      if (simTotal <= newTotalTax) {
        breakEvenDeduction = d;
        break;
      }
    }
  }

  return {
    grossSalary: annualGrossSalary,
    newRegime: {
      standardDeduction: newStandardDeduction,
      taxableIncome: Math.round(newTaxableIncome),
      slabTax: Math.round(newSlabTax),
      rebate87A: Math.round(newRebate87A),
      surcharge: Math.round(newSurcharge),
      cess: Math.round(newCess),
      totalTax: newTotalTax,
      effectiveRate: annualGrossSalary > 0 ? Number(((newTotalTax / annualGrossSalary) * 100).toFixed(2)) : 0,
    },
    oldRegime: {
      standardDeduction: oldStandardDeduction,
      totalExemptionsDeductions: Math.round(totalOldDeductions),
      taxableIncome: Math.round(oldTaxableIncome),
      slabTax: Math.round(oldSlabTax),
      rebate87A: Math.round(oldRebate87A),
      surcharge: Math.round(oldSurcharge),
      cess: Math.round(oldCess),
      totalTax: oldTotalTax,
      effectiveRate: annualGrossSalary > 0 ? Number(((oldTotalTax / annualGrossSalary) * 100).toFixed(2)) : 0,
    },
    recommendedRegime,
    taxSavings,
    breakEvenDeductionNeeded: breakEvenDeduction,
  };
}
