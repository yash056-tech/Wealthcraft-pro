"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { CALCULATORS, CALCULATOR_CATEGORIES } from "@/lib/calculators/catalog";
import { formatINR } from "@/lib/calculators/formatters";
import {
  TrendingUp,
  ShieldCheck,
  Flame,
  Home,
  Scale,
  Receipt,
  FileSpreadsheet,
  Calculator,
  Building2,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock,
  Download,
  Database,
  BarChart3,
  Layers,
  ChevronRight,
  UserCheck,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="h-6 w-6" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6" />,
  Flame: <Flame className="h-6 w-6" />,
  Home: <Home className="h-6 w-6" />,
  Scale: <Scale className="h-6 w-6" />,
  Receipt: <Receipt className="h-6 w-6" />,
  FileSpreadsheet: <FileSpreadsheet className="h-6 w-6" />,
  Calculator: <Calculator className="h-6 w-6" />,
  Building2: <Building2 className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
};

export default function HomePage() {
  const { isPro, openPaywall, openRegister } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredCalculators =
    activeCategory === "all"
      ? CALCULATORS
      : CALCULATORS.filter((c) => c.categorySlug === activeCategory);

  return (
    <div className="relative overflow-hidden">
      {/* Background Glow Highlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-amber-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Institutional FinTech Suite for HNWIs, Real Estate & Founders</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
          The Wealth Architecture Suite for{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            India&apos;s Discerning Investors.
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
          Stop relying on generic toy calculators. Model complex Step-Up SIPs, multi-crore real estate buy-vs-rent parity, 30-year FIRE trajectories, Union Budget tax regimes, and 5-year DCF enterprise valuations.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={openRegister}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-[0.99] transition"
          >
            <UserCheck className="h-4 w-4" />
            <span>Register (Client / Student / Investor)</span>
          </button>

          <a
            href="#calculators-section"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-slate-950 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-[0.99] transition"
          >
            <span>Explore 10 Free Calculators</span>
            <ArrowRight className="h-4 w-4" />
          </a>

          <Link
            href="/pricing"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-amber-500/50 hover:text-white transition"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Pro Tier (₹999/mo)</span>
          </Link>
        </div>

        {/* Hero Interactive Proof Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-2xl border border-slate-800 bg-slate-950/70 backdrop-blur-xl">
          <div className="p-3 text-center border-r border-slate-800/80 last:border-none">
            <div className="text-2xl font-black text-white">₹ 100 Cr+</div>
            <div className="text-xs text-slate-400 mt-0.5">Scenarios Modeled</div>
          </div>
          <div className="p-3 text-center border-r border-slate-800/80 last:border-none">
            <div className="text-2xl font-black text-emerald-400">10 Deep Tools</div>
            <div className="text-xs text-slate-400 mt-0.5">Sovereign & Tax Ready</div>
          </div>
          <div className="p-3 text-center border-r border-slate-800/80 last:border-none">
            <div className="text-2xl font-black text-amber-400">Budget 2024</div>
            <div className="text-xs text-slate-400 mt-0.5">12.5% LTCG & Sec 87A</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl font-black text-teal-400">Bank Grade</div>
            <div className="text-xs text-slate-400 mt-0.5">Vector PDF Reports</div>
          </div>
        </div>
      </section>

      {/* All 10 Calculators Suite Section */}
      <section id="calculators-section" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 mb-2">
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>THE COMPLETE FINANCIAL SUITE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              10 Financial Engines. Zero Compromise.
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Categorized purposefully into Wealth, Real Estate, Taxation, and Debt Restructuring.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeCategory === "all"
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All (10)
            </button>
            {CALCULATOR_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeCategory === cat.slug
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Calculators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calc) => (
            <Link
              key={calc.id}
              href={calc.slug}
              className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 hover:bg-slate-900/90 hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition">
                    {ICON_MAP[calc.iconName] || <TrendingUp className="h-6 w-6" />}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {calc.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        {calc.badge}
                      </span>
                    )}
                    {calc.isPro ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                        PRO
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
                        FREE
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                  {calc.category}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition mb-2">
                  {calc.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {calc.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                <span>Launch Simulator</span>
                <ChevronRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Showcase: Free vs Pro Value Matrix */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-8 md:p-14">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-3">
              <Sparkles className="h-3.5 w-3.5" /> PRO TIER ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why High-Net-Worth Individuals Upgrade to Pro
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Free users enjoy unlimited simulation runs. Pro subscribers unlock the persistent private vault, institutional exports, and executive reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Private Scenario Cloud</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save multi-asset portfolios, mortgage prepayment scenarios, and custom tax models. Revisit or edit them anytime in your private client portal.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Executive PDF Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate high-resolution advisory memos for family offices, co-investors, and chartered accountants with unwatermarked financial tables.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Deep Sensitivity Matrices</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stress-test valuations across 25 dynamic WACC & terminal growth permutations, amortization curves, and break-even crossover years.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Free vs Pro ₹999/mo) */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            TRANSPARENT FINTECH PRICING
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Choose Your Advisory Tier
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            No long-term lock-in. Upgrade or cancel anytime with one click.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Tier */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-white">Free Community Tier</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
                  Lead Gen
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Essential computational power for individuals planning basic financial goals.
              </p>
              <div className="text-3xl font-black text-white mb-6">₹ 0</div>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Access to all 10 core calculators</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Interactive graphs & compounding curves</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Union Budget 2024 tax slabs</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-500">
                  <Lock className="h-4 w-4 text-slate-600 shrink-0" />
                  <span>Saving scenarios to private vault</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-500">
                  <Lock className="h-4 w-4 text-slate-600 shrink-0" />
                  <span>Executive PDF export</span>
                </li>
              </ul>
            </div>

            <a
              href="#calculators-section"
              className="w-full py-3 px-4 rounded-xl text-center text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
            >
              Start Free Simulating
            </a>
          </div>

          {/* Pro Tier (₹999/mo) */}
          <div className="relative rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 flex flex-col justify-between shadow-2xl shadow-amber-500/10">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950">
              RECOMMENDED FOR HNWIs
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Pro Advisory Tier</span>
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Full Suite
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Engineered for serious investors, real estate developers, and wealth managers.
              </p>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black text-white">₹ 999</span>
                <span className="text-xs text-slate-400">/ month + GST</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="font-medium text-white">All 10 Calculators + Pro Simulators</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="font-medium text-white">Unlimited Cloud Scenario Vault</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="font-medium text-white">Client-Ready PDF Advisory Reports</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>DCF Sensitivity Matrix & Monte Carlo models</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Stripe Subscription Management Portal</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => openPaywall("Full Pro Advisory Suite")}
                className="w-full py-3.5 px-4 rounded-xl text-center text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 hover:brightness-110 shadow-lg shadow-amber-500/20 transition active:scale-[0.99]"
              >
                {isPro ? "You Have Pro Access" : "Upgrade to Pro (₹999/mo)"}
              </button>
              <div className="text-[11px] text-center text-slate-500">
                Processed via secure Stripe Checkout • Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
