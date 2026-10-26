"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Check, X, Sparkles, Shield, ArrowRight, Zap, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const { isPro, openPaywall, toggleDemoPro } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        if (data.simulated) {
          toggleDemoPro();
        } else {
          window.location.href = data.url;
        }
      } else {
        toggleDemoPro();
      }
    } catch {
      toggleDemoPro();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <Sparkles className="h-3.5 w-3.5" /> PRO MEMBERSHIP
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Simple, Transparent FinTech Pricing
        </h1>
        <p className="text-base text-slate-300 mt-3">
          Designed for high-net-worth investors, family offices, real estate sponsors, and founders.
        </p>

        {/* Billing Cycle Switcher */}
        <div className="mt-8 inline-flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
              billingCycle === "monthly"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              billingCycle === "annual"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Annual (Save 17%)</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400 text-slate-950">
              2 MOS FREE
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
        {/* Free Plan */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-white">Free Tier</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                Lead Generation
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Full access to computational engines with instant in-browser outputs.
            </p>
            <div className="text-4xl font-black text-white mb-6">₹ 0</div>

            <div className="space-y-3 border-t border-slate-800/80 pt-6 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>10 Standard Indian Financial Calculators</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Interactive graphical compounding curves</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Union Budget 2024 tax slabs</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <X className="h-4 w-4 text-slate-600" />
                <span>Saving scenarios to private cloud</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <X className="h-4 w-4 text-slate-600" />
                <span>Executive PDF Advisory Memo export</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-500">
                <X className="h-4 w-4 text-slate-600" />
                <span>DCF Sensitivity Matrix & Monte Carlo models</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              disabled
              className="w-full py-3 px-4 rounded-xl text-center text-xs font-semibold text-slate-400 bg-slate-800/60 cursor-default"
            >
              Current Default Tier
            </button>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="relative rounded-3xl border-2 border-amber-500/50 bg-slate-900 p-8 flex flex-col justify-between shadow-2xl shadow-amber-500/10">
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950">
            MOST POPULAR
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-white flex items-center gap-2">
                <span>Pro Advisory</span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold">
                Monthly SaaS
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Complete software architecture for advisory memos, scenario persistence, and institutional modeling.
            </p>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-black text-white">
                {billingCycle === "monthly" ? "₹ 999" : "₹ 832"}
              </span>
              <span className="text-xs text-slate-400">
                {billingCycle === "monthly" ? "/ month" : "/ month (billed annually)"}
              </span>
            </div>

            <div className="space-y-3 border-t border-slate-800/80 pt-6 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-400" />
                <span className="font-semibold text-white">All 10 Financial Simulators + Advanced Modes</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-400" />
                <span className="font-semibold text-white">Unlimited Private Scenario Cloud Vault</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-400" />
                <span className="font-semibold text-white">Executive PDF Advisory Reports (Clean / Unwatermarked)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-400" />
                <span>DCF 5x5 WACC vs Growth Sensitivity Grid</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-400" />
                <span>Custom Annual Lump-Sum Mortgage Prepayment Models</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-amber-400" />
                <span>Stripe Self-Serve Customer Portal Access</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl text-center text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 hover:brightness-110 shadow-lg shadow-amber-500/20 transition active:scale-[0.99] disabled:opacity-50"
            >
              {isPro
                ? "You are Currently on Pro Tier"
                : isProcessing
                ? "Connecting to Stripe..."
                : "Subscribe with Stripe Checkout (₹999/mo)"}
            </button>

            <button
              onClick={toggleDemoPro}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>{isPro ? "Revert to Free Mode" : "Activate One-Click Demo Pro Mode"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix Table */}
      <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-8 mb-20 overflow-x-auto">
        <h3 className="text-xl font-bold text-white mb-6">Detailed Tier Comparison</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3 font-semibold">Capabilities</th>
              <th className="pb-3 font-semibold text-center w-28">Free Tier</th>
              <th className="pb-3 font-semibold text-center w-28 text-amber-400">Pro Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr>
              <td className="py-3 font-medium">All 10 Financial Simulators</td>
              <td className="py-3 text-center text-emerald-400">Yes</td>
              <td className="py-3 text-center text-emerald-400">Yes</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Union Budget 2024 Tax Formulas</td>
              <td className="py-3 text-center text-emerald-400">Yes</td>
              <td className="py-3 text-center text-emerald-400">Yes</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Cloud Scenario Storage (Supabase)</td>
              <td className="py-3 text-center text-slate-500">No</td>
              <td className="py-3 text-center text-amber-400 font-bold">Unlimited</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Executive PDF Advisory Memos</td>
              <td className="py-3 text-center text-slate-500">No</td>
              <td className="py-3 text-center text-amber-400 font-bold">Vector PDF</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">DCF 5x5 WACC Sensitivity Matrix</td>
              <td className="py-3 text-center text-slate-500">Locked</td>
              <td className="py-3 text-center text-emerald-400">Included</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Multi-Debt Snowball vs Avalanche Rollover</td>
              <td className="py-3 text-center text-emerald-400">Yes</td>
              <td className="py-3 text-center text-emerald-400">Yes</td>
            </tr>
            <tr>
              <td className="py-3 font-medium">Customer Support</td>
              <td className="py-3 text-center text-slate-400">Community</td>
              <td className="py-3 text-center text-amber-400 font-bold">Priority Desk</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-white text-center mb-8">
          Frequently Asked Questions
        </h3>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h4 className="text-sm font-bold text-white mb-1">
            Can I cancel my ₹999/month subscription anytime?
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Yes, absolutely. There are no contracts or termination penalties. You can cancel with one click from the Stripe Customer Portal inside your Client Dashboard.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h4 className="text-sm font-bold text-white mb-1">
            Are the tax calculations updated for Union Budget 2024 & FY 2025-26?
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Yes. Our engines incorporate the revised 12.5% Long-Term Capital Gains tax on listed equities and property, the enhanced ₹1.25 Lakh Section 112A threshold, the revised ₹75,000 standard deduction under the New Tax Regime, and the grandfathering provisions for real estate acquired prior to July 23, 2024.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h4 className="text-sm font-bold text-white mb-1">
            Is my financial data stored privately?
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            We adhere to strict data privacy principles. Scenarios are encrypted and stored in PostgreSQL via Supabase Row-Level Security (RLS). We never sell or share user data with third-party brokers.
          </p>
        </div>
      </div>
    </div>
  );
}
