"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  CalendarIcon,
  GamepadIcon,
  HandIcon,
  PhoneIcon,
  UserIcon,
  UserIcon as GenderIcon,
} from "@/components/Icons";

export default function FinalizePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, session, signOut, user } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    gender: "",
    dob: "",
    playingHand: "",
    primarySport: "",
  });

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/splash");
      return;
    }

    setFormData((current) => ({
      ...current,
      name:
        current.name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        "",
    }));
  }, [isAuthenticated, isLoading, router, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!session?.access_token) {
      setErrorMessage("Please sign in again before completing registration.");
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBaseUrl) {
      setErrorMessage("Registration service is not configured.");
      return;
    }

    try {
      setIsRegistering(true);
      const response = await fetch(`${apiBaseUrl}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.contactNumber.trim(),
          gender: formData.gender,
          dob: formData.dob,
          playingHand: formData.playingHand || null,
          primarySport: formData.primarySport.trim() || null,
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || "Registration failed.");
      }

      router.push("/user/home");
    } catch (error) {
      console.error("Failed to register user", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
      setIsRegistering(false);
    }
  };

  const handleBackToSignIn = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.replace("/splash");
    } catch (error) {
      console.error("Failed to sign out", error);
      setIsSigningOut(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-text)]">
        <p className="text-sm text-[var(--color-muted)]">
          Loading your account...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6 pb-safe">
      <div className="max-w-md mx-auto">
        <div
          className="rounded-2xl p-6 mb-6 text-white"
          style={{ background: "var(--gradient-orange)" }}
        >
          <h1 className="text-2xl font-bold mb-1">Finalize Registration</h1>
          <p className="text-sm opacity-90">
            Let&apos;s set up your player profile
          </p>
          {user?.email ? (
            <p className="text-xs opacity-75 mt-2">{user.email}</p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2 flex items-center gap-2">
              <UserIcon size={14} /> Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2 flex items-center gap-2">
              <PhoneIcon size={14} /> Contact Number
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter your contact number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2 flex items-center gap-2">
              <GenderIcon size={14} /> Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none transition-colors"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2 flex items-center gap-2">
              <CalendarIcon size={14} /> Date of Birth
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2 flex items-center gap-2">
              <HandIcon size={14} /> Playing Hand
            </label>
            <select
              value={formData.playingHand}
              onChange={(e) =>
                setFormData({ ...formData, playingHand: e.target.value })
              }
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none transition-colors"
            >
              <option value="">Select playing hand</option>
              <option value="right">Right</option>
              <option value="left">Left</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2 flex items-center gap-2">
              <GamepadIcon size={14} /> Primary Sport
            </label>
            <input
              type="text"
              value={formData.primarySport}
              onChange={(e) =>
                setFormData({ ...formData, primarySport: e.target.value })
              }
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none transition-colors"
              placeholder="e.g. Badminton"
            />
          </div>

          {errorMessage ? (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isRegistering}
            className="w-full min-h-[52px] flex items-center justify-center rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-95 mt-6 disabled:opacity-70"
            style={{ background: "var(--gradient-orange)" }}
          >
            {isRegistering ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-xs text-[var(--color-muted)] text-center mt-6">
          Want to continue later?{" "}
          <button
            type="button"
            onClick={handleBackToSignIn}
            disabled={isSigningOut}
            className="text-primary font-medium disabled:opacity-60"
          >
            {isSigningOut ? "Signing out..." : "Back to sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

