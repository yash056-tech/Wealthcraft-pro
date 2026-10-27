# WealthCraft Pro — Premium Financial Advisory & Simulation Hub

An institutional-grade, subscription-based FinTech SaaS platform engineered for **high-net-worth individuals (HNWIs)**, real estate investors, and business founders.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Recharts**, featuring precision Indian financial mathematics (INR ₹), Supabase cloud scenario persistence, and Stripe subscription monetization.

---

## 🌟 Core System Architecture

### 1. High-Converting FinTech Landing Page & Marketing Hub
- Interactive hero showcase with real-time portfolio compounding previews.
- Dynamic 4-category filter for all 10 financial simulation engines.
- Feature comparison matrix comparing the Free Lead-Gen tier against the **₹999/month Pro Advisory Tier**.
- Real SEBI / Indian Union Budget compliance disclosures and security badges.

### 2. Client Dashboard & Scenario Vault
- Private client portal with profile management and subscription state tracking.
- Stored scenario management: save, title, tag, filter, and reload complex calculations.
- Integrated **Stripe Self-Serve Customer Portal** for one-click subscription management.
- Instant **Demo Pro Mode** switch to simulate and test all Pro capabilities with zero friction.

### 3. Executive PDF Advisory Reports
- Client-ready, unwatermarked executive PDF memos generated via `jspdf` and `jspdf-autotable`.
- Formatted in Indian Rupee (Crores / Lakhs / Thousands), with KPI summary cards, structured data ledgers, and advisor sign-off blocks.

---

## 🧮 The 10-Calculator Suite (Default Currency: INR ₹)

### Category 1: Wealth & Retirement Projectors
1. **Step-Up SIP Calculator** (`/calculators/step-up-sip`)
   - Inputs: Monthly SIP, Expected Return (%), Time Horizon, Annual Step-Up Increment (%), Inflation Discount.
   - Outputs: Cumulative Invested vs. Compound Wealth BarChart, Wealth Multiplier, and year-by-year compounding schedule.

2. **PPF / EPF Maturity Projector** (`/calculators/ppf-epf`)
   - Standardized sovereign provident fund compounding: PPF (7.1% p.a., EEE tax-free) + EPF (8.25% p.a., employer/employee 12% split, EPS 8.33% capped at ₹1,250/mo).
   - Outputs: Total sovereign guaranteed corpus, risk-free interest earned, and retirement milestone schedule.

3. **FIRE (Financial Independence, Retire Early) Simulator** (`/calculators/fire-simulator`)
   - Inputs: Age, Target FIRE Age, Monthly Expenses, Inflation, Pre/Post-Retirement Returns, Current Portfolio, Monthly Savings, Safe Withdrawal Rate (SWR 3%–4%).
   - Outputs: Exact Year and Age achieved, Lean FIRE (75%), Standard FIRE (100%), Fat FIRE (140%), Coast FIRE, and 40-year Accumulation-to-Decumulation Trajectory.

### Category 2: Real Estate & Property Analyzers
4. **Home Loan EMI & Prepayment Optimizer** (`/calculators/home-loan-prepayment`)
   - Inputs: Loan Principal, Rate, Tenure, Annual Lump-Sum Prepayment, Monthly EMI Step-Up (%).
   - Outputs: Original vs. Revised Amortization, Total Interest Saved (lakhs/crores), and Tenure Reduction (saving 8 to 12 years).

5. **Buy vs. Rent Simulator** (`/calculators/buy-vs-rent`)
   - 30-year mathematical parity showdown: Property purchase (down payment, stamp duty 6.5%, EMI, maintenance 1.2%, appreciation 7%) vs. Renting and compounding upfront capital + monthly difference into equities (12% p.a.).
   - Outputs: 20-Year Net Worth LineChart, Break-Even Crossover Year, and clear HNWI recommendation.

6. **Capital Gains Tax Estimator** (`/calculators/capital-gains`)
   - Built for **Union Budget 2024 amendments**: Real Estate LTCG (12.5% unindexed vs. 20% indexed grandfathering for pre-July 2024 properties), Listed Equities (12.5% LTCG above ₹1.25L exemption, 20% STCG), and Debt/Other assets.
   - Section 54 (new residential house) and Section 54EC (capital gain bonds up to ₹50L) shields.

