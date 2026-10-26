import React from "react";
import Link from "next/link";
import { TrendingUp, ShieldCheck, Lock, Award, HeartHandshake } from "lucide-react";
import { CALCULATOR_CATEGORIES, CALCULATORS } from "@/lib/calculators/catalog";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-900 bg-slate-950/40 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-slate-200 text-xs">Bank-Grade Math</p>
              <p className="text-[11px] text-slate-500">SEBI & Union Budget Compliant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-slate-200 text-xs">Zero Data Selling</p>
              <p className="text-[11px] text-slate-500">End-to-End Private Portfolios</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold text-slate-200 text-xs">Executive Grade</p>
              <p className="text-[11px] text-slate-500">Tailored for HNWIs & Founders</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HeartHandshake className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-slate-200 text-xs">Transparent Pricing</p>
              <p className="text-[11px] text-slate-500">₹999/mo • Cancel Anytime</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                <TrendingUp className="h-4 w-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-base font-extrabold text-white">WEALTHCRAFT PRO</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier SaaS advisory platform for high-net-worth individuals, commercial real estate investors, and growth founders. Engineered with rigorous actuarial logic and Indian tax code precision.
            </p>
            <div className="text-[11px] text-slate-500">
              Default currency: Indian Rupee (INR ₹). Supports Crores, Lakhs, and standard international formats.
            </div>
          </div>

          {/* Categories Columns */}
          {CALCULATOR_CATEGORIES.slice(0, 3).map((cat) => {
            const calcs = CALCULATORS.filter((c) => c.categorySlug === cat.slug);
            return (
              <div key={cat.slug} className="space-y-3">
                <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">{cat.title}</p>
                <ul className="space-y-2">
                  {calcs.map((calc) => (
                    <li key={calc.id}>
                      <Link
                        href={calc.slug}
                        className="text-xs text-slate-400 hover:text-emerald-400 transition"
                      >
                        {calc.shortName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Regulatory & Disclaimer Notice */}
        <div className="mt-12 pt-6 border-t border-slate-900 text-[11px] text-slate-500 space-y-2">
          <p>
            <strong>Regulatory Disclaimer:</strong> WealthCraft Pro is a financial modeling and simulation SaaS platform. Calculations and projections are indicative and based on statutory Indian financial frameworks (including Union Budget 2024-25 / 2025-26 amendments, PPF rates declared by Ministry of Finance, and EPF interest declared by EPFO). This platform does not provide formal investment advice or guarantee returns. Please consult a SEBI-registered Investment Adviser (RIA) or Chartered Accountant (CA) before executing financial commitments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div>© {new Date().getFullYear()} WealthCraft Pro Technologies. All rights reserved.</div>
            <div className="flex gap-4">
              <Link href="/pricing" className="hover:text-slate-300">
                Subscription Terms
              </Link>
              <Link href="/dashboard" className="hover:text-slate-300">
                Security & Data Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
