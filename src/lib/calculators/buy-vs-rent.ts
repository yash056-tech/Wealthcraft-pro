export interface BuyVsRentInput {
  propertyPrice: number; // e.g. 1,20,00,000 (1.2 Cr)
  downPaymentPercent: number; // e.g. 20%
  stampDutyPercent: number; // e.g. 6.5%
  loanInterestRate: number; // e.g. 8.5%
  loanTenureYears: number; // e.g. 20
  propertyAppreciationRate: number; // e.g. 7%
  annualMaintenancePercent: number; // e.g. 1.5%
  monthlyRent: number; // e.g. 35000
  annualRentInflation: number; // e.g. 7%
  investmentReturnRate: number; // e.g. 12% (Equity/MF)
  horizonYears: number; // e.g. 20
}

export interface YearBuyVsRent {
  year: number;
  buyerPropertyVal: number;
  buyerLoanBalance: number;
  buyerNetWorth: number;
  buyerAnnualOutflow: number;
  renterPortfolio: number;
  renterAnnualOutflow: number;
  renterNetWorth: number;
  difference: number; // Positive = Buyer ahead, Negative = Renter ahead
}

export interface BuyVsRentResult {
  buyerNetWorthAtHorizon: number;
  renterNetWorthAtHorizon: number;
  breakEvenYear: number | null;
  winner: "Buy" | "Rent";
  differenceAtHorizon: number;
  totalRentPaid: number;
  totalBuyerOutflow: number;
  propertyValueAtHorizon: number;
  yearlyData: YearBuyVsRent[];
}

export function calculateBuyVsRent(input: BuyVsRentInput): BuyVsRentResult {
  const {
    propertyPrice,
    downPaymentPercent,
    stampDutyPercent,
    loanInterestRate,
    loanTenureYears,
    propertyAppreciationRate,
    annualMaintenancePercent,
    monthlyRent,
    annualRentInflation,
    investmentReturnRate,
    horizonYears,
  } = input;

  const downPayment = propertyPrice * (downPaymentPercent / 100);
  const stampDutyAndRegistration = propertyPrice * (stampDutyPercent / 100);
  const upfrontBuyerCost = downPayment + stampDutyAndRegistration;

  const loanAmount = propertyPrice - downPayment;
  const loanMonths = loanTenureYears * 12;
  const monthlyLoanRate = loanInterestRate / 100 / 12;

  // Monthly EMI
  let monthlyEmi = 0;
  if (loanAmount > 0 && monthlyLoanRate > 0) {
    const factor = Math.pow(1 + monthlyLoanRate, loanMonths);
    monthlyEmi = (loanAmount * monthlyLoanRate * factor) / (factor - 1);
  }

  // Renter initial investment capital: Renter didn't pay upfrontBuyerCost, but may pay 3 months rent as refundable deposit
  const securityDeposit = monthlyRent * 3;
  let renterPortfolio = Math.max(0, upfrontBuyerCost - securityDeposit);

  let currentPropertyVal = propertyPrice;
  let currentLoanBalance = loanAmount;
  let currentMonthlyRent = monthlyRent;

  const monthlyInvRate = investmentReturnRate / 100 / 12;
  const yearlyData: YearBuyVsRent[] = [];

  let breakEvenYear: number | null = null;
  let totalRentPaid = 0;
  let totalBuyerOutflow = upfrontBuyerCost;

  for (let y = 1; y <= horizonYears; y++) {
    let buyerAnnualOutflowThisYear = 0;
    let renterAnnualOutflowThisYear = 0;

    // Monthly simulation for the year
    for (let m = 1; m <= 12; m++) {
      const monthIndex = (y - 1) * 12 + m;
      
      // Buyer costs
      let emiPaidThisMonth = 0;
      if (monthIndex <= loanMonths && currentLoanBalance > 0) {
        const interest = currentLoanBalance * monthlyLoanRate;
        const principal = Math.min(currentLoanBalance, monthlyEmi - interest);
        currentLoanBalance = Math.max(0, currentLoanBalance - principal);
        emiPaidThisMonth = interest + principal;
      }
      const maintenanceThisMonth = (currentPropertyVal * (annualMaintenancePercent / 100)) / 12;
      const totalBuyerMonth = emiPaidThisMonth + maintenanceThisMonth;
      buyerAnnualOutflowThisYear += totalBuyerMonth;

      // Renter costs
      const totalRenterMonth = currentMonthlyRent;
      renterAnnualOutflowThisYear += totalRenterMonth;
      totalRentPaid += totalRenterMonth;

      // Difference in monthly cash flow:
      // If buyer pays more than renter, renter invests the difference!
      // If renter pays more than buyer, renter portfolio is reduced or grows less
      const cashDifference = totalBuyerMonth - totalRenterMonth;
      renterPortfolio = renterPortfolio * (1 + monthlyInvRate) + cashDifference;
    }

    totalBuyerOutflow += buyerAnnualOutflowThisYear;

    // Year-end property appreciation
    currentPropertyVal = currentPropertyVal * (1 + propertyAppreciationRate / 100);

    // Year-end rent escalation
    currentMonthlyRent = currentMonthlyRent * (1 + annualRentInflation / 100);

    const buyerNetWorth = Math.round(currentPropertyVal - currentLoanBalance);
    const renterNetWorth = Math.round(renterPortfolio + securityDeposit);
    const diff = buyerNetWorth - renterNetWorth;

    if (diff > 0 && breakEvenYear === null) {
      breakEvenYear = y;
    }

    yearlyData.push({
      year: y,
      buyerPropertyVal: Math.round(currentPropertyVal),
      buyerLoanBalance: Math.round(currentLoanBalance),
      buyerNetWorth,
      buyerAnnualOutflow: Math.round(buyerAnnualOutflowThisYear),
      renterPortfolio: Math.round(renterPortfolio),
      renterAnnualOutflow: Math.round(renterAnnualOutflowThisYear),
      renterNetWorth,
      difference: diff,
    });
  }

  const finalYear = yearlyData[yearlyData.length - 1];
  const buyerNetWorthAtHorizon = finalYear ? finalYear.buyerNetWorth : 0;
  const renterNetWorthAtHorizon = finalYear ? finalYear.renterNetWorth : 0;
  const winner = buyerNetWorthAtHorizon >= renterNetWorthAtHorizon ? "Buy" : "Rent";
  const differenceAtHorizon = Math.abs(buyerNetWorthAtHorizon - renterNetWorthAtHorizon);

  return {
    buyerNetWorthAtHorizon,
    renterNetWorthAtHorizon,
    breakEvenYear,
    winner,
    differenceAtHorizon,
    totalRentPaid: Math.round(totalRentPaid),
    totalBuyerOutflow: Math.round(totalBuyerOutflow),
    propertyValueAtHorizon: Math.round(currentPropertyVal),
    yearlyData,
  };
}