### Category 3: Taxation & Business Planners
7. **Income Tax Regime Comparator** (`/calculators/tax-regime`)
   - Updated for FY 2024-25 / FY 2025-26: New Regime (revised ₹75,000 standard deduction, new slabs, Sec 87A rebate for income up to ₹7.75L) vs. Old Regime (80C, 80D, 24b home loan interest, HRA, NPS 80CCD).
   - Outputs: Exact tax saved, optimal regime recommendation, and deduction break-even threshold.

8. **GST Calculator (Add / Remove)** (`/calculators/gst`)
   - Forward (+Add GST) and Reverse (-Remove GST) computations across 5%, 12%, 18%, 28%, and custom slabs.
   - Automatic Intrastate (CGST 50% + SGST 50%) and Interstate (IGST 100%) line items with one-click copyable B2B invoice snippets.

9. **Business Valuation (DCF Model)** (`/calculators/dcf-valuation`) — *Pro Simulator*
   - 5-year discrete Free Cash Flows to Firm (FCFF) forecast, Gordon Growth Terminal Value, Enterprise Value (EV), Net Debt Bridge, and Intrinsic Share Price.
   - **5x5 WACC vs. Terminal Growth Sensitivity Matrix** to stress-test valuations across macroeconomic shifts.

### Category 4: Debt Restructuring
10. **Debt Snowball vs. Avalanche Simulator** (`/calculators/debt-snowball-avalanche`)
    - Input up to 5 concurrent debts (balances, APRs, minimum payments) plus extra monthly acceleration budget.
    - Side-by-side simulation: **Debt Avalanche** (mathematical efficiency targeting highest APR) vs. **Debt Snowball** (psychological momentum targeting lowest balance).
    - Outputs: Exact payoff order, months saved, and total interest saved vs. minimum payment only.

---

## 🚀 Quickstart & Local Execution

### Install Dependencies:
```bash
npm install
```

### Run Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💳 Payment Gateway & Direct Bank Account Settlement

WealthCraft Pro supports three complementary payment channels engineered to receive funds directly into your Indian bank account:

### 1. Razorpay (UPI, NetBanking & Cards)
- **Direct Bank Settlement**: Payments collected via Razorpay (UPI, Google Pay, PhonePe, Paytm, CRED, NetBanking across 50+ banks, Mastercard/Visa/RuPay) are settled directly into your linked bank account (via IFSC and Account number configured in your [Razorpay Dashboard](https://dashboard.razorpay.com)).
- **Cryptographic Security**: Every payment is signed with HMAC-SHA256 (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`) and verified server-side.
- **Environment Variables**:
  ```env
  RAZORPAY_KEY_ID=rzp_live_your_key_id
  RAZORPAY_KEY_SECRET=your_key_secret
  NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id
  ```

### 2. Direct Bank UPI QR Scan & Pay (0% Gateway Fee)
- **Instant Bank Settlement**: Customers scan the dynamic UPI QR code with any UPI app (GPay, PhonePe, Paytm, BHIM, CRED) or copy the UPI ID (`ya09shu@okaxis` or configurable via `NEXT_PUBLIC_UPI_ID`).
- **Immediate Deposit**: Funds land directly and immediately in your bank account with zero gateway fee deductions.
- **UTR Verification**: The user submits the 12-digit UPI Transaction Reference (UTR) number to activate their subscription and generate an instant payment receipt.

### 3. Stripe Checkout & Customer Portal
- Designed for international clients and recurring SaaS billing.
- Managed customer portal for self-serve invoice downloads and plan updates.

---

## 📧 Email Alerts to ya09shu@gmail.com

Whenever a client, investor, or student interacts with the platform:
1. **User Registration Alert**: Name, email, mobile number, role (Investor / Real Estate / Student / Advisor), and timestamp are instantly formatted and dispatched to `ya09shu@gmail.com`.
2. **Payment Confirmation Alert**: On every successful payment (Razorpay, Direct UPI with UTR, or Stripe), an executive notification is dispatched to `ya09shu@gmail.com` containing the transaction ID, amount paid (₹), plan type, and user details.

To configure SMTP delivery:
```env
SMTP_USER=ya09shu@gmail.com
SMTP_PASS=your_16_char_google_app_password
ADMIN_NOTIFICATION_EMAIL=ya09shu@gmail.com
```
*(If credentials are not yet configured in production, the system securely logs all registrations and payment submissions as a resilient fallback).*

---

## 🌐 Production Deployment

- **Live URL**: [https://wealthcraft-pro.vercel.app](https://wealthcraft-pro.vercel.app)
- **GitHub Repository**: [https://github.com/yash056-tech/Wealthcraft-pro](https://github.com/yash056-tech/Wealthcraft-pro)
