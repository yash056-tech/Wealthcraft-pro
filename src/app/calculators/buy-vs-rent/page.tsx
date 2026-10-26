"use client";

import React, { useState, useMemo } from "react";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import { calculateBuyVsRent, BuyVsRentInput } from "@/lib/calculators/buy-vs-rent";
import { formatINR } from "@/lib/calculators/formatters";
import { generateFinancialPdfReport } from "@/lib/pdf/generate-report";
import { useAuth } from "@/context/auth-context";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Scale, Home, TrendingUp, DollarSign, Award } from "lucide-react";

export default function BuyVsRentPage() {
  const { user } = useAuth();

  const [propertyPrice, setPropertyPrice] = useState<number>(15000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [stampDutyPercent, setStampDutyPercent] = useState<number>(6.5);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [propertyAppreciationRate, setPropertyAppreciationRate] = useState<number>(7);
  const [annualMaintenancePercent, setAnnualMaintenancePercent] = useState<number>(1.2);
  const [monthlyRent, setMonthlyRent] = useState<number>(45000);
  const [annualRentInflation, setAnnualRentInflation] = useState<number>(7);
  const [investmentReturnRate, setInvestmentReturnRate] = useState<number>(12);
  const [horizonYears, setHorizonYears] = useState<number>(20);

  const result = useMemo(() => {
    return calculateBuyVsRent({
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
    });
  }, [
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
  ]);

  const handleReset = () => {
    setPropertyPrice(15000000);
    setDownPaymentPercent(20);
    setStampDutyPercent(6.5);
    setLoanInterestRate(8.5);
    setLoanTenureYears(20);
    setPropertyAppreciationRate(7);
    setAnnualMaintenancePercent(1.2);
    setMonthlyRent(45000);
    setAnnualRentInflation(7);
    setInvestmentReturnRate(12);
    setHorizonYears(20);
  };

  const handleExportPdf = () => {
    generateFinancialPdfReport({
      title: "Real Estate Buy vs. Rent Financial Parity Memo",
      category: "Real Estate & Property Analyzers",
      clientName: user?.name || "Private Wealth Client",
      summaryMetrics: [
        { label: "Recommended Strategy", value: result.winner === "Buy" ? "BUYING RECOMMENDED" : "RENTING & INVESTING" },
        { label: "Buyer 20Y Net Worth", value: formatINR(result.buyerNetWorthAtHorizon) },
        { label: "Renter 20Y Net Worth", value: formatINR(result.renterNetWorthAtHorizon) },
        { label: "Net Advantage", value: formatINR(result.differenceAtHorizon) },
        { label: "Break-Even Crossover", value: result.breakEvenYear ? `Year ${result.breakEvenYear}` : "Never in Horizon" },
      ],
      sections: [
        {
          title: "Buy vs. Rent Multi-Year Parity Trajectory",
          headers: ["Year", "Buyer Property Val", "Buyer Loan Debt", "Buyer Net Worth", "Renter Equity Portfolio", "Net Worth Parity"],
          rows: result.yearlyData.map((y) => [
            `Year ${y.year}`,
            formatINR(y.buyerPropertyVal),
            formatINR(y.buyerLoanBalance),
            formatINR(y.buyerNetWorth),
            formatINR(y.renterNetWorth),
            `${y.difference >= 0 ? "+" : ""}${formatINR(y.difference)}`,
          ]),
        },
      ],
      advisorNotes: [
        `Base Property: ${formatINR(propertyPrice)} with ${downPaymentPercent}% down payment and ${stampDutyPercent}% stamp duty/registration.`,
        `Alternative: Initial capital + monthly cashflow difference invested in diversified equities compounding at ${investmentReturnRate}% p.a.`,
        `Rent assumed at ${formatINR(monthlyRent)}/month escalating at ${annualRentInflation}% annual rental inflation.`,
      ],
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <CalculatorHeader
        id="buy-vs-rent"
        title="Buy vs. Rent Simulator"
        category="Real Estate & Property"
        categorySlug="real-estate"
        description="A mathematical 20-year showdown: compare homeownership equity (appreciation minus EMI & maintenance) against renting and investing the difference in equities."
        onReset={handleReset}
        onExportPdf={handleExportPdf}
        currentInputs={{
          propertyPrice,
          downPaymentPercent,
          monthlyRent,
          investmentReturnRate,
          propertyAppreciationRate,
          horizonYears,
        }}
        summaryText={`Verdict: ${result.winner.toUpperCase()} by ${formatINR(result.differenceAtHorizon, { compact: true })} | Break-Even: ${result.breakEvenYear ? `Yr ${result.breakEvenYear}` : "N/A"}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="h-4 w-4 text-emerald-400" />
              <span>Property & Investment Assumptions</span>
            </span>
            <span className="text-xs text-slate-400 font-semibold">{horizonYears} Year Horizon</span>
          </div>

          {/* Property Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Property Purchase Price</label>
              <span className="font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {formatINR(propertyPrice)}
              </span>
            </div>
            <input
              type="range"
              min="3000000"
              max="60000000"
              step="500000"
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Down Payment & Stamp Duty */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Down Payment (%)</label>
              <input
                type="number"
                min="10"
                max="50"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stamp Duty & Reg (%)</label>
              <input
                type="number"
                step="0.5"
                value={stampDutyPercent}
                onChange={(e) => setStampDutyPercent(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Rent & Appreciation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Rent for House</label>
              <input
                type="number"
                step="2000"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rent Inflation (% p.a.)</label>
              <input
                type="number"
                step="0.5"
                value={annualRentInflation}
                onChange={(e) => setAnnualRentInflation(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Growth Assumptions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Property Apprec (% p.a.)</label>
              <input
                type="number"
                step="0.5"
                value={propertyAppreciationRate}
                onChange={(e) => setPropertyAppreciationRate(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-emerald-400 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Equity Return (% p.a.)</label>
              <input
                type="number"
                step="0.5"
                value={investmentReturnRate}
                onChange={(e) => setInvestmentReturnRate(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-teal-400 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Winner Card */}
          <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-slate-900 to-amber-500/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                <span>30-YEAR PARITY VERDICT</span>
              </div>
              <div className="text-3xl font-black text-white">
                {result.winner === "Buy" ? "Buying Creates More Wealth" : "Renting & Investing Wins"}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Net wealth difference of{" "}
                <strong className="text-emerald-300">
                  {formatINR(result.differenceAtHorizon, { compact: true })}
                </strong>{" "}
                at year {horizonYears}.
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-slate-400">Break-Even Crossover</div>
              <div className="text-2xl font-black text-amber-400">
                {result.breakEvenYear ? `Year ${result.breakEvenYear}` : "Never"}
              </div>
              <div className="text-[11px] text-slate-400">
                Property: {formatINR(result.propertyValueAtHorizon, { compact: true })}
              </div>
            </div>
          </div>

          {/* Net Worth Progression Chart */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-bold text-white mb-1">
              Net Worth Showdown: Buyer Equity vs. Renter Investment Portfolio
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Realized Equity After Liquidating Loan vs. Equities Portfolio
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" tickFormatter={(y) => `Y${y}`} stroke="#64748b" fontSize={11} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => (v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(val: number) => [formatINR(val), ""]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Line
                    type="monotone"
                    dataKey="buyerNetWorth"
                    name="Buyer Net Worth (House - Loan)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="renterNetWorth"
                    name="Renter Net Worth (Equity Portfolio)"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
