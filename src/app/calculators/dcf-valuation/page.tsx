"use client";

import React, { useState, useMemo } from "react";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import { calculateDcf, DcfInput } from "@/lib/calculators/dcf-valuation";
import { formatINR, formatPercent } from "@/lib/calculators/formatters";
import { generateFinancialPdfReport } from "@/lib/pdf/generate-report";
import { useAuth } from "@/context/auth-context";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Building2, Sparkles, Lock, ArrowUpRight, Grid, DollarSign } from "lucide-react";

export default function DcfValuationPage() {
  const { user, isPro, openPaywall } = useAuth();

  const [currentRevenue, setCurrentRevenue] = useState<number>(500000000); // 50 Crores
  const [growthRateYear1, setGrowthRateYear1] = useState<number>(25);
  const [growthRateYear2, setGrowthRateYear2] = useState<number>(20);
  const [growthRateYear3, setGrowthRateYear3] = useState<number>(18);
  const [growthRateYear4, setGrowthRateYear4] = useState<number>(15);
  const [growthRateYear5, setGrowthRateYear5] = useState<number>(12);
  const [ebitdaMargin, setEbitdaMargin] = useState<number>(24);
  const [taxRate, setTaxRate] = useState<number>(25);
  const [reinvestmentRate, setReinvestmentRate] = useState<number>(20);
  const [wacc, setWacc] = useState<number>(12.5);
  const [terminalGrowthRate, setTerminalGrowthRate] = useState<number>(4.5);
  const [cashAndEquivalents, setCashAndEquivalents] = useState<number>(80000000); // 8 Crores
  const [totalDebt, setTotalDebt] = useState<number>(120000000); // 12 Crores
  const [sharesOutstanding, setSharesOutstanding] = useState<number>(10000000); // 1 Crore shares

  const result = useMemo(() => {
    return calculateDcf({
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
      sharesOutstanding,
    });
  }, [
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
    sharesOutstanding,
  ]);

  const handleReset = () => {
    setCurrentRevenue(500000000);
    setGrowthRateYear1(25);
    setGrowthRateYear2(20);
    setGrowthRateYear3(18);
    setGrowthRateYear4(15);
    setGrowthRateYear5(12);
    setEbitdaMargin(24);
    setTaxRate(25);
    setReinvestmentRate(20);
    setWacc(12.5);
    setTerminalGrowthRate(4.5);
    setCashAndEquivalents(80000000);
    setTotalDebt(120000000);
    setSharesOutstanding(10000000);
  };

  const handleExportPdf = () => {
    generateFinancialPdfReport({
      title: "Discounted Cash Flow (DCF) Institutional Valuation Memo",
      category: "Taxation & Business Planners",
      clientName: user?.name || "Private Wealth Client",
      summaryMetrics: [
        { label: "Enterprise Value (EV)", value: formatINR(result.enterpriseValue, { compact: true }) },
        { label: "Equity Value", value: formatINR(result.equityValue, { compact: true }) },
        { label: "Implied Share Price", value: `₹${result.impliedSharePrice.toFixed(2)}` },
        { label: "WACC Discount Rate", value: `${wacc}%` },
        { label: "Terminal Growth (g)", value: `${terminalGrowthRate}%` },
      ],
      sections: [
        {
          title: "5-Year Free Cash Flow Projections (FCFF)",
          headers: ["Year", "Revenue", "EBITDA", "Tax", "CapEx / Reinv.", "FCFF", "PV of FCFF"],
          rows: result.projectionYears.map((p) => [
            `Year ${p.year}`,
            formatINR(p.revenue, { compact: true }),
            formatINR(p.ebitda, { compact: true }),
            formatINR(p.tax, { compact: true }),
            formatINR(p.reinvestment, { compact: true }),
            formatINR(p.fcff, { compact: true }),
            formatINR(p.pvFcff, { compact: true }),
          ]),
        },
        {
          title: "Enterprise to Equity Bridge",
          headers: ["Valuation Metric", "Value (INR)"],
          rows: [
            ["PV of 5-Year Discrete Cash Flows", formatINR(result.pvDiscreteCashFlows)],
            ["PV of Terminal Value (Gordon Growth)", formatINR(result.pvTerminalValue)],
            ["Enterprise Value (EV)", formatINR(result.enterpriseValue)],
            ["Add: Cash & Liquid Equivalents", formatINR(cashAndEquivalents)],
            ["Less: Total Outstanding Debt", `-${formatINR(totalDebt)}`],
            ["Net Equity Value", formatINR(result.equityValue)],
            ["Shares Outstanding", sharesOutstanding.toLocaleString("en-IN")],
            ["Implied Per Share Fair Value", `₹${result.impliedSharePrice.toFixed(2)}`],
          ],
        },
      ],
      advisorNotes: [
        `Valuation derived via 2-stage Gordon Growth DCF model discounting unlevered Free Cash Flows to Firm (FCFF).`,
        `Terminal value accounts for ${result.terminalValueContributionPercent}% of Enterprise Value at ${terminalGrowthRate}% perpetual growth.`,
      ],
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <CalculatorHeader
        id="dcf-valuation"
        title="Business Valuation (DCF Model)"
        category="Taxation & Business"
        categorySlug="tax-business"
        description="Institutional 5-year Discounted Cash Flow model forecasting unlevered Free Cash Flows to Firm (FCFF), Terminal Value, Enterprise Value, and 5x5 WACC sensitivity."
        isProOnly={true}
        onReset={handleReset}
        onExportPdf={handleExportPdf}
        currentInputs={{
          currentRevenue,
          wacc,
          terminalGrowthRate,
          ebitdaMargin,
          sharesOutstanding,
        }}
        summaryText={`EV: ${formatINR(result.enterpriseValue, { compact: true })} | Share: ₹${result.impliedSharePrice.toFixed(2)}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-400" />
              <span>Financial Model Assumptions</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
              Pro Simulator
            </span>
          </div>

          {/* Current Revenue */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Base Year Revenue (LTM)</label>
              <span className="font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {formatINR(currentRevenue, { compact: true })}
              </span>
            </div>
            <input
              type="number"
              step="10000000"
              value={currentRevenue}
              onChange={(e) => setCurrentRevenue(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white"
            />
          </div>

          {/* 5-Year Growth Forecast */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs font-bold text-slate-300 block mb-1">
              5-Year Revenue Growth Forecast (%)
            </span>
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400">Y1</label>
                <input
                  type="number"
                  value={growthRateYear1}
                  onChange={(e) => setGrowthRateYear1(Number(e.target.value))}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 p-1 text-center text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Y2</label>
                <input
                  type="number"
                  value={growthRateYear2}
                  onChange={(e) => setGrowthRateYear2(Number(e.target.value))}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 p-1 text-center text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Y3</label>
                <input
                  type="number"
                  value={growthRateYear3}
                  onChange={(e) => setGrowthRateYear3(Number(e.target.value))}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 p-1 text-center text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Y4</label>
                <input
                  type="number"
                  value={growthRateYear4}
                  onChange={(e) => setGrowthRateYear4(Number(e.target.value))}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 p-1 text-center text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Y5</label>
                <input
                  type="number"
                  value={growthRateYear5}
                  onChange={(e) => setGrowthRateYear5(Number(e.target.value))}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 p-1 text-center text-white"
                />
              </div>
            </div>
          </div>

          {/* Margins & Reinvestment */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">EBITDA Margin</label>
              <input
                type="number"
                step="0.5"
                value={ebitdaMargin}
                onChange={(e) => setEbitdaMargin(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-emerald-400 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Reinvestment</label>
              <input
                type="number"
                value={reinvestmentRate}
                onChange={(e) => setReinvestmentRate(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white"
              />
            </div>
          </div>

          {/* Discount Rate / WACC & Terminal Growth */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">WACC / Discount Rate (%)</label>
              <input
                type="number"
                step="0.25"
                value={wacc}
                onChange={(e) => setWacc(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-amber-400 font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Terminal Growth (g %)</label>
              <input
                type="number"
                step="0.25"
                value={terminalGrowthRate}
                onChange={(e) => setTerminalGrowthRate(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-teal-400 font-bold"
              />
            </div>
          </div>

          {/* Balance Sheet: Cash & Debt */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Cash on Hand (₹)</label>
              <input
                type="number"
                step="10000000"
                value={cashAndEquivalents}
                onChange={(e) => setCashAndEquivalents(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Total Debt (₹)</label>
              <input
                type="number"
                step="10000000"
                value={totalDebt}
                onChange={(e) => setTotalDebt(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-[11px] text-slate-400">Enterprise Value (EV)</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {formatINR(result.enterpriseValue, { compact: true })}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Firm Valuation</div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="text-[11px] text-emerald-300 font-semibold">Equity Value (Market Cap)</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                {formatINR(result.equityValue, { compact: true })}
              </div>
              <div className="text-[10px] text-emerald-500/80 mt-0.5">After Net Debt Bridge</div>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="text-[11px] text-amber-300 font-semibold">Implied Share Price</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
                ₹{result.impliedSharePrice.toFixed(2)}
              </div>
              <div className="text-[10px] text-amber-400/80 mt-0.5">Intrinsic Value / Share</div>
            </div>
          </div>

          {/* 5-Year FCFF Bar Chart */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-bold text-white mb-1">
              Projected Free Cash Flows to Firm (FCFF)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Discrete 5-Year Cash Flow & Present Value at {wacc}% WACC
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.projectionYears} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" tickFormatter={(y) => `Year ${y}`} stroke="#64748b" fontSize={11} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => (v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(val: number) => [formatINR(val), ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Bar dataKey="fcff" name="Nominal FCFF" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pvFcff" name="Discounted PV of FCFF" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 5x5 WACC vs Growth Sensitivity Matrix (Pro Gated) */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Grid className="h-4 w-4 text-amber-400" />
                  <span>5x5 Valuation Sensitivity Matrix (WACC vs. Growth)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Implied Equity Value (Crores) across macroeconomic stress tests
                </p>
              </div>
              <span className="text-xs text-amber-400 font-bold">Pro Simulator Feature</span>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-2 text-left">WACC \ g</th>
                    {result.sensitivityMatrix[0].map((cell, idx) => (
                      <th key={idx} className="p-2 text-slate-300">
                        {cell.terminalGrowth}%
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {result.sensitivityMatrix.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      <td className="p-2 text-left font-bold text-amber-400">{row[0].wacc}%</td>
                      {row.map((cell, colIdx) => (
                        <td
                          key={colIdx}
                          className={`p-2 font-mono ${
                            cell.wacc === wacc && cell.terminalGrowth === terminalGrowthRate
                              ? "bg-emerald-500/20 text-emerald-300 font-bold rounded-lg border border-emerald-500/40"
                              : "text-slate-300"
                          }`}
                        >
                          {formatINR(cell.equityValue, { compact: true })}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paywall Overlay if Free */}
            {!isPro && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                  <Lock className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">
                  Sensitivity Matrix Gated for Pro Subscribers
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Unlock all 25 dynamic stress-test scenarios, equity share pricing permutations, and vector PDF exports.
                </p>
                <button
                  onClick={() => openPaywall("DCF 5x5 Sensitivity Matrix")}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
                >
                  Unlock with Pro (₹999/mo)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
