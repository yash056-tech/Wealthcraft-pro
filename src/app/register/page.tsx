"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Building,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";

type UserPersona = "Client / HNWI" | "Customer / Investor" | "Student / Academic" | "Business Founder";

export default function RegisterPage() {
  const [userType, setUserType] = useState<UserPersona>("Client / HNWI");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [primaryService, setPrimaryService] = useState("Full Financial & Wealth Advisory");
  const [portfolioRange, setPortfolioRange] = useState("₹50 Lakhs - ₹2 Crores");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          userType,
          primaryService,
          portfolioRange,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit registration");
      }

      setIsSuccess(true);
      try {
        confetti({
          particleCount: 110,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10B981", "#F59E0B", "#38BDF8"],
        });
      } catch {
        // Confetti non-critical
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <UserCheck className="h-3.5 w-3.5" />
          <span>ONBOARDING PORTAL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Client, Investor & Student Registration
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
          Register to access private wealth advisory, institutional financial modeling, mortgage prepayment strategies, or academic FinTech mentorship.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {isSuccess ? (
          <div className="text-center py-10 space-y-5">
            <div className="h-20 w-20 mx-auto rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" /> REGISTRATION CONFIRMED
            </div>

            <h2 className="text-3xl font-bold text-white">
              Thank You, {fullName}!
            </h2>

            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Your registration profile has been successfully delivered to our advisory desk at{" "}
              <strong className="text-emerald-400 font-semibold">ya09shu@gmail.com</strong>.
            </p>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between text-slate-400">
                <span>Full Name:</span>
                <span className="font-semibold text-white">{fullName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Email Address:</span>
                <span className="font-semibold text-white">{email}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Phone:</span>
                <span className="font-semibold text-white">{phone || "Not provided"}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Registered Role:</span>
                <span className="font-semibold text-amber-400">{userType}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Primary Interest:</span>
                <span className="font-semibold text-emerald-400">{primaryService}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
              >
                Go to Client Dashboard
              </Link>
              <Link
                href="/calculators/step-up-sip"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
              >
                Explore Calculators
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Persona Switcher Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                Select Your Profile Type:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setUserType("Client / HNWI");
                    setPortfolioRange("₹50 Lakhs - ₹2 Crores");
                    setPrimaryService("Full Financial & Wealth Advisory");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    userType === "Client / HNWI"
                      ? "border-emerald-500 bg-emerald-500/15 text-white shadow-md shadow-emerald-500/10"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <Briefcase className="h-5 w-5 text-emerald-400 mb-1.5" />
                  <span className="text-xs font-bold leading-tight">Client / HNWI</span>
                  <span className="text-[11px] text-slate-400">Wealth plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserType("Customer / Investor");
                    setPortfolioRange("₹10 Lakhs - ₹50 Lakhs");
                    setPrimaryService("Retirement & FIRE Planning");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    userType === "Customer / Investor"
                      ? "border-emerald-500 bg-emerald-500/15 text-white shadow-md shadow-emerald-500/10"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <UserCheck className="h-5 w-5 text-teal-400 mb-1.5" />
                  <span className="text-xs font-bold leading-tight">Customer / Investor</span>
                  <span className="text-[11px] text-slate-400">SIP & Real Estate</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserType("Student / Academic");
                    setPortfolioRange("Student / Academic");
                    setPrimaryService("FinTech Modeling & Career Mentorship");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    userType === "Student / Academic"
                      ? "border-amber-500 bg-amber-500/15 text-white shadow-md shadow-amber-500/10"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <GraduationCap className="h-5 w-5 text-amber-400 mb-1.5" />
                  <span className="text-xs font-bold leading-tight">Student / Learner</span>
                  <span className="text-[11px] text-slate-400">Learn Modeling</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserType("Business Founder");
                    setPortfolioRange("₹1 Crore - ₹10 Crores+");
                    setPrimaryService("Business Valuation (DCF Model)");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    userType === "Business Founder"
                      ? "border-purple-500 bg-purple-500/15 text-white shadow-md shadow-purple-500/10"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <Building className="h-5 w-5 text-purple-400 mb-1.5" />
                  <span className="text-xs font-bold leading-tight">Business Founder</span>
                  <span className="text-[11px] text-slate-400">DCF & Valuation</span>
                </button>
              </div>
            </div>

            {/* Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikramaditya Singhania"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-3 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Phone and Service */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone / WhatsApp Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-3 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Service / Interest
                </label>
                <select
                  value={primaryService}
                  onChange={(e) => setPrimaryService(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Full Financial & Wealth Advisory">Full Wealth & Portfolio Advisory</option>
                  <option value="Retirement & FIRE Planning">Retirement & FIRE Simulator</option>
                  <option value="Real Estate & Prepayment Optimization">Real Estate & Prepayment Optimization</option>
                  <option value="Income Tax & Union Budget Planning">Income Tax & Union Budget Planning</option>
                  <option value="Business Valuation (DCF Model)">Business Valuation (DCF Model)</option>
                  <option value="Debt Snowball vs Avalanche">Debt Restructuring & Payoff</option>
                  <option value="FinTech Modeling & Career Mentorship">FinTech Modeling & Student Mentorship</option>
                </select>
              </div>
            </div>

            {/* Portfolio / Income Bracket */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Portfolio or Annual Income Bracket
              </label>
              <select
                value={portfolioRange}
                onChange={(e) => setPortfolioRange(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-3 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                {userType === "Student / Academic" ? (
                  <>
                    <option value="Student / Academic">Student / Higher Education</option>
                    <option value="Fresher (< 1 Year)">Fresher / Graduate (&lt; 1 Year)</option>
                    <option value="Academic Researcher">Academic Researcher / Faculty</option>
                  </>
                ) : (
                  <>
                    <option value="< ₹10 Lakhs">&lt; ₹10 Lakhs</option>
                    <option value="₹10 Lakhs - ₹50 Lakhs">₹10 Lakhs - ₹50 Lakhs</option>
                    <option value="₹50 Lakhs - ₹2 Crores">₹50 Lakhs - ₹2 Crores</option>
                    <option value="₹2 Crores - ₹10 Crores">₹2 Crores - ₹10 Crores (HNWI)</option>
                    <option value="₹10 Crores+">₹10 Crores+ (Ultra HNWI / Family Office)</option>
                  </>
                )}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Specific Goals, Questions, or Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your portfolio size, retirement age target, or what simulation you want to explore..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Transmitting Details to Advisory Desk...</span>
              ) : (
                <>
                  <span>Submit Registration Profile</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 text-center pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Details are delivered directly to <strong className="text-slate-300">ya09shu@gmail.com</strong></span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
