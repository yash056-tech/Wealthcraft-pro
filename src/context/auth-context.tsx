"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isPro: boolean;
  avatarUrl?: string;
  subscriptionPlan?: "free" | "pro_monthly" | "pro_annual";
  subscriptionRenewsAt?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isPro: boolean;
  isLoading: boolean;
  isPaywallOpen: boolean;
  paywallFeature: string;
  isRegisterOpen: boolean;
  isPaymentModalOpen: boolean;
  selectedPaymentPlan: "monthly" | "annual" | "student";
  openPaywall: (featureName?: string) => void;
  closePaywall: () => void;
  openRegister: () => void;
  closeRegister: () => void;
  openPaymentModal: (plan?: "monthly" | "annual" | "student") => void;
  closePaymentModal: () => void;
  toggleDemoPro: () => void;
  upgradeToPro: () => void;
  loginAsDemoUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PRO_STORAGE_KEY = "wealthcraft_pro_active";
const USER_STORAGE_KEY = "wealthcraft_user_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [paywallFeature, setPaywallFeature] = useState<string>("Premium Financial Tools");
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<"monthly" | "annual" | "student">("monthly");

  const openRegister = () => setIsRegisterOpen(true);
  const closeRegister = () => setIsRegisterOpen(false);

  const openPaymentModal = (plan?: "monthly" | "annual" | "student") => {
    if (plan) setSelectedPaymentPlan(plan);
    setIsPaymentModalOpen(true);
  };
  const closePaymentModal = () => setIsPaymentModalOpen(false);

  useEffect(() => {
    try {
      const storedPro = localStorage.getItem(PRO_STORAGE_KEY);
      const isProActive = storedPro === "true";
      setIsPro(isProActive);

      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({ ...parsed, isPro: isProActive });
      } else {
        // Default guest / demo client profile
        setUser({
          id: "usr-guest-1",
          email: "adviser@client.wealthcraft.pro",
          name: "Vikramaditya Singhania",
          isPro: isProActive,
          subscriptionPlan: isProActive ? "pro_monthly" : "free",
        });
      }
    } catch {
      // Ignore storage errors
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openPaywall = (featureName: string = "Premium Financial Simulators") => {
    setPaywallFeature(featureName);
    setIsPaywallOpen(true);
  };

  const closePaywall = () => {
    setIsPaywallOpen(false);
  };

  const toggleDemoPro = () => {
    const nextState = !isPro;
    setIsPro(nextState);
    localStorage.setItem(PRO_STORAGE_KEY, String(nextState));

    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        isPro: nextState,
        subscriptionPlan: nextState ? "pro_monthly" : "free",
        subscriptionRenewsAt: nextState
          ? new Date(Date.now() + 30 * 86400000).toISOString()
          : undefined,
      };
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    }

    if (nextState) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#10B981", "#F59E0B", "#3B82F6"],
        });
      } catch {
        // Confetti non-critical
      }
    }
  };

  const upgradeToPro = () => {
    // Triggers instant activation or Stripe checkout redirect
    toggleDemoPro();
    setIsPaywallOpen(false);
  };

  const loginAsDemoUser = () => {
    const demoUser: UserProfile = {
      id: "usr-demo-hni",
      email: "vikram@singhania-familyoffice.com",
      name: "Vikram Singhania (HNI)",
      isPro: true,
      subscriptionPlan: "pro_monthly",
      subscriptionRenewsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    };
    setUser(demoUser);
    setIsPro(true);
    localStorage.setItem(PRO_STORAGE_KEY, "true");
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    setIsPro(false);
    localStorage.removeItem(PRO_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isPro,
        isLoading,
        isPaywallOpen,
        paywallFeature,
        isRegisterOpen,
        isPaymentModalOpen,
        selectedPaymentPlan,
        openPaywall,
        closePaywall,
        openRegister,
        closeRegister,
        openPaymentModal,
        closePaymentModal,
        toggleDemoPro,
        upgradeToPro,
        loginAsDemoUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
