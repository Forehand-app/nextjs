"use client";

import React, { Suspense } from "react";
import TournamentCheckoutScreen from "@/components/TournamentCheckoutScreen";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff7a1a] border-t-transparent"></div>
        </div>
      }
    >
      <TournamentCheckoutScreen />
    </Suspense>
  );
}
