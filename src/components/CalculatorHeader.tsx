"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import {
  FileDown,
  BookmarkPlus,
  Share2,
  RotateCcw,
  Sparkles,
  Lock,
  Check,
  ChevronRight,
} from "lucide-react";
import { SaveScenarioModal } from "./SaveScenarioModal";

interface CalculatorHeaderProps {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  description: string;
  isProOnly?: boolean;
  onReset?: () => void;
  onExportPdf?: () => void;
  currentInputs: Record<string, unknown>;
  summaryText: string;
}

export function CalculatorHeader({
  id,
  title,
  category,
  categorySlug,
  description,
  isProOnly = false,
  onReset,
  onExportPdf,
  currentInputs,
  summaryText,
}: CalculatorHeaderProps) {
  const { isPro, openPaywall } = useAuth();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSaveClick = () => {
    if (!isPro) {
      openPaywall("Scenario Cloud Storage & Sync");
      return;
    }
    setIsSaveModalOpen(true);
  };

  const handleExportPdfClick = () => {
    if (!isPro) {
      openPaywall("Executive PDF Advisory Reports");
      return;
    }
    if (onExportPdf) onExportPdf();
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="mb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-3" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-emerald-400 transition">
            Hub
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <Link href={`/#${categorySlug}`} className="hover:text-emerald-400 transition">
            {category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <span className="text-slate-200 font-medium">{title}</span>
        </nav>

        {/* Title & Actions Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {title}
              </h1>
              {isProOnly ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Sparkles className="h-3 w-3" /> Pro Simulator
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Free Access
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300 max-w-2xl">{description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {onReset && (
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 hover:text-white transition"
                title="Reset to default assumptions"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 hover:text-white transition"
              title="Copy shareable link"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
            </button>

            <button
              onClick={handleSaveClick}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-sm ${
                isPro
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                  : "bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-800"
              }`}
            >
              {isPro ? <BookmarkPlus className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5 text-amber-400" />}
              <span>Save Scenario</span>
            </button>

            <button
              onClick={handleExportPdfClick}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                isPro
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-amber-500/20"
                  : "bg-slate-800 text-amber-400 border border-amber-500/30 hover:bg-slate-800/90"
              }`}
            >
              {isPro ? <FileDown className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              <span>Executive PDF Report</span>
            </button>
          </div>
        </div>
      </div>

      <SaveScenarioModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        calculatorId={id}
        calculatorName={title}
        category={category}
        currentInputs={currentInputs}
        summaryText={summaryText}
      />
    </>
  );
}
