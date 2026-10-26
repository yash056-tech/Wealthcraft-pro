export interface CalculatorMeta {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  category: "Wealth & Retirement" | "Real Estate & Property" | "Taxation & Business" | "Debt Restructuring";
  categorySlug: "wealth" | "real-estate" | "tax-business" | "debt";
  description: string;
  badge?: string;
  isPro?: boolean;
  popular?: boolean;
  iconName: string;
}

export const CALCULATOR_CATEGORIES = [
  {
    title: "Wealth & Retirement Projectors",
    slug: "wealth",
    description: "Long-term compounding, sovereign pension growth, and early retirement roadmaps.",
    color: "emerald",
  },
  {
    title: "Real Estate & Property Analyzers",
    slug: "real-estate",
    description: "Mortgage tenure compression, buy vs. rent net worth parity, and property capital gains.",
    color: "blue",
  },
  {
    title: "Taxation & Business Planners",
    slug: "tax-business",
    description: "Union Budget tax regime comparisons, corporate GST flows, and DCF enterprise valuations.",
    color: "purple",
  },
  {
    title: "Debt Restructuring",
    slug: "debt",
    description: "Mathematical avalanche vs. psychological snowball multi-liability optimization.",
    color: "amber",
  },
] as const;

export const CALCULATORS: CalculatorMeta[] = [
  // Category 1: Wealth & Retirement Projectors
  {
    id: "step-up-sip",
    name: "Step-Up SIP Calculator",
    shortName: "Step-Up SIP",
    slug: "/calculators/step-up-sip",
    category: "Wealth & Retirement",
    categorySlug: "wealth",
    description: "Model exponential portfolio growth with annual SIP increments and wealth multiplier analytics.",
    iconName: "TrendingUp",
    popular: true,
  },
  {
    id: "ppf-epf",
    name: "PPF / EPF Maturity Projector",
    shortName: "PPF & EPF",
    slug: "/calculators/ppf-epf",
    category: "Wealth & Retirement",
    categorySlug: "wealth",
    description: "Project sovereign guaranteed retirement wealth combining PPF 7.1% and EPF 8.25% compounding.",
    iconName: "ShieldCheck",
  },
  {
    id: "fire-simulator",
    name: "FIRE Simulator (Retire Early)",
    shortName: "FIRE Simulator",
    slug: "/calculators/fire-simulator",
    category: "Wealth & Retirement",
    categorySlug: "wealth",
    description: "Pinpoint your exact financial independence year with Lean, Standard, and Fat FIRE milestones.",
    iconName: "Flame",
    badge: "HNWI Favorite",
    popular: true,
  },

  // Category 2: Real Estate & Property Analyzers
  {
    id: "home-loan-prepayment",
    name: "Home Loan EMI & Prepayment Optimizer",
    shortName: "Prepayment Optimizer",
    slug: "/calculators/home-loan-prepayment",
    category: "Real Estate & Property",
    categorySlug: "real-estate",
    description: "Simulate annual lump-sum prepayments and step-up EMIs to shave years and lakhs off interest.",
    iconName: "Home",
    popular: true,
  },
  {
    id: "buy-vs-rent",
    name: "Buy vs. Rent Simulator",
    shortName: "Buy vs. Rent",
    slug: "/calculators/buy-vs-rent",
    category: "Real Estate & Property",
    categorySlug: "real-estate",
    description: "30-year net worth showdown comparing homeownership equity against renting and index investing.",
    iconName: "Scale",
    badge: "Investor Favorite",
  },
  {
    id: "capital-gains",
    name: "Capital Gains Tax Estimator",
    shortName: "Capital Gains Tax",
    slug: "/calculators/capital-gains",
    category: "Real Estate & Property",
    categorySlug: "real-estate",
    description: "Calculate STCG & LTCG for real estate, equities & debt under Budget 2024 with Sec 54 exemptions.",
    iconName: "Receipt",
  },

  // Category 3: Taxation & Business Planners
  {
    id: "tax-regime",
    name: "Income Tax Regime Comparator",
    shortName: "Tax Regime",
    slug: "/calculators/tax-regime",
    category: "Taxation & Business",
    categorySlug: "tax-business",
    description: "Side-by-side comparison of Old vs. New Tax Regimes (FY 24-25 / FY 25-26) with break-even deduction point.",
    iconName: "FileSpreadsheet",
    popular: true,
  },
  {
    id: "gst",
    name: "GST Calculator (Add / Remove)",
    shortName: "GST Invoicing",
    slug: "/calculators/gst",
    category: "Taxation & Business",
    categorySlug: "tax-business",
    description: "Calculate gross and net prices across 5%, 12%, 18%, and 28% slabs with CGST, SGST, and IGST breakdowns.",
    iconName: "Calculator",
  },
  {
    id: "dcf-valuation",
    name: "Business Valuation (DCF Model)",
    shortName: "DCF Valuation",
    slug: "/calculators/dcf-valuation",
    category: "Taxation & Business",
    categorySlug: "tax-business",
    description: "Institutional-grade 5-year Discounted Cash Flow valuation with WACC sensitivity and equity bridge.",
    iconName: "Building2",
    badge: "Pro Simulator",
    isPro: true,
  },

  // Category 4: Debt Restructuring
  {
    id: "debt-snowball-avalanche",
    name: "Debt Snowball vs. Avalanche Simulator",
    shortName: "Debt Payoff",
    slug: "/calculators/debt-snowball-avalanche",
    category: "Debt Restructuring",
    categorySlug: "debt",
    description: "Compare payoff timelines and interest savings by targeting lowest balance vs. highest interest first.",
    iconName: "Zap",
    badge: "High Impact",
  },
];
