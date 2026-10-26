"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Check, Sparkles, X, Shield, Lock, ArrowRight, Zap } from "lucide-react";

export function PaywallModal() {
  const { isPaywallOpen, closePaywall, paywallFeature, upgradeToPro, isPro } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!isPaywallOpen || isPro) return null;

  const handleStripeCheckout = async () => {
    setIsRedirecting(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        if (data.simulated) {
          // If in local/simulated mode without live Stripe credentials, upgrade instantly
          upgradeToPro();
        } else {
          window.location.href = data.url;
        }
      } else {
        upgradeToPro();
      }
    } catch {
      upgradeToPro();
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-900 p-6 md:p-8 shadow-2xl text-white">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={closePaywall}
          className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Sparkles className="h-3.5 w-3.5" /> PRO TIER REQUIRED
          </span>
          <span className="text-xs text-slate-400">Institutional Grade</span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          Unlock {paywallFeature}
        </h3>
        <p className="text-sm text-slate-300 mb-6">
          Upgrade to WealthCraft Pro to generate branded PDF memos, save unlimited client portfolios, and run advanced institutional sensitivity models.
        </p>

        {/* Pro Benefits Grid */}
        <div className="space-y-3 mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Check className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">Executive PDF Advisory Reports</p>
              <p className="text-xs text-slate-400">Export branded, client-ready PDF memos with tables and charts.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Check className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">Cloud Scenario Saving & Sync</p>
              <p className="text-xs text-slate-400">Store and compare unlimited scenarios in your private client portal.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Check className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">Advanced Simulator Engines</p>
              <p className="text-xs text-slate-400">Access DCF WACC sensitivity matrices, customized prepayments, and tax optimization.</p>
            </div>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent rounded-xl border border-amber-500/20">
          <div>
            <span className="text-2xl font-black text-white">₹999</span>
            <span className="text-xs text-slate-400"> / month</span>
            <div className="text-[11px] text-emerald-400">Cancel anytime • Zero lock-in</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>256-bit Encrypted</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={handleStripeCheckout}
            disabled={isRedirecting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition active:scale-[0.99] disabled:opacity-50"
          >
            {isRedirecting ? (
              <span>Connecting to Stripe...</span>
            ) : (
              <>
                <span>Upgrade with Stripe Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <button
            onClick={upgradeToPro}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:text-white transition"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Instant Demo Pro Mode (One-Click Testing)</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-500 mt-4">
          Default currency: INR (₹). In compliance with Indian FinTech & payment standards.
        </p>
      </div>
    </div>
  );
}
