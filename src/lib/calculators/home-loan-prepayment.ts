export interface HomeLoanInput {
  loanAmount: number;
  interestRate: number; // % p.a.
  tenureYears: number; // e.g. 20
  annualPrepaymentAmount?: number; // e.g. 100000 lump sum each year
  prepaymentMonth?: number; // 1-12, default 12 (December / end of year)
  monthlyEmiStepUpPercent?: number; // e.g. 5% annual increase in EMI
  oneTimePrepayment?: {
    amount: number;
    year: number;
  };
}

export interface AmortizationRow {
  month: number;
  year: number;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  prepayment: number;
  closingBalance: number;
}

export interface YearAmortization {
  year: number;
  openingBalance: number;
  totalEmi: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPrepayment: number;
  closingBalance: number;
}

export interface HomeLoanResult {
  originalEmi: number;
  originalTotalInterest: number;
  originalTotalAmount: number;
  originalTenureMonths: number;
  
  revisedTotalInterest: number;
  revisedTotalAmount: number;
  revisedTenureMonths: number;
  tenureSavedMonths: number;
  interestSaved: number;
  
  yearlySchedule: YearAmortization[];
  comparisonData: {
    name: string;
    value: number;
    interest: number;
    principal: number;
  }[];
}

export function calculateHomeLoanPrepayment(input: HomeLoanInput): HomeLoanResult {
  const {
    loanAmount,
    interestRate,
    tenureYears,
    annualPrepaymentAmount = 0,
    prepaymentMonth = 12,
    monthlyEmiStepUpPercent = 0,
    oneTimePrepayment,
  } = input;

  const originalTenureMonths = tenureYears * 12;
  const monthlyRate = interestRate / 100 / 12;

  // Standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const factor = Math.pow(1 + monthlyRate, originalTenureMonths);
  const originalEmi = Math.round((loanAmount * monthlyRate * factor) / (factor - 1));

  const originalTotalAmount = originalEmi * originalTenureMonths;
  const originalTotalInterest = originalTotalAmount - loanAmount;

  // Revised simulation with prepayments
  let balance = loanAmount;
  let currentEmi = originalEmi;
  let revisedTotalInterest = 0;
  let revisedTotalPrincipal = 0;
  let revisedTotalPrepayments = 0;
  let month = 0;

  const yearlySchedule: YearAmortization[] = [];
  let currentYearOpening = loanAmount;
  let currentYearEmi = 0;
  let currentYearPrincipal = 0;
  let currentYearInterest = 0;
  let currentYearPrepayment = 0;

  while (balance > 1 && month < originalTenureMonths) {
    month++;
    const currentYear = Math.ceil(month / 12);
    const monthInYear = ((month - 1) % 12) + 1;

    // Apply annual step-up to EMI if configured
    if (monthlyEmiStepUpPercent > 0 && monthInYear === 1 && currentYear > 1) {
      currentEmi = Math.round(currentEmi * (1 + monthlyEmiStepUpPercent / 100));
    }

    const interestForMonth = balance * monthlyRate;
    let principalForMonth = Math.min(balance, currentEmi - interestForMonth);
    let effectiveEmi = principalForMonth + interestForMonth;

    if (currentEmi >= balance + interestForMonth) {
      // Last fractional EMI
      principalForMonth = balance;
      effectiveEmi = balance + interestForMonth;
      balance = 0;
    } else {
      balance = balance - principalForMonth;
    }

    // Prepayments
    let prepaymentThisMonth = 0;
    if (balance > 0) {
      // Annual lump sum in chosen month
      if (annualPrepaymentAmount > 0 && monthInYear === prepaymentMonth) {
        prepaymentThisMonth += Math.min(balance, annualPrepaymentAmount);
      }
      // One time prepayment in specific year
      if (
        oneTimePrepayment &&
        oneTimePrepayment.amount > 0 &&
        currentYear === oneTimePrepayment.year &&
        monthInYear === 1
      ) {
        prepaymentThisMonth += Math.min(balance, oneTimePrepayment.amount);
      }

      balance -= prepaymentThisMonth;
    }

    revisedTotalInterest += interestForMonth;
    revisedTotalPrincipal += principalForMonth;
    revisedTotalPrepayments += prepaymentThisMonth;

    currentYearEmi += effectiveEmi;
    currentYearPrincipal += principalForMonth;
    currentYearInterest += interestForMonth;
    currentYearPrepayment += prepaymentThisMonth;

    if (monthInYear === 12 || balance <= 0) {
      yearlySchedule.push({
        year: currentYear,
        openingBalance: Math.round(currentYearOpening),
        totalEmi: Math.round(currentYearEmi),
        totalPrincipal: Math.round(currentYearPrincipal),
        totalInterest: Math.round(currentYearInterest),
        totalPrepayment: Math.round(currentYearPrepayment),
        closingBalance: Math.round(balance),
      });

      currentYearOpening = balance;
      currentYearEmi = 0;
      currentYearPrincipal = 0;
      currentYearInterest = 0;
      currentYearPrepayment = 0;
    }
  }

  const revisedTenureMonths = month;
  const tenureSavedMonths = Math.max(0, originalTenureMonths - revisedTenureMonths);
  const roundedRevisedInterest = Math.round(revisedTotalInterest);
  const interestSaved = Math.max(0, Math.round(originalTotalInterest - roundedRevisedInterest));
  const revisedTotalAmount = Math.round(loanAmount + roundedRevisedInterest);

  const comparisonData = [
    {
      name: "Original Loan Plan",
      value: originalTotalAmount,
      principal: loanAmount,
      interest: originalTotalInterest,
    },
    {
      name: "Optimized With Prepayments",
      value: revisedTotalAmount,
      principal: loanAmount,
      interest: roundedRevisedInterest,
    },
  ];

  return {
    originalEmi,
    originalTotalInterest,
    originalTotalAmount,
    originalTenureMonths,
    revisedTotalInterest: roundedRevisedInterest,
    revisedTotalAmount,
    revisedTenureMonths,
    tenureSavedMonths,
    interestSaved,
    yearlySchedule,
    comparisonData,
  };
}
