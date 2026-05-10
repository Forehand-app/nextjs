"use client";

import React from "react";
import Link from "next/link";
import {
  BuildingIcon,
  ChevronRightIcon,
  UserIcon,
  XIcon,
} from "@/components/Icons";

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProfileModal({
  isOpen,
  onClose,
}: CreateProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end bg-black/40 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative z-10 w-full rounded-t-[28px] bg-[#3a2a57] px-5 pb-[max(env(safe-area-inset-bottom),24px)] pt-3 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-white/20" />

        <div className="mt-6">
          <h2 className="text-[24px] font-bold text-white">Create Profile</h2>
          <p className="mt-2 text-[15px] text-[#b2abc8]">
            Choose the type of profile you want to set up today.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link
            href="/org/create"
            className="flex items-center gap-4 rounded-[22px] border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
            onClick={onClose}
          >
            <div className="grid h-14 w-14 shrink-0 place-content-center rounded-full border border-white/10 bg-white/5">
              <BuildingIcon size={24} className="text-[#ff7a1a]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-bold text-white">Organization Profile</p>
              <p className="mt-1 text-[13px] text-[#b2abc8] leading-tight">
                Perfect for clubs, teams, or event managers.
              </p>
            </div>
            <ChevronRightIcon size={20} className="text-[#b2abc8]" />
          </Link>

          <button
            type="button"
            className="flex items-center gap-4 w-full text-left rounded-[22px] border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
            onClick={onClose}
          >
            <div className="grid h-14 w-14 shrink-0 place-content-center rounded-full border border-white/10 bg-white/5">
              <UserIcon size={24} className="text-[#ff7a1a]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-bold text-white">Individual Profile</p>
              <p className="mt-1 text-[13px] text-[#b2abc8] leading-tight">
                Set up personal account to track your progress.
              </p>
            </div>
            <ChevronRightIcon size={20} className="text-[#b2abc8]" />
          </button>
        </div>
      </div>
    </div>
  );
}
