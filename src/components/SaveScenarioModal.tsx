"use client";

import React, { useState } from "react";
import { X, BookmarkPlus, Tag } from "lucide-react";
import { saveScenario } from "@/lib/scenarios/scenario-storage";

interface SaveScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorId: string;
  calculatorName: string;
  category: string;
  currentInputs: Record<string, unknown>;
  summaryText: string;
  onSavedSuccess?: () => void;
}

export function SaveScenarioModal({
  isOpen,
  onClose,
  calculatorId,
  calculatorName,
  category,
  currentInputs,
  summaryText,
  onSavedSuccess,
}: SaveScenarioModalProps) {
  const [title, setTitle] = useState(
    `${calculatorName} - ${new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`
  );
  const [tagsInput, setTagsInput] = useState("Portfolio, HNI");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    saveScenario({
      calculatorId,
      calculatorName,
      title: title || `${calculatorName} Scenario`,
      category,
      inputs: currentInputs,
      summary: summaryText,
      tags,
      notes: notes || undefined,
    });

    setIsSaving(false);
    if (onSavedSuccess) onSavedSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <BookmarkPlus className="h-5 w-5 text-emerald-400" />
          <h3 className="text-xl font-bold text-white">Save Financial Scenario</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Store this simulation in your private dashboard for future review and side-by-side comparison.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Scenario Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. 2030 Bengaluru Villa Plan"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Tags (comma separated)
            </label>
            <div className="relative">
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 pl-9 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Real Estate, Tax, Long Term"
              />
              <Tag className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Advisory Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Key strategic rationale or client assumptions..."
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-slate-400">Snapshot: </span>
            <span className="font-semibold text-emerald-400">{summaryText}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition"
            >
              {isSaving ? "Saving..." : "Save to Portal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
