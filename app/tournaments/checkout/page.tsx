"use client";

import React, { Suspense } from "react";
import TournamentCheckoutScreen from "@/components/TournamentCheckoutScreen";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#ff7a1a] border-t-transparent" /></div>}>
      <TournamentCheckoutScreen />
    </Suspense>
  );
}
