"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/components/AppProvider";
import {
  EditIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  HandIcon,
  GamepadIcon,
} from "@/components/Icons";

export default function EditProfilePage() {
  const { userProfile: profile, isLoading } = useApp();
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    gender: "",
    dateOfBirth: "",
    playingHand: "",
    primarySport: "",
  });
  const avatarInitial = (formData.fullName || profile?.name || "P")
    .trim()
    .charAt(0)
    .toUpperCase();

  useEffect(() => {
    setFormData({
      fullName: profile?.name || "Player",
      contactNumber: profile?.phone || "",
      gender: profile?.gender || "",
      dateOfBirth: profile?.dob || "",
      playingHand: profile?.playingHand || "",
      primarySport: profile?.primarySport || "",
    });
  }, [profile]);

  return (
    <Layout title="Edit Profile" showBack>
      <div className="p-4 space-y-4 pb-24">
        {/* Profile Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
              {avatarInitial}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
              <EditIcon size={14} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-sm text-[var(--color-muted)]">
            Loading profile...
          </p>
        ) : null}

        {/* Form Fields */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-1">
            <UserIcon size={14} /> Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-1">
            <PhoneIcon size={14} /> Contact Number
          </label>
          <input
            type="tel"
            value={formData.contactNumber}
            onChange={(e) =>
              setFormData({ ...formData, contactNumber: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-1">
            <UserIcon size={14} /> Gender
          </label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-1">
            <CalendarIcon size={14} /> Date of Birth
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-1">
            <HandIcon size={14} /> Playing Hand
          </label>
          <select
            value={formData.playingHand}
            onChange={(e) =>
              setFormData({ ...formData, playingHand: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none"
          >
            <option value="">Select</option>
            <option value="right">Right</option>
            <option value="left">Left</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-1">
            <GamepadIcon size={14} /> Primary Sport
          </label>
          <input
            type="text"
            value={formData.primarySport}
            onChange={(e) =>
              setFormData({ ...formData, primarySport: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-primary focus:outline-none"
          />
        </div>

        {/* Save Button */}
        <button className="btn-primary w-full mt-6">Continue</button>
      </div>
    </Layout>
  );
}
