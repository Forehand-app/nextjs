"use client";

import React from "react";
import { ArrowLeftIcon, ShareIcon, UsersIcon } from "@/components/Icons";

type TournamentHeroCardProps = {
  title: string;
  subtitle: string;
  registeredCount: number | string;
  registrationStatus: string;
  onBack?: () => void;
  onShare?: () => void;
};

function SoftballLogo() {
  return (
    <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-[#f4f0e8] bg-[radial-gradient(circle_at_35%_35%,#fffefb_0%,#faf7ef_58%,#f3ebd8_100%)] shadow-[0_3px_8px_rgba(110,45,0,0.12)]">
      <svg viewBox="0 0 64 64" className="h-[42px] w-[42px]" aria-hidden="true">
        <circle cx="32" cy="32" r="27" fill="#fffdf8" stroke="#2f2a21" strokeWidth="1.8" />
        <circle cx="32" cy="32" r="20.5" fill="none" stroke="#2f2a21" strokeWidth="1.2" strokeDasharray="1.3 2.2" />
        <path d="M18 12c4.8 6.4 7 13.1 7 20s-2.2 13.6-7 20" fill="none" stroke="#c96b1f" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M46 12c-4.8 6.4-7 13.1-7 20s2.2 13.6 7 20" fill="none" stroke="#c96b1f" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M15 24c5.8 2.8 11.4 4.2 17 4.2S43.2 26.8 49 24" fill="none" stroke="#c96b1f" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15 40c5.8-2.8 11.4-4.2 17-4.2S43.2 37.2 49 40" fill="none" stroke="#c96b1f" strokeWidth="1.8" strokeLinecap="round" />
        <text x="32" y="29" textAnchor="middle" fontSize="7.2" fontWeight="700" fill="#2f2a21" letterSpacing="1.8">
          SOFT
        </text>
        <text x="32" y="37.5" textAnchor="middle" fontSize="6" fontWeight="700" fill="#2f2a21" letterSpacing="1.4">
          BALL
        </text>
      </svg>
    </div>
  );
}

export default function TournamentHeroCard({
  title,
  subtitle,
  registeredCount,
  registrationStatus,
  onBack,
  onShare,
}: TournamentHeroCardProps) {
  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,#ff8a24_0%,#ff7418_100%)] px-4 pb-4 pt-[calc(max(env(safe-area-inset-top),12px)+4px)]">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="grid h-7 w-7 place-content-center rounded-full bg-white/28 text-white backdrop-blur-[2px]"
          aria-label="Back"
        >
          <ArrowLeftIcon size={15} />
        </button>
        <button
          onClick={onShare}
          className="grid h-7 w-7 place-content-center rounded-full bg-white/28 text-white backdrop-blur-[2px]"
          aria-label="Share"
        >
          <ShareIcon size={13} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-[42px_minmax(0,1fr)] items-center gap-x-3">
        <div className="self-center">
          <SoftballLogo />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-white">
            {title}
          </h1>
          <p className="mt-1 truncate text-[12px] font-medium text-white/92">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[14px] bg-[var(--color-surface)] px-3.5 py-3 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-content-center rounded-full border border-primary/30 bg-primary/20 text-primary">
              <UsersIcon size={15} />
            </div>
            <div>
              <p className="text-[28px] font-bold leading-none text-[var(--color-text)]">{registeredCount}</p>
              <p className="mt-1 text-[12px] font-medium text-[var(--color-muted)]">Registered</p>
            </div>
          </div>
        </div>

        <div className="rounded-[14px] bg-[var(--color-surface)] px-3.5 py-3 shadow-[var(--shadow-card)]">
          <p className="text-[19px] font-bold leading-tight text-[var(--color-text)]">Registration</p>
          <div className="mt-2.5 flex justify-center">
            <span className="inline-flex h-5 min-w-[52px] items-center justify-center rounded-full bg-primary/20 px-2 text-[10px] font-semibold text-primary">
              {registrationStatus}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
