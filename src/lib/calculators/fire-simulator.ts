export interface FireInput {
  currentAge: number;
  desiredRetirementAge: number;
  currentMonthlyExpenses: number;
  inflationRate: number; // % p.a.
  preRetirementReturn: number; // % p.a.
  postRetirementReturn: number; // % p.a.
  currentPortfolio: number;
  monthlySavings: number;
  savingsStepUp: number; // % annual increase in savings
  swr: number; // Safe Withdrawal Rate %, default 3.5% or 4%
  lifeExpectancy?: number; // default 85
}

export interface FireYearTrajectory {
  year: number;
  age: number;
  status: "Accumulating" | "FIRE Achieved" | "Retired" | "Portfolio Depleted";
  portfolioStart: number;
  annualSavings: number;
  annualExpenses: number;
  investmentReturns: number;
  portfolioEnd: number;
}

export interface FireResult {
  fireAge: number;
  fireYear: number;
  yearsToFire: number;
  isFireAchievedByTarget: boolean;
  requiredFireCorpus: number;
  leanFireCorpus: number;
  fatFireCorpus: number;
  coastFireCorpus: number;
  monthlyExpenseAtRetirement: number;
  annualExpenseAtRetirement: number;
  portfolioAtRetirement: number;
  portfolioAtLifeEnd: number;
  runwayYears: number;
  trajectory: FireYearTrajectory[];
}

export function calculateFire(input: FireInput): FireResult {
  const {
    currentAge,
    desiredRetirementAge,
    currentMonthlyExpenses,
    inflationRate,
    preRetirementReturn,
    postRetirementReturn,
    currentPortfolio,
    monthlySavings,
    savingsStepUp,
    swr = 3.5,
    lifeExpectancy = 85,
  } = input;

  const currentYear = new Date().getFullYear();
  const trajectory: FireYearTrajectory[] = [];

  let portfolio = currentPortfolio;
  let currentMonthlySav = monthlySavings;
  let fireAchievedAge = -1;
  let fireAchievedYear = -1;
  let portfolioAtDesiredRetirement = 0;

  const totalSimulationYears = Math.max(1, lifeExpectancy - currentAge);

  for (let i = 0; i <= totalSimulationYears; i++) {
    const age = currentAge + i;
    const simYear = currentYear + i;

    // Inflation-adjusted monthly & annual expenses
    const inflationFactor = Math.pow(1 + inflationRate / 100, i);
    const annualExpenses = currentMonthlyExpenses * 12 * inflationFactor;

    // FIRE corpus requirement at this specific age
    const currentRequiredCorpus = annualExpenses / (swr / 100);

    let status: FireYearTrajectory["status"] = "Accumulating";
    let annualSavings = 0;
    let returns = 0;
    const portfolioStart = Math.round(portfolio);

    // Check if user has retired or reached target retirement age
    const isRetired = age >= desiredRetirementAge;

    if (portfolio >= currentRequiredCorpus && fireAchievedAge === -1) {
      fireAchievedAge = age;
      fireAchievedYear = simYear;
    }

    if (!isRetired) {
      status = portfolio >= currentRequiredCorpus ? "FIRE Achieved" : "Accumulating";
      annualSavings = Math.round(currentMonthlySav * 12);
      returns = Math.round((portfolio + annualSavings / 2) * (preRetirementReturn / 100));
      portfolio = portfolio + annualSavings + returns;
      currentMonthlySav = currentMonthlySav * (1 + savingsStepUp / 100);
    } else {
      if (age === desiredRetirementAge) {
        portfolioAtDesiredRetirement = Math.round(portfolio);
      }
      if (portfolio <= 0) {
        status = "Portfolio Depleted";
        portfolio = 0;
        annualSavings = 0;
        returns = 0;
      } else {
        status = "Retired";
        returns = Math.round((portfolio - annualExpenses / 2) * (postRetirementReturn / 100));
        portfolio = portfolio + returns - annualExpenses;
        if (portfolio < 0) portfolio = 0;
      }
    }

    trajectory.push({
      year: simYear,
      age,
      status,
      portfolioStart,
      annualSavings,
      annualExpenses: Math.round(annualExpenses),
      investmentReturns: returns,
      portfolioEnd: Math.round(portfolio),
    });
  }

  // Desired retirement metrics
  const yearsToDesired = Math.max(0, desiredRetirementAge - currentAge);
  const inflationAtRetirement = Math.pow(1 + inflationRate / 100, yearsToDesired);
  const annualExpenseAtRetirement = Math.round(currentMonthlyExpenses * 12 * inflationAtRetirement);
  const monthlyExpenseAtRetirement = Math.round(annualExpenseAtRetirement / 12);

  // Standard FIRE: 100% expenses / SWR
  const requiredFireCorpus = Math.round(annualExpenseAtRetirement / (swr / 100));
  // Lean FIRE: 75% expenses
  const leanFireCorpus = Math.round((annualExpenseAtRetirement * 0.75) / (swr / 100));
  // Fat FIRE: 140% expenses
  const fatFireCorpus = Math.round((annualExpenseAtRetirement * 1.4) / (swr / 100));

  // Coast FIRE: Amount needed right now which, if compounded at preRetirementReturn without extra savings, reaches requiredFireCorpus
  const coastFireCorpus = Math.round(
    requiredFireCorpus / Math.pow(1 + preRetirementReturn / 100, yearsToDesired)
  );

  const effectiveFireAge = fireAchievedAge !== -1 ? fireAchievedAge : desiredRetirementAge;
  const effectiveFireYear = fireAchievedYear !== -1 ? fireAchievedYear : currentYear + yearsToDesired;
  const isFireAchievedByTarget = fireAchievedAge !== -1 && fireAchievedAge <= desiredRetirementAge;

  // Runway calculation
  let runwayYears = 0;
  for (const t of trajectory) {
    if (t.age >= desiredRetirementAge) {
      if (t.portfolioEnd > 0) runwayYears++;
    }
  }

  return {
    fireAge: effectiveFireAge,
    fireYear: effectiveFireYear,
    yearsToFire: Math.max(0, effectiveFireAge - currentAge),
    isFireAchievedByTarget,
    requiredFireCorpus,
    leanFireCorpus,
    fatFireCorpus,
    coastFireCorpus,
    monthlyExpenseAtRetirement,
    annualExpenseAtRetirement,
    portfolioAtRetirement: portfolioAtDesiredRetirement || Math.round(portfolio),
    portfolioAtLifeEnd: trajectory[trajectory.length - 1]?.portfolioEnd || 0,
    runwayYears,
    trajectory,
  };
}
