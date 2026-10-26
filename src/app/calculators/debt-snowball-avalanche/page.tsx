"use client";

import React, { useState, useMemo } from "react";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import {
  calculateDebtPayoffComparison,
  DebtItem,
} from "@/lib/calculators/debt-payoff";
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
import { Zap, Plus, Trash2, Award, TrendingDown, Clock, ShieldAlert } from "lucide-react";

export default function DebtSnowballAvalanchePage() {
  const { user } = useAuth();

  const [debts, setDebts] = useState<DebtItem[]>([
    {
      id: "debt-1",
      name: "HDFC Credit Card",
      balance: 180000,
      interestRate: 42,
      minimumPayment: 9000,
    },
    {
      id: "debt-2",
      name: "ICICI Personal Loan",
      balance: 450000,
      interestRate: 14.5,
      minimumPayment: 12500,
    },
    {
      id: "debt-3",
      name: "Auto Loan",
      balance: 750000,
      interestRate: 9.2,
      minimumPayment: 15500,
    },
    {
      id: "debt-4",
      name: "Executive Education Loan",
      balance: 1200000,
      interestRate: 8.5,
      minimumPayment: 18000,
    },
  ]);

  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState<number>(25000);

  const result = useMemo(() => {
    return calculateDebtPayoffComparison(debts, extraMonthlyPayment);
  }, [debts, extraMonthlyPayment]);

  const handleAddDebt = () => {
    if (debts.length >= 5) return;
    setDebts([
      ...debts,
      {
        id: `debt-${Date.now()}`,
        name: `Liability #${debts.length + 1}`,
        balance: 200000,
        interestRate: 12,
        minimumPayment: 5000,
      },
    ]);
  };

  const handleRemoveDebt = (id: string) => {
    if (debts.length <= 1) return;
    setDebts(debts.filter((d) => d.id !== id));
  };

  const handleUpdateDebt = (id: string, field: keyof DebtItem, value: unknown) => {
    setDebts(
      debts.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleReset = () => {
    setDebts([
      {
        id: "debt-1",
        name: "HDFC Credit Card",
        balance: 180000,
        interestRate: 42,
        minimumPayment: 9000,
      },
      {
        id: "debt-2",
        name: "ICICI Personal Loan",
        balance: 450000,
        interestRate: 14.5,
        minimumPayment: 12500,
      },
      {
        id: "debt-3",
        name: "Auto Loan",
        balance: 750000,
        interestRate: 9.2,
        minimumPayment: 15500,
      },
      {
        id: "debt-4",
        name: "Executive Education Loan",
        balance: 1200000,
        interestRate: 8.5,
        minimumPayment: 18000,
      },
    ]);
    setExtraMonthlyPayment(25000);
  };

  const chartData = useMemo(() => {
    const maxMonths = Math.min(
      60,
      Math.max(result.snowball.totalMonths, result.avalanche.totalMonths)
    );
    const data = [];
    for (let m = 1; m <= maxMonths; m++) {
      const av = result.avalanche.monthlyBalances[m - 1]?.totalBalance ?? 0;
      const sn = result.snowball.monthlyBalances[m - 1]?.totalBalance ?? 0;
      data.push({
        month: `M${m}`,
        Avalanche: av,
        Snowball: sn,
      });
    }
    return data;
  }, [result]);

  const handleExportPdf = () => {
    generateFinancialPdfReport({
      title: "Debt Restructuring & Accelerated Payoff Advisory Memo",
      category: "Debt Restructuring",
      clientName: user?.name || "Private Wealth Client",
      summaryMetrics: [
        { label: "Optimal Strategy", value: "DEBT AVALANCHE (MAX SAVINGS)" },
        { label: "Interest Saved vs Min.", value: formatINR(result.interestSavedAvalancheVsMinimum) },
        { label: "Months Saved vs Min.", value: `${result.monthsSavedAvalancheVsMinimum} Months` },
        { label: "Avalanche Payoff Time", value: `${(result.avalanche.totalMonths / 12).toFixed(1)} Years` },
        { label: "Snowball Payoff Time", value: `${(result.snowball.totalMonths / 12).toFixed(1)} Years` },
      ],
      sections: [
        {
          title: "Existing Liabilities Portfolio",
          headers: ["Liability", "Balance", "Interest Rate (APR)", "Minimum Payment"],
          rows: debts.map((d) => [
            d.name,
            formatINR(d.balance),
            `${d.interestRate}%`,
            formatINR(d.minimumPayment),
          ]),
        },
        {
          title: "Strategy Payoff Comparison",
          headers: ["Strategy", "Payoff Timeline", "Total Interest Paid", "Total Cash Outflow"],
          rows: [
            [
              "Debt Avalanche (Highest APR First)",
              `${result.avalanche.totalMonths} Mos (${(result.avalanche.totalMonths / 12).toFixed(1)}y)`,
              formatINR(result.avalanche.totalInterestPaid),
              formatINR(result.avalanche.totalAmountPaid),
            ],
            [
              "Debt Snowball (Lowest Balance First)",
              `${result.snowball.totalMonths} Mos (${(result.snowball.totalMonths / 12).toFixed(1)}y)`,
              formatINR(result.snowball.totalInterestPaid),
              formatINR(result.snowball.totalAmountPaid),
            ],
            [
              "Minimum Payment Only (Baseline)",
              `${result.minimumOnly.totalMonths} Mos (${(result.minimumOnly.totalMonths / 12).toFixed(1)}y)`,
              formatINR(result.minimumOnly.totalInterestPaid),
              formatINR(result.minimumOnly.totalAmountPaid),
            ],
          ],
        },
      ],
      advisorNotes: [
        `Extra monthly debt acceleration pool of ${formatINR(extraMonthlyPayment)} applied continuously.`,
        `Avalanche prioritizes high-cost credit card debt (42% APR), eliminating interest faster than Snowball.`,
      ],
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <CalculatorHeader
        id="debt-snowball-avalanche"
        title="Debt Snowball vs. Avalanche Simulator"
        category="Debt Restructuring"
        categorySlug="debt"
        description="Compare payoff timelines and interest savings across up to 5 concurrent debts by prioritizing lowest balance (psychological momentum) vs. highest APR (mathematical efficiency)."
        onReset={handleReset}
        onExportPdf={handleExportPdf}
        currentInputs={{ debts, extraMonthlyPayment }}
        summaryText={`Avalanche Saves ${formatINR(result.interestSavedAvalancheVsMinimum, { compact: true })} | Freedom in ${(result.avalanche.totalMonths / 12).toFixed(1)} yrs`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column: Debt List */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>Current Liabilities ({debts.length}/5)</span>
            </span>
            {debts.length < 5 && (
              <button
                onClick={handleAddDebt}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Debt</span>
              </button>
            )}
          </div>

          {/* Debts Table */}
          <div className="space-y-3">
            {debts.map((d, index) => (
              <div
                key={d.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={d.name}
                    onChange={(e) => handleUpdateDebt(d.id, "name", e.target.value)}
                    className="bg-transparent font-bold text-xs text-white focus:outline-none focus:border-b border-emerald-500"
                  />
                  {debts.length > 1 && (
                    <button
                      onClick={() => handleRemoveDebt(d.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove debt"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Balance (₹)</label>
                    <input
                      type="number"
                      step="5000"
                      value={d.balance}
                      onChange={(e) => handleUpdateDebt(d.id, "balance", Number(e.target.value))}
                      className="w-full rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">APR (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={d.interestRate}
                      onChange={(e) => handleUpdateDebt(d.id, "interestRate", Number(e.target.value))}
                      className="w-full rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-amber-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Min. Payment (₹)</label>
                    <input
                      type="number"
                      step="500"
                      value={d.minimumPayment}
                      onChange={(e) => handleUpdateDebt(d.id, "minimumPayment", Number(e.target.value))}
                      className="w-full rounded-lg bg-slate-900 border border-slate-800 p-1.5 text-emerald-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Extra Monthly Payment Budget */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">
                Extra Monthly Acceleration Budget (₹)
              </label>
              <span className="font-bold text-amber-400">{formatINR(extraMonthlyPayment)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="150000"
              step="2500"
              value={extraMonthlyPayment}
              onChange={(e) => setExtraMonthlyPayment(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Total monthly payment pool channeled into priority debt.
            </p>
          </div>
        </div>

        {/* Right Output Column: Strategy Showdown */}
        <div className="lg:col-span-6 space-y-6">
          {/* Winner Verdict Card */}
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-slate-900 to-emerald-500/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                <span>RESTITUTION VERDICT</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                Avalanche Method Saves {formatINR(result.interestSavedAvalancheVsMinimum, { compact: true })}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Completely debt-free in{" "}
                <strong className="text-emerald-300">
                  {result.avalanche.totalMonths} months ({(result.avalanche.totalMonths / 12).toFixed(1)} yrs)
                </strong>
                .
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xs text-slate-400">Time Slashed vs Min</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {result.monthsSavedAvalancheVsMinimum} Months
              </div>
            </div>
          </div>

          {/* Strategy Side-by-Side Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Avalanche Card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">DEBT AVALANCHE</span>
                <span className="text-[9px] px-2 py-0.5 rounded font-black bg-emerald-500 text-slate-950">
                  HIGHEST APR
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-white">
                  {result.avalanche.totalMonths} Months
                </div>
                <div className="text-xs text-slate-400">
                  Total Interest: <strong className="text-slate-200">{formatINR(result.avalanche.totalInterestPaid)}</strong>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                Order: {result.avalanche.debtEliminationOrder.map((d) => d.debtName.split(" ")[0]).join(" → ")}
              </div>
            </div>

            {/* Snowball Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">DEBT SNOWBALL</span>
                <span className="text-[9px] px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-400">
                  LOWEST BALANCE
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-white">
                  {result.snowball.totalMonths} Months
                </div>
                <div className="text-xs text-slate-400">
                  Total Interest: <strong className="text-slate-200">{formatINR(result.snowball.totalInterestPaid)}</strong>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                Order: {result.snowball.debtEliminationOrder.map((d) => d.debtName.split(" ")[0]).join(" → ")}
              </div>
            </div>
          </div>

          {/* Payoff Curve LineChart */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-sm font-bold text-white mb-1">
              Outstanding Debt Payoff Trajectory
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Avalanche (Green) vs. Snowball (Blue) Balance Depletion
            </p>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
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
                  <Line
                    type="monotone"
                    dataKey="Avalanche"
                    name="Avalanche Method"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="Snowball"
                    name="Snowball Method"
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
