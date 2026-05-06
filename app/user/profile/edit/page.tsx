"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { useAuth } from "@/components/AuthProvider";
import { useAppSession } from "@/components/AppSessionProvider";
import { ArrowLeftIcon, CameraIcon } from "@/components/Icons";
import {
  formatDateInputValue,
  getUserDisplayName,
} from "@/lib/userProfile";

export default function UserProfileEditPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isResolving, profile } = useAppSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [playingHand, setPlayingHand] = useState("");
  const [primarySport, setPrimarySport] = useState("");
  const avatarInitial = (name || getUserDisplayName(user) || "P")
    .trim()
    .charAt(0)
    .toUpperCase();

  useEffect(() => {
    setName(profile?.name || getUserDisplayName(user));
    setPhone(profile?.phone || "");
    setGender(profile?.gender || "");
    setDob(formatDateInputValue(profile?.dob));
    setPlayingHand(profile?.playingHand || "");
    setPrimarySport(profile?.primarySport || "");
  }, [profile, user]);

  return (
    <Layout>
      <div className="p-4 space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-elevated)] min-h-[44px] flex items-center gap-2"
          aria-label="Back"
        >
          <ArrowLeftIcon size={20} />
          <span className="font-medium">Edit Profile</span>
        </button>
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary relative">
            {avatarInitial}
            <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm" aria-hidden>
              <CameraIcon size={16} className="text-white" />
            </span>
          </div>
        </div>
        {isResolving ? (
          <p className="text-center text-sm text-[var(--color-muted)]">
            Loading profile...
          </p>
        ) : null}
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.back(); }}>
          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Full Name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]" />
          </label>
          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Contact Number</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]" />
          </label>
          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Gender</span>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Date of Birth</span>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]" />
          </label>
          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Playing Hand</span>
            <select value={playingHand} onChange={(e) => setPlayingHand(e.target.value)} className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]">
              <option value="">Select</option>
              <option value="right">Right</option>
              <option value="left">Left</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Primary sport</span>
            <input type="text" value={primarySport} onChange={(e) => setPrimarySport(e.target.value)} className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]" />
          </label>
          <button type="submit" className="w-full min-h-[44px] rounded-[var(--radius-button)] bg-primary text-[var(--color-primary-contrast)] font-medium">Continue</button>
        </form>
      </div>
    </Layout>
  );
}

