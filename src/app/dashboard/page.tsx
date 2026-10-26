"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import {
  SavedScenario,
  getSavedScenarios,
  deleteScenario,
} from "@/lib/scenarios/scenario-storage";
import { generateFinancialPdfReport } from "@/lib/pdf/generate-report";
import {
  LayoutDashboard,
  Sparkles,
  CreditCard,
  FileDown,
  Trash2,
  ExternalLink,
  Tag,
  Search,
  Filter,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  Lock,
} from "lucide-react";

export default function DashboardPage() {
  const { user, isPro, toggleDemoPro, openPaywall } = useAuth();
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  useEffect(() => {
    setScenarios(getSavedScenarios());
  }, []);

  const handleDelete = (id: string) => {
    deleteScenario(id);
    setScenarios(getSavedScenarios());
  };

  const handleExportSavedPdf = (scenario: SavedScenario) => {
    if (!isPro) {
      openPaywall("Executive PDF Reports");
      return;
    }

    const rows: (string | number)[][] = Object.entries(scenario.inputs).map(([k, v]) => [
      k.replace(/([A-Z])/g, " $1").toUpperCase(),
      typeof v === "object" ? JSON.stringify(v) : String(v),
    ]);

    generateFinancialPdfReport({
      title: scenario.title,
      category: scenario.category,
      clientName: user?.name || "Private Wealth Client",
      summaryMetrics: [
        { label: "Scenario", value: scenario.calculatorName },
        { label: "Status", value: scenario.summary },
        { label: "Tags", value: scenario.tags?.join(", ") || "General" },
      ],
      sections: [
        {
          title: "Scenario Configuration Parameters",
          headers: ["Input Parameter", "Configured Value"],
          rows,
        },
      ],
      advisorNotes: scenario.notes ? [scenario.notes] : [
        "Confidential advisory output modeled via WealthCraft Pro suite.",
        "Ensure all tax assumptions align with individual assessment status.",
      ],
    });
  };

  const handleStripePortal = async () => {
    setIsOpeningPortal(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Non-blocking
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const filteredScenarios = scenarios.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.calculatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      s.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Banner: Client Profile & Subscription State */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg">
            {user?.name?.[0] || "V"}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-white">
                {user?.name || "Vikramaditya Singhania"}
              </h1>
              {isPro ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <Sparkles className="h-3 w-3" /> PRO TIER ACTIVE
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
                  FREE TIER
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {user?.email || "adviser@client.wealthcraft.pro"} • Client ID: WP-HNI-8492
            </p>
          </div>
        </div>

        {/* Subscription & Dev Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={toggleDemoPro}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Zap className={`h-3.5 w-3.5 ${isPro ? "text-amber-400" : "text-slate-400"}`} />
            <span>Toggle Demo Pro ({isPro ? "Active" : "Off"})</span>
          </button>

          {isPro ? (
            <button
              onClick={handleStripePortal}
              disabled={isOpeningPortal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition"
            >
              <CreditCard className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isOpeningPortal ? "Opening..." : "Stripe Billing Portal"}</span>
            </button>
          ) : (
            <button
              onClick={() => openPaywall("Client Scenario Cloud")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-md shadow-amber-500/20 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Upgrade to Pro (₹999/mo)</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400 mb-1">Saved Portfolios</div>
          <div className="text-2xl font-bold text-white">{scenarios.length} Scenarios</div>
          <div className="text-[11px] text-emerald-400 mt-1">Private Cloud Vault</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400 mb-1">Max Wealth Projected</div>
          <div className="text-2xl font-bold text-emerald-400">₹ 9.8 Cr</div>
          <div className="text-[11px] text-slate-400 mt-1">Fat FIRE Target 2037</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400 mb-1">Total Interest Saved</div>
          <div className="text-2xl font-bold text-amber-400">₹ 72.8 L</div>
          <div className="text-[11px] text-slate-400 mt-1">Mortgage Prepayments</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400 mb-1">Subscription Cycle</div>
          <div className="text-2xl font-bold text-white">{isPro ? "₹ 999 / mo" : "Free"}</div>
          <div className="text-[11px] text-slate-400 mt-1">Auto-renews monthly</div>
        </div>
      </div>

      {/* Paywall Banner for Free Tier Users */}
      {!isPro && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Scenario Cloud Vault & PDF Exports are Gated Behind Pro
              </h3>
              <p className="text-xs text-slate-300">
                You are currently viewing demo preview scenarios. Upgrade to Pro for ₹999/month to permanently save and edit your real portfolios.
              </p>
            </div>
          </div>
          <button
            onClick={() => openPaywall("Full Cloud Vault")}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition shrink-0"
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Saved Scenarios Vault Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-emerald-400" />
              <span>Saved Financial Scenarios</span>
            </h2>
            <p className="text-xs text-slate-400">
              All stored assumptions, timelines, and quantitative model configurations.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <input
                type="text"
                placeholder="Search scenarios or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Domains</option>
              <option value="wealth">Wealth & Retirement</option>
              <option value="real estate">Real Estate</option>
              <option value="tax">Taxation & Business</option>
              <option value="debt">Debt Restructuring</option>
            </select>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    {scenario.category}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(scenario.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
                  {scenario.title}
                </h3>
                <p className="text-xs text-slate-400 mb-3">{scenario.calculatorName}</p>

                {/* Metric Snapshot */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-emerald-300 mb-3">
                  {scenario.summary}
                </div>

                {scenario.notes && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 italic mb-3">
                    &quot;{scenario.notes}&quot;
                  </p>
                )}

                {/* Tags */}
                {scenario.tags && scenario.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {scenario.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <Link
                  href={`/calculators/${scenario.calculatorId}`}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
                >
                  <span>Open Calculator</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleExportSavedPdf(scenario)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
                    title="Export Executive PDF Report"
                  >
                    <FileDown className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(scenario.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Delete scenario"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
