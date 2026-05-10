"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import {
  registrationSchema,
  type RegistrationFormData,
} from "@/lib/validators/registrationForm";
import { userApi } from "@/lib/api/userApi";
import { storageApi } from "@/lib/api/storageApi";
import { CameraIcon } from "@/components/Icons";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, session, logout, register } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    contactNumber: "",
    gender: "" as any,
    dob: "",
    playingHand: undefined,
    primarySport: "",
  });

  // Real-time contact uniqueness check (using Zod async validation)
  useEffect(() => {
    const contact = formData.contactNumber;
    if (!contact || contact.length < 10) {
      setFieldErrors((prev) => {
        const { contactNumber, ...rest } = prev;
        return rest;
      });
      return;
    }

    const timer = setTimeout(async () => {
      // Run the async Zod validation
      const result = await registrationSchema.safeParseAsync(formData);

      if (!result.success) {
        const contactError = result.error.issues.find(
          (i) => i.path[0] === "contactNumber",
        );
        if (contactError) {
          setFieldErrors((prev) => ({
            ...prev,
            contactNumber: contactError.message,
          }));
        } else {
          setFieldErrors((prev) => {
            const { contactNumber, ...rest } = prev;
            return rest;
          });
        }
      } else {
        setFieldErrors((prev) => {
          const { contactNumber, ...rest } = prev;
          return rest;
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.contactNumber, formData]);

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

    // 1. Zod async validation (includes uniqueness check)
    const result = await registrationSchema.safeParseAsync(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    const validatedData = result.data;

    try {
      setIsSubmitting(true);

      // 1. Clean phone number to exactly 10 digits (no +, no spaces, handle country code)
      let cleanPhone = validatedData.contactNumber.replace(/\D/g, "");
      if (cleanPhone.length > 10) {
        // If it starts with 91 and is 12 digits, take last 10
        if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
          cleanPhone = cleanPhone.slice(-10);
        } else if (cleanPhone.length === 11 && cleanPhone.startsWith("0")) {
          cleanPhone = cleanPhone.slice(-10);
        }
      }

      // 2. Register profile first
      await register({
        name: validatedData.name,
        phone: cleanPhone,
        gender: validatedData.gender,
        dob: validatedData.dob,
        playingHand: validatedData.playingHand ?? null,
        primarySport: validatedData.primarySport ?? null,
      });

      // 3. Now upload avatar if exists (profile record now exists)
      if (avatarFile) {
        try {
          await storageApi.uploadProfileAvatar(avatarFile);
        } catch (uploadErr) {
          console.error("Avatar upload failed:", uploadErr);
          // We continue since registration was successful
        }
      }

      router.replace("/home");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await logout();
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

  const InputError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-xs text-red-500 mt-1 ml-1">{message}</p>;
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6 pb-safe">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div
          className="rounded-2xl p-6 mb-6 text-white"
          style={{ background: "var(--gradient-orange)" }}
        >
          <h1 className="text-2xl font-bold mb-1">Create your profile</h1>
          <p className="text-sm opacity-90">
            Just a few details to get you started
          </p>
          {session?.user?.email && (
            <p className="text-xs opacity-75 mt-2">{session.user.email}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-[var(--color-surface-elevated)] border-4 border-white shadow-md flex items-center justify-center relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[var(--color-muted)] flex flex-col items-center">
                    <CameraIcon size={32} />
                    <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                      Add Photo
                    </span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <CameraIcon size={24} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setAvatarPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white pointer-events-none">
                <CameraIcon size={16} />
              </div>
            </div>
            <p className="text-xs text-[var(--color-muted)] mt-3">
              Help organizers and players recognize you
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border ${
                fieldErrors.name
                  ? "border-red-500"
                  : "border-[var(--color-border)]"
              } text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none transition-colors`}
              placeholder="Enter your full name"
            />
            <InputError message={fieldErrors.name} />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              value={formData.contactNumber || ""}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border ${
                fieldErrors.contactNumber
                  ? "border-red-500"
                  : "border-[var(--color-border)]"
              } text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none transition-colors`}
              placeholder="Enter your contact number"
            />
            <InputError message={fieldErrors.contactNumber} />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Gender
            </label>
            <select
              value={formData.gender || ""}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value as any })
              }
              className={`w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border ${
                fieldErrors.gender
                  ? "border-red-500"
                  : "border-[var(--color-border)]"
              } text-[var(--color-text)] focus:border-primary focus:outline-none transition-colors`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <InputError message={fieldErrors.gender} />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dob || ""}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border ${
                fieldErrors.dob
                  ? "border-red-500"
                  : "border-[var(--color-border)]"
              } text-[var(--color-text)] focus:border-primary focus:outline-none transition-colors`}
            />
            <InputError message={fieldErrors.dob} />
          </div>

          {/* Playing Hand */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Playing Hand
            </label>
            <select
              value={formData.playingHand || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  playingHand: e.target.value as any,
                })
              }
              className={`w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border ${
                fieldErrors.playingHand
                  ? "border-red-500"
                  : "border-[var(--color-border)]"
              } text-[var(--color-text)] focus:border-primary focus:outline-none transition-colors`}
            >
              <option value="">Select playing hand</option>
              <option value="right">Right</option>
              <option value="left">Left</option>
            </select>
            <InputError message={fieldErrors.playingHand} />
          </div>

          {/* Primary Sport */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Primary Sport
            </label>
            <input
              type="text"
              value={formData.primarySport || ""}
              onChange={(e) =>
                setFormData({ ...formData, primarySport: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-[var(--radius-input)] bg-[var(--color-surface)] border ${
                fieldErrors.primarySport
                  ? "border-red-500"
                  : "border-[var(--color-border)]"
              } text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-primary focus:outline-none transition-colors`}
              placeholder="e.g. Badminton"
            />
            <InputError message={fieldErrors.primarySport} />
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
