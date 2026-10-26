"use client";

import React, { useState, useMemo } from "react";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import { calculateFire, FireInput } from "@/lib/calculators/fire-simulator";
import { formatINR } from "@/lib/calculators/formatters";
import { generateFinancialPdfReport } from "@/lib/pdf/generate-report";
import { useAuth } from "@/context/auth-context";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Flame, Compass, Shield, Award, CheckCircle2, AlertTriangle } from "lucide-react";

export default function FireSimulatorPage() {
  const { user } = useAuth();

  const [currentAge, setCurrentAge] = useState<number>(31);
  const [desiredRetirementAge, setDesiredRetirementAge] = useState<number>(43);
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState<number>(85000);
  const [inflationRate, setInflationRate] = useState<number>(6.5);
  const [preRetirementReturn, setPreRetirementReturn] = useState<number>(13);
  const [postRetirementReturn, setPostRetirementReturn] = useState<number>(8.5);
  const [currentPortfolio, setCurrentPortfolio] = useState<number>(3500000);
  const [monthlySavings, setMonthlySavings] = useState<number>(75000);
  const [savingsStepUp, setSavingsStepUp] = useState<number>(10);
  const [swr, setSwr] = useState<number>(3.5);

  const result = useMemo(() => {
    return calculateFire({
      currentAge,
      desiredRetirementAge,
      currentMonthlyExpenses,
      inflationRate,
      preRetirementReturn,
      postRetirementReturn,
      currentPortfolio,
      monthlySavings,
      savingsStepUp,
      swr,
      lifeExpectancy: 85,
    });
  }, [
    currentAge,
    desiredRetirementAge,
    currentMonthlyExpenses,
    inflationRate,
    preRetirementReturn,
    postRetirementReturn,
    currentPortfolio,
    monthlySavings,
    savingsStepUp,
    swr,
  ]);

  const handleReset = () => {
    setCurrentAge(31);
    setDesiredRetirementAge(43);
    setCurrentMonthlyExpenses(85000);
    setInflationRate(6.5);
    setPreRetirementReturn(13);
    setPostRetirementReturn(8.5);
    setCurrentPortfolio(3500000);
    setMonthlySavings(75000);
    setSavingsStepUp(10);
    setSwr(3.5);
  };

  const handleExportPdf = () => {
    generateFinancialPdfReport({
      title: "FIRE Financial Independence Strategic Roadmap",
      category: "Wealth & Retirement Projectors",
      clientName: user?.name || "Private Wealth Client",
      summaryMetrics: [
        { label: "Target FIRE Corpus", value: formatINR(result.requiredFireCorpus) },
        { label: "Target FIRE Age", value: `Age ${result.fireAge} (${result.fireYear})` },
        { label: "Monthly Expense at FIRE", value: formatINR(result.monthlyExpenseAtRetirement) },
        { label: "Lean FIRE Number", value: formatINR(result.leanFireCorpus) },
        { label: "Fat FIRE Number", value: formatINR(result.fatFireCorpus) },
        { label: "Coast FIRE Number", value: formatINR(result.coastFireCorpus) },
      ],
      sections: [
        {
          title: "Net Worth Trajectory (Accumulation & Decumulation)",
          headers: ["Age", "Year", "Status", "Annual Expenses", "Portfolio Value"],
          rows: result.trajectory
            .filter((_, idx) => idx % 2 === 0 || idx === result.trajectory.length - 1)
            .map((t) => [
              `Age ${t.age}`,
              `${t.year}`,
              t.status,
              formatINR(t.annualExpenses),
              formatINR(t.portfolioEnd),
            ]),
        },
      ],
      advisorNotes: [
        `Safe Withdrawal Rate (SWR) configured at ${swr}% p.a.`,
        `Pre-retirement equity compounding at ${preRetirementReturn}%, transitioning to ${postRetirementReturn}% balanced portfolio in retirement.`,
        `Includes annual savings escalation of ${savingsStepUp}% linked to career earnings.`,
      ],
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <CalculatorHeader
        id="fire-simulator"
        title="FIRE Simulator (Financial Independence, Retire Early)"
        category="Wealth & Retirement"
        categorySlug="wealth"
        description="Pinpoint your exact financial freedom milestone with Lean, Standard, and Fat FIRE targets, inflation-adjusted expense modeling, and 40-year portfolio longevity."
        onReset={handleReset}
        onExportPdf={handleExportPdf}
        currentInputs={{
          currentAge,
          desiredRetirementAge,
          currentMonthlyExpenses,
          inflationRate,
          currentPortfolio,
          monthlySavings,
          swr,
        }}
        summaryText={`FIRE Corpus: ${formatINR(result.requiredFireCorpus, { compact: true })} by Year ${result.fireYear} (Age ${result.fireAge})`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>FIRE Assumptions</span>
            </span>
            <span className="text-xs text-amber-400 font-semibold">{swr}% SWR</span>
          </div>

          {/* Ages */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Age</label>
              <input
                type="number"
                min="20"
                max="60"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Desired FIRE Age</label>
              <input
                type="number"
                min="25"
                max="75"
                value={desiredRetirementAge}
                onChange={(e) => setDesiredRetirementAge(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Current Monthly Expenses */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Current Monthly Expenses</label>
              <span className="font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {formatINR(currentMonthlyExpenses)}
              </span>
            </div>
            <input
              type="range"
              min="25000"
              max="500000"
              step="5000"
              value={currentMonthlyExpenses}
              onChange={(e) => setCurrentMonthlyExpenses(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Current Portfolio & Monthly Savings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Portfolio (₹)</label>
              <input
                type="number"
                step="50000"
                value={currentPortfolio}
                onChange={(e) => setCurrentPortfolio(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Savings (₹)</label>
              <input
                type="number"
                step="5000"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-emerald-400 font-bold"
              />
            </div>
          </div>

          {/* Rates */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Inflation</label>
              <input
                type="number"
                step="0.1"
                value={inflationRate}
                onChange={(e) => setInflationRate(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Pre-Ret Return</label>
              <input
                type="number"
                step="0.5"
                value={preRetirementReturn}
                onChange={(e) => setPreRetirementReturn(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-emerald-400"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Post-Ret Return</label>
              <input
                type="number"
                step="0.5"
                value={postRetirementReturn}
                onChange={(e) => setPostRetirementReturn(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-teal-400"
              />
            </div>
          </div>

          {/* SWR and Step Up */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Safe Withdrawal Rate</label>
              <select
                value={swr}
                onChange={(e) => setSwr(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-amber-400 font-bold"
              >
                <option value={3.0}>3.0% (Ultra Conservative / 33x)</option>
                <option value={3.5}>3.5% (Recommended India / 28x)</option>
                <option value={4.0}>4.0% (Classic Trinity / 25x)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Annual Savings Hike (%)</label>
              <input
                type="number"
                value={savingsStepUp}
                onChange={(e) => setSavingsStepUp(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Milestone Verdict */}
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 p-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Flame className="h-4 w-4" />
                <span>FIRE MILESTONE ACHIEVABLE</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                Year {result.fireYear} (Age {result.fireAge})
              </div>
              <p className="text-xs text-slate-300 mt-1">
                You are on track to achieve financial freedom in{" "}
                <strong className="text-emerald-400">{result.yearsToFire} years</strong>.
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs text-slate-400">Required Target Corpus</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {formatINR(result.requiredFireCorpus, { compact: true })}
              </div>
              <div className="text-[11px] text-slate-500">
                Monthly Exp: {formatINR(result.monthlyExpenseAtRetirement, { compact: true })}
              </div>
            </div>
          </div>

          {/* 4 FIRE Flavor Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Lean FIRE (75%)</div>
              <div className="text-base sm:text-lg font-black text-white mt-1">
                {formatINR(result.leanFireCorpus, { compact: true })}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Barebones Living</div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
              <div className="text-[10px] font-bold text-emerald-400 uppercase">Standard FIRE</div>
              <div className="text-base sm:text-lg font-black text-emerald-300 mt-1">
                {formatINR(result.requiredFireCorpus, { compact: true })}
              </div>
              <div className="text-[10px] text-emerald-400/80 mt-0.5">100% Lifestyle</div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
              <div className="text-[10px] font-bold text-amber-400 uppercase">Fat FIRE (140%)</div>
              <div className="text-base sm:text-lg font-black text-amber-300 mt-1">
                {formatINR(result.fatFireCorpus, { compact: true })}
              </div>
              <div className="text-[10px] text-amber-400/80 mt-0.5">Luxury & Travel</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5">
              <div className="text-[10px] font-bold text-teal-400 uppercase">Coast FIRE</div>
              <div className="text-base sm:text-lg font-black text-white mt-1">
                {formatINR(result.coastFireCorpus, { compact: true })}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Invested Today</div>
            </div>
          </div>

          {/* 40-Year Net Worth Trajectory AreaChart */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">40-Year Wealth Trajectory</h3>
                <p className="text-xs text-slate-400">Accumulation Phase → Retirement Preservation</p>
              </div>
              <div className="text-xs text-emerald-400 font-semibold">
                Runway: {result.runwayYears}+ Years Sustainable
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.trajectory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="firePortfolioGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="age" tickFormatter={(a) => `Age ${a}`} stroke="#64748b" fontSize={11} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => (v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(val: number) => [formatINR(val), ""]}
                    labelFormatter={(age) => `Age ${age}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="portfolioEnd"
                    name="Portfolio Net Worth"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#firePortfolioGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
