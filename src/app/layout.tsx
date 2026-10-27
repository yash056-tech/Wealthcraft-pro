import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PaywallModal } from "@/components/PaywallModal";
import { RegisterModal } from "@/components/RegisterModal";
import { PaymentModal } from "@/components/PaymentModal";

export const metadata: Metadata = {
  title: "WealthCraft Pro | Premium Financial Advisory & Simulation Suite",
  description:
    "Institutional-grade financial simulators, retirement planners, real estate optimizers, and business valuation tools for high-net-worth individuals and founders.",
  keywords: [
    "Step-up SIP",
    "FIRE Calculator",
    "PPF EPF Calculator",
    "Home Loan Prepayment",
    "Buy vs Rent India",
    "Capital Gains Tax",
    "Income Tax Regime",
    "GST Invoicing",
    "DCF Valuation",
    "Debt Snowball Avalanche",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <PaywallModal />
          <RegisterModal />
          <PaymentModal />
        </AuthProvider>
      </body>
    </html>
  );
}
