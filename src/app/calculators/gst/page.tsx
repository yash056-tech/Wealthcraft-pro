"use client";

import React, { useState, useMemo } from "react";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import {
  calculateGst,
  GstInput,
  GstCalculationMode,
  GstSupplyType,
} from "@/lib/calculators/gst-calculator";
import { formatINR } from "@/lib/calculators/formatters";
import { generateFinancialPdfReport } from "@/lib/pdf/generate-report";
import { useAuth } from "@/context/auth-context";
import { Calculator, Copy, Check, FileText, ArrowRightLeft } from "lucide-react";

export default function GstCalculatorPage() {
  const { user } = useAuth();

  const [amount, setAmount] = useState<number>(100000);
  const [ratePercent, setRatePercent] = useState<number>(18);
  const [mode, setMode] = useState<GstCalculationMode>("add_gst");
  const [supplyType, setSupplyType] = useState<GstSupplyType>("intrastate");
  const [copiedInvoice, setCopiedInvoice] = useState<boolean>(false);

  const result = useMemo(() => {
    return calculateGst({
      amount,
      ratePercent,
      mode,
      supplyType,
    });
  }, [amount, ratePercent, mode, supplyType]);

  const handleReset = () => {
    setAmount(100000);
    setRatePercent(18);
    setMode("add_gst");
    setSupplyType("intrastate");
  };

  const invoiceSummary = `B2B INVOICE SUMMARY:
Base Taxable Value: ₹${result.netBaseAmount.toLocaleString("en-IN")}
GST Rate: ${ratePercent}% (${supplyType === "intrastate" ? `CGST ${result.cgstRatePercent}% + SGST ${result.sgstRatePercent}%` : `IGST ${result.igstRatePercent}%`})
${supplyType === "intrastate" ? `CGST: ₹${result.cgstAmount.toLocaleString("en-IN")}\nSGST: ₹${result.sgstAmount.toLocaleString("en-IN")}` : `IGST: ₹${result.igstAmount.toLocaleString("en-IN")}`}
Total GST: ₹${result.totalGstAmount.toLocaleString("en-IN")}
Gross Invoice Total: ₹${result.grossAmount.toLocaleString("en-IN")}`;

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(invoiceSummary);
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2000);
    }
  };

  const handleExportPdf = () => {
    generateFinancialPdfReport({
      title: "GST Invoice & Commercial Tax Assessment",
      category: "Taxation & Business Planners",
      clientName: user?.name || "Private Wealth Client",
      summaryMetrics: [
        { label: "Net Taxable Base", value: formatINR(result.netBaseAmount) },
        { label: `GST (${ratePercent}%)`, value: formatINR(result.totalGstAmount) },
        { label: "Gross Total", value: formatINR(result.grossAmount) },
        { label: "Transaction Type", value: supplyType === "intrastate" ? "Intrastate (CGST+SGST)" : "Interstate (IGST)" },
      ],
      sections: [
        {
          title: "Invoicing Line Item Tax Breakdown",
          headers: ["Tax Ledger Item", "Rate (%)", "Amount (INR)"],
          rows: [
            ["Taxable Base Value", "-", formatINR(result.netBaseAmount)],
            supplyType === "intrastate"
              ? ["Central GST (CGST)", `${result.cgstRatePercent}%`, formatINR(result.cgstAmount)]
              : ["Integrated GST (IGST)", `${result.igstRatePercent}%`, formatINR(result.igstAmount)],
            supplyType === "intrastate"
              ? ["State GST (SGST)", `${result.sgstRatePercent}%`, formatINR(result.sgstAmount)]
              : ["-", "-", "-"],
            ["Total GST Liability", `${ratePercent}%`, formatINR(result.totalGstAmount)],
            ["Gross Invoice Value", "-", formatINR(result.grossAmount)],
          ].filter((r) => r[0] !== "-"),
        },
      ],
      advisorNotes: [
        `Mode: ${mode === "add_gst" ? "GST Added to Base Price (Exclusive)" : "GST Extracted from Gross Price (Inclusive)"}.`,
        "All calculations strictly comply with Indian Goods & Services Tax (GST) Council statutory invoicing norms.",
      ],
    });
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <CalculatorHeader
        id="gst"
        title="GST Calculator (Add / Remove)"
        category="Taxation & Business"
        categorySlug="tax-business"
        description="Instantly compute forward or reverse GST across 5%, 12%, 18%, and 28% slabs with automatic Intrastate (CGST/SGST) and Interstate (IGST) line-item generation."
        onReset={handleReset}
        onExportPdf={handleExportPdf}
        currentInputs={{ amount, ratePercent, mode, supplyType }}
        summaryText={`Total GST: ${formatINR(result.totalGstAmount)} | Gross: ${formatINR(result.grossAmount)}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="h-4 w-4 text-emerald-400" />
              <span>Invoicing Parameters</span>
            </span>
            <span className="text-xs text-slate-400 font-semibold">INR (₹)</span>
          </div>

          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Calculation Direction</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode("add_gst")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                  mode === "add_gst"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                + Add GST (Exclusive)
              </button>
              <button
                onClick={() => setMode("remove_gst")}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                  mode === "remove_gst"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                - Remove GST (Inclusive)
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">
                {mode === "add_gst" ? "Base Taxable Price (₹)" : "Gross Invoice Amount (₹)"}
              </label>
              <span className="font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {formatINR(amount)}
              </span>
            </div>
            <input
              type="number"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Preset GST Rates */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Statutory GST Slab (%)</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setRatePercent(rate)}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    ratePercent === rate
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Custom Rate:</span>
              <input
                type="number"
                step="0.5"
                value={ratePercent}
                onChange={(e) => setRatePercent(Number(e.target.value))}
                className="w-20 rounded-lg bg-slate-950 border border-slate-800 p-1 text-right text-amber-400 font-bold"
              />
            </div>
          </div>

          {/* Supply Type */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Supply Destination</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSupplyType("intrastate")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                  supplyType === "intrastate"
                    ? "bg-slate-800 text-emerald-400 border border-emerald-500/40"
                    : "bg-slate-950 border border-slate-800 text-slate-400"
                }`}
              >
                Intrastate (CGST + SGST)
              </button>
              <button
                onClick={() => setSupplyType("interstate")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition ${
                  supplyType === "interstate"
                    ? "bg-slate-800 text-teal-400 border border-teal-500/40"
                    : "bg-slate-950 border border-slate-800 text-slate-400"
                }`}
              >
                Interstate (IGST)
              </button>
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Output Highlight Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-[11px] text-slate-400">Net Taxable Base</div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                {formatINR(result.netBaseAmount)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Excluding Tax</div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="text-[11px] text-amber-300 font-semibold">Total GST Amount</div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                {formatINR(result.totalGstAmount)}
              </div>
              <div className="text-[10px] text-amber-400/80 mt-0.5">{ratePercent}% Statutory Rate</div>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="text-[11px] text-emerald-300 font-semibold">Gross Invoice Total</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                {formatINR(result.grossAmount)}
              </div>
              <div className="text-[10px] text-emerald-500/80 mt-0.5">Final Invoiced Value</div>
            </div>
          </div>

          {/* Breakdown Ledger */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Invoice Tax Breakdown</h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                {copiedInvoice ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedInvoice ? "Copied" : "Copy B2B Line Item"}</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Base Taxable Amount</span>
                <span className="font-semibold text-white">{formatINR(result.netBaseAmount)}</span>
              </div>

              {supplyType === "intrastate" ? (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Central GST (CGST @ {result.cgstRatePercent}%)</span>
                    <span className="font-semibold text-emerald-400">{formatINR(result.cgstAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">State GST (SGST @ {result.sgstRatePercent}%)</span>
                    <span className="font-semibold text-teal-400">{formatINR(result.sgstAmount)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Integrated GST (IGST @ {result.igstRatePercent}%)</span>
                  <span className="font-semibold text-amber-400">{formatINR(result.igstAmount)}</span>
                </div>
              )}

              <div className="flex justify-between py-2 pt-2 text-sm">
                <strong className="text-white">Gross Total Payable</strong>
                <strong className="text-emerald-400">{formatINR(result.grossAmount)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
