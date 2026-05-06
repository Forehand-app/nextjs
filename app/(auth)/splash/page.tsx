"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useAppSession } from "@/components/AppSessionProvider";
import { GamepadIcon } from "@/components/Icons";

export default function SplashPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, signInWithGoogle } = useAuth();
  const { refreshAppSession } = useAppSession();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;
    if (isLoading) return;

    if (!isAuthenticated) {
      return;
    }

    const redirectAuthenticatedUser = async () => {
      try {
        const target = await refreshAppSession();
        if (isActive) {
          router.replace(target);
        }
      } catch (cause) {
        if (!isActive) return;
        const message =
          cause instanceof Error
            ? cause.message
            : "Unable to load your profile.";
        setError(message);
      }
    };

    void redirectAuthenticatedUser();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, isLoading, refreshAppSession, router]);

  const handleGoogleLogin = async () => {
    if (isLoading || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await signInWithGoogle();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to start Google sign-in.";
      setError(message);
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
        {/* Player Image in Circle */}
        <div className="relative mb-8">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white/10">
            {/* Placeholder for player image - in real implementation would use next/image */}
            <GamepadIcon size={56} className="text-white/90" />
          </div>
        </div>

        {/* Branding */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4 shadow-lg">
          <span className="text-4xl font-black text-white">F</span>
        </div>

        <h1 className="text-3xl font-black text-[var(--color-text)] mb-2 tracking-tight">
          FOREHAND
        </h1>

        <p className="text-[var(--color-muted)] text-center max-w-xs mb-8">
          Your all-in-one tournament hub.<br />
          Manage. Play. Compete.
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-sm relative z-10 pb-safe">
        <button
          type="button"
          onClick={handleGoogleLogin}
          aria-disabled={isLoading || isSubmitting}
          className="w-full min-h-[52px] flex items-center justify-center rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-95"
          style={{ background: "var(--gradient-orange)" }}
        >
          {isSubmitting ? "Connecting..." : "Login with Google"}
        </button>

        {error ? (
          <p className="text-xs text-red-500 mt-3 text-center">{error}</p>
        ) : null}

        <p className="text-xs text-[var(--color-muted)] mt-4 text-center">
          By continuing, you agree to our{" "}
          <a href="#" className="text-primary">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
}

