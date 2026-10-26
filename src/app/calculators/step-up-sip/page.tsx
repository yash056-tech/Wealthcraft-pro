"use client";

import React, { useState, useMemo } from "react";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import { calculateStepUpSip, StepUpSipInput } from "@/lib/calculators/step-up-sip";
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
import { TrendingUp, ShieldAlert, Sparkles, Layers } from "lucide-react";

export default function StepUpSipPage() {
  const { user } = useAuth();

  const [monthlySip, setMonthlySip] = useState<number>(25000);
  const [expectedReturn, setExpectedReturn] = useState<number>(13);
  const [years, setYears] = useState<number>(15);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(6);

  const result = useMemo(() => {
    return calculateStepUpSip({
      monthlySip,
      expectedReturn,
      years,
      stepUpPercent,
      inflationRate,
    });
  }, [monthlySip, expectedReturn, years, stepUpPercent, inflationRate]);

  const handleReset = () => {
    setMonthlySip(25000);
    setExpectedReturn(13);
    setYears(15);
    setStepUpPercent(10);
    setInflationRate(6);
  };

  const handleExportPdf = () => {
    generateFinancialPdfReport({
      title: "Step-Up SIP Wealth Creation Blueprint",
      category: "Wealth & Retirement Projectors",
      clientName: user?.name || "Private Wealth Client",
      summaryMetrics: [
        { label: "Total Invested", value: formatINR(result.totalInvested) },
        { label: "Estimated Wealth Gain", value: formatINR(result.totalWealthGain) },
        { label: "Total Maturity Corpus", value: formatINR(result.futureValue) },
        { label: "Inflation-Adjusted Value", value: formatINR(result.inflationAdjustedValue) },
        { label: "Wealth Multiplier", value: `${result.wealthMultiplier}x` },
      ],
      sections: [
        {
          title: "Year-by-Year Step-Up Compounding Schedule",
          headers: ["Year", "Monthly SIP", "Annual Deposit", "Total Invested", "Wealth Gain", "Portfolio Value"],
          rows: result.yearlyData.map((d) => [
            `Year ${d.year}`,
            formatINR(d.monthlySip),
            formatINR(d.investedThisYear),
            formatINR(d.cumulativeInvested),
            formatINR(d.wealthGain),
            formatINR(d.totalValue),
          ]),
        },
      ],
      advisorNotes: [
        `Base Monthly SIP of ${formatINR(monthlySip)} stepped up by ${stepUpPercent}% annually over ${years} years.`,
        `Assumed market return of ${expectedReturn}% p.a. compounded monthly.`,
        `Real purchasing power estimated at ${inflationRate}% annual inflation rate.`,
      ],
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <CalculatorHeader
        id="step-up-sip"
        title="Step-Up SIP Calculator"
        category="Wealth & Retirement"
        categorySlug="wealth"
        description="Model the compounding power of boosting your monthly Systematic Investment Plan annually as your income expands."
        onReset={handleReset}
        onExportPdf={handleExportPdf}
        currentInputs={{ monthlySip, expectedReturn, years, stepUpPercent, inflationRate }}
        summaryText={`Total Corpus: ${formatINR(result.futureValue, { compact: true })} (${result.wealthMultiplier}x multiplier)`}
      />

      {/* Main Grid: Inputs Column & Outputs Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>Investment Parameters</span>
            </span>
            <span className="text-xs text-slate-400">INR (₹)</span>
          </div>

          {/* Monthly SIP Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Initial Monthly SIP</label>
              <div className="flex items-center gap-1 font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                <span>₹</span>
                <input
                  type="number"
                  min="500"
                  max="10000000"
                  step="500"
                  value={monthlySip}
                  onChange={(e) => setMonthlySip(Number(e.target.value))}
                  className="w-24 bg-transparent text-right focus:outline-none"
                />
              </div>
            </div>
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={monthlySip}
              onChange={(e) => setMonthlySip(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹1k</span>
              <span>₹50k</span>
              <span>₹1 Lakh</span>
              <span>₹2 Lakhs</span>
            </div>
          </div>

          {/* Expected Return Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Expected Annual Return (%)</label>
              <span className="font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {expectedReturn}% p.a.
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="24"
              step="0.5"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>8% (Debt/Hybrid)</span>
              <span>12% (Nifty 50)</span>
              <span>15% (Midcap)</span>
              <span>20% (Aggressive)</span>
            </div>
          </div>

          {/* Time Horizon */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Time Period (Years)</label>
              <span className="font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {years} Years
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>5 yrs</span>
              <span>10 yrs</span>
              <span>20 yrs</span>
              <span>30 yrs</span>
            </div>
          </div>

          {/* Annual Step-Up Increment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Annual Step-Up Increment (%)</label>
              <span className="font-bold text-amber-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                +{stepUpPercent}% / year
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={stepUpPercent}
              onChange={(e) => setStepUpPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (Flat SIP)</span>
              <span>5% (Inflation)</span>
              <span>10% (Career Hike)</span>
              <span>20% (Fast Track)</span>
            </div>
          </div>

          {/* Inflation Rate Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-400">Assumed Inflation Rate (%)</label>
              <span className="text-xs text-slate-300">{inflationRate}%</span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              step="0.5"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right Output & Visualization Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Metric Highlight Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-[11px] text-slate-400">Total Invested</div>
              <div className="text-xl sm:text-2xl font-black text-slate-200 mt-1">
                {formatINR(result.totalInvested, { compact: true })}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{formatINR(result.totalInvested)}</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-[11px] text-slate-400">Estimated Wealth Gain</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                {formatINR(result.totalWealthGain, { compact: true })}
              </div>
              <div className="text-[10px] text-emerald-500/80 mt-0.5">Capital Compounding</div>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="text-[11px] text-amber-300 font-semibold">Total Maturity Value</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {formatINR(result.futureValue, { compact: true })}
              </div>
              <div className="text-[10px] text-amber-400/90 mt-0.5">
                {result.wealthMultiplier}x Wealth Multiplier
              </div>
            </div>
          </div>

          {/* Interactive Recharts Graph */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Cumulative Wealth Trajectory</h3>
                <p className="text-xs text-slate-400">Invested Capital vs. Compound Maturity Value</p>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Purchasing Power (Real): <strong className="text-emerald-400">{formatINR(result.inflationAdjustedValue, { compact: true })}</strong>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.yearlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" tickFormatter={(v) => `Y${v}`} stroke="#64748b" fontSize={11} />
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
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="cumulativeInvested" name="Invested Capital" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalValue" name="Total Wealth" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Year-by-Year Table Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 overflow-x-auto">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Year-by-Year Compounding Breakdown
            </h4>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">Year</th>
                  <th className="pb-2">Monthly SIP</th>
                  <th className="pb-2">Annual Invested</th>
                  <th className="pb-2">Cumulative Invested</th>
                  <th className="pb-2 text-right">Portfolio Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {result.yearlyData.slice(0, 10).map((row) => (
                  <tr key={row.year} className="hover:bg-slate-800/30">
                    <td className="py-2 font-medium">Year {row.year}</td>
                    <td className="py-2 text-slate-400">{formatINR(row.monthlySip)}</td>
                    <td className="py-2">{formatINR(row.investedThisYear)}</td>
                    <td className="py-2 text-slate-400">{formatINR(row.cumulativeInvested)}</td>
                    <td className="py-2 text-right font-bold text-emerald-400">{formatINR(row.totalValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.yearlyData.length > 10 && (
              <p className="text-[11px] text-slate-500 text-center mt-3">
                Showing first 10 years of {result.yearlyData.length} years. Export Executive PDF report for complete table.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
