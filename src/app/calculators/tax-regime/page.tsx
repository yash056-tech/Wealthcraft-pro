"use client";

import React, { useState, useMemo } from "react";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import { calculateTaxRegimes, TaxRegimeInput } from "@/lib/calculators/tax-regime";
import { formatINR } from "@/lib/calculators/formatters";
import { generateFinancialPdfReport } from "@/lib/pdf/generate-report";
import { useAuth } from "@/context/auth-context";
import { FileSpreadsheet, Award, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function TaxRegimePage() {
  const { user } = useAuth();

  const [annualGrossSalary, setAnnualGrossSalary] = useState<number>(1800000);
  const [section80C, setSection80C] = useState<number>(150000);
  const [section80D, setSection80D] = useState<number>(35000);
  const [section24bHomeLoanInterest, setSection24bHomeLoanInterest] = useState<number>(180000);
  const [hraExemption, setHraExemption] = useState<number>(120000);
  const [nps80CCD1B, setNps80CCD1B] = useState<number>(50000);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  const result = useMemo(() => {
    return calculateTaxRegimes({
      annualGrossSalary,
      section80C,
      section80D,
      section24bHomeLoanInterest,
      hraExemption,
      nps80CCD1B,
      otherDeductions,
    });
  }, [
    annualGrossSalary,
    section80C,
    section80D,
    section24bHomeLoanInterest,
    hraExemption,
    nps80CCD1B,
    otherDeductions,
  ]);

  const handleReset = () => {
    setAnnualGrossSalary(1800000);
    setSection80C(150000);
    setSection80D(35000);
    setSection24bHomeLoanInterest(180000);
    setHraExemption(120000);
    setNps80CCD1B(50000);
    setOtherDeductions(0);
  };

  const handleExportPdf = () => {
    generateFinancialPdfReport({
      title: "Union Budget Tax Regime Comparative Advisory Memo",
      category: "Taxation & Business Planners",
      clientName: user?.name || "Private Wealth Client",
      summaryMetrics: [
        { label: "Optimal Choice", value: `${result.recommendedRegime.toUpperCase()} SAVES MORE` },
        { label: "Net Tax Savings", value: formatINR(result.taxSavings) },
        { label: "New Regime Tax", value: formatINR(result.newRegime.totalTax) },
        { label: "Old Regime Tax", value: formatINR(result.oldRegime.totalTax) },
        { label: "Break-Even Deductions", value: formatINR(result.breakEvenDeductionNeeded) },
      ],
      sections: [
        {
          title: "Side-by-Side Slabs & Tax Computation (FY 2024-25 / FY 2025-26)",
          headers: ["Ledger Parameter", "New Tax Regime (Sec 115BAC)", "Old Tax Regime"],
          rows: [
            ["Gross Total Income", formatINR(annualGrossSalary), formatINR(annualGrossSalary)],
            ["Standard Deduction", formatINR(result.newRegime.standardDeduction), formatINR(result.oldRegime.standardDeduction)],
            ["Total Chapter VI-A Deductions", "Not Allowed", formatINR(result.oldRegime.totalExemptionsDeductions - 50000)],
            ["Net Taxable Income", formatINR(result.newRegime.taxableIncome), formatINR(result.oldRegime.taxableIncome)],
            ["Base Slab Tax", formatINR(result.newRegime.slabTax), formatINR(result.oldRegime.slabTax)],
            ["Section 87A Tax Rebate", formatINR(result.newRegime.rebate87A), formatINR(result.oldRegime.rebate87A)],
            ["Health & Education Cess (4%)", formatINR(result.newRegime.cess), formatINR(result.oldRegime.cess)],
            ["Total Payable Tax", formatINR(result.newRegime.totalTax), formatINR(result.oldRegime.totalTax)],
            ["Effective Tax Rate", `${result.newRegime.effectiveRate}%`, `${result.oldRegime.effectiveRate}%`],
          ],
        },
      ],
      advisorNotes: [
        `Recommended Strategy: Choose ${result.recommendedRegime} to minimize your annual tax liability by ${formatINR(result.taxSavings)}.`,
        `To make the Old Regime financially competitive, you would require total deductions of at least ${formatINR(result.breakEvenDeductionNeeded)}.`,
      ],
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <CalculatorHeader
        id="tax-regime"
        title="Income Tax Regime Comparator"
        category="Taxation & Business"
        categorySlug="tax-business"
        description="Compare the Old vs. New Tax Regimes (FY 2024-25 / FY 2025-26) incorporating the revised ₹75,000 standard deduction, Sec 87A rebate, and exact deduction break-even thresholds."
        onReset={handleReset}
        onExportPdf={handleExportPdf}
        currentInputs={{
          annualGrossSalary,
          section80C,
          section80D,
          section24bHomeLoanInterest,
          hraExemption,
        }}
        summaryText={`Pick ${result.recommendedRegime} | Saves ${formatINR(result.taxSavings)}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Income & Deduction Inputs</span>
            </span>
            <span className="text-xs text-slate-400 font-semibold">FY 2024-25 / 2025-26</span>
          </div>

          {/* Gross Salary */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Annual Gross Salary (CTC)</label>
              <span className="font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {formatINR(annualGrossSalary)}
              </span>
            </div>
            <input
              type="range"
              min="500000"
              max="5000000"
              step="50000"
              value={annualGrossSalary}
              onChange={(e) => setAnnualGrossSalary(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Old Regime Deductions Section */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Old Regime Deductions
              </span>
              <span className="text-[10px] text-slate-400">Chapter VI-A</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Section 80C (Max ₹1.5L)</label>
                <input
                  type="number"
                  max="150000"
                  step="10000"
                  value={section80C}
                  onChange={(e) => setSection80C(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Section 80D Health (Max ₹1L)</label>
                <input
                  type="number"
                  max="100000"
                  step="5000"
                  value={section80D}
                  onChange={(e) => setSection80D(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Home Loan Sec 24(b)</label>
                <input
                  type="number"
                  max="200000"
                  step="10000"
                  value={section24bHomeLoanInterest}
                  onChange={(e) => setSection24bHomeLoanInterest(Number(e.target.value))}
                  placeholder="Max ₹2 Lakhs"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">HRA Exemption</label>
                <input
                  type="number"
                  step="10000"
                  value={hraExemption}
                  onChange={(e) => setHraExemption(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">NPS 80CCD(1B)</label>
                <input
                  type="number"
                  max="50000"
                  value={nps80CCD1B}
                  onChange={(e) => setNps80CCD1B(Number(e.target.value))}
                  placeholder="Max ₹50,000"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Other Deductions (80E/G)</label>
                <input
                  type="number"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-white"
                />
              </div>
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
                <span>TAX OPTIMIZATION RECOMMENDATION</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {result.recommendedRegime} is Optimal
              </div>
              <p className="text-xs text-slate-300 mt-1">
                You save <strong className="text-emerald-300">{formatINR(result.taxSavings)}</strong> in tax this financial year.
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-slate-400">Old Regime Break-Even Point</div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                {formatINR(result.breakEvenDeductionNeeded, { compact: true })}
              </div>
              <div className="text-[10px] text-slate-400">Deductions required to beat New Regime</div>
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Regime Card */}
            <div className={`rounded-2xl border p-5 ${
              result.recommendedRegime === "New Regime"
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-slate-800 bg-slate-900/60"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">NEW REGIME (Sec 115BAC)</span>
                {result.recommendedRegime === "New Regime" && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                    LOWEST TAX
                  </span>
                )}
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {formatINR(result.newRegime.totalTax)}
              </div>
              <div className="text-xs text-slate-400 mb-4">
                Effective Tax Rate: <strong className="text-emerald-400">{result.newRegime.effectiveRate}%</strong>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Standard Deduction:</span>
                  <span>{formatINR(result.newRegime.standardDeduction)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taxable Income:</span>
                  <span>{formatINR(result.newRegime.taxableIncome)}</span>
                </div>
                {result.newRegime.rebate87A > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Sec 87A Rebate:</span>
                    <span>-{formatINR(result.newRegime.rebate87A)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Old Regime Card */}
            <div className={`rounded-2xl border p-5 ${
              result.recommendedRegime === "Old Regime"
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-slate-800 bg-slate-900/60"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">OLD TAX REGIME</span>
                {result.recommendedRegime === "Old Regime" && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                    LOWEST TAX
                  </span>
                )}
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {formatINR(result.oldRegime.totalTax)}
              </div>
              <div className="text-xs text-slate-400 mb-4">
                Effective Tax Rate: <strong className="text-slate-300">{result.oldRegime.effectiveRate}%</strong>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Deductions Claimed:</span>
                  <span>{formatINR(result.oldRegime.totalExemptionsDeductions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Taxable Income:</span>
                  <span>{formatINR(result.oldRegime.taxableIncome)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
