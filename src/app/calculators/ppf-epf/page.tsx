"use client";

import React, { useState, useMemo } from "react";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import { calculatePpfEpf, PpfEpfInput } from "@/lib/calculators/ppf-epf";
import { formatINR } from "@/lib/calculators/formatters";
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
import { ShieldCheck, Landmark, PiggyBank, Calendar } from "lucide-react";

export default function PpfEpfPage() {
  const { user } = useAuth();

  const [calcType, setCalcType] = useState<"combined" | "ppf" | "epf">("combined");
  const [ppfAnnualDeposit, setPpfAnnualDeposit] = useState<number>(150000);
  const [ppfTenureYears, setPpfTenureYears] = useState<number>(15);
  const [ppfRate, setPpfRate] = useState<number>(7.1);

  const [monthlyBasicSalary, setMonthlyBasicSalary] = useState<number>(60000);
  const [currentAge, setCurrentAge] = useState<number>(28);
  const [retirementAge, setRetirementAge] = useState<number>(58);
  const [annualSalaryHike, setAnnualSalaryHike] = useState<number>(8);
  const [epfRate, setEpfRate] = useState<number>(8.25);
  const [currentEpfBalance, setCurrentEpfBalance] = useState<number>(200000);

  const result = useMemo(() => {
    return calculatePpfEpf({
      calcType,
      ppfAnnualDeposit,
      ppfTenureYears,
      ppfRate,
      monthlyBasicSalary,
      currentAge,
      retirementAge,
      annualSalaryHike,
      epfRate,
      currentEpfBalance,
    });
  }, [
    calcType,
    ppfAnnualDeposit,
    ppfTenureYears,
    ppfRate,
    monthlyBasicSalary,
    currentAge,
    retirementAge,
    annualSalaryHike,
    epfRate,
    currentEpfBalance,
  ]);

  const handleReset = () => {
    setPpfAnnualDeposit(150000);
    setPpfTenureYears(15);
    setPpfRate(7.1);
    setMonthlyBasicSalary(60000);
    setCurrentAge(28);
    setRetirementAge(58);
    setAnnualSalaryHike(8);
    setEpfRate(8.25);
    setCurrentEpfBalance(200000);
  };

  const handleExportPdf = () => {
    generateFinancialPdfReport({
      title: "Sovereign Retirement Wealth Projection (PPF & EPF)",
      category: "Wealth & Retirement Projectors",
      clientName: user?.name || "Private Wealth Client",
      summaryMetrics: [
        { label: "Combined Maturity Corpus", value: formatINR(result.combinedCorpus) },
        { label: "Total Sovereign Interest", value: formatINR(result.combinedInterestEarned) },
        { label: "PPF Maturity (15y)", value: formatINR(result.ppf.maturityCorpus) },
        { label: "EPF Retirement Corpus", value: formatINR(result.epf.maturityCorpus) },
        { label: "EPS Pension Accumulation", value: formatINR(result.epf.pensionAccumulation) },
      ],
      sections: [
        {
          title: "PPF 15-Year Guaranteed Compounding Schedule",
          headers: ["Year", "Opening Balance", "Deposit", "Interest Earned", "Closing Balance"],
          rows: result.ppf.yearlyData.map((d) => [
            `Year ${d.year}`,
            formatINR(d.openingBalance),
            formatINR(d.deposit),
            formatINR(d.interest),
            formatINR(d.closingBalance),
          ]),
        },
      ],
      advisorNotes: [
        `Public Provident Fund (PPF) earns ${ppfRate}% tax-free sovereign interest under EEE status.`,
        `Employees Provident Fund (EPF) earns ${epfRate}% statutory compound interest with annual salary hike of ${annualSalaryHike}%.`,
      ],
    });
  };

  const chartData = useMemo(() => {
    const data = [];
    const maxYears = Math.max(ppfTenureYears, retirementAge - currentAge);
    for (let y = 1; y <= Math.min(25, maxYears); y++) {
      const ppfRow = result.ppf.yearlyData[y - 1];
      const epfRow = result.epf.yearlyData[y - 1];
      data.push({
        year: `Year ${y}`,
        ppf: ppfRow ? ppfRow.closingBalance : 0,
        epf: epfRow ? epfRow.closingBalance : 0,
        total: (ppfRow ? ppfRow.closingBalance : 0) + (epfRow ? epfRow.closingBalance : 0),
      });
    }
    return data;
  }, [result, ppfTenureYears, retirementAge, currentAge]);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <CalculatorHeader
        id="ppf-epf"
        title="PPF / EPF Maturity Projector"
        category="Wealth & Retirement"
        categorySlug="wealth"
        description="Forecast your sovereign, tax-exempt retirement wealth under current Government of India rates (PPF 7.1% & EPF 8.25%)."
        onReset={handleReset}
        onExportPdf={handleExportPdf}
        currentInputs={{
          ppfAnnualDeposit,
          ppfTenureYears,
          monthlyBasicSalary,
          currentAge,
          retirementAge,
          annualSalaryHike,
        }}
        summaryText={`Combined Corpus: ${formatINR(result.combinedCorpus, { compact: true })} (Interest: ${formatINR(result.combinedInterestEarned, { compact: true })})`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Landmark className="h-4 w-4 text-emerald-400" />
              <span>Sovereign Provident Parameters</span>
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCalcType("combined")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                  calcType === "combined" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                Combined
              </button>
              <button
                onClick={() => setCalcType("ppf")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                  calcType === "ppf" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                PPF
              </button>
              <button
                onClick={() => setCalcType("epf")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                  calcType === "epf" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                EPF
              </button>
            </div>
          </div>

          {/* Section 1: PPF */}
          {(calcType === "combined" || calcType === "ppf") && (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Public Provident Fund (PPF)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  EEE Tax Free
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-300">Annual Deposit (Max ₹1.5L)</label>
                  <span className="font-bold text-emerald-400">{formatINR(ppfAnnualDeposit)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="150000"
                  step="5000"
                  value={ppfAnnualDeposit}
                  onChange={(e) => setPpfAnnualDeposit(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tenure (Blocks)</label>
                  <select
                    value={ppfTenureYears}
                    onChange={(e) => setPpfTenureYears(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white"
                  >
                    <option value={15}>15 Years (Standard)</option>
                    <option value={20}>20 Years (1 Extension)</option>
                    <option value={25}>25 Years (2 Extensions)</option>
                    <option value={30}>30 Years (3 Extensions)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Current PPF Rate</label>
                  <div className="rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-emerald-400 font-bold">
                    {ppfRate}% p.a.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: EPF */}
          {(calcType === "combined" || calcType === "epf") && (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Employees Provident Fund (EPF)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  8.25% p.a.
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-slate-300">Monthly Basic Salary + DA</label>
                  <span className="font-bold text-teal-400">{formatINR(monthlyBasicSalary)}</span>
                </div>
                <input
                  type="range"
                  min="15000"
                  max="300000"
                  step="5000"
                  value={monthlyBasicSalary}
                  onChange={(e) => setMonthlyBasicSalary(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Current Age</label>
                  <input
                    type="number"
                    min="18"
                    max="55"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Retirement Age</label>
                  <input
                    type="number"
                    min="50"
                    max="65"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Annual Salary Hike (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={annualSalaryHike}
                    onChange={(e) => setAnnualSalaryHike(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Existing EPF Balance</label>
                  <input
                    type="number"
                    min="0"
                    step="50000"
                    value={currentEpfBalance}
                    onChange={(e) => setCurrentEpfBalance(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="text-[11px] text-emerald-300 font-semibold">Total Sovereign Corpus</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {formatINR(result.combinedCorpus, { compact: true })}
              </div>
              <div className="text-[10px] text-emerald-400/80 mt-0.5">Government Guaranteed</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-[11px] text-slate-400">Total Interest Accrued</div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                {formatINR(result.combinedInterestEarned, { compact: true })}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Compounded Annually</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-[11px] text-slate-400">Total Principal Deposit</div>
              <div className="text-xl sm:text-2xl font-black text-slate-200 mt-1">
                {formatINR(result.combinedInvested, { compact: true })}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Employee + Employer</div>
            </div>
          </div>

          {/* Graph: PPF vs EPF Compounding Curve */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Provident Fund Accumulation Curve</h3>
                <p className="text-xs text-slate-400">PPF vs EPF Sovereign Growth</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(v) => (v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(0)}L`)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "12px" }}
                    formatter={(val: number) => [formatINR(val), ""]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="ppf" name="PPF (7.1%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="epf" name="EPF (8.25%)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sovereign Highlights */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-2 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">PPF Corpus at Year {ppfTenureYears}:</span>
              <strong className="text-emerald-400">{formatINR(result.ppf.maturityCorpus)}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">EPF Corpus at Age {retirementAge}:</span>
              <strong className="text-teal-400">{formatINR(result.epf.maturityCorpus)}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">EPS Pension Contribution (8.33% capped):</span>
              <strong className="text-amber-400">{formatINR(result.epf.pensionAccumulation)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
