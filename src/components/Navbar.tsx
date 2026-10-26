"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { CALCULATORS, CALCULATOR_CATEGORIES } from "@/lib/calculators/catalog";
import {
  TrendingUp,
  ChevronDown,
  Sparkles,
  Zap,
  LayoutDashboard,
  CreditCard,
  Menu,
  X,
  ShieldCheck,
  Building2,
  FileSpreadsheet,
  Flame,
  Home,
  Scale,
  Receipt,
  Calculator,
  UserCheck,
} from "lucide-react";

// Icon mapping helper
const ICONS: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4" />,
  Flame: <Flame className="h-4 w-4" />,
  Home: <Home className="h-4 w-4" />,
  Scale: <Scale className="h-4 w-4" />,
  Receipt: <Receipt className="h-4 w-4" />,
  FileSpreadsheet: <FileSpreadsheet className="h-4 w-4" />,
  Calculator: <Calculator className="h-4 w-4" />,
  Building2: <Building2 className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
};

export function Navbar() {
  const pathname = usePathname();
  const { isPro, toggleDemoPro, openPaywall, openRegister, user } = useAuth();
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
              <TrendingUp className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                WEALTHCRAFT <span className="text-amber-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">PRO</span>
              </span>
              <span className="text-[10px] block text-slate-400 font-medium tracking-wide -mt-0.5">
                Financial Advisory Suite
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Calculators Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setIsCalculatorsOpen(true)}
              onMouseLeave={() => setIsCalculatorsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname.startsWith("/calculators")
                    ? "text-emerald-400 bg-slate-900"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                <span>Calculators</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isCalculatorsOpen ? "rotate-180 text-emerald-400" : "text-slate-500"
                  }`}
                />
              </button>

              {/* Mega Dropdown Menu */}
              {isCalculatorsOpen && (
                <div className="absolute top-full -left-12 w-[850px] p-6 rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl backdrop-blur-2xl grid grid-cols-2 gap-6 animate-in fade-in-50 zoom-in-95 duration-150">
                  {CALCULATOR_CATEGORIES.map((cat) => {
                    const items = CALCULATORS.filter((c) => c.categorySlug === cat.slug);
                    return (
                      <div key={cat.slug} className="space-y-2.5">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {cat.title}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {items.map((item) => (
                            <Link
                              key={item.id}
                              href={item.slug}
                              onClick={() => setIsCalculatorsOpen(false)}
                              className="group flex items-center justify-between p-2 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition">
                                  {ICONS[item.iconName] || <TrendingUp className="h-4 w-4" />}
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white flex items-center gap-1.5">
                                    <span>{item.name}</span>
                                    {item.badge && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded-full font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500 line-clamp-1">
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/dashboard"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === "/dashboard"
                  ? "text-emerald-400 bg-slate-900"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-slate-400" />
              <span>Client Dashboard</span>
            </Link>

            <Link
              href="/pricing"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === "/pricing"
                  ? "text-emerald-400 bg-slate-900"
                  : "text-slate-300 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <CreditCard className="h-4 w-4 text-slate-400" />
              <span>Pricing (₹999/mo)</span>
            </Link>

            <button
              onClick={openRegister}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:bg-slate-900/60 transition"
            >
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>Register</span>
            </button>
          </nav>
        </div>

        {/* Right Actions: Currency, Demo Pro Toggle, Upgrade / Pro Badge */}
        <div className="flex items-center gap-3">
          {/* Default Currency Indicator */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-emerald-400">INR</span>
            <span className="text-slate-400">(₹)</span>
          </div>

          {/* Quick Demo Pro Switcher */}
          <button
            onClick={toggleDemoPro}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              isPro
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/20"
                : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title="Toggle Pro Tier state for instant simulation/testing"
          >
            <Zap className={`h-3.5 w-3.5 ${isPro ? "text-amber-400 fill-amber-400" : "text-slate-500"}`} />
            <span className="hidden md:inline">Demo Pro Mode:</span>
            <span className={isPro ? "text-amber-300 font-bold" : "text-slate-400"}>
              {isPro ? "ACTIVE" : "OFF"}
            </span>
          </button>

          {/* Pro Status or Upgrade CTA */}
          {isPro ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>PRO CLIENT</span>
            </Link>
          ) : (
            <button
              onClick={() => openPaywall("Full Pro Advisory Suite")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 hover:brightness-110 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Get Pro (₹999/mo)</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 p-4 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              <LayoutDashboard className="h-4 w-4 text-emerald-400" />
              <span>Client Dashboard</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-slate-900"
            >
              <CreditCard className="h-4 w-4 text-emerald-400" />
              <span>Pricing (Free vs. Pro)</span>
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openRegister();
              }}
              className="w-full flex items-center gap-2 p-2.5 rounded-xl text-sm font-semibold text-emerald-400 hover:bg-slate-900 text-left"
            >
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>Register (Client / Student / Investor)</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              All 10 Calculators
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {CALCULATORS.map((calc) => (
                <Link
                  key={calc.id}
                  href={calc.slug}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-emerald-400"
                >
                  <span className="text-emerald-400">{ICONS[calc.iconName]}</span>
                  <span>{calc.shortName}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
