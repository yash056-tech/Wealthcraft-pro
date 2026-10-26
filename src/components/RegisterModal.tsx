"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import {
  X,
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
} from "lucide-react";
import confetti from "canvas-confetti";

type UserPersona = "Client / HNWI" | "Customer / Investor" | "Student / Academic" | "Business Founder";

export function RegisterModal() {
  const { isRegisterOpen, closeRegister } = useAuth();

  const [userType, setUserType] = useState<UserPersona>("Client / HNWI");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [primaryService, setPrimaryService] = useState("Retirement & FIRE Planning");
  const [portfolioRange, setPortfolioRange] = useState("₹50 Lakhs - ₹2 Crores");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isRegisterOpen) return null;

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
          particleCount: 100,
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

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage("");
    closeRegister();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5" /> REGISTRATION CONFIRMED
            </div>

            <h3 className="text-2xl font-bold text-white">
              Welcome to WealthCraft Pro, {fullName.split(" ")[0]}!
            </h3>

            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Your details have been successfully transmitted to our executive desk at{" "}
              <strong className="text-emerald-400">ya09shu@gmail.com</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between text-slate-400">
                <span>Registered Email:</span>
                <span className="font-semibold text-white">{email}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Assigned Role:</span>
                <span className="font-semibold text-amber-400">{userType}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Selected Focus:</span>
                <span className="font-semibold text-emerald-400">{primaryService}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Our lead advisory team will review your objectives and reach out shortly.
            </p>

            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
            >
              Continue Exploring Tools
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <UserCheck className="h-3.5 w-3.5" /> CLIENT & STUDENT ONBOARDING
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Register for WealthCraft Services
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Connect with our advisory desk for private portfolio reviews, institutional simulators, or student academic modeling.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Persona Switcher Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUserType("Client / HNWI");
                    setPortfolioRange("₹50 Lakhs - ₹2 Crores");
                    setPrimaryService("Full Financial & Wealth Advisory");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    userType === "Client / HNWI"
                      ? "border-emerald-500 bg-emerald-500/15 text-white"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <Briefcase className="h-4 w-4 text-emerald-400 mb-1" />
                  <span className="text-xs font-bold leading-tight">Client / HNWI</span>
                  <span className="text-[10px] text-slate-400">Wealth plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserType("Customer / Investor");
                    setPortfolioRange("₹10 Lakhs - ₹50 Lakhs");
                    setPrimaryService("Retirement & FIRE Planning");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    userType === "Customer / Investor"
                      ? "border-emerald-500 bg-emerald-500/15 text-white"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <UserCheck className="h-4 w-4 text-teal-400 mb-1" />
                  <span className="text-xs font-bold leading-tight">Customer / Investor</span>
                  <span className="text-[10px] text-slate-400">Growth & SIP</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserType("Student / Academic");
                    setPortfolioRange("Student / Academic");
                    setPrimaryService("FinTech Modeling & Career Mentorship");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    userType === "Student / Academic"
                      ? "border-amber-500 bg-amber-500/15 text-white"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <GraduationCap className="h-4 w-4 text-amber-400 mb-1" />
                  <span className="text-xs font-bold leading-tight">Student / Learner</span>
                  <span className="text-[10px] text-slate-400">Study & Learn</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserType("Business Founder");
                    setPortfolioRange("₹1 Crore - ₹10 Crores+");
                    setPrimaryService("Business Valuation (DCF Model)");
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    userType === "Business Founder"
                      ? "border-purple-500 bg-purple-500/15 text-white"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white"
                  }`}
                >
                  <Building className="h-4 w-4 text-purple-400 mb-1" />
                  <span className="text-xs font-bold leading-tight">Business Founder</span>
                  <span className="text-[10px] text-slate-400">Valuation / DCF</span>
                </button>
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
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
                    placeholder="you@domain.com"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <Mail className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Phone & Service */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 pl-8 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <Phone className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Service / Interest
                </label>
                <select
                  value={primaryService}
                  onChange={(e) => setPrimaryService(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
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

            {/* Message / Objectives */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Specific Goals or Questions (Optional)
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your current financial milestone or specific question..."
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering & Dispatching Notification...</span>
                ) : (
                  <>
                    <span>Submit Registration</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Details are delivered directly to ya09shu@gmail.com</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
