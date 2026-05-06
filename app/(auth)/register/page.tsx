"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, session, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
    // Not logged in → back to login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    // Pre-fill name from Google profile
    setFormData((prev) => ({
      ...prev,
      name:
        prev.name ||
        session?.user?.user_metadata?.full_name ||
        session?.user?.user_metadata?.name ||
        "",
    }));
  }, [isAuthenticated, isLoading, router, session]);

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
      setIsSubmitting(true);
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

      router.replace("/home");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.replace("/login");
    } catch {
      setIsSigningOut(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <p className="text-sm text-[var(--color-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6 pb-safe">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div
          className="rounded-2xl p-6 mb-6 text-white"
          style={{ background: "var(--gradient-orange)" }}
        >
          <h1 className="text-2xl font-bold mb-1">Create your profile</h1>
          <p className="text-sm opacity-90">Just a few details to get you started</p>
          {session?.user?.email && (
            <p className="text-xs opacity-75 mt-2">{session.user.email}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter your contact number"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none transition-colors"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Playing Hand */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Playing Hand
            </label>
            <select
              value={formData.playingHand}
              onChange={(e) => setFormData({ ...formData, playingHand: e.target.value })}
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none transition-colors"
            >
              <option value="">Select playing hand</option>
              <option value="right">Right</option>
              <option value="left">Left</option>
            </select>
          </div>

          {/* Primary Sport */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Primary Sport
            </label>
            <input
              type="text"
              value={formData.primarySport}
              onChange={(e) => setFormData({ ...formData, primarySport: e.target.value })}
              className="w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none transition-colors"
              placeholder="e.g. Badminton"
            />
          </div>

          {errorMessage && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[52px] flex items-center justify-center rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-95 mt-6 disabled:opacity-70"
            style={{ background: "var(--gradient-orange)" }}
          >
            {isSubmitting ? "Creating profile..." : "Create Profile"}
          </button>
        </form>

        <p className="text-xs text-[var(--color-muted)] text-center mt-6">
          Wrong account?{" "}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-primary font-medium disabled:opacity-60"
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </p>
      </div>
    </div>
  );
}
