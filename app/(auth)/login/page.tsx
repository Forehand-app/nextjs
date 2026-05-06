"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect already-authenticated users
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleGoogleLogin = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await login();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to start Google sign-in.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-[var(--color-background)] relative overflow-hidden">
      {/* Decorative orange triangle */}
      <div
        className="absolute top-0 right-0 w-64 h-64"
        style={{
          background: "linear-gradient(225deg, var(--card-orange-light) 0%, var(--card-orange-bg) 100%)",
          clipPath: "polygon(100% 0, 100% 100%, 0 0)",
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6 shadow-lg">
          <span className="text-4xl font-black text-white">F</span>
        </div>

        <h1 className="text-3xl font-black text-[var(--color-text)] mb-2 tracking-tight">
          FOREHAND
        </h1>
        <p className="text-[var(--color-muted)] text-center max-w-xs mb-2">
          Your all-in-one tournament hub.
        </p>
        <p className="text-sm text-[var(--color-muted)] text-center mb-8">
          Manage. Play. Compete.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-sm relative z-10 pb-safe space-y-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isSubmitting || isLoading}
          className="w-full min-h-[52px] flex items-center justify-center gap-3 rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-70"
          style={{ background: "var(--gradient-orange)" }}
        >
          {isSubmitting ? "Connecting..." : "Continue with Google"}
        </button>

        {error && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}

        <p className="text-xs text-[var(--color-muted)] text-center">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary underline">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
}
