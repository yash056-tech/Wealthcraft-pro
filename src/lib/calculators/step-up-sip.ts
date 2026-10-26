export interface StepUpSipInput {
  monthlySip: number;
  expectedReturn: number; // in %
  years: number;
  stepUpPercent: number; // in %
  inflationRate?: number; // in % (optional, default 6%)
}

export interface YearBreakdown {
  year: number;
  monthlySip: number;
  investedThisYear: number;
  cumulativeInvested: number;
  wealthGain: number;
  totalValue: number;
  inflationAdjustedValue: number;
}

export interface StepUpSipResult {
  totalInvested: number;
  totalWealthGain: number;
  futureValue: number;
  inflationAdjustedValue: number;
  wealthMultiplier: number;
  yearlyData: YearBreakdown[];
}

export function calculateStepUpSip(input: StepUpSipInput): StepUpSipResult {
  const { monthlySip, expectedReturn, years, stepUpPercent, inflationRate = 6 } = input;

  const monthlyRate = expectedReturn / 100 / 12;
  const yearlyData: YearBreakdown[] = [];

  let currentMonthlySip = monthlySip;
  let cumulativeInvested = 0;
  let currentPortfolioValue = 0;

  for (let year = 1; year <= years; year++) {
    let investedThisYear = 0;

    for (let month = 1; month <= 12; month++) {
      investedThisYear += currentMonthlySip;
      cumulativeInvested += currentMonthlySip;
      // Compounding at beginning of month
      currentPortfolioValue = (currentPortfolioValue + currentMonthlySip) * (1 + monthlyRate);
    }

    const wealthGain = currentPortfolioValue - cumulativeInvested;
    // Inflation discount factor (1 + inf)^year
    const inflationFactor = Math.pow(1 + inflationRate / 100, year);
    const inflationAdjustedValue = currentPortfolioValue / inflationFactor;

    yearlyData.push({
      year,
      monthlySip: Math.round(currentMonthlySip),
      investedThisYear: Math.round(investedThisYear),
      cumulativeInvested: Math.round(cumulativeInvested),
      wealthGain: Math.round(wealthGain),
      totalValue: Math.round(currentPortfolioValue),
      inflationAdjustedValue: Math.round(inflationAdjustedValue),
    });

    // Step-up for next year
    currentMonthlySip = currentMonthlySip * (1 + stepUpPercent / 100);
  }

  const futureValue = Math.round(currentPortfolioValue);
  const totalInvested = Math.round(cumulativeInvested);
  const totalWealthGain = Math.round(futureValue - totalInvested);
  const inflationAdjustedValue = Math.round(
    yearlyData[yearlyData.length - 1]?.inflationAdjustedValue || futureValue
  );
  const wealthMultiplier = totalInvested > 0 ? Number((futureValue / totalInvested).toFixed(2)) : 0;

  return {
    totalInvested,
    totalWealthGain,
    futureValue,
    inflationAdjustedValue,
    wealthMultiplier,
    yearlyData,
  };
}
