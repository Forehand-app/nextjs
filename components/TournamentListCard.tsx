"use client";

import React from "react";
import Link from "next/link";
import { CalendarIcon, ChevronRightIcon, MapPinIcon, WalletIcon } from "@/components/Icons";
import { routes } from "@/lib/routes";

export type TournamentListItem = {
  id: string;
  name: string;
  subtitle: string;
  start: string;
  end: string;
  entry?: string;
  location: string;
  players: string;
  cta: "Register" | "View" | "Chevron";
  joinedStatus?: string;
};

function SoftballLogo() {
  return (
    <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-[#f28a36] bg-[radial-gradient(circle_at_35%_35%,#fffefb_0%,#faf7ef_58%,#f3ebd8_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_3px_8px_rgba(242,138,54,0.08)]">
      <svg viewBox="0 0 64 64" className="h-[34px] w-[34px]" aria-hidden="true">
        <circle cx="32" cy="32" r="27" fill="#fffdf8" stroke="#2f2a21" strokeWidth="1.8" />
        <circle cx="32" cy="32" r="20.5" fill="none" stroke="#2f2a21" strokeWidth="1.2" strokeDasharray="1.3 2.2" />
        <path d="M18 12c4.8 6.4 7 13.1 7 20s-2.2 13.6-7 20" fill="none" stroke="#c96b1f" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M46 12c-4.8 6.4-7 13.1-7 20s2.2 13.6 7 20" fill="none" stroke="#c96b1f" strokeWidth="2.2" strokeLinecap="round" />
        <text x="32" y="29" textAnchor="middle" fontSize="7.2" fontWeight="700" fill="#2f2a21" letterSpacing="1.5">
          SOFT
        </text>
        <text x="32" y="37.5" textAnchor="middle" fontSize="6" fontWeight="700" fill="#2f2a21" letterSpacing="1.2">
          BALL
        </text>
      </svg>
    </div>
  );
}

function PennantIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 21V4" />
      <path d="m5 5 13 4-13 4" />
    </svg>
  );
}

export default function TournamentListCard({ item }: { item: TournamentListItem }) {
  const isHistory = item.cta === "Chevron";

  if (isHistory) {
    return (
      <Link
        href={routes.tournamentDetail(item.id)}
        className="block rounded-[16px] border border-[#f28a36] bg-[#f9f9f7] px-3.5 py-3 shadow-[0_4px_12px_rgba(27,31,35,0.05)] transition hover:border-[#eb7a1e]"
      >
        <div className="grid grid-cols-[42px_minmax(0,1fr)_18px] gap-x-3 gap-y-3">
          <div className="row-span-2 self-start pt-0.5">
            <SoftballLogo />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold leading-5 text-[var(--color-text)]">{item.name}</h3>
            <p className="mt-[2px] truncate text-[11px] text-[var(--color-text-muted)]">{item.subtitle}</p>
          </div>

          <ChevronRightIcon size={16} className="mt-0.5 text-[#2f2f35]" />

          <div className="col-span-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-[var(--color-text-secondary)]">
            <div className="flex min-w-0 items-center gap-1.5">
              <CalendarIcon size={12} className="shrink-0 text-[#5a5a63]" />
              <span className="truncate">Start: {item.start}</span>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 justify-self-end text-right">
              <CalendarIcon size={12} className="shrink-0 text-[#5a5a63]" />
              <span className="truncate">End: {item.end}</span>
            </div>
            <div className="flex min-w-0 items-center gap-1.5">
              <MapPinIcon size={12} className="shrink-0 text-[#5a5a63]" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 justify-self-end text-right">
              <PennantIcon size={12} className="shrink-0 text-[#5a5a63]" />
              <span className="truncate">{item.joinedStatus}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={routes.tournamentDetail(item.id)}
      className="block rounded-[18px] border border-[#f28a36] bg-[#f9f9f7] px-4 py-3.5 shadow-[0_4px_12px_rgba(27,31,35,0.05)] transition hover:border-[#eb7a1e]"
    >
      <div className="grid grid-cols-[42px_minmax(0,1fr)] gap-x-3 gap-y-3">
        <div className="self-start pt-0.5">
          <SoftballLogo />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-semibold leading-5 text-[var(--color-text)]">{item.name}</h3>
          <p className="mt-[2px] truncate text-[12px] text-[var(--color-text-muted)]">{item.subtitle}</p>
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-2 text-[12px] text-[var(--color-text-secondary)]">
          <div className="flex min-w-0 items-center gap-1.5">
            <CalendarIcon size={13} className="shrink-0 text-[#5a5a63]" />
            <span className="truncate">Start: {item.start}</span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5 justify-self-end text-right">
            <CalendarIcon size={13} className="shrink-0 text-[#5a5a63]" />
            <span className="truncate">End: {item.end}</span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <WalletIcon size={13} className="shrink-0 text-[#5a5a63]" />
            <span className="truncate">{item.entry}</span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5 justify-self-end text-right">
            <MapPinIcon size={13} className="shrink-0 text-[#5a5a63]" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        <div className="col-span-2 grid grid-cols-2 items-end gap-x-6 pt-1">
          <div className="flex items-center gap-2 text-[11px] text-[var(--color-text)]">
            <div className="-mt-1 flex -space-x-1.5">
              <div className="h-6 w-6 rounded-full bg-[#dbb27a] ring-2 ring-[#f9f9f7]" />
              <div className="h-6 w-6 rounded-full bg-[#3ea3bf] ring-2 ring-[#f9f9f7]" />
              <div className="h-6 w-6 rounded-full bg-[#2d6d94] ring-2 ring-[#f9f9f7]" />
            </div>
            <span>{item.players}</span>
          </div>

          <div className="justify-self-end">
            <span className="inline-flex h-8 min-w-[96px] items-center justify-center rounded-full border border-[#f28a36] bg-[#fffaf4] px-5 text-[13px] font-semibold text-[#f28a36]">
              {item.cta}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
