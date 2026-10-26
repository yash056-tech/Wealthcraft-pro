import { createClient } from "@/lib/supabase/client";

export interface SavedScenario {
  id: string;
  calculatorId: string;
  calculatorName: string;
  title: string;
  category: string;
  inputs: Record<string, unknown>;
  summary: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "wealthcraft_saved_scenarios";

// Initial seed scenarios for immediate demonstration and exploration
const DEFAULT_SAMPLE_SCENARIOS: SavedScenario[] = [
  {
    id: "scen-sample-1",
    calculatorId: "step-up-sip",
    calculatorName: "Step-Up SIP Calculator",
    title: "10-Year ₹50k Crorepati Blueprint",
    category: "Wealth & Retirement",
    inputs: {
      monthlySip: 50000,
      expectedReturn: 14,
      years: 10,
      stepUpPercent: 10,
      inflationRate: 6,
    },
    summary: "Target Wealth: ₹ 1.94 Cr (Invested: ₹ 95.6 L)",
    tags: ["Equity", "Mutual Funds", "HNI"],
    notes: "Allocated across Nifty 50 Index + Midcap 150 Quality 50 funds with 10% annual bonus step-up.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "scen-sample-2",
    calculatorId: "home-loan-prepayment",
    calculatorName: "Home Loan EMI & Prepayment Optimizer",
    title: "Bengaluru Villa ₹1.5 Cr Loan Tenure Slash",
    category: "Real Estate & Property",
    inputs: {
      loanAmount: 15000000,
      interestRate: 8.5,
      tenureYears: 20,
      annualPrepaymentAmount: 400000,
      prepaymentMonth: 12,
      monthlyEmiStepUpPercent: 0,
    },
    summary: "Saved ₹ 72.8 Lakhs Interest & 8.5 Years",
    tags: ["Real Estate", "Mortgage", "Optimization"],
    notes: "Channeling annual corporate performance bonus of ₹4 Lakhs towards principal reduction every December.",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "scen-sample-3",
    calculatorId: "fire-simulator",
    calculatorName: "FIRE Simulator (Retire Early)",
    title: "Age 42 Fat FIRE Milestone",
    category: "Wealth & Retirement",
    inputs: {
      currentAge: 31,
      desiredRetirementAge: 42,
      currentMonthlyExpenses: 120000,
      inflationRate: 6.5,
      preRetirementReturn: 13,
      postRetirementReturn: 8.5,
      currentPortfolio: 6500000,
      monthlySavings: 150000,
      savingsStepUp: 10,
      swr: 3.5,
      lifeExpectancy: 85,
    },
    summary: "Fat FIRE Target: ₹ 9.8 Cr by Year 2037",
    tags: ["Retire Early", "Portfolio", "Financial Freedom"],
    notes: "Aggressive savings plan targeting 3.5% SWR with perpetual asset preservation.",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
];

export function getSavedScenarios(): SavedScenario[] {
  if (typeof window === "undefined") return DEFAULT_SAMPLE_SCENARIOS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_SCENARIOS));
      return DEFAULT_SAMPLE_SCENARIOS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_SAMPLE_SCENARIOS;
  } catch {
    return DEFAULT_SAMPLE_SCENARIOS;
  }
}

export function saveScenario(scenario: Omit<SavedScenario, "id" | "createdAt" | "updatedAt">): SavedScenario {
  const all = getSavedScenarios();
  const newScenario: SavedScenario = {
    ...scenario,
    id: `scen-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newScenario, ...all];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // Attempt Supabase sync asynchronously if client is active
  try {
    const supabase = createClient();
    if (supabase) {
      supabase.from("financial_scenarios").insert([newScenario]).then();
    }
  } catch {
    // Non-blocking fallback
  }

  return newScenario;
}

export function deleteScenario(id: string): void {
  const all = getSavedScenarios();
  const updated = all.filter((s) => s.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  try {
    const supabase = createClient();
    if (supabase) {
      supabase.from("financial_scenarios").delete().eq("id", id).then();
    }
  } catch {
    // Non-blocking
  }
}
