export interface PpfEpfInput {
  calcType: "combined" | "ppf" | "epf";
  // PPF Inputs
  ppfAnnualDeposit: number; // max 1,50,000
  ppfTenureYears: number; // 15, 20, 25, 30
  ppfRate: number; // default 7.1%
  // EPF Inputs
  monthlyBasicSalary: number; // Basic + DA
  currentAge: number;
  retirementAge: number;
  annualSalaryHike: number; // in %
  epfRate: number; // default 8.25%
  currentEpfBalance?: number;
}

export interface PpfYearData {
  year: number;
  openingBalance: number;
  deposit: number;
  interest: number;
  closingBalance: number;
}

export interface EpfYearData {
  year: number;
  age: number;
  monthlyBasic: number;
  employeeContribution: number;
  employerEpfContribution: number;
  employerEpsContribution: number;
  totalAnnualContribution: number;
  interest: number;
  closingBalance: number;
}

export interface PpfEpfResult {
  ppf: {
    totalDeposit: number;
    totalInterest: number;
    maturityCorpus: number;
    yearlyData: PpfYearData[];
  };
  epf: {
    totalEmployeeDeposit: number;
    totalEmployerEpfDeposit: number;
    totalEpsContribution: number;
    totalInterest: number;
    maturityCorpus: number;
    pensionAccumulation: number;
    yearlyData: EpfYearData[];
  };
  combinedCorpus: number;
  combinedInterestEarned: number;
  combinedInvested: number;
}

export function calculatePpfEpf(input: PpfEpfInput): PpfEpfResult {
  const {
    ppfAnnualDeposit = 150000,
    ppfTenureYears = 15,
    ppfRate = 7.1,
    monthlyBasicSalary = 50000,
    currentAge = 28,
    retirementAge = 58,
    annualSalaryHike = 8,
    epfRate = 8.25,
    currentEpfBalance = 0,
  } = input;

  // 1. PPF Calculation
  const boundedPpfDeposit = Math.min(150000, Math.max(500, ppfAnnualDeposit));
  let ppfBalance = 0;
  let ppfTotalDeposit = 0;
  let ppfTotalInterest = 0;
  const ppfYearlyData: PpfYearData[] = [];

  for (let y = 1; y <= ppfTenureYears; y++) {
    const opening = ppfBalance;
    const deposit = boundedPpfDeposit;
    ppfTotalDeposit += deposit;
    // Compounded annually on opening balance + deposit (assumed deposited before 5th April)
    const interest = Math.round((opening + deposit) * (ppfRate / 100));
    ppfTotalInterest += interest;
    ppfBalance = opening + deposit + interest;

    ppfYearlyData.push({
      year: y,
      openingBalance: Math.round(opening),
      deposit: Math.round(deposit),
      interest,
      closingBalance: Math.round(ppfBalance),
    });
  }

  // 2. EPF Calculation
  const epfTenure = Math.max(1, retirementAge - currentAge);
  let currentMonthlySalary = monthlyBasicSalary;
  let epfBalance = currentEpfBalance;
  let totalEmployeeDeposit = 0;
  let totalEmployerEpfDeposit = 0;
  let totalEpsContribution = 0;
  let totalEpfInterest = 0;
  const epfYearlyData: EpfYearData[] = [];

  for (let y = 1; y <= epfTenure; y++) {
    const age = currentAge + y - 1;
    // Employee: 12% of basic
    const employeeMonthly = currentMonthlySalary * 0.12;
    // Employer: 8.33% of basic capped at Rs 15,000 (i.e., Rs 1,250 max) to EPS, remainder of 12% to EPF (at least 3.67%)
    const epsMonthly = Math.min(1250, currentMonthlySalary * 0.0833);
    const employerEpfMonthly = (currentMonthlySalary * 0.12) - epsMonthly;

    const annualEmployee = Math.round(employeeMonthly * 12);
    const annualEmployerEpf = Math.round(employerEpfMonthly * 12);
    const annualEps = Math.round(epsMonthly * 12);

    totalEmployeeDeposit += annualEmployee;
    totalEmployerEpfDeposit += annualEmployerEpf;
    totalEpsContribution += annualEps;

    const totalAnnualToEpf = annualEmployee + annualEmployerEpf;

    // Monthly balance accrual interest (EPF rule: interest calculated on monthly running balance, credited at financial year end)
    // Approximation: Interest on opening balance for whole year + interest on contributions (average 6 months)
    const interestOnOpening = epfBalance * (epfRate / 100);
    const interestOnContrib = totalAnnualToEpf * (epfRate / 100) * (6.5 / 12);
    const yearInterest = Math.round(interestOnOpening + interestOnContrib);

    totalEpfInterest += yearInterest;
    epfBalance = epfBalance + totalAnnualToEpf + yearInterest;

    epfYearlyData.push({
      year: y,
      age,
      monthlyBasic: Math.round(currentMonthlySalary),
      employeeContribution: annualEmployee,
      employerEpfContribution: annualEmployerEpf,
      employerEpsContribution: annualEps,
      totalAnnualContribution: totalAnnualToEpf,
      interest: yearInterest,
      closingBalance: Math.round(epfBalance),
    });

    // Salary hike for next year
    currentMonthlySalary = currentMonthlySalary * (1 + annualSalaryHike / 100);
  }

  const ppfMaturityCorpus = Math.round(ppfBalance);
  const epfMaturityCorpus = Math.round(epfBalance);

  return {
    ppf: {
      totalDeposit: Math.round(ppfTotalDeposit),
      totalInterest: Math.round(ppfTotalInterest),
      maturityCorpus: ppfMaturityCorpus,
      yearlyData: ppfYearlyData,
    },
    epf: {
      totalEmployeeDeposit: Math.round(totalEmployeeDeposit),
      totalEmployerEpfDeposit: Math.round(totalEmployerEpfDeposit),
      totalEpsContribution: Math.round(totalEpsContribution),
      totalInterest: Math.round(totalEpfInterest),
      maturityCorpus: epfMaturityCorpus,
      pensionAccumulation: Math.round(totalEpsContribution),
      yearlyData: epfYearlyData,
    },
    combinedCorpus: ppfMaturityCorpus + epfMaturityCorpus,
    combinedInterestEarned: Math.round(ppfTotalInterest + totalEpfInterest),
    combinedInvested: Math.round(ppfTotalDeposit + totalEmployeeDeposit + totalEmployerEpfDeposit),
  };
}
