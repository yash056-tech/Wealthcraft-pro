export interface DcfInput {
  currentRevenue: number; // in INR (e.g. 50,00,00,000 for 50 Cr)
  growthRateYear1: number; // in %
  growthRateYear2: number;
  growthRateYear3: number;
  growthRateYear4: number;
  growthRateYear5: number;
  ebitdaMargin: number; // in % (e.g. 25%)
  taxRate: number; // in % (e.g. 25%)
  reinvestmentRate: number; // CapEx + WC as % of EBITDA (e.g. 20%)
  wacc: number; // Weighted Average Cost of Capital % (e.g. 12%)
  terminalGrowthRate: number; // Perpetual growth % (e.g. 4.5%)
  cashAndEquivalents: number;
  totalDebt: number;
  sharesOutstanding?: number;
}

export interface DcfYearData {
  year: number;
  growthRate: number;
  revenue: number;
  ebitda: number;
  tax: number;
  reinvestment: number;
  fcff: number; // Free Cash Flow to Firm
  discountFactor: number;
  pvFcff: number;
}

export interface SensitivityCell {
  wacc: number;
  terminalGrowth: number;
  enterpriseValue: number;
  equityValue: number;
  sharePrice?: number;
}

export interface DcfResult {
  projectionYears: DcfYearData[];
  pvDiscreteCashFlows: number;
  terminalYearFcff: number;
  terminalValue: number;
  pvTerminalValue: number;
  enterpriseValue: number;
  equityValue: number;
  impliedSharePrice: number;
  terminalValueContributionPercent: number;
  sensitivityMatrix: SensitivityCell[][];
}

export function calculateDcf(input: DcfInput): DcfResult {
  const {
    currentRevenue,
    growthRateYear1,
    growthRateYear2,
    growthRateYear3,
    growthRateYear4,
    growthRateYear5,
    ebitdaMargin,
    taxRate,
    reinvestmentRate,
    wacc,
    terminalGrowthRate,
    cashAndEquivalents,
    totalDebt,
    sharesOutstanding = 10000000,
  } = input;

  const growthRates = [
    growthRateYear1,
    growthRateYear2,
    growthRateYear3,
    growthRateYear4,
    growthRateYear5,
  ];

  const waccDecimal = Math.max(0.01, wacc / 100);
  const terminalGrowthDecimal = Math.min(waccDecimal - 0.01, Math.max(0.01, terminalGrowthRate / 100));

  let prevRevenue = currentRevenue;
  let pvDiscreteCashFlows = 0;
  const projectionYears: DcfYearData[] = [];

  for (let t = 1; t <= 5; t++) {
    const g = growthRates[t - 1] / 100;
    const revenue = prevRevenue * (1 + g);
    const ebitda = revenue * (ebitdaMargin / 100);
    const tax = ebitda * (taxRate / 100);
    const reinvestment = ebitda * (reinvestmentRate / 100);
    const fcff = ebitda - tax - reinvestment;

    const discountFactor = 1 / Math.pow(1 + waccDecimal, t);
    const pvFcff = fcff * discountFactor;

    pvDiscreteCashFlows += pvFcff;

    projectionYears.push({
      year: t,
      growthRate: growthRates[t - 1],
      revenue: Math.round(revenue),
      ebitda: Math.round(ebitda),
      tax: Math.round(tax),
      reinvestment: Math.round(reinvestment),
      fcff: Math.round(fcff),
      discountFactor: Number(discountFactor.toFixed(4)),
      pvFcff: Math.round(pvFcff),
    });

    prevRevenue = revenue;
  }

  // Terminal Value (Gordon Growth Model)
  const lastFcff = projectionYears[projectionYears.length - 1].fcff;
  const terminalYearFcff = lastFcff * (1 + terminalGrowthDecimal);
  const terminalValue = terminalYearFcff / (waccDecimal - terminalGrowthDecimal);
  const pvTerminalValue = terminalValue / Math.pow(1 + waccDecimal, 5);

  const enterpriseValue = pvDiscreteCashFlows + pvTerminalValue;
  const equityValue = enterpriseValue + cashAndEquivalents - totalDebt;
  const impliedSharePrice = sharesOutstanding > 0 ? equityValue / sharesOutstanding : 0;
  const terminalValueContributionPercent =
    enterpriseValue > 0 ? (pvTerminalValue / enterpriseValue) * 100 : 0;

  // 5x5 Sensitivity Matrix
  const waccDeltas = [-2, -1, 0, 1, 2];
  const gDeltas = [-1, -0.5, 0, 0.5, 1];
  const sensitivityMatrix: SensitivityCell[][] = [];

  for (const wDelta of waccDeltas) {
    const row: SensitivityCell[] = [];
    const simWaccPct = Math.max(3, wacc + wDelta);
    const simWacc = simWaccPct / 100;

    for (const gDelta of gDeltas) {
      const simGPct = Math.min(simWaccPct - 1, Math.max(1, terminalGrowthRate + gDelta));
      const simG = simGPct / 100;

      // Re-sum PV with simWacc
      let simPvDiscrete = 0;
      for (let t = 1; t <= 5; t++) {
        const fcff = projectionYears[t - 1].fcff;
        simPvDiscrete += fcff / Math.pow(1 + simWacc, t);
      }
      const simTv = (lastFcff * (1 + simG)) / (simWacc - simG);
      const simPvTv = simTv / Math.pow(1 + simWacc, 5);
      const simEv = simPvDiscrete + simPvTv;
      const simEq = simEv + cashAndEquivalents - totalDebt;

      row.push({
        wacc: simWaccPct,
        terminalGrowth: simGPct,
        enterpriseValue: Math.round(simEv),
        equityValue: Math.round(simEq),
        sharePrice: sharesOutstanding > 0 ? Number((simEq / sharesOutstanding).toFixed(2)) : undefined,
      });
    }
    sensitivityMatrix.push(row);
  }

  return {
    projectionYears,
    pvDiscreteCashFlows: Math.round(pvDiscreteCashFlows),
    terminalYearFcff: Math.round(terminalYearFcff),
    terminalValue: Math.round(terminalValue),
    pvTerminalValue: Math.round(pvTerminalValue),
    enterpriseValue: Math.round(enterpriseValue),
    equityValue: Math.round(equityValue),
    impliedSharePrice: Number(impliedSharePrice.toFixed(2)),
    terminalValueContributionPercent: Number(terminalValueContributionPercent.toFixed(1)),
    sensitivityMatrix,
  };
}
