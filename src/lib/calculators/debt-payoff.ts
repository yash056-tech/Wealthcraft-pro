export interface DebtItem {
  id: string;
  name: string;
  balance: number; // in INR
  interestRate: number; // % APR
  minimumPayment: number; // in INR
}

export interface DebtPayoffSummary {
  method: "snowball" | "avalanche" | "minimum_only";
  totalMonths: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  debtEliminationOrder: {
    debtId: string;
    debtName: string;
    monthPaidOff: number;
  }[];
  monthlyBalances: {
    month: number;
    totalBalance: number;
    totalInterestPaidSoFar: number;
  }[];
}

export interface DebtPayoffComparisonResult {
  snowball: DebtPayoffSummary;
  avalanche: DebtPayoffSummary;
  minimumOnly: DebtPayoffSummary;
  interestSavedAvalancheVsSnowball: number;
  interestSavedAvalancheVsMinimum: number;
  interestSavedSnowballVsMinimum: number;
  monthsSavedAvalancheVsSnowball: number;
  monthsSavedAvalancheVsMinimum: number;
  bestMethod: "avalanche" | "snowball";
}

interface InternalDebtState {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPayment: number;
  isPaid: boolean;
  paidOffMonth?: number;
}

function simulatePayoff(
  initialDebts: DebtItem[],
  extraPayment: number,
  strategy: "snowball" | "avalanche" | "minimum_only"
): DebtPayoffSummary {
  const debts: InternalDebtState[] = initialDebts.map((d) => ({
    id: d.id,
    name: d.name,
    balance: d.balance,
    apr: d.interestRate,
    minPayment: d.minimumPayment,
    isPaid: d.balance <= 0,
  }));

  let month = 0;
  let totalInterest = 0;
  const debtEliminationOrder: { debtId: string; debtName: string; monthPaidOff: number }[] = [];
  const monthlyBalances: { month: number; totalBalance: number; totalInterestPaidSoFar: number }[] = [];

  const maxMonths = 360; // 30 years cap

  while (debts.some((d) => !d.isPaid) && month < maxMonths) {
    month++;
    let monthlyFreedUpCash = 0;

    // 1. Accrue monthly interest on active debts
    for (const d of debts) {
      if (!d.isPaid) {
        const monthlyRate = d.apr / 100 / 12;
        const interest = d.balance * monthlyRate;
        totalInterest += interest;
        d.balance += interest;
      }
    }

    // 2. Pay minimums
    for (const d of debts) {
      if (!d.isPaid) {
        if (d.balance <= d.minPayment) {
          monthlyFreedUpCash += d.minPayment - d.balance;
          d.balance = 0;
          d.isPaid = true;
          d.paidOffMonth = month;
          debtEliminationOrder.push({ debtId: d.id, debtName: d.name, monthPaidOff: month });
        } else {
          d.balance -= d.minPayment;
        }
      }
    }

    // 3. Apply extra payment & rollover freed cash to priority debt
    if (strategy !== "minimum_only") {
      let pool = extraPayment + monthlyFreedUpCash;

      // Add minimum payments of already-cleared debts into rollover pool
      for (const d of debts) {
        if (d.isPaid && d.paidOffMonth !== undefined && d.paidOffMonth < month) {
          pool += d.minPayment;
        }
      }

      while (pool > 0.01 && debts.some((d) => !d.isPaid)) {
        // Sort active debts by strategy
        const activeDebts = debts.filter((d) => !d.isPaid);
        if (strategy === "snowball") {
          activeDebts.sort((a, b) => a.balance - b.balance);
        } else if (strategy === "avalanche") {
          activeDebts.sort((a, b) => b.apr - a.apr);
        }

        const targetDebt = activeDebts[0];
        if (!targetDebt) break;

        if (pool >= targetDebt.balance) {
          pool -= targetDebt.balance;
          targetDebt.balance = 0;
          targetDebt.isPaid = true;
          targetDebt.paidOffMonth = month;
          debtEliminationOrder.push({ debtId: targetDebt.id, debtName: targetDebt.name, monthPaidOff: month });
        } else {
          targetDebt.balance -= pool;
          pool = 0;
        }
      }
    }

    const currentTotalBalance = debts.reduce((sum, d) => sum + Math.max(0, d.balance), 0);
    monthlyBalances.push({
      month,
      totalBalance: Math.round(currentTotalBalance),
      totalInterestPaidSoFar: Math.round(totalInterest),
    });
  }

  const initialPrincipal = initialDebts.reduce((sum, d) => sum + d.balance, 0);

  return {
    method: strategy,
    totalMonths: month,
    totalInterestPaid: Math.round(totalInterest),
    totalAmountPaid: Math.round(initialPrincipal + totalInterest),
    debtEliminationOrder,
    monthlyBalances,
  };
}

export function calculateDebtPayoffComparison(
  debts: DebtItem[],
  extraMonthlyPayment: number
): DebtPayoffComparisonResult {
  const validDebts = debts.filter((d) => d.balance > 0 && d.minimumPayment > 0);

  const snowball = simulatePayoff(validDebts, extraMonthlyPayment, "snowball");
  const avalanche = simulatePayoff(validDebts, extraMonthlyPayment, "avalanche");
  const minimumOnly = simulatePayoff(validDebts, 0, "minimum_only");

  const interestSavedAvalancheVsSnowball = Math.max(0, snowball.totalInterestPaid - avalanche.totalInterestPaid);
  const interestSavedAvalancheVsMinimum = Math.max(0, minimumOnly.totalInterestPaid - avalanche.totalInterestPaid);
  const interestSavedSnowballVsMinimum = Math.max(0, minimumOnly.totalInterestPaid - snowball.totalInterestPaid);

  const monthsSavedAvalancheVsSnowball = Math.max(0, snowball.totalMonths - avalanche.totalMonths);
  const monthsSavedAvalancheVsMinimum = Math.max(0, minimumOnly.totalMonths - avalanche.totalMonths);

  return {
    snowball,
    avalanche,
    minimumOnly,
    interestSavedAvalancheVsSnowball,
    interestSavedAvalancheVsMinimum,
    interestSavedSnowballVsMinimum,
    monthsSavedAvalancheVsSnowball,
    monthsSavedAvalancheVsMinimum,
    bestMethod: avalanche.totalInterestPaid <= snowball.totalInterestPaid ? "avalanche" : "snowball",
  };
}
