"use client";

import React, { useState, useMemo } from "react";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import { calculateHomeLoanPrepayment, HomeLoanInput } from "@/lib/calculators/home-loan-prepayment";
import { formatINR, formatYears } from "@/lib/calculators/formatters";
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
import { Home, Sparkles, TrendingDown, Clock, ShieldCheck, Zap } from "lucide-react";

export default function HomeLoanPrepaymentPage() {
  const { user } = useAuth();

  const [loanAmount, setLoanAmount] = useState<number>(7500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [annualPrepaymentAmount, setAnnualPrepaymentAmount] = useState<number>(150000);
  const [monthlyEmiStepUpPercent, setMonthlyEmiStepUpPercent] = useState<number>(5);

  const result = useMemo(() => {
    return calculateHomeLoanPrepayment({
      loanAmount,
      interestRate,
      tenureYears,
      annualPrepaymentAmount,
      prepaymentMonth: 12,
      monthlyEmiStepUpPercent,
    });
  }, [loanAmount, interestRate, tenureYears, annualPrepaymentAmount, monthlyEmiStepUpPercent]);

  const handleReset = () => {
    setLoanAmount(7500000);
    setInterestRate(8.5);
    setTenureYears(20);
    setAnnualPrepaymentAmount(150000);
    setMonthlyEmiStepUpPercent(5);
  };

  const handleExportPdf = () => {
    generateFinancialPdfReport({
      title: "Home Loan EMI & Prepayment Optimization Memo",
      category: "Real Estate & Property Analyzers",
      clientName: user?.name || "Private Wealth Client",
      summaryMetrics: [
        { label: "Loan Principal", value: formatINR(loanAmount) },
        { label: "Original Monthly EMI", value: formatINR(result.originalEmi) },
        { label: "Total Interest Saved", value: formatINR(result.interestSaved) },
        { label: "Tenure Cut By", value: `${(result.tenureSavedMonths / 12).toFixed(1)} Years` },
        { label: "Revised Payoff Tenure", value: `${(result.revisedTenureMonths / 12).toFixed(1)} Years` },
      ],
      sections: [
        {
          title: "Prepayment Amortization Summary (First 10 Years)",
          headers: ["Year", "Opening Balance", "Total EMI Paid", "Principal Repaid", "Interest Paid", "Prepayment", "Closing Balance"],
          rows: result.yearlySchedule.slice(0, 10).map((y) => [
            `Year ${y.year}`,
            formatINR(y.openingBalance),
            formatINR(y.totalEmi),
            formatINR(y.totalPrincipal),
            formatINR(y.totalInterest),
            formatINR(y.totalPrepayment),
            formatINR(y.closingBalance),
          ]),
        },
      ],
      advisorNotes: [
        `Loan Amount: ${formatINR(loanAmount)} at ${interestRate}% p.a. for original ${tenureYears} years.`,
        `Prepayment schedule applies annual lump sum of ${formatINR(annualPrepaymentAmount)} plus ${monthlyEmiStepUpPercent}% annual EMI step-up.`,
        `Directly reduces principal balance, eliminating compound compounding interest obligations.`,
      ],
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <CalculatorHeader
        id="home-loan-prepayment"
        title="Home Loan EMI & Prepayment Optimizer"
        category="Real Estate & Property"
        categorySlug="real-estate"
        description="Discover how modest annual lump-sum prepayments and annual step-up EMIs drastically crush total interest and slice 8 to 12 years off your mortgage."
        onReset={handleReset}
        onExportPdf={handleExportPdf}
        currentInputs={{
          loanAmount,
          interestRate,
          tenureYears,
          annualPrepaymentAmount,
          monthlyEmiStepUpPercent,
        }}
        summaryText={`Interest Saved: ${formatINR(result.interestSaved, { compact: true })} | Tenure Cut: ${(result.tenureSavedMonths / 12).toFixed(1)} yrs`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Home className="h-4 w-4 text-emerald-400" />
              <span>Mortgage Parameters</span>
            </span>
            <span className="text-xs text-slate-400 font-semibold">INR (₹)</span>
          </div>

          {/* Loan Amount */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Loan Principal Amount</label>
              <span className="font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {formatINR(loanAmount)}
              </span>
            </div>
            <input
              type="range"
              min="1000000"
              max="50000000"
              step="500000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>₹25 Lakhs</span>
              <span>₹75 Lakhs</span>
              <span>₹1.5 Crore</span>
              <span>₹5 Crores</span>
            </div>
          </div>

          {/* Interest Rate & Tenure */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="6"
                max="15"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tenure (Years)</label>
              <input
                type="number"
                min="5"
                max="30"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Prepayment Optimizations Section */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Zap className="h-4 w-4" />
              <span>PREPAYMENT STRATEGIES</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-300">Annual Lump-Sum Prepayment</label>
                <span className="font-bold text-amber-300">{formatINR(annualPrepaymentAmount)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="25000"
                value={annualPrepaymentAmount}
                onChange={(e) => setAnnualPrepaymentAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[10px] text-slate-500">
                Simulates channeling your year-end appraisal / bonus into principal reduction.
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-300">Annual Monthly EMI Step-Up (%)</label>
                <span className="font-bold text-emerald-400">+{monthlyEmiStepUpPercent}% / yr</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={monthlyEmiStepUpPercent}
                onChange={(e) => setMonthlyEmiStepUpPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Big Savings Verdict Card */}
          <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-slate-900 to-amber-500/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4" />
                <span>INTEREST ELIMINATION VERDICT</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {formatINR(result.interestSaved, { compact: true })} Saved
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Mortgage fully cleared in{" "}
                <strong className="text-emerald-300">
                  {(result.revisedTenureMonths / 12).toFixed(1)} Years
                </strong>{" "}
                instead of {tenureYears} Years.
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-slate-400">Tenure Slashed By</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">
                {(result.tenureSavedMonths / 12).toFixed(1)} Years
              </div>
              <div className="text-[11px] text-slate-400">
                Base Monthly EMI: {formatINR(result.originalEmi)}
              </div>
            </div>
          </div>

          {/* Cost Comparison BarChart */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-bold text-white mb-1">
              Original Mortgage vs. Optimized Prepayment Total Outflow
            </h3>
            <p className="text-xs text-slate-400 mb-4">Principal vs. Total Interest Paid</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(v) => (v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(val: number) => [formatINR(val), ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Bar dataKey="principal" name="Principal Loan" fill="#3b82f6" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="interest" name="Interest Paid" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Amortization Table Highlights */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 overflow-x-auto">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Optimized Amortization Trajectory (First 6 Years)
            </h4>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2">Year</th>
                  <th className="pb-2">Opening</th>
                  <th className="pb-2">Principal Paid</th>
                  <th className="pb-2">Interest Paid</th>
                  <th className="pb-2">Prepayment</th>
                  <th className="pb-2 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {result.yearlySchedule.slice(0, 6).map((row) => (
                  <tr key={row.year} className="hover:bg-slate-800/30">
                    <td className="py-2 font-medium">Year {row.year}</td>
                    <td className="py-2 text-slate-400">{formatINR(row.openingBalance, { compact: true })}</td>
                    <td className="py-2">{formatINR(row.totalPrincipal, { compact: true })}</td>
                    <td className="py-2 text-amber-400">{formatINR(row.totalInterest, { compact: true })}</td>
                    <td className="py-2 text-emerald-400 font-semibold">{formatINR(row.totalPrepayment, { compact: true })}</td>
                    <td className="py-2 text-right font-bold text-white">{formatINR(row.closingBalance, { compact: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
