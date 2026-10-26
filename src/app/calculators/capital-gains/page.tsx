"use client";

import React, { useState, useMemo } from "react";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import {
  calculateCapitalGains,
  AssetCategory,
  CII_TABLE,
} from "@/lib/calculators/capital-gains";
import { formatINR, formatPercent } from "@/lib/calculators/formatters";
import { generateFinancialPdfReport } from "@/lib/pdf/generate-report";
import { useAuth } from "@/context/auth-context";
import { Receipt, ShieldAlert, CheckCircle2, Info, Building, TrendingUp } from "lucide-react";

export default function CapitalGainsPage() {
  const { user } = useAuth();

  const [assetType, setAssetType] = useState<AssetCategory>("real_estate");
  const [purchasePrice, setPurchasePrice] = useState<number>(4500000);
  const [salePrice, setSalePrice] = useState<number>(12500000);
  const [purchaseYear, setPurchaseYear] = useState<string>("2016-17");
  const [saleYear, setSaleYear] = useState<string>("2024-25");
  const [holdingPeriodMonths, setHoldingPeriodMonths] = useState<number>(36);
  const [improvementExpenses, setImprovementExpenses] = useState<number>(500000);
  const [transferExpenses, setTransferExpenses] = useState<number>(100000);
  const [section54Exemption, setSection54Exemption] = useState<number>(0);
  const [section54EcExemption, setSection54EcExemption] = useState<number>(0);
  const [purchasedBeforeJuly2024, setPurchasedBeforeJuly2024] = useState<boolean>(true);

  const result = useMemo(() => {
    return calculateCapitalGains({
      assetType,
      purchasePrice,
      salePrice,
      purchaseYear,
      saleYear,
      holdingPeriodMonths,
      improvementExpenses,
      transferExpenses,
      section54Exemption,
      section54EcExemption,
      applicableIncomeTaxSlabPercent: 30,
      purchasedBeforeJuly2024,
    });
  }, [
    assetType,
    purchasePrice,
    salePrice,
    purchaseYear,
    saleYear,
    holdingPeriodMonths,
    improvementExpenses,
    transferExpenses,
    section54Exemption,
    section54EcExemption,
    purchasedBeforeJuly2024,
  ]);

  const handleReset = () => {
    setPurchasePrice(4500000);
    setSalePrice(12500000);
    setPurchaseYear("2016-17");
    setSaleYear("2024-25");
    setHoldingPeriodMonths(36);
    setImprovementExpenses(500000);
    setTransferExpenses(100000);
    setSection54Exemption(0);
    setSection54EcExemption(0);
  };

  const handleExportPdf = () => {
    generateFinancialPdfReport({
      title: "Capital Gains Tax Advisory Assessment (Budget 2024)",
      category: "Real Estate & Property Analyzers",
      clientName: user?.name || "Private Wealth Client",
      summaryMetrics: [
        { label: "Net Sale Proceeds", value: formatINR(result.netSaleConsideration) },
        { label: "Gross Capital Gain", value: formatINR(result.grossCapitalGain) },
        { label: "Total Tax Payable", value: formatINR(result.totalTaxPayable) },
        { label: "Effective Tax Rate", value: `${result.effectiveTaxRate}%` },
        { label: "Net Cash In Hand", value: formatINR(result.netProceedsInHand) },
      ],
      sections: [
        {
          title: "Capital Gains Computation Breakdown",
          headers: ["Tax Ledger Line Item", "Amount (INR)"],
          rows: [
            ["Gross Sale Value", formatINR(salePrice)],
            ["Less: Transfer Expenses / Brokerage", formatINR(transferExpenses)],
            ["Net Sale Consideration", formatINR(result.netSaleConsideration)],
            ["Cost of Acquisition (Original)", formatINR(purchasePrice)],
            ["Cost of Improvements", formatINR(improvementExpenses)],
            ["Indexed Cost of Acquisition (CII)", formatINR(result.indexedCostOfAcquisition)],
            ["Total Exemptions (Sec 54 / 54EC / 112A)", formatINR(result.totalExemptions)],
            ["Net Taxable Capital Gain", formatINR(result.netTaxableGain)],
            [`Base Tax (${result.taxRatePercent}%)`, formatINR(result.baseTax)],
            ["Health & Education Cess (4%)", formatINR(result.healthAndEducationCess)],
            ["Total Capital Gains Tax", formatINR(result.totalTaxPayable)],
            ["Net Cash In Hand", formatINR(result.netProceedsInHand)],
          ],
        },
      ],
      advisorNotes: result.taxRuleNotes,
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <CalculatorHeader
        id="capital-gains"
        title="Capital Gains Tax Estimator"
        category="Real Estate & Property"
        categorySlug="real-estate"
        description="Calculate STCG & LTCG for property, equity, and debt under amended Union Budget 2024 rules (12.5% unindexed vs 20% indexed grandfathering & Sec 54 exemptions)."
        onReset={handleReset}
        onExportPdf={handleExportPdf}
        currentInputs={{
          assetType,
          purchasePrice,
          salePrice,
          holdingPeriodMonths,
          section54Exemption,
          section54EcExemption,
        }}
        summaryText={`Tax: ${formatINR(result.totalTaxPayable, { compact: true })} (${result.effectiveTaxRate}%) | Cash in Hand: ${formatINR(result.netProceedsInHand, { compact: true })}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-emerald-400" />
              <span>Asset Transaction Details</span>
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setAssetType("real_estate")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                  assetType === "real_estate" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                Property
              </button>
              <button
                onClick={() => setAssetType("equity_listed")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                  assetType === "equity_listed" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                Equity
              </button>
              <button
                onClick={() => setAssetType("debt_other")}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition ${
                  assetType === "debt_other" ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                Debt / Other
              </button>
            </div>
          </div>

          {/* Sale and Purchase Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Purchase Price (₹)</label>
              <input
                type="number"
                step="50000"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sale Price (₹)</label>
              <input
                type="number"
                step="50000"
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-emerald-400 font-bold"
              />
            </div>
          </div>

          {/* Holding Months & Years */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Holding (Mos)</label>
              <input
                type="number"
                value={holdingPeriodMonths}
                onChange={(e) => setHoldingPeriodMonths(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Purchase FY</label>
              <select
                value={purchaseYear}
                onChange={(e) => setPurchaseYear(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white"
              >
                {Object.keys(CII_TABLE).map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Sale FY</label>
              <select
                value={saleYear}
                onChange={(e) => setSaleYear(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white"
              >
                <option value="2024-25">2024-25</option>
                <option value="2025-26">2025-26</option>
              </select>
            </div>
          </div>

          {/* Improvements & Transfer */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Improvements (₹)</label>
              <input
                type="number"
                value={improvementExpenses}
                onChange={(e) => setImprovementExpenses(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Transfer Expenses (₹)</label>
              <input
                type="number"
                value={transferExpenses}
                onChange={(e) => setTransferExpenses(Number(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2 text-white"
              />
            </div>
          </div>

          {/* Section 54 / 54EC Exemptions */}
          {assetType === "real_estate" && (
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Capital Gains Tax Shields (Exemptions)
              </span>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Section 54: Reinvestment in New Residential House
                </label>
                <input
                  type="number"
                  step="100000"
                  value={section54Exemption}
                  onChange={(e) => setSection54Exemption(Number(e.target.value))}
                  placeholder="e.g. 30,00,000"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">
                  Section 54EC: Capital Gain Bonds (REC/NHAI, Max ₹50L)
                </label>
                <input
                  type="number"
                  max="5000000"
                  step="50000"
                  value={section54EcExemption}
                  onChange={(e) => setSection54EcExemption(Number(e.target.value))}
                  placeholder="Max ₹50,00,000"
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Highlights Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-[11px] text-slate-400">Gross Capital Gain</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {formatINR(result.grossCapitalGain, { compact: true })}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{result.gainType} Status</div>
            </div>

            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
              <div className="text-[11px] text-rose-300 font-semibold">Total Tax Payable</div>
              <div className="text-xl sm:text-2xl font-black text-rose-400 mt-1">
                {formatINR(result.totalTaxPayable, { compact: true })}
              </div>
              <div className="text-[10px] text-rose-400/80 mt-0.5">
                Effective Rate: {result.effectiveTaxRate}%
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="text-[11px] text-emerald-300 font-semibold">Net Cash in Hand</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                {formatINR(result.netProceedsInHand, { compact: true })}
              </div>
              <div className="text-[10px] text-emerald-500/80 mt-0.5">Post-Tax Liquidity</div>
            </div>
          </div>

          {/* Tax Notes Banner */}
          {result.taxRuleNotes.map((note, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
              <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{note}</span>
            </div>
          ))}

          {/* Ledger Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Tax Computation Ledger
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Net Sale Consideration</span>
                <span className="font-semibold text-white">{formatINR(result.netSaleConsideration)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Cost of Acquisition + Improvements</span>
                <span className="text-slate-300">{formatINR(result.costOfAcquisition)}</span>
              </div>
              {result.indexedCostOfAcquisition > 0 && assetType === "real_estate" && (
                <div className="flex justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Indexed Cost (CII {saleYear}/{purchaseYear})</span>
                  <span className="text-amber-400 font-semibold">{formatINR(result.indexedCostOfAcquisition)}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Total Deductions & Exemptions</span>
                <span className="text-emerald-400 font-semibold">-{formatINR(result.totalExemptions)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Net Taxable Gain</span>
                <span className="font-bold text-white">{formatINR(result.netTaxableGain)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Base Tax @ {result.taxRatePercent}%</span>
                <span className="text-slate-300">{formatINR(result.baseTax)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Health & Education Cess (4%)</span>
                <span className="text-slate-300">{formatINR(result.healthAndEducationCess)}</span>
              </div>
              <div className="flex justify-between py-2 pt-3 text-sm">
                <strong className="text-white">Net Tax Payable</strong>
                <strong className="text-rose-400">{formatINR(result.totalTaxPayable)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
